from pydantic import BaseModel
from typing import Dict, Optional, List, Any
from datetime import datetime

class PDFTemplateBase(BaseModel):
    name: str
    description: Optional[str] = None
    field_mappings: Dict[str, str] = {}

class PDFTemplateCreate(PDFTemplateBase):
    tenant_id: Optional[int] = None

class PDFTemplateUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    field_mappings: Optional[Dict[str, str]] = None
    is_active: Optional[bool] = None
    tenant_id: Optional[int] = None

class PDFTemplate(PDFTemplateBase):
    id: int
    file_path: str
    created_at: datetime
    updated_at: datetime
    is_active: bool
    tenant_id: Optional[int] = None
    
    model_config = {
        "from_attributes": True
    }

class GeneratedPDFCreate(BaseModel):
    client_id: int
    template_id: int

class GeneratedPDF(BaseModel):
    id: int
    file_path: str
    client_id: int
    template_id: int
    created_at: datetime
    
    model_config = {
        "from_attributes": True
    }

class PDFField(BaseModel):
    name: str
    type: str
    required: bool

class PDFTemplateFields(BaseModel):
    fields: List[PDFField]

class FieldMapping(BaseModel):
    pdf_field: str
    client_field: str

class UpdateFieldMappings(BaseModel):
    mappings: Dict[str, str]

class FieldCategory(BaseModel):
    """Category for grouping similar PDF fields"""
    name: str
    description: str
    fields: List[str]

class FieldCategoryMap(BaseModel):
    """Mapping of field categories to client data fields"""
    categories: Dict[str, List[str]]
    mappings: Dict[str, str]
