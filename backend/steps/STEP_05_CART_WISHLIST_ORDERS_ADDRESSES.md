# STEP 5 — Build Cart, Wishlist, Orders, Addresses

---

## 5.1 Cart Router — `app/routers/cart.py`

### Models — `app/models/cart.py`
```python
from pydantic import BaseModel
from typing import List

class CartItem(BaseModel):
    productId: str
    quantity: int
    addedAt: str

class CartSave(BaseModel):
    items: List[CartItem]

class CartItemAdd(BaseModel):
    productId: str
    quantity: int = 1

class CartItemUpdate(BaseModel):
    quantity: int
```

### Router
```python
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
    items = [i for i in _get(user["sub"]) if i["productId"] != product_id]
    _save(user["sub"], items)
    return {"message": "Item removed"}

@router.delete("")
def clear_cart(user: dict = Depends(get_current_user)):
    _save(user["sub"], [])
    return {"message": "Cart cleared"}
```

---

## 5.2 Wishlist Router — `app/routers/wishlist.py`

```python
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
    items = [i for i in _get(user["sub"]) if i != product_id]
    _save(user["sub"], items)
    return {"message": "Removed from wishlist"}

@router.delete("")
def clear(user: dict = Depends(get_current_user)):
    _save(user["sub"], [])
    return {"message": "Wishlist cleared"}
```

---

## 5.3 Orders Router — `app/routers/orders.py`

### Models — `app/models/order.py`
```python
from pydantic import BaseModel
from typing import Literal, List, Optional

class OrderItem(BaseModel):
    productId: str
    name: str
    price: float
    quantity: int
    image: str

class ShippingInfo(BaseModel):
    fullName: str
    email: str
    phone: str
    address: str
    apartment: Optional[str] = None
    city: str
    county: str
    postalCode: str

class OrderCreate(BaseModel):
    items: List[OrderItem]
    subtotal: float
    shipping: float
    total: float
    payment_method: Literal["mpesa", "card", "cod"]
    delivery_method: Literal["standard", "express", "pickup"]
    shipping_info: ShippingInfo
    order_notes: Optional[str] = None

class OrderStatusUpdate(BaseModel):
    status: Literal["pending","processing","shipped","delivered","cancelled"]

class PaymentStatusUpdate(BaseModel):
    payment_status: Literal["unpaid","paid","refunded"]

class TrackingUpdate(BaseModel):
    tracking_number: str
```

### Router
```python
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from app.models.order import OrderCreate, OrderStatusUpdate, PaymentStatusUpdate, TrackingUpdate
from app.database import supabase
from app.dependencies import get_current_user, require_admin

router = APIRouter()

@router.get("")
def get_user_orders(user: dict = Depends(get_current_user)):
    return supabase.table("orders").select("*").eq("user_id", user["sub"]).order("created_at", desc=True).execute().data

@router.get("/all")
def get_all_orders(_: dict = Depends(require_admin)):
    return supabase.table("orders").select("*").order("created_at", desc=True).execute().data

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
def cancel_order(order_id: str, user: dict = Depends(get_current_user)):
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
    res = supabase.table("orders").update({"status": body.status, "updated_at": datetime.utcnow().isoformat()}).eq("order_id", order_id).execute()
    return res.data[0]

@router.put("/{order_id}/payment")
def update_payment(order_id: str, body: PaymentStatusUpdate, _: dict = Depends(require_admin)):
    res = supabase.table("orders").update({"payment_status": body.payment_status, "updated_at": datetime.utcnow().isoformat()}).eq("order_id", order_id).execute()
    return res.data[0]

@router.put("/{order_id}/tracking")
def update_tracking(order_id: str, body: TrackingUpdate, _: dict = Depends(require_admin)):
    res = supabase.table("orders").update({"tracking_number": body.tracking_number, "updated_at": datetime.utcnow().isoformat()}).eq("order_id", order_id).execute()
    return res.data[0]

@router.delete("/{order_id}")
def delete_order(order_id: str, _: dict = Depends(require_admin)):
    supabase.table("orders").delete().eq("order_id", order_id).execute()
    return {"message": "Order deleted"}
```

---

## 5.4 Addresses Router — `app/routers/addresses.py`

### Models — `app/models/address.py`
```python
from pydantic import BaseModel
from typing import Optional

class AddressCreate(BaseModel):
    full_name: str
    phone: str
    address: str
    apartment: Optional[str] = ""
    city: str
    county: str
    postal_code: str
    is_default: bool = False

class AddressOut(AddressCreate):
    address_id: str
    user_id: str
    created_at: str
```

### Router
```python
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from app.models.address import AddressCreate, AddressOut
from app.database import supabase
from app.dependencies import get_current_user

router = APIRouter()

@router.get("", response_model=list[AddressOut])
def get_addresses(user: dict = Depends(get_current_user)):
    return supabase.table("addresses").select("*").eq("user_id", user["sub"]).execute().data

@router.get("/{address_id}", response_model=AddressOut)
def get_address(address_id: str, user: dict = Depends(get_current_user)):
    res = supabase.table("addresses").select("*").eq("address_id", address_id).eq("user_id", user["sub"]).execute()
    if not res.data:
        raise HTTPException(404, "Address not found")
    return res.data[0]

@router.post("", response_model=AddressOut, status_code=201)
def add_address(body: AddressCreate, user: dict = Depends(get_current_user)):
    if body.is_default:
        supabase.table("addresses").update({"is_default": False}).eq("user_id", user["sub"]).execute()
    address = {**body.model_dump(), "user_id": user["sub"], "address_id": f"ADDR-{int(datetime.utcnow().timestamp()*1000)}"}
    supabase.table("addresses").insert(address).execute()
    return address

@router.put("/{address_id}", response_model=AddressOut)
def update_address(address_id: str, body: AddressCreate, user: dict = Depends(get_current_user)):
    if body.is_default:
        supabase.table("addresses").update({"is_default": False}).eq("user_id", user["sub"]).execute()
    res = supabase.table("addresses").update(body.model_dump()).eq("address_id", address_id).eq("user_id", user["sub"]).execute()
    return res.data[0]

@router.delete("/{address_id}")
def delete_address(address_id: str, user: dict = Depends(get_current_user)):
    supabase.table("addresses").delete().eq("address_id", address_id).eq("user_id", user["sub"]).execute()
    return {"message": "Address deleted"}

@router.put("/{address_id}/default")
def set_default(address_id: str, user: dict = Depends(get_current_user)):
    supabase.table("addresses").update({"is_default": False}).eq("user_id", user["sub"]).execute()
    supabase.table("addresses").update({"is_default": True}).eq("address_id", address_id).eq("user_id", user["sub"]).execute()
    return {"message": "Default address set"}
```

---

## 5.5 Register routers in `app/main.py`
```python
from app.routers import cart, wishlist, orders, addresses

app.include_router(cart.router,      prefix="/api/cart",      tags=["Cart"])
app.include_router(wishlist.router,  prefix="/api/wishlist",  tags=["Wishlist"])
app.include_router(orders.router,    prefix="/api/orders",    tags=["Orders"])
app.include_router(addresses.router, prefix="/api/addresses", tags=["Addresses"])
```
