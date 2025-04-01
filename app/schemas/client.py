from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date

class ClientBase(BaseModel):
    first_name: str
    last_name: str
    id_number: str
    date_of_birth: date
    email: EmailStr
    phone_number: str
    address: str
    city: str
    postal_code: str
    country: str
    tax_number: str
    
    # Banking details
    bank_name: str
    account_number: str
    branch_code: str
    account_type: str
    
    # Optional fields
    employer: Optional[str] = None
    occupation: Optional[str] = None
    income: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    id_number: Optional[str] = None
    date_of_birth: Optional[date] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    tax_number: Optional[str] = None
    
    # Banking details
    bank_name: Optional[str] = None
    account_number: Optional[str] = None
    branch_code: Optional[str] = None
    account_type: Optional[str] = None
    
    # Optional fields
    employer: Optional[str] = None
    occupation: Optional[str] = None
    income: Optional[str] = None
    is_active: Optional[bool] = None
    tenant_id: Optional[int] = None

class Client(ClientBase):
    id: int
    is_active: bool
    tenant_id: Optional[int] = None
    
    model_config = {
        "from_attributes": True
    }
