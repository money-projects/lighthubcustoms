from pydantic import BaseModel
from typing import Optional

class AddressCreate(BaseModel):
    full_name: str
    phone: str
    address: str
    apartment: Optional[str] = ""
    city: str
    county: str
    postal_code: str
    is_default: bool = False

class AddressOut(AddressCreate):
    address_id: str
    user_id: str
    created_at: str
