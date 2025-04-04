from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
import datetime

from .database import Base

class PDFTemplate(Base):
    __tablename__ = "pdf_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    file_path = Column(String)
    
    # Store field mappings as JSON
    field_mappings = Column(JSON, default={})
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # Tenant relationship
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=True)  # Nullable for backward compatibility
    tenant = relationship("Tenant", back_populates="templates")
    
    # Relationship with generated PDFs
    generated_pdfs = relationship("GeneratedPDF", back_populates="template")
    
    def __repr__(self):
        return f"<PDFTemplate(id={self.id}, name='{self.name}')>"

class GeneratedPDF(Base):
    __tablename__ = "generated_pdfs"
    
    id = Column(Integer, primary_key=True, index=True)
    file_path = Column(String)
    
    # Foreign keys
    client_id = Column(Integer, ForeignKey("clients.id"))
    template_id = Column(Integer, ForeignKey("pdf_templates.id"))
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationships
    client = relationship("Client", back_populates="pdfs")
    template = relationship("PDFTemplate", back_populates="generated_pdfs")
    
    def __repr__(self):
        return f"<GeneratedPDF(id={self.id}, client_id={self.client_id}, template_id={self.template_id})>"
