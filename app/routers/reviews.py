from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from app.models.review import ReviewCreate
from app.database import supabase
from app.dependencies import get_current_user, require_admin

router = APIRouter()

@router.get("/product/{product_id}")
def get_product_reviews(product_id: str):
    return supabase.table("reviews").select("*").eq("product_id", product_id).order("created_at", desc=True).execute().data

@router.get("/all")
def get_all(_: dict = Depends(require_admin)):
    return supabase.table("reviews").select("*").order("created_at", desc=True).execute().data

@router.post("", status_code=201)
def submit(body: ReviewCreate, user: dict = Depends(get_current_user)):
    review = {**body.model_dump(), "review_id": f"REV-{int(datetime.utcnow().timestamp()*1000)}", "user_id": user["sub"], "verified": False}
    supabase.table("reviews").insert(review).execute()
    return review

@router.put("/{review_id}")
def edit(review_id: str, body: ReviewCreate, user: dict = Depends(get_current_user)):
    res = supabase.table("reviews").select("user_id").eq("review_id", review_id).execute()
    if not res.data or res.data[0]["user_id"] != user["sub"]:
        raise HTTPException(403, "Not your review")
    return supabase.table("reviews").update(body.model_dump()).eq("review_id", review_id).execute().data[0]

@router.delete("/{review_id}")
def delete(review_id: str, user: dict = Depends(get_current_user)):
    res = supabase.table("reviews").select("user_id").eq("review_id", review_id).execute()
    if not res.data or res.data[0]["user_id"] != user["sub"]:
        raise HTTPException(403, "Not your review")
    supabase.table("reviews").delete().eq("review_id", review_id).execute()
    return {"message": "Review deleted"}

@router.put("/{review_id}/verify")
def verify(review_id: str, _: dict = Depends(require_admin)):
    supabase.table("reviews").update({"verified": True}).eq("review_id", review_id).execute()
    return {"message": "Verified"}

@router.delete("/{review_id}/admin")
def admin_delete(review_id: str, _: dict = Depends(require_admin)):
    supabase.table("reviews").delete().eq("review_id", review_id).execute()
    return {"message": "Deleted"}
