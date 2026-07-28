from fastapi import APIRouter, Depends, HTTPException, Query
from datetime import datetime
from typing import Optional
from app.models.order import OrderCreate, OrderStatusUpdate, PaymentStatusUpdate, TrackingUpdate
from app.database import supabase
from app.dependencies import get_current_user, require_admin

router = APIRouter()

@router.get("")
def get_user_orders(
    page:   int = Query(1, ge=1),
    limit:  int = Query(10, ge=1, le=50),
    status: Optional[str] = Query(None),
    user: dict = Depends(get_current_user)
):
    query = supabase.table("orders").select("*", count="exact").eq("user_id", user["sub"])
    if status: query = query.eq("status", status)
    offset = (page - 1) * limit
    res = query.order("created_at", desc=True).range(offset, offset + limit - 1).execute()
    return {"data": res.data, "total": res.count, "page": page, "limit": limit, "pages": -(-res.count // limit)}

@router.get("/all")
def get_all(
    page:   int = Query(1, ge=1),
    limit:  int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
    _: dict = Depends(require_admin)
):
    query = supabase.table("orders").select("*", count="exact")
    if status: query = query.eq("status", status)
    offset = (page - 1) * limit
    res = query.order("created_at", desc=True).range(offset, offset + limit - 1).execute()
    return {"data": res.data, "total": res.count, "page": page, "limit": limit, "pages": -(-res.count // limit)}

@router.get("/{order_id}")
def get_order(order_id: str, user: dict = Depends(get_current_user)):
    res = supabase.table("orders").select("*").eq("order_id", order_id).execute()
    if not res.data:
        raise HTTPException(404, "Order not found")
    order = res.data[0]
    if order["user_id"] != user["sub"] and user.get("role") != "admin":
        raise HTTPException(403, "Access denied")
    return order

@router.post("", status_code=201)
def create_order(body: OrderCreate, user: dict = Depends(get_current_user)):
    now = datetime.utcnow().isoformat()
    order = {
        **body.model_dump(),
        "order_id": f"ORD-{int(datetime.utcnow().timestamp()*1000)}",
        "user_id": user["sub"],
        "status": "pending",
        "payment_status": "unpaid",
        "tracking_number": "",
        "created_at": now,
        "updated_at": now,
    }
    supabase.table("orders").insert(order).execute()
    return order

@router.post("/{order_id}/cancel")
def cancel(order_id: str, user: dict = Depends(get_current_user)):
    res = supabase.table("orders").select("*").eq("order_id", order_id).execute()
    if not res.data:
        raise HTTPException(404, "Order not found")
    if res.data[0]["user_id"] != user["sub"]:
        raise HTTPException(403, "Access denied")
    if res.data[0]["status"] not in ("pending", "processing"):
        raise HTTPException(400, "Order cannot be cancelled")
    supabase.table("orders").update({"status": "cancelled", "updated_at": datetime.utcnow().isoformat()}).eq("order_id", order_id).execute()
    return {"message": "Order cancelled"}

@router.put("/{order_id}/status")
def update_status(order_id: str, body: OrderStatusUpdate, _: dict = Depends(require_admin)):
    return supabase.table("orders").update({"status": body.status, "updated_at": datetime.utcnow().isoformat()}).eq("order_id", order_id).execute().data[0]

@router.put("/{order_id}/payment")
def update_payment(order_id: str, body: PaymentStatusUpdate, _: dict = Depends(require_admin)):
    return supabase.table("orders").update({"payment_status": body.payment_status, "updated_at": datetime.utcnow().isoformat()}).eq("order_id", order_id).execute().data[0]

@router.put("/{order_id}/tracking")
def update_tracking(order_id: str, body: TrackingUpdate, _: dict = Depends(require_admin)):
    return supabase.table("orders").update({"tracking_number": body.tracking_number, "updated_at": datetime.utcnow().isoformat()}).eq("order_id", order_id).execute().data[0]

@router.delete("/{order_id}")
def delete_order(order_id: str, _: dict = Depends(require_admin)):
    supabase.table("orders").delete().eq("order_id", order_id).execute()
    return {"message": "Order deleted"}
