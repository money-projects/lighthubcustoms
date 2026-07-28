from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import List, Optional, Literal
from datetime import datetime
from jinja2 import Template
from app.database import supabase
from app.dependencies import require_admin
from app.email_service import send_receipt, RECEIPT_TEMPLATE

router = APIRouter()

# ── Models ────────────────────────────────────────────────────────────────────

class POSOrderItem(BaseModel):
    productId: str
    name: str
    price: float
    quantity: int
    image: str = ""

class POSOrderCreate(BaseModel):
    items: List[POSOrderItem]
    subtotal: float
    discount: float = 0
    shipping: float = 0
    total: float
    payment_method: Literal["mpesa", "card", "cash", "cod"]
    customer_email: Optional[str] = None
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    order_notes: Optional[str] = None

class SendReceiptBody(BaseModel):
    email: Optional[str] = None

class RefundBody(BaseModel):
    reason: str
    amount: Optional[float] = None

class StockAdjust(BaseModel):
    product_id: str
    quantity: int
    reason: str

class DiscountCreate(BaseModel):
    code: str
    discount_type: Literal["fixed", "percent"]
    discount_value: float
    min_order: float = 0
    max_uses: int = 100
    expires_at: Optional[str] = None

class ShiftOpen(BaseModel):
    opening_float: float
    notes: Optional[str] = None

class ShiftClose(BaseModel):
    closing_cash: float
    notes: Optional[str] = None

# ── POS Orders ────────────────────────────────────────────────────────────────

@router.post("/pos/order", status_code=201)
def pos_create_order(body: POSOrderCreate, admin: dict = Depends(require_admin)):
    now = datetime.utcnow().isoformat()
    order_id = f"POS-{int(datetime.utcnow().timestamp()*1000)}"
    shipping_info = {
        "fullName": body.customer_name or "Walk-in Customer",
        "email": body.customer_email or "",
        "phone": body.customer_phone or "",
        "address": "In-store", "city": "", "county": "", "postalCode": "",
    }
    order = {
        "order_id": order_id,
        "user_id": body.customer_email or admin["sub"],
        "items": [i.model_dump() for i in body.items],
        "subtotal": body.subtotal,
        "discount": body.discount,
        "shipping": body.shipping,
        "total": body.total,
        "payment_method": body.payment_method,
        "delivery_method": "pickup",
        "shipping_info": shipping_info,
        "status": "delivered",
        "payment_status": "paid",
        "tracking_number": "",
        "order_notes": body.order_notes or "",
        "created_at": now,
        "updated_at": now,
        "pos": True,
        "created_by": admin["sub"],
    }
    supabase.table("orders").insert(order).execute()
    if body.customer_email:
        send_receipt(body.customer_email, order, subject_prefix="Your Receipt")
    return order

@router.get("/pos/order/{order_id}/receipt", response_class=HTMLResponse)
def pos_receipt_html(order_id: str, _: dict = Depends(require_admin)):
    res = supabase.table("orders").select("*").eq("order_id", order_id).execute()
    if not res.data:
        raise HTTPException(404, "Order not found")
    return Template(RECEIPT_TEMPLATE).render(order=res.data[0])

@router.post("/pos/order/{order_id}/send-receipt")
def pos_send_receipt(order_id: str, body: SendReceiptBody, _: dict = Depends(require_admin)):
    res = supabase.table("orders").select("*").eq("order_id", order_id).execute()
    if not res.data:
        raise HTTPException(404, "Order not found")
    order = res.data[0]
    email = body.email or order.get("shipping_info", {}).get("email") or order["user_id"]
    if not email or "@" not in email:
        raise HTTPException(400, "No valid email for this order")
    send_receipt(email, order, subject_prefix="Receipt")
    return {"message": f"Receipt sent to {email}"}

# ── Refunds ───────────────────────────────────────────────────────────────────

@router.post("/orders/{order_id}/refund")
def refund_order(order_id: str, body: RefundBody, admin: dict = Depends(require_admin)):
    res = supabase.table("orders").select("*").eq("order_id", order_id).execute()
    if not res.data:
        raise HTTPException(404, "Order not found")
    order = res.data[0]
    refund_amount = body.amount or order["total"]
    supabase.table("orders").update({
        "payment_status": "refunded",
        "status": "cancelled",
        "refund_amount": refund_amount,
        "refund_reason": body.reason,
        "refunded_by": admin["sub"],
        "refunded_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    }).eq("order_id", order_id).execute()
    return {"message": f"Refund of KES {refund_amount} processed", "order_id": order_id}

# ── Inventory ─────────────────────────────────────────────────────────────────

@router.get("/inventory")
def get_inventory(_: dict = Depends(require_admin)):
    return supabase.table("products").select("product_id,name,category,stock,price,is_active").order("stock").execute().data

@router.get("/inventory/low-stock")
def low_stock(threshold: int = Query(10), _: dict = Depends(require_admin)):
    return supabase.table("products").select("product_id,name,category,stock").lte("stock", threshold).eq("is_active", True).order("stock").execute().data

@router.post("/inventory/adjust")
def adjust_stock(body: StockAdjust, admin: dict = Depends(require_admin)):
    res = supabase.table("products").select("stock").eq("product_id", body.product_id).execute()
    if not res.data:
        raise HTTPException(404, "Product not found")
    new_stock = max(0, res.data[0]["stock"] + body.quantity)
    supabase.table("products").update({"stock": new_stock}).eq("product_id", body.product_id).execute()
    supabase.table("stock_adjustments").insert({
        "product_id": body.product_id,
        "quantity": body.quantity,
        "reason": body.reason,
        "adjusted_by": admin["sub"],
        "created_at": datetime.utcnow().isoformat(),
    }).execute()
    return {"product_id": body.product_id, "new_stock": new_stock}

@router.get("/inventory/adjustments")
def stock_adjustments(_: dict = Depends(require_admin)):
    return supabase.table("stock_adjustments").select("*").order("created_at", desc=True).limit(100).execute().data

# ── Discounts ─────────────────────────────────────────────────────────────────

@router.get("/discounts")
def list_discounts(_: dict = Depends(require_admin)):
    return supabase.table("coupons").select("*").order("created_at", desc=True).execute().data

@router.post("/discounts", status_code=201)
def create_discount(body: DiscountCreate, _: dict = Depends(require_admin)):
    data = {**body.model_dump(), "used_count": 0, "is_active": True, "created_at": datetime.utcnow().isoformat()}
    supabase.table("coupons").insert(data).execute()
    return data

@router.delete("/discounts/{code}")
def delete_discount(code: str, _: dict = Depends(require_admin)):
    supabase.table("coupons").delete().eq("code", code).execute()
    return {"message": "Discount deleted"}

# ── Shifts ────────────────────────────────────────────────────────────────────

@router.post("/shifts/open", status_code=201)
def open_shift(body: ShiftOpen, admin: dict = Depends(require_admin)):
    active = supabase.table("shifts").select("shift_id").eq("cashier", admin["sub"]).is_("closed_at", "null").execute()
    if active.data:
        raise HTTPException(400, "You already have an open shift")
    shift = {
        "shift_id": f"SHIFT-{int(datetime.utcnow().timestamp()*1000)}",
        "cashier": admin["sub"],
        "opening_float": body.opening_float,
        "notes": body.notes or "",
        "opened_at": datetime.utcnow().isoformat(),
        "closed_at": None,
    }
    supabase.table("shifts").insert(shift).execute()
    return shift

@router.post("/shifts/close")
def close_shift(body: ShiftClose, admin: dict = Depends(require_admin)):
    res = supabase.table("shifts").select("*").eq("cashier", admin["sub"]).is_("closed_at", "null").execute()
    if not res.data:
        raise HTTPException(404, "No open shift found")
    shift = res.data[0]
    now = datetime.utcnow().isoformat()
    orders = supabase.table("orders").select("total,payment_method,created_at").eq("created_by", admin["sub"]).gte("created_at", shift["opened_at"]).execute().data
    total_sales = sum(o["total"] for o in orders)
    cash_sales  = sum(o["total"] for o in orders if o["payment_method"] == "cash")
    variance    = body.closing_cash - (shift["opening_float"] + cash_sales)
    supabase.table("shifts").update({
        "closed_at": now,
        "closing_cash": body.closing_cash,
        "total_sales": total_sales,
        "cash_sales": cash_sales,
        "order_count": len(orders),
        "variance": variance,
        "close_notes": body.notes or "",
    }).eq("shift_id", shift["shift_id"]).execute()
    return {"shift_id": shift["shift_id"], "opened_at": shift["opened_at"], "closed_at": now,
            "total_sales": total_sales, "cash_sales": cash_sales, "order_count": len(orders), "variance": variance}

@router.get("/shifts")
def list_shifts(_: dict = Depends(require_admin)):
    return supabase.table("shifts").select("*").order("opened_at", desc=True).limit(50).execute().data

@router.get("/shifts/current")
def current_shift(admin: dict = Depends(require_admin)):
    res = supabase.table("shifts").select("*").eq("cashier", admin["sub"]).is_("closed_at", "null").execute()
    if not res.data:
        raise HTTPException(404, "No open shift")
    return res.data[0]

# ── Reports ───────────────────────────────────────────────────────────────────

@router.get("/reports/sales")
def sales_report(date_from: str = Query(...), date_to: str = Query(...), _: dict = Depends(require_admin)):
    orders = supabase.table("orders").select("*").gte("created_at", date_from).lte("created_at", date_to + "T23:59:59").neq("status", "cancelled").execute().data
    total_revenue = sum(o["total"] for o in orders)
    by_method, by_day = {}, {}
    for o in orders:
        m = o.get("payment_method", "unknown")
        by_method[m] = by_method.get(m, 0) + o["total"]
        day = o["created_at"][:10]
        by_day[day] = by_day.get(day, 0) + o["total"]
    return {"date_from": date_from, "date_to": date_to, "total_orders": len(orders),
            "total_revenue": total_revenue, "by_payment_method": by_method,
            "by_day": [{"date": k, "revenue": v} for k, v in sorted(by_day.items())]}

@router.get("/reports/products")
def product_report(_: dict = Depends(require_admin)):
    orders = supabase.table("orders").select("items,status").neq("status", "cancelled").execute().data
    counts, revenue = {}, {}
    for o in orders:
        for item in o.get("items", []):
            pid = item.get("productId", "")
            counts[pid]  = counts.get(pid, 0) + item.get("quantity", 0)
            revenue[pid] = revenue.get(pid, 0) + item.get("price", 0) * item.get("quantity", 0)
    top = sorted(counts.items(), key=lambda x: x[1], reverse=True)[:20]
    return [{"product_id": k, "units_sold": v, "revenue": revenue.get(k, 0)} for k, v in top]

@router.get("/reports/customers")
def customer_report(_: dict = Depends(require_admin)):
    orders = supabase.table("orders").select("user_id,total,status").neq("status", "cancelled").execute().data
    customers = {}
    for o in orders:
        uid = o["user_id"]
        if uid not in customers:
            customers[uid] = {"email": uid, "order_count": 0, "total_spent": 0}
        customers[uid]["order_count"] += 1
        customers[uid]["total_spent"] += o["total"]
    return sorted(customers.values(), key=lambda x: x["total_spent"], reverse=True)[:20]

# ── Stats ─────────────────────────────────────────────────────────────────────

@router.get("/stats")
def stats(_: dict = Depends(require_admin)):
    users     = supabase.table("users").select("email", count="exact").execute()
    products  = supabase.table("products").select("product_id", count="exact").execute()
    orders    = supabase.table("orders").select("total,status,created_at").execute().data
    today     = datetime.utcnow().date().isoformat()
    revenue       = sum(o["total"] for o in orders if o["status"] != "cancelled")
    today_revenue = sum(o["total"] for o in orders if o["created_at"][:10] == today and o["status"] != "cancelled")
    today_orders  = sum(1 for o in orders if o["created_at"][:10] == today)
    low_stock     = supabase.table("products").select("product_id", count="exact").lte("stock", 10).eq("is_active", True).execute()
    return {"total_users": users.count, "total_products": products.count, "total_orders": len(orders),
            "total_revenue": revenue, "today_orders": today_orders, "today_revenue": today_revenue,
            "low_stock_count": low_stock.count}

@router.get("/stats/revenue")
def revenue(_: dict = Depends(require_admin)):
    orders = supabase.table("orders").select("total,created_at,status").execute().data
    by_day = {}
    for o in orders:
        if o["status"] == "cancelled": continue
        day = o["created_at"][:10]
        by_day[day] = by_day.get(day, 0) + o["total"]
    return [{"date": k, "revenue": v} for k, v in sorted(by_day.items())]

@router.get("/stats/top-products")
def top_products(_: dict = Depends(require_admin)):
    orders = supabase.table("orders").select("items").execute().data
    counts = {}
    for o in orders:
        for item in o.get("items", []):
            pid = item.get("productId", "")
            counts[pid] = counts.get(pid, 0) + item.get("quantity", 0)
    return [{"product_id": k, "units_sold": v} for k, v in sorted(counts.items(), key=lambda x: x[1], reverse=True)[:10]]

@router.get("/stats/recent-orders")
def recent_orders(_: dict = Depends(require_admin)):
    return supabase.table("orders").select("*").order("created_at", desc=True).limit(10).execute().data
