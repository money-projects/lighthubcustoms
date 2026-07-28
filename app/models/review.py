from pydantic import BaseModel

class ReviewCreate(BaseModel):
    product_id: str
    rating: int
    title: str = ""
    body: str = ""
