from pydantic import BaseModel
from typing import List

class CartItem(BaseModel):
    productId: str
    quantity: int
    addedAt: str

class CartSave(BaseModel):
    items: List[CartItem]

class CartItemAdd(BaseModel):
    productId: str
    quantity: int = 1

class CartItemUpdate(BaseModel):
    quantity: int
