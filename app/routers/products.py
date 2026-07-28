from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from app.models.product import ProductCreate, ProductOut, StockUpdate
from app.database import supabase
from app.dependencies import require_admin

router = APIRouter()

@router.get("")
def get_all():
    return supabase.table("products").select("*").eq("is_active", True).execute().data

@router.get("/search")
def search(q: str):
    return supabase.table("products").select("*").ilike("name", f"%{q}%").execute().data

@router.get("/category/{category}")
def by_category(category: str):
    return supabase.table("products").select("*").eq("category", category).eq("is_active", True).execute().data

@router.get("/section/{section}")
def by_section(section: str):
    return supabase.table("products").select("*").eq("section", section).eq("is_active", True).execute().data

@router.get("/{product_id}")
def get_one(product_id: str):
    res = supabase.table("products").select("*").eq("product_id", product_id).execute()
    if not res.data:
        raise HTTPException(404, "Product not found")
    return res.data[0]

@router.post("", status_code=201)
def create(body: ProductCreate, _: dict = Depends(require_admin)):
    product = {**body.model_dump(), "product_id": f"PROD-{int(datetime.utcnow().timestamp()*1000)}"}
    supabase.table("products").insert(product).execute()
    return product

@router.put("/{product_id}")
def update(product_id: str, body: ProductCreate, _: dict = Depends(require_admin)):
    data = {**body.model_dump(), "updated_at": datetime.utcnow().isoformat()}
    return supabase.table("products").update(data).eq("product_id", product_id).execute().data[0]

@router.delete("/{product_id}")
def delete(product_id: str, _: dict = Depends(require_admin)):
    supabase.table("products").delete().eq("product_id", product_id).execute()
    return {"message": "Product deleted"}

@router.put("/{product_id}/stock")
def update_stock(product_id: str, body: StockUpdate, _: dict = Depends(require_admin)):
    supabase.table("products").update({"stock": body.stock}).eq("product_id", product_id).execute()
    return {"message": "Stock updated"}

@router.put("/{product_id}/toggle")
def toggle(product_id: str, _: dict = Depends(require_admin)):
    res = supabase.table("products").select("is_active").eq("product_id", product_id).execute()
    current = res.data[0]["is_active"]
    supabase.table("products").update({"is_active": not current}).eq("product_id", product_id).execute()
    return {"is_active": not current}
