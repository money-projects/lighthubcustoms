from fastapi import APIRouter, Depends
from datetime import datetime
from app.database import supabase
from app.dependencies import get_current_user

router = APIRouter()

def _get(uid):
    res = supabase.table("wishlist").select("items").eq("user_id", uid).execute()
    return res.data[0]["items"] if res.data else []

def _save(uid, items):
    supabase.table("wishlist").upsert({"user_id": uid, "items": items, "updated_at": datetime.utcnow().isoformat()}).execute()

@router.get("")
def get_wishlist(user: dict = Depends(get_current_user)):
    return _get(user["sub"])

@router.post("")
def save_wishlist(body: dict, user: dict = Depends(get_current_user)):
    _save(user["sub"], body.get("items", []))
    return {"message": "Wishlist saved"}

@router.post("/add/{product_id}")
def add(product_id: str, user: dict = Depends(get_current_user)):
    items = _get(user["sub"])
    if product_id not in items:
        items.append(product_id)
        _save(user["sub"], items)
    return {"message": "Added to wishlist"}

@router.delete("/remove/{product_id}")
def remove(product_id: str, user: dict = Depends(get_current_user)):
    _save(user["sub"], [i for i in _get(user["sub"]) if i != product_id])
    return {"message": "Removed from wishlist"}

@router.delete("")
def clear(user: dict = Depends(get_current_user)):
    _save(user["sub"], [])
    return {"message": "Wishlist cleared"}
