# Radiant Motors — Backend Dev Guide
## Part 3 of 5: Database Schema & Seeding

---

## 1. Supabase Table Setup

Run the following SQL in the **Supabase SQL Editor** (`https://supabase.com/dashboard → SQL Editor`).

```sql
-- USERS
create table if not exists users (
  email        text primary key,
  name         text not null,
  phone        text,
  password     text not null,
  role         text not null default 'user' check (role in ('user', 'admin')),
  verified     boolean not null default true,
  created_at   timestamptz not null default now()
);

-- PRODUCTS
create table if not exists products (
  product_id      text primary key,
  name            text not null,
  category        text not null,
  section         text not null,
  price           numeric not null,
  description     text,
  specifications  text,
  image_url       text,
  images          jsonb default '[]',
  discount        text default ''
);

-- ORDERS
create table if not exists orders (
  order_id        text primary key,
  user_id         text not null references users(email),
  items           jsonb not null,
  subtotal        numeric not null,
  shipping        numeric not null,
  total           numeric not null,
  status          text not null default 'pending'
                    check (status in ('pending','processing','shipped','delivered','cancelled')),
  payment_method  text not null check (payment_method in ('mpesa','card','cod')),
  delivery_method text not null check (delivery_method in ('standard','express','pickup')),
  shipping_info   jsonb not null,
  order_notes     text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists orders_user_id_idx on orders(user_id);

-- CART
create table if not exists cart (
  user_id     text primary key references users(email),
  items       jsonb not null default '[]',
  updated_at  timestamptz not null default now()
);

-- WISHLIST
create table if not exists wishlist (
  user_id     text primary key references users(email),
  items       jsonb not null default '[]',
  updated_at  timestamptz not null default now()
);

-- ADDRESSES
create table if not exists addresses (
  address_id  text primary key,
  user_id     text not null references users(email),
  full_name   text not null,
  phone       text not null,
  address     text not null,
  apartment   text,
  city        text not null,
  county      text not null,
  postal_code text not null,
  is_default  boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists addresses_user_id_idx on addresses(user_id);

-- BULB DATA
create table if not exists bulb_data (
  vehicle_key         text primary key,
  make                text not null,
  model               text not null,
  headlight_low       text default '',
  headlight_high      text default '',
  fog_light           text default '',
  turn_signal_front   text default '',
  turn_signal_rear    text default '',
  parking_light       text default '',
  tail_light          text default '',
  brake_light         text default '',
  reverse_light       text default '',
  license_plate       text default ''
);
```

---

## 2. Pydantic Models

### app/models/user.py

```python
from pydantic import BaseModel, EmailStr
from typing import Literal

class UserRegister(BaseModel):
    email: EmailStr
    name: str
    phone: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    email: str
    name: str
    phone: str | None = None
    role: Literal["user", "admin"]
    verified: bool

class AuthResponse(BaseModel):
    token: str
    user: UserOut
```

### app/models/product.py

```python
from pydantic import BaseModel
from typing import Literal, List

class ProductBase(BaseModel):
    name: str
    category: str
    section: Literal["best-seller", "new-arrival", "carousel", "deal", "accessory"]
    price: float
    description: str = ""
    specifications: str = ""
    image_url: str = ""
    images: List[str] = []
    discount: str = ""

class ProductCreate(ProductBase):
    pass

class ProductOut(ProductBase):
    product_id: str
```

### app/models/order.py

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

class OrderOut(OrderCreate):
    order_id: str
    user_id: str
    status: Literal["pending", "processing", "shipped", "delivered", "cancelled"]
    created_at: str
    updated_at: str

class OrderStatusUpdate(BaseModel):
    status: Literal["pending", "processing", "shipped", "delivered", "cancelled"]
```

### app/models/cart.py

```python
from pydantic import BaseModel
from typing import List

class CartItem(BaseModel):
    productId: str
    quantity: int
    addedAt: str

class CartSave(BaseModel):
    items: List[CartItem]

class WishlistSave(BaseModel):
    items: List[str]
```

### app/models/address.py

```python
from pydantic import BaseModel
from typing import Optional

class AddressCreate(BaseModel):
    full_name: str
    phone: str
    address: str
    apartment: Optional[str] = None
    city: str
    county: str
    postal_code: str
    is_default: bool = False

class AddressOut(AddressCreate):
    user_id: str
    address_id: str
    created_at: str
```

### app/models/bulb.py

```python
from pydantic import BaseModel

class VehicleBulbData(BaseModel):
    vehicle_key: str
    make: str
    model: str
    headlight_low: str = ""
    headlight_high: str = ""
    fog_light: str = ""
    turn_signal_front: str = ""
    turn_signal_rear: str = ""
    parking_light: str = ""
    tail_light: str = ""
    brake_light: str = ""
    reverse_light: str = ""
    license_plate: str = ""
```

---

## 3. Product Seeding Script

Reads `results.csv` from the project root and inserts all 143 products into the `products` table.

### scripts/seed_products.py

```python
import csv
import json
import os
import sys
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_KEY"))

CSV_PATH = os.path.join(os.path.dirname(__file__), "../../results.csv")

def parse_images(raw: str) -> list:
    if not raw or not raw.strip():
        return []
    try:
        items = json.loads(raw)
        return [i.get("S", "") for i in items if "S" in i]
    except Exception:
        return []

def seed():
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = []
        for row in reader:
            rows.append({
                "product_id":     row["productId"],
                "name":           row["name"],
                "category":       row["category"],
                "section":        row["section"],
                "price":          int(row["price"]) if row["price"] else 0,
                "description":    row["description"],
                "specifications": row["specifications"],
                "image_url":      row["imageUrl"],
                "images":         parse_images(row.get("images", "")),
                "discount":       row.get("discount", ""),
            })

        # Upsert in batches of 50
        for i in range(0, len(rows), 50):
            supabase.table("products").upsert(rows[i:i+50]).execute()

    print(f"✅ Seeded {len(rows)} products into Supabase")

if __name__ == "__main__":
    seed()
```

**Run it:**
```bash
cd backend
python scripts/seed_products.py
```

---

## Next → [Part 4: Authentication & Route Implementation](./DEV_GUIDE_04_ROUTES.md)
