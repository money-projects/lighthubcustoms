from pydantic import BaseModel
from typing import Literal, List, Optional

class ProductCreate(BaseModel):
    name: str
    category: str
    section: str
    price: float
    description: str = ""
    specifications: str = ""
    image_url: str = ""
    images: List[str] = []
    discount: str = ""
    stock: int = 0

class ProductOut(ProductCreate):
    product_id: str
    is_active: bool
    created_at: str

class StockUpdate(BaseModel):
    stock: int
