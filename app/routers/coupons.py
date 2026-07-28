from fastapi import APIRouter, Depends, HTTPException
from app.models.coupon import CouponCreate, CouponValidate
from app.database import supabase
from app.dependencies import get_current_user, require_admin

router = APIRouter()

@router.post("/validate")
def validate(body: CouponValidate, _: dict = Depends(get_current_user)):
    res = supabase.table("coupons").select("*").eq("code", body.code).eq("is_active", True).execute()
    if not res.data:
        raise HTTPException(404, "Invalid or inactive coupon")
    c = res.data[0]
    if c["used_count"] >= c["max_uses"]:
        raise HTTPException(400, "Coupon limit reached")
    if body.order_total < c["min_order"]:
        raise HTTPException(400, f"Minimum order is {c['min_order']}")
    discount = c["discount_value"] if c["discount_type"] == "fixed" else round(body.order_total * c["discount_value"] / 100, 2)
    return {"valid": True, "discount": discount, "discount_type": c["discount_type"]}

@router.get("")
def list_all(_: dict = Depends(require_admin)):
    return supabase.table("coupons").select("*").execute().data

@router.post("", status_code=201)
def create(body: CouponCreate, _: dict = Depends(require_admin)):
    supabase.table("coupons").insert({**body.model_dump(), "used_count": 0, "is_active": True}).execute()
    return body

@router.put("/{code}")
def update(code: str, body: CouponCreate, _: dict = Depends(require_admin)):
    return supabase.table("coupons").update(body.model_dump()).eq("code", code).execute().data[0]

@router.delete("/{code}")
def delete(code: str, _: dict = Depends(require_admin)):
    supabase.table("coupons").delete().eq("code", code).execute()
    return {"message": "Coupon deleted"}

@router.put("/{code}/toggle")
def toggle(code: str, _: dict = Depends(require_admin)):
    res = supabase.table("coupons").select("is_active").eq("code", code).execute()
    current = res.data[0]["is_active"]
    supabase.table("coupons").update({"is_active": not current}).eq("code", code).execute()
    return {"is_active": not current}
