from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from app.models.category import CategoryCreate, CategoryOut
from app.database import supabase
from app.dependencies import require_admin

router = APIRouter()

@router.get("")
def get_all():
    return supabase.table("categories").select("*").execute().data

@router.get("/{category_id}")
def get_one(category_id: str):
    res = supabase.table("categories").select("*").eq("category_id", category_id).execute()
    if not res.data:
        raise HTTPException(404, "Category not found")
    return res.data[0]

@router.post("", status_code=201)
def create(body: CategoryCreate, _: dict = Depends(require_admin)):
    cat = {**body.model_dump(), "category_id": f"CAT-{int(datetime.utcnow().timestamp()*1000)}"}
    supabase.table("categories").insert(cat).execute()
    return cat

@router.put("/{category_id}")
def update(category_id: str, body: CategoryCreate, _: dict = Depends(require_admin)):
    return supabase.table("categories").update(body.model_dump()).eq("category_id", category_id).execute().data[0]

@router.delete("/{category_id}")
def delete(category_id: str, _: dict = Depends(require_admin)):
    supabase.table("categories").delete().eq("category_id", category_id).execute()
    return {"message": "Category deleted"}
