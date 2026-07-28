from pydantic import BaseModel
from typing import Literal, List, Optional

class OrderItem(BaseModel):
    productId: str
    name: str
    price: float
    quantity: int
    image: str

class ShippingInfo(BaseModel):
    fullName: str
    email: str
    phone: str
    address: str
    apartment: Optional[str] = None
    city: str
    county: str
    postalCode: str

class OrderCreate(BaseModel):
    items: List[OrderItem]
    subtotal: float
    shipping: float
    total: float
    payment_method: Literal["mpesa", "card", "cod"]
    delivery_method: Literal["standard", "express", "pickup"]
    shipping_info: ShippingInfo
    order_notes: Optional[str] = None

class OrderStatusUpdate(BaseModel):
    status: Literal["pending", "processing", "shipped", "delivered", "cancelled"]

class PaymentStatusUpdate(BaseModel):
    payment_status: Literal["unpaid", "paid", "refunded"]

class TrackingUpdate(BaseModel):
    tracking_number: str
