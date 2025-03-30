from sqlalchemy import Boolean, Column, Integer, String, Date
from sqlalchemy.orm import relationship

from .database import Base

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    id_number = Column(String, unique=True, index=True)
    date_of_birth = Column(Date)
    email = Column(String, unique=True, index=True)
    phone_number = Column(String)
    address = Column(String)
    city = Column(String)
    postal_code = Column(String)
    country = Column(String)
    tax_number = Column(String)
    
    # Banking details
    bank_name = Column(String)
    account_number = Column(String)
    branch_code = Column(String)
    account_type = Column(String)
    
    # Optional fields
    employer = Column(String, nullable=True)
    occupation = Column(String, nullable=True)
    income = Column(String, nullable=True)
    
    is_active = Column(Boolean, default=True)
    
    # Relationship with generated PDFs
    pdfs = relationship("GeneratedPDF", back_populates="client") 