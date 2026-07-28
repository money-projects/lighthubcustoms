# Radiant Motors — Backend Dev Guide
## Part 4 of 5: Authentication & Route Implementation

---

## 1. JWT Auth Utilities

### app/dependencies.py

```python
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from app.config import settings

bearer_scheme = HTTPBearer()

def create_token(email: str, role: str) -> str:
    payload = {
        "sub": email,
        "role": role,
        "exp": datetime.utcnow() + timedelta(days=settings.jwt_expires_days)
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> dict:
    return decode_token(credentials.credentials)

def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return user
```

---

## 2. Auth Router

### app/routers/auth.py

```python
from fastapi import APIRouter, HTTPException, Depends
from passlib.context import CryptContext
from app.models.user import UserRegister, UserLogin, AuthResponse, UserOut
from app.database import supabase
from app.config import settings
from app.dependencies import create_token, get_current_user

router = APIRouter()
pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/register", response_model=AuthResponse)
def register(body: UserRegister):
    existing = supabase.table("users").select("email").eq("email", body.email).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="User already exists")

    user = {
        "email":    body.email,
        "name":     body.name,
        "phone":    body.phone,
        "password": pwd_ctx.hash(body.password),
        "role":     "admin" if body.email == settings.admin_email else "user",
        "verified": True,
    }
    supabase.table("users").insert(user).execute()

    token = create_token(user["email"], user["role"])
    user.pop("password")
    return {"token": token, "user": user}

@router.post("/login", response_model=AuthResponse)
def login(body: UserLogin):
    result = supabase.table("users").select("*").eq("email", body.email).execute()
    if not result.data:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user = result.data[0]
    if not pwd_ctx.verify(body.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token(user["email"], user["role"])
    user.pop("password")
    return {"token": token, "user": user}

@router.get("/profile", response_model=UserOut)
def profile(current: dict = Depends(get_current_user)):
    result = supabase.table("users").select("*").eq("email", current["sub"]).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")
    user = result.data[0]
    user.pop("password", None)
    return user
```

---

## 3. Products Router

### app/routers/products.py

```python
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from app.models.product import ProductCreate, ProductOut
from app.database import supabase
from app.dependencies import require_admin

router = APIRouter()

@router.get("", response_model=list[ProductOut])
def get_all():
    return supabase.table("products").select("*").execute().data

@router.get("/{product_id}", response_model=ProductOut)
def get_one(product_id: str):
    result = supabase.table("products").select("*").eq("product_id", product_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return result.data[0]

@router.post("", response_model=ProductOut, status_code=201)
def create(body: ProductCreate, _: dict = Depends(require_admin)):
    product = {**body.model_dump(), "product_id": f"PROD-{int(datetime.utcnow().timestamp()*1000)}"}
    supabase.table("products").insert(product).execute()
    return product

@router.put("/{product_id}", response_model=ProductOut)
def update(product_id: str, body: ProductCreate, _: dict = Depends(require_admin)):
    product = {**body.model_dump(), "product_id": product_id}
    supabase.table("products").upsert(product).execute()
    return product

@router.delete("/{product_id}")
def delete(product_id: str, _: dict = Depends(require_admin)):
    supabase.table("products").delete().eq("product_id", product_id).execute()
    return {"message": "Product deleted"}
```

---

## 4. Orders Router

### app/routers/orders.py

```python
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from app.models.order import OrderCreate, OrderOut, OrderStatusUpdate
from app.database import supabase
from app.dependencies import get_current_user, require_admin

router = APIRouter()

@router.get("", response_model=list[OrderOut])
def get_user_orders(user: dict = Depends(get_current_user)):
    result = supabase.table("orders").select("*").eq("user_id", user["sub"]).order("created_at", desc=True).execute()
    return result.data

@router.get("/all", response_model=list[OrderOut])
def get_all_orders(_: dict = Depends(require_admin)):
    result = supabase.table("orders").select("*").order("created_at", desc=True).execute()
    return result.data

@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: str, user: dict = Depends(get_current_user)):
    result = supabase.table("orders").select("*").eq("order_id", order_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Order not found")
    order = result.data[0]
    if order["user_id"] != user["sub"] and user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    return order

@router.post("", response_model=OrderOut, status_code=201)
def create_order(body: OrderCreate, user: dict = Depends(get_current_user)):
    now = datetime.utcnow().isoformat()
    order = {
        **body.model_dump(),
        "order_id":   f"ORD-{int(datetime.utcnow().timestamp()*1000)}",
        "user_id":    user["sub"],
        "status":     "pending",
        "created_at": now,
        "updated_at": now,
    }
    supabase.table("orders").insert(order).execute()
    return order

@router.put("/{order_id}", response_model=OrderOut)
def update_status(order_id: str, body: OrderStatusUpdate, _: dict = Depends(require_admin)):
    result = supabase.table("orders").select("*").eq("order_id", order_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Order not found")
    updated = supabase.table("orders").update({
        "status": body.status,
        "updated_at": datetime.utcnow().isoformat()
    }).eq("order_id", order_id).execute()
    return updated.data[0]

@router.delete("/{order_id}")
def delete_order(order_id: str, _: dict = Depends(require_admin)):
    supabase.table("orders").delete().eq("order_id", order_id).execute()
    return {"message": "Order deleted"}
```

---

## 5. Cart & Wishlist Routers

### app/routers/cart.py

```python
from fastapi import APIRouter, Depends
from datetime import datetime
from app.models.cart import CartSave
from app.database import supabase
from app.dependencies import get_current_user

router = APIRouter()

@router.get("")
def get_cart(user: dict = Depends(get_current_user)):
    result = supabase.table("cart").select("items").eq("user_id", user["sub"]).execute()
    return result.data[0]["items"] if result.data else []

@router.post("")
def save_cart(body: CartSave, user: dict = Depends(get_current_user)):
    supabase.table("cart").upsert({
        "user_id":    user["sub"],
        "items":      [i.model_dump() for i in body.items],
        "updated_at": datetime.utcnow().isoformat()
    }).execute()
    return {"message": "Cart saved"}
```

### app/routers/wishlist.py

```python
from fastapi import APIRouter, Depends
from datetime import datetime
from app.models.cart import WishlistSave
from app.database import supabase
from app.dependencies import get_current_user

router = APIRouter()

@router.get("")
def get_wishlist(user: dict = Depends(get_current_user)):
    result = supabase.table("wishlist").select("items").eq("user_id", user["sub"]).execute()
    return result.data[0]["items"] if result.data else []

@router.post("")
def save_wishlist(body: WishlistSave, user: dict = Depends(get_current_user)):
    supabase.table("wishlist").upsert({
        "user_id":    user["sub"],
        "items":      body.items,
        "updated_at": datetime.utcnow().isoformat()
    }).execute()
    return {"message": "Wishlist saved"}
```

---

## 6. Addresses Router

### app/routers/addresses.py

```python
from fastapi import APIRouter, Depends
from datetime import datetime
from app.models.address import AddressCreate, AddressOut
from app.database import supabase
from app.dependencies import get_current_user

router = APIRouter()

@router.get("", response_model=list[AddressOut])
def get_addresses(user: dict = Depends(get_current_user)):
    result = supabase.table("addresses").select("*").eq("user_id", user["sub"]).execute()
    return result.data

@router.post("", response_model=AddressOut)
def save_address(body: AddressCreate, user: dict = Depends(get_current_user)):
    address = {
        **body.model_dump(),
        "user_id":    user["sub"],
        "address_id": f"ADDR-{int(datetime.utcnow().timestamp()*1000)}",
    }
    supabase.table("addresses").insert(address).execute()
    return address

@router.delete("/{address_id}")
def delete_address(address_id: str, user: dict = Depends(get_current_user)):
    supabase.table("addresses").delete().eq("address_id", address_id).eq("user_id", user["sub"]).execute()
    return {"message": "Address deleted"}
```

---

## 7. Bulb Data Router

### app/routers/bulb_data.py

```python
from fastapi import APIRouter, HTTPException
from app.database import supabase

router = APIRouter()

@router.get("")
def get_all():
    return supabase.table("bulb_data").select("*").execute().data

@router.get("/{make}/{model}")
def get_by_vehicle(make: str, model: str):
    vehicle_key = f"{make}#{model}"
    result = supabase.table("bulb_data").select("*").eq("vehicle_key", vehicle_key).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return result.data[0]
```

---

## Next → [Part 5: Deployment & Production Guide](./DEV_GUIDE_05_DEPLOYMENT.md)
