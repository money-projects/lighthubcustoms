from pydantic import BaseModel
from typing import Literal, Optional

class CouponCreate(BaseModel):
    code: str
    discount_type: Literal["percent", "fixed"]
    discount_value: float
    min_order: float = 0
    max_uses: int = 100
    expires_at: Optional[str] = None

class CouponValidate(BaseModel):
    code: str
    order_total: float
