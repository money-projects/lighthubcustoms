# STEP 6 — Reviews, Coupons, Notifications, Bulb Data, Admin Stats

---

## 6.1 Reviews — `app/routers/reviews.py`

### `app/models/review.py`
```python
from pydantic import BaseModel

class ReviewCreate(BaseModel):
    product_id: str
    rating: int
    title: str = ""
    body: str = ""

class ReviewOut(ReviewCreate):
    review_id: str
    user_id: str
    verified: bool
    created_at: str
```

### Router
```python
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from app.models.review import ReviewCreate, ReviewOut
from app.database import supabase
from app.dependencies import get_current_user, require_admin

router = APIRouter()

@router.get("/product/{product_id}", response_model=list[ReviewOut])
def get_product_reviews(product_id: str):
    return supabase.table("reviews").select("*").eq("product_id", product_id).order("created_at", desc=True).execute().data

@router.get("/all")
def get_all(_: dict = Depends(require_admin)):
    return supabase.table("reviews").select("*").order("created_at", desc=True).execute().data

@router.post("", response_model=ReviewOut, status_code=201)
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
```

---

## 6.2 Coupons — `app/routers/coupons.py`

### `app/models/coupon.py`
```python
from pydantic import BaseModel
from typing import Literal, Optional

class CouponCreate(BaseModel):
    code: str
    discount_type: Literal["percent", "fixed"]
    discount_value: float
    min_order: float = 0
    max_uses: int = 100
    expires_at: Optional[str] = None

class CouponValidate(BaseModel):
    code: str
    order_total: float
```

### Router
```python
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
```

---

## 6.3 Notifications — `app/routers/notifications.py`

```python
from fastapi import APIRouter, Depends
from datetime import datetime
from app.database import supabase
from app.dependencies import get_current_user, require_admin

router = APIRouter()

@router.get("")
def get_all(user: dict = Depends(get_current_user)):
    return supabase.table("notifications").select("*").eq("user_id", user["sub"]).order("created_at", desc=True).execute().data

@router.put("/{notification_id}/read")
def mark_read(notification_id: str, user: dict = Depends(get_current_user)):
    supabase.table("notifications").update({"is_read": True}).eq("notification_id", notification_id).eq("user_id", user["sub"]).execute()
    return {"message": "Marked as read"}

@router.put("/read-all")
def mark_all_read(user: dict = Depends(get_current_user)):
    supabase.table("notifications").update({"is_read": True}).eq("user_id", user["sub"]).execute()
    return {"message": "All marked as read"}

@router.delete("/{notification_id}")
def delete(notification_id: str, user: dict = Depends(get_current_user)):
    supabase.table("notifications").delete().eq("notification_id", notification_id).eq("user_id", user["sub"]).execute()
    return {"message": "Deleted"}

@router.post("/broadcast")
def broadcast(body: dict, _: dict = Depends(require_admin)):
    users = supabase.table("users").select("email").execute().data
    now = datetime.utcnow().isoformat()
    notifs = [{
        "notification_id": f"NOTIF-{int(datetime.utcnow().timestamp()*1000)}-{i}",
        "user_id": u["email"],
        "title": body.get("title", ""),
        "message": body.get("message", ""),
        "type": body.get("type", "info"),
        "is_read": False,
        "created_at": now
    } for i, u in enumerate(users)]
    supabase.table("notifications").insert(notifs).execute()
    return {"message": f"Sent to {len(users)} users"}
```

---

## 6.4 Bulb Data — `app/routers/bulb_data.py`

```python
from fastapi import APIRouter, Depends, HTTPException
from app.database import supabase
from app.dependencies import require_admin

router = APIRouter()

@router.get("")
def get_all():
    return supabase.table("bulb_data").select("*").execute().data

@router.get("/makes")
def get_makes():
    res = supabase.table("bulb_data").select("make").execute()
    return list({r["make"] for r in res.data})

@router.get("/models/{make}")
def get_models(make: str):
    res = supabase.table("bulb_data").select("model").eq("make", make).execute()
    return [r["model"] for r in res.data]

@router.get("/{make}/{model}")
def get_by_vehicle(make: str, model: str):
    res = supabase.table("bulb_data").select("*").eq("vehicle_key", f"{make}#{model}").execute()
    if not res.data:
        raise HTTPException(404, "Vehicle not found")
    return res.data[0]

@router.post("", status_code=201)
def add(body: dict, _: dict = Depends(require_admin)):
    body["vehicle_key"] = f"{body['make']}#{body['model']}"
    supabase.table("bulb_data").insert(body).execute()
    return body

@router.put("/{make}/{model}")
def update(make: str, model: str, body: dict, _: dict = Depends(require_admin)):
    return supabase.table("bulb_data").update(body).eq("vehicle_key", f"{make}#{model}").execute().data[0]

@router.delete("/{make}/{model}")
def delete(make: str, model: str, _: dict = Depends(require_admin)):
    supabase.table("bulb_data").delete().eq("vehicle_key", f"{make}#{model}").execute()
    return {"message": "Deleted"}
```

---

## 6.5 Admin Stats — `app/routers/admin.py`

```python
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
```

---

## 6.6 Final `app/main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import (
    auth, users, products, categories,
    cart, wishlist, orders, addresses,
    reviews, coupons, notifications, bulb_data, admin
)

app = FastAPI(title="Radiant Motors API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,          prefix="/api/auth",          tags=["Auth"])
app.include_router(users.router,         prefix="/api/users",         tags=["Users"])
app.include_router(products.router,      prefix="/api/products",      tags=["Products"])
app.include_router(categories.router,    prefix="/api/categories",    tags=["Categories"])
app.include_router(cart.router,          prefix="/api/cart",          tags=["Cart"])
app.include_router(wishlist.router,      prefix="/api/wishlist",      tags=["Wishlist"])
app.include_router(orders.router,        prefix="/api/orders",        tags=["Orders"])
app.include_router(addresses.router,     prefix="/api/addresses",     tags=["Addresses"])
app.include_router(reviews.router,       prefix="/api/reviews",       tags=["Reviews"])
app.include_router(coupons.router,       prefix="/api/coupons",       tags=["Coupons"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])
app.include_router(bulb_data.router,     prefix="/api/bulb-data",     tags=["Bulb Data"])
app.include_router(admin.router,         prefix="/api/admin",         tags=["Admin"])

@app.get("/")
def root():
    return {"message": "Radiant Motors API running"}
```
