from fastapi import FastAPI, Depends, HTTPException, File, UploadFile, Form, status
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.datastructures import UploadFile as StarletteUploadFile
import os
import shutil
import sys
from typing import List, Dict, Optional
from sqlalchemy.orm import Session
import json
import uvicorn

# Handle both local development and Docker environment imports
try:
    # Try Docker path first
    from app.models import client, pdf_template, database, tenant
    from app.models.database import get_db, engine
    from app.schemas import client as client_schema
    from app.schemas import pdf_template as pdf_schema
    from app.services.pdf_service import PDFService
    print("Using Docker import paths")
except ImportError:
    # Fall back to local development paths
    from models import client, pdf_template, database, tenant
    from models.database import get_db, engine
    from schemas import client as client_schema
    from schemas import pdf_template as pdf_schema
    from services.pdf_service import PDFService
    print("Using local import paths")

# NOTE: No longer creating tables directly - using Alembic for migrations
# Tables will be created by running alembic upgrade head

# Initialize FastAPI app
app = FastAPI(
    title="DocuMantis PDF Automation",
    description="API for managing client data and automating PDF form filling",
    version="1.0.0"
)

# Override FastAPI's default UploadFile max size (increase to 50MB)
# This is a monkey patch to allow larger file uploads
def _get_with_increased_limit():
    orig_init = StarletteUploadFile.__init__

    def new_init(self, *args, **kwargs):
        if "max_size" in kwargs:
            kwargs["max_size"] = 50 * 1024 * 1024  # 50MB
        orig_init(self, *args, **kwargs)

    StarletteUploadFile.__init__ = new_init

# Apply the monkey patch
_get_with_increased_limit()

# Initialize PDF service
pdf_service = PDFService()

# Set up CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development. In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
os.makedirs("./data", exist_ok=True)
os.makedirs("./data/generated_pdfs", exist_ok=True)
app.mount("/downloads", StaticFiles(directory="./data/generated_pdfs"), name="downloads")

# Health check endpoint
@app.get("/health")
def health_check():
    """Health check endpoint for Docker."""
    return {"status": "healthy", "database": "PostgreSQL"}

# Root endpoint
@app.get("/")
def read_root():
    """Root endpoint."""
    return {"message": "DocuMantis PDF Automation API"}

# Tenant routes
@app.post("/tenants/", response_model=dict)
def create_tenant(tenant_data: dict, db: Session = Depends(get_db)):
    """Create a new tenant."""
    db_tenant = tenant.Tenant(
        name=tenant_data.get("name"),
        slug=tenant_data.get("slug"),
        is_active=True
    )
    db.add(db_tenant)
    db.commit()
    db.refresh(db_tenant)
    return {"id": db_tenant.id, "name": db_tenant.name, "slug": db_tenant.slug}

@app.get("/tenants/")
def get_tenants(db: Session = Depends(get_db)):
    """Get all tenants."""
    tenants = db.query(tenant.Tenant).all()
    return [{"id": t.id, "name": t.name, "slug": t.slug, "is_active": t.is_active} for t in tenants]

# Client routes
@app.post("/clients/", response_model=client_schema.Client, status_code=status.HTTP_201_CREATED)
def create_client(client_data: client_schema.ClientCreate, tenant_id: Optional[int] = None, db: Session = Depends(get_db)):
    """Create a new client."""
    # Check if client with same ID number exists in the same tenant
    query = db.query(client.Client).filter(client.Client.id_number == client_data.id_number)
    if tenant_id:
        query = query.filter(client.Client.tenant_id == tenant_id)
    
    db_client = query.first()
    if db_client:
        raise HTTPException(status_code=400, detail="Client with this ID number already exists")
    
    # Create client data dictionary
    client_dict = client_data.model_dump()
    
    # Add tenant_id if provided
    if tenant_id:
        client_dict["tenant_id"] = tenant_id
    
    db_client = client.Client(**client_dict)
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

@app.get("/clients/", response_model=List[client_schema.Client])
def get_clients(skip: int = 0, limit: int = 100, tenant_id: Optional[int] = None, db: Session = Depends(get_db)):
    """Get all clients, optionally filtered by tenant."""
    query = db.query(client.Client)
    
    # Filter by tenant if specified
    if tenant_id:
        query = query.filter(client.Client.tenant_id == tenant_id)
        
    clients = query.offset(skip).limit(limit).all()
    return clients

@app.get("/clients/{client_id}", response_model=client_schema.Client)
def get_client(client_id: int, db: Session = Depends(get_db)):
    """Get a specific client by ID."""
    db_client = db.query(client.Client).filter(client.Client.id == client_id).first()
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return db_client

@app.put("/clients/{client_id}", response_model=client_schema.Client)
def update_client(client_id: int, client_update: client_schema.ClientUpdate, db: Session = Depends(get_db)):
    """Update a client's information."""
    db_client = db.query(client.Client).filter(client.Client.id == client_id).first()
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    
    # Update client attributes
    update_data = client_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_client, key, value)
    
    db.commit()
    db.refresh(db_client)
    return db_client

@app.delete("/clients/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client(client_id: int, db: Session = Depends(get_db)):
    """Delete a client."""
    db_client = db.query(client.Client).filter(client.Client.id == client_id).first()
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    
    db.delete(db_client)
    db.commit()
    return {"ok": True}

# PDF Template routes
@app.post("/pdf-templates/", response_model=pdf_schema.PDFTemplate)
async def create_pdf_template(
    name: str = Form(...),
    description: Optional[str] = Form(None),
    file: UploadFile = File(...),
    tenant_id: Optional[int] = Form(None),
    db: Session = Depends(get_db)
):
    """Upload a new PDF template."""
    file_path = None
    try:
        # Check if file is PDF
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
            
        # Save the uploaded PDF
        file_content = await file.read()
        file_path = pdf_service.save_pdf_template(file_content, file.filename)
        
        # Extract form fields - handle any errors gracefully
        try:
            form_fields = pdf_service.extract_form_fields(file_path)
        except Exception as e:
            print(f"Error extracting form fields: {e}")
            form_fields = {}  # Use empty dict if extraction fails
        
        # Create template in database
        db_template = pdf_template.PDFTemplate(
            name=name,
            description=description,
            file_path=file_path,
            field_mappings={},  # Initially empty, will be set through mapping endpoint
            tenant_id=tenant_id
        )
        
        db.add(db_template)
        db.commit()
        db.refresh(db_template)
        
        return db_template
    except Exception as e:
        print(f"Error in create_pdf_template: {e}")
        if file_path and os.path.exists(file_path):
            try:
                os.remove(file_path)
            except:
                pass
        raise HTTPException(status_code=500, detail=f"Failed to process PDF template: {str(e)}")

@app.get("/pdf-templates/", response_model=List[pdf_schema.PDFTemplate])
def get_pdf_templates(skip: int = 0, limit: int = 100, tenant_id: Optional[int] = None, db: Session = Depends(get_db)):
    """Get all PDF templates, optionally filtered by tenant."""
    query = db.query(pdf_template.PDFTemplate)
    
    # Filter by tenant if specified
    if tenant_id:
        query = query.filter(pdf_template.PDFTemplate.tenant_id == tenant_id)
        
    templates = query.offset(skip).limit(limit).all()
    return templates

@app.get("/pdf-templates/{template_id}", response_model=pdf_schema.PDFTemplate)
def get_pdf_template(template_id: int, db: Session = Depends(get_db)):
    """Get a specific PDF template by ID."""
    db_template = db.query(pdf_template.PDFTemplate).filter(pdf_template.PDFTemplate.id == template_id).first()
    if db_template is None:
        raise HTTPException(status_code=404, detail="PDF template not found")
    return db_template

@app.get("/pdf-templates/{template_id}/fields")
def get_pdf_template_fields(template_id: int, db: Session = Depends(get_db)):
    """Get all form fields from a PDF template with categories and semantic groups."""
    db_template = db.query(pdf_template.PDFTemplate).filter(pdf_template.PDFTemplate.id == template_id).first()
    if db_template is None:
        raise HTTPException(status_code=404, detail="PDF template not found")
    
    # Extract fields with display names and semantic fingerprints
    fields_with_display = pdf_service.extract_form_fields(db_template.file_path)
    
    # Get field categories
    raw_fields = {field: "" for field in fields_with_display.keys()}
    categories = pdf_service.categorize_fields(raw_fields)
    
    # Get semantic field groups
    semantic_groups = pdf_service.get_similar_fields(db_template.file_path)
    
    # Get current mappings
    current_mappings = db_template.field_mappings or {}
    
    # Create a response with fields, display names, categories, semantic groups and mappings
    response = {
        "fields": fields_with_display,
        "categories": categories,
        "semantic_groups": semantic_groups,
        "current_mappings": current_mappings
    }
    
    return response

@app.put("/pdf-templates/{template_id}/mappings", response_model=pdf_schema.PDFTemplate)
def update_field_mappings(template_id: int, mappings: pdf_schema.UpdateFieldMappings, db: Session = Depends(get_db)):
    """Update field mappings for a PDF template."""
    db_template = db.query(pdf_template.PDFTemplate).filter(pdf_template.PDFTemplate.id == template_id).first()
    if db_template is None:
        raise HTTPException(status_code=404, detail="PDF template not found")
    
    db_template.field_mappings = mappings.mappings
    db.commit()
    db.refresh(db_template)
    return db_template

@app.delete("/pdf-templates/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pdf_template(template_id: int, db: Session = Depends(get_db)):
    """Delete a PDF template."""
    db_template = db.query(pdf_template.PDFTemplate).filter(pdf_template.PDFTemplate.id == template_id).first()
    if db_template is None:
        raise HTTPException(status_code=404, detail="PDF template not found")
    
    # Delete the file
    if os.path.exists(db_template.file_path):
        os.remove(db_template.file_path)
    
    db.delete(db_template)
    db.commit()
    return {"ok": True}

# Generated PDF routes
@app.post("/generate-pdf/", response_model=pdf_schema.GeneratedPDF)
def generate_pdf(
    pdf_request: pdf_schema.GeneratedPDFCreate,
    db: Session = Depends(get_db)
):
    """Generate a filled PDF for a client using a template with intelligent semantic field mapping."""
    try:
        # Get the client and template
        db_client = db.query(client.Client).filter(client.Client.id == pdf_request.client_id).first()
        if db_client is None:
            raise HTTPException(status_code=404, detail="Client not found")
        
        db_template = db.query(pdf_template.PDFTemplate).filter(pdf_template.PDFTemplate.id == pdf_request.template_id).first()
        if db_template is None:
            raise HTTPException(status_code=404, detail="PDF template not found")
        
        # Check if client and template belong to the same tenant if both have tenant_id
        if db_client.tenant_id and db_template.tenant_id and db_client.tenant_id != db_template.tenant_id:
            raise HTTPException(status_code=400, detail="Client and template belong to different tenants")
        
        # Convert client to dictionary in a more robust way
        client_data = {}
        for column in client.Client.__table__.columns:
            attr_name = column.name
            if hasattr(db_client, attr_name):
                client_data[attr_name] = getattr(db_client, attr_name)
        
        # Log the client data for debugging
        print(f"Client data keys: {list(client_data.keys())}")
        
        # Get the template's explicit field mappings
        template_mappings = db_template.field_mappings or {}
        print(f"Template explicit mappings: {template_mappings}")
        
        # Get semantic field information to enhance the mapping process
        form_fields = pdf_service.extract_form_fields(db_template.file_path)
        semantic_groups = pdf_service.get_similar_fields(db_template.file_path)
        
        print(f"Semantic field groups found: {len(semantic_groups)} groups")
        for semantic_type, fields in semantic_groups.items():
            print(f"  - {semantic_type}: {len(fields)} fields")
        
        # Generate filled PDF with intelligent field mapping
        output_path = pdf_service.generate_filled_pdf(
            db_template.file_path,
            client_data,
            template_mappings
        )
        
        # Create record in database
        db_generated_pdf = pdf_template.GeneratedPDF(
            file_path=output_path,
            client_id=pdf_request.client_id,
            template_id=pdf_request.template_id
        )
        
        db.add(db_generated_pdf)
        db.commit()
        db.refresh(db_generated_pdf)
        
        return db_generated_pdf
    except Exception as e:
        print(f"Error generating PDF: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")

@app.get("/generate-pdf/{generated_pdf_id}")
def download_generated_pdf(generated_pdf_id: int, db: Session = Depends(get_db)):
    """Download a generated PDF file."""
    db_generated_pdf = db.query(pdf_template.GeneratedPDF).filter(pdf_template.GeneratedPDF.id == generated_pdf_id).first()
    if db_generated_pdf is None:
        raise HTTPException(status_code=404, detail="Generated PDF not found")
    
    if not os.path.exists(db_generated_pdf.file_path):
        raise HTTPException(status_code=404, detail="PDF file not found")
    
    return FileResponse(
        db_generated_pdf.file_path, 
        filename=os.path.basename(db_generated_pdf.file_path),
        media_type="application/pdf"
    )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
