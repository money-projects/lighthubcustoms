# Radiant Motors — Backend Dev Guide
## Part 2 of 5: Project Setup & Environment

---

## 1. Prerequisites

- Python 3.11+
- pip / virtualenv
- A [Supabase](https://supabase.com) project (free tier works)

---

## 2. Project Structure

```
backend/
├── app/
│   ├── main.py                  # FastAPI app entry point
│   ├── config.py                # Settings & env vars
│   ├── database.py              # Supabase client setup
│   ├── dependencies.py          # JWT auth injection
│   │
│   ├── models/                  # Pydantic request/response models
│   │   ├── user.py
│   │   ├── product.py
│   │   ├── order.py
│   │   ├── cart.py
│   │   ├── address.py
│   │   └── bulb.py
│   │
│   ├── routers/                 # Route handlers
│   │   ├── auth.py
│   │   ├── products.py
│   │   ├── orders.py
│   │   ├── cart.py
│   │   ├── wishlist.py
│   │   ├── addresses.py
│   │   └── bulb_data.py
│   │
│   └── services/                # Business logic layer
│       └── auth_service.py
│
├── scripts/
│   └── seed_products.py         # Seeds products table from results.csv
│
├── requirements.txt
├── .env.example
└── README.md
```

---

## 3. Installation

```bash
# 1. Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows

# 2. Install dependencies
pip install -r requirements.txt
```

---

## 4. requirements.txt

```txt
fastapi==0.111.0
uvicorn[standard]==0.29.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
supabase==2.4.0
pydantic==2.7.0
pydantic-settings==2.2.1
python-dotenv==1.0.1
python-multipart==0.0.9
```

---

## 5. Environment Variables

Create a `.env` file in the `backend/` root:

```env
# Supabase
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_ALGORITHM=HS256
JWT_EXPIRES_DAYS=7

# App
ADMIN_EMAIL=admin@radiantmotors.co.ke
```

> Use the **service role key** (not the anon key) so the backend can bypass Row Level Security.
> Never expose this key to the frontend.

---

## 6. app/config.py

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    supabase_url: str
    supabase_service_key: str

    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expires_days: int = 7

    admin_email: str

    class Config:
        env_file = ".env"

settings = Settings()
```

---

## 7. app/database.py

```python
from supabase import create_client, Client
from app.config import settings

supabase: Client = create_client(settings.supabase_url, settings.supabase_service_key)
```

---

## 8. app/main.py

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, products, orders, cart, wishlist, addresses, bulb_data

app = FastAPI(
    title="Radiant Motors API",
    description="Automotive LED lighting e-commerce backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # Restrict to frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,       prefix="/api/auth",      tags=["Auth"])
app.include_router(products.router,   prefix="/api/products",  tags=["Products"])
app.include_router(orders.router,     prefix="/api/orders",    tags=["Orders"])
app.include_router(cart.router,       prefix="/api/cart",      tags=["Cart"])
app.include_router(wishlist.router,   prefix="/api/wishlist",  tags=["Wishlist"])
app.include_router(addresses.router,  prefix="/api/addresses", tags=["Addresses"])
app.include_router(bulb_data.router,  prefix="/api/bulb-data", tags=["Bulb Data"])

@app.get("/")
def root():
    return {"message": "Radiant Motors API is running"}
```

---

## 9. Running the Server

```bash
# Development (with auto-reload)
uvicorn app.main:app --reload --port 8000

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

API docs auto-generated at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## Next → [Part 3: Database Schema & Seeding](./DEV_GUIDE_03_MODELS.md)
