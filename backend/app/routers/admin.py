from fastapi import APIRouter, Depends
from app.database import supabase
from app.dependencies import require_admin

router = APIRouter()

@router.get("/stats")
def stats(_: dict = Depends(require_admin)):
    users    = supabase.table("users").select("email", count="exact").execute()
    products = supabase.table("products").select("product_id", count="exact").execute()
    orders   = supabase.table("orders").select("total,status").execute().data
    revenue  = sum(o["total"] for o in orders if o["status"] != "cancelled")
    return {"total_users": users.count, "total_products": products.count, "total_orders": len(orders), "total_revenue": revenue}

@router.get("/stats/revenue")
def revenue(_: dict = Depends(require_admin)):
    orders = supabase.table("orders").select("total,created_at,status").execute().data
    by_day = {}
    for o in orders:
        if o["status"] == "cancelled":
            continue
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
    top = sorted(counts.items(), key=lambda x: x[1], reverse=True)[:10]
    return [{"product_id": k, "units_sold": v} for k, v in top]

@router.get("/stats/recent-orders")
def recent_orders(_: dict = Depends(require_admin)):
    return supabase.table("orders").select("*").order("created_at", desc=True).limit(10).execute().data
