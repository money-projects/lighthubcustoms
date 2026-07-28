from fastapi import APIRouter, Depends
from datetime import datetime
from app.models.cart import CartSave, CartItemAdd, CartItemUpdate
from app.database import supabase
from app.dependencies import get_current_user

router = APIRouter()

def _get(uid):
    res = supabase.table("cart").select("items").eq("user_id", uid).execute()
    return res.data[0]["items"] if res.data else []

def _save(uid, items):
    supabase.table("cart").upsert({"user_id": uid, "items": items, "updated_at": datetime.utcnow().isoformat()}).execute()

@router.get("")
def get_cart(user: dict = Depends(get_current_user)):
    return _get(user["sub"])

@router.post("")
def save_cart(body: CartSave, user: dict = Depends(get_current_user)):
    _save(user["sub"], [i.model_dump() for i in body.items])
    return {"message": "Cart saved"}

@router.post("/add")
def add_item(body: CartItemAdd, user: dict = Depends(get_current_user)):
    items = _get(user["sub"])
    for item in items:
        if item["productId"] == body.productId:
            item["quantity"] += body.quantity
            _save(user["sub"], items)
            return {"message": "Quantity updated"}
    items.append({"productId": body.productId, "quantity": body.quantity, "addedAt": datetime.utcnow().isoformat()})
    _save(user["sub"], items)
    return {"message": "Item added"}

@router.put("/item/{product_id}")
def update_item(product_id: str, body: CartItemUpdate, user: dict = Depends(get_current_user)):
    items = [i for i in _get(user["sub"]) if i["productId"] != product_id]
    if body.quantity > 0:
        items.append({"productId": product_id, "quantity": body.quantity, "addedAt": datetime.utcnow().isoformat()})
    _save(user["sub"], items)
    return {"message": "Cart updated"}

@router.delete("/item/{product_id}")
def remove_item(product_id: str, user: dict = Depends(get_current_user)):
    _save(user["sub"], [i for i in _get(user["sub"]) if i["productId"] != product_id])
    return {"message": "Item removed"}

@router.delete("")
def clear_cart(user: dict = Depends(get_current_user)):
    _save(user["sub"], [])
    return {"message": "Cart cleared"}
