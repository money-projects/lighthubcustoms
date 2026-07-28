from pydantic import BaseModel

class CategoryCreate(BaseModel):
    name: str
    description: str = ""
    image_url: str = ""

class CategoryOut(CategoryCreate):
    category_id: str
    created_at: str
