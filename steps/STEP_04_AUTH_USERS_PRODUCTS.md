# STEP 4 — Build Auth, Users, Products, Categories

Follow in order. Each section = one router file.

---

## 4.1 Auth Router — `app/routers/auth.py`

### Models — `app/models/user.py`
```python
from pydantic import BaseModel, EmailStr
from typing import Literal, Optional

class UserRegister(BaseModel):
    email: EmailStr
    name: str
    phone: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

class UserOut(BaseModel):
    email: str
    name: str
    phone: Optional[str] = None
    role: Literal["user", "admin"]
    verified: bool

class AuthResponse(BaseModel):
    token: str
    user: UserOut
```

### Router
```python
from fastapi import APIRouter, HTTPException, Depends
from passlib.context import CryptContext
from app.models.user import UserRegister, UserLogin, UserUpdate, PasswordChange, AuthResponse, UserOut
from app.database import supabase
from app.config import settings
from app.dependencies import create_token, get_current_user

router = APIRouter()
pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/register", response_model=AuthResponse)
def register(body: UserRegister):
    if supabase.table("users").select("email").eq("email", body.email).execute().data:
        raise HTTPException(400, "User already exists")
    user = {
        "email": body.email, "name": body.name, "phone": body.phone,
        "password": pwd.hash(body.password),
        "role": "admin" if body.email == settings.admin_email else "user",
        "verified": True
    }
    supabase.table("users").insert(user).execute()
    token = create_token(user["email"], user["role"])
    user.pop("password")
    return {"token": token, "user": user}

@router.post("/login", response_model=AuthResponse)
def login(body: UserLogin):
    res = supabase.table("users").select("*").eq("email", body.email).execute()
    if not res.data or not pwd.verify(body.password, res.data[0]["password"]):
        raise HTTPException(401, "Invalid credentials")
    user = res.data[0]
    token = create_token(user["email"], user["role"])
    user.pop("password")
    return {"token": token, "user": user}

@router.get("/profile", response_model=UserOut)
def get_profile(current: dict = Depends(get_current_user)):
    res = supabase.table("users").select("*").eq("email", current["sub"]).execute()
    if not res.data:
        raise HTTPException(404, "User not found")
    u = res.data[0]; u.pop("password", None)
    return u

@router.put("/profile", response_model=UserOut)
def update_profile(body: UserUpdate, current: dict = Depends(get_current_user)):
    data = {k: v for k, v in body.model_dump().items() if v is not None}
    res = supabase.table("users").update(data).eq("email", current["sub"]).execute()
    u = res.data[0]; u.pop("password", None)
    return u

@router.put("/change-password")
def change_password(body: PasswordChange, current: dict = Depends(get_current_user)):
    res = supabase.table("users").select("password").eq("email", current["sub"]).execute()
    if not pwd.verify(body.current_password, res.data[0]["password"]):
        raise HTTPException(400, "Current password incorrect")
    supabase.table("users").update({"password": pwd.hash(body.new_password)}).eq("email", current["sub"]).execute()
    return {"message": "Password updated"}

@router.post("/logout")
def logout():
    return {"message": "Logged out"}
```

---

## 4.2 Users Router (Admin) — `app/routers/users.py`

```python
from fastapi import APIRouter, Depends, HTTPException
from app.database import supabase
from app.dependencies import require_admin

router = APIRouter()

@router.get("")
def list_users(_: dict = Depends(require_admin)):
    res = supabase.table("users").select("email,name,phone,role,verified,created_at").execute()
    return res.data

@router.get("/{email}")
def get_user(email: str, _: dict = Depends(require_admin)):
    res = supabase.table("users").select("email,name,phone,role,verified,created_at").eq("email", email).execute()
    if not res.data:
        raise HTTPException(404, "User not found")
    return res.data[0]

@router.put("/{email}/role")
def update_role(email: str, body: dict, _: dict = Depends(require_admin)):
    supabase.table("users").update({"role": body["role"]}).eq("email", email).execute()
    return {"message": "Role updated"}

@router.delete("/{email}")
def delete_user(email: str, _: dict = Depends(require_admin)):
    supabase.table("users").delete().eq("email", email).execute()
    return {"message": "User deleted"}
```

---

## 4.3 Products Router — `app/routers/products.py`

### Models — `app/models/product.py`
```python
from pydantic import BaseModel
from typing import Literal, List, Optional

class ProductCreate(BaseModel):
    name: str
    category: str
    section: Literal["best-seller","new-arrival","carousel","deal","accessory"]
    price: float
    description: str = ""
    specifications: str = ""
    image_url: str = ""
    images: List[str] = []
    discount: str = ""
    stock: int = 0

class ProductOut(ProductCreate):
    product_id: str
    is_active: bool
    created_at: str

class StockUpdate(BaseModel):
    stock: int
```

### Router
```python
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from app.models.product import ProductCreate, ProductOut, StockUpdate
from app.database import supabase
from app.dependencies import require_admin

router = APIRouter()

@router.get("", response_model=list[ProductOut])
def get_all():
    return supabase.table("products").select("*").eq("is_active", True).execute().data

@router.get("/search")
def search(q: str):
    res = supabase.table("products").select("*").ilike("name", f"%{q}%").execute()
    return res.data

@router.get("/category/{category}")
def by_category(category: str):
    return supabase.table("products").select("*").eq("category", category).eq("is_active", True).execute().data

@router.get("/section/{section}")
def by_section(section: str):
    return supabase.table("products").select("*").eq("section", section).eq("is_active", True).execute().data

@router.get("/{product_id}", response_model=ProductOut)
def get_one(product_id: str):
    res = supabase.table("products").select("*").eq("product_id", product_id).execute()
    if not res.data:
        raise HTTPException(404, "Product not found")
    return res.data[0]

@router.post("", response_model=ProductOut, status_code=201)
def create(body: ProductCreate, _: dict = Depends(require_admin)):
    product = {**body.model_dump(), "product_id": f"PROD-{int(datetime.utcnow().timestamp()*1000)}"}
    supabase.table("products").insert(product).execute()
    return product

@router.put("/{product_id}", response_model=ProductOut)
def update(product_id: str, body: ProductCreate, _: dict = Depends(require_admin)):
    data = {**body.model_dump(), "updated_at": datetime.utcnow().isoformat()}
    res = supabase.table("products").update(data).eq("product_id", product_id).execute()
    return res.data[0]

@router.delete("/{product_id}")
def delete(product_id: str, _: dict = Depends(require_admin)):
    supabase.table("products").delete().eq("product_id", product_id).execute()
    return {"message": "Product deleted"}

@router.put("/{product_id}/stock")
def update_stock(product_id: str, body: StockUpdate, _: dict = Depends(require_admin)):
    supabase.table("products").update({"stock": body.stock}).eq("product_id", product_id).execute()
    return {"message": "Stock updated"}

@router.put("/{product_id}/toggle")
def toggle(product_id: str, _: dict = Depends(require_admin)):
    res = supabase.table("products").select("is_active").eq("product_id", product_id).execute()
    current = res.data[0]["is_active"]
    supabase.table("products").update({"is_active": not current}).eq("product_id", product_id).execute()
    return {"is_active": not current}
```

---

## 4.4 Categories Router — `app/routers/categories.py`

### Models — `app/models/category.py`
```python
from pydantic import BaseModel

class CategoryCreate(BaseModel):
    name: str
    description: str = ""
    image_url: str = ""

class CategoryOut(CategoryCreate):
    category_id: str
    created_at: str
```

### Router
```python
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from app.models.category import CategoryCreate, CategoryOut
from app.database import supabase
from app.dependencies import require_admin

router = APIRouter()

@router.get("", response_model=list[CategoryOut])
def get_all():
    return supabase.table("categories").select("*").execute().data

@router.get("/{category_id}", response_model=CategoryOut)
def get_one(category_id: str):
    res = supabase.table("categories").select("*").eq("category_id", category_id).execute()
    if not res.data:
        raise HTTPException(404, "Category not found")
    return res.data[0]

@router.post("", response_model=CategoryOut, status_code=201)
def create(body: CategoryCreate, _: dict = Depends(require_admin)):
    cat = {**body.model_dump(), "category_id": f"CAT-{int(datetime.utcnow().timestamp()*1000)}"}
    supabase.table("categories").insert(cat).execute()
    return cat

@router.put("/{category_id}", response_model=CategoryOut)
def update(category_id: str, body: CategoryCreate, _: dict = Depends(require_admin)):
    res = supabase.table("categories").update(body.model_dump()).eq("category_id", category_id).execute()
    return res.data[0]

@router.delete("/{category_id}")
def delete(category_id: str, _: dict = Depends(require_admin)):
    supabase.table("categories").delete().eq("category_id", category_id).execute()
    return {"message": "Category deleted"}
```

---

## 4.5 Register all routers in `app/main.py`
```python
from app.routers import auth, users, products, categories

app.include_router(auth.router,       prefix="/api/auth",       tags=["Auth"])
app.include_router(users.router,      prefix="/api/users",      tags=["Users"])
app.include_router(products.router,   prefix="/api/products",   tags=["Products"])
app.include_router(categories.router, prefix="/api/categories", tags=["Categories"])
```
