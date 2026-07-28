# STEP 1 — Project Setup

## 1. Create project folder
```bash
mkdir radiant-motors-backend
cd radiant-motors-backend
python -m venv venv
source venv/bin/activate
```

## 2. Install dependencies
```bash
pip install fastapi uvicorn[standard] supabase python-jose[cryptography] passlib[bcrypt] pydantic-settings python-dotenv python-multipart
pip freeze > requirements.txt
```

## 3. Folder structure to create
```
radiant-motors-backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── dependencies.py
│   ├── models/
│   │   └── __init__.py
│   └── routers/
│       └── __init__.py
├── scripts/
│   └── seed_products.py
├── .env
└── requirements.txt
```

## 4. .env
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
JWT_SECRET=your_secret_key
JWT_ALGORITHM=HS256
JWT_EXPIRES_DAYS=7
ADMIN_EMAIL=admin@radiantmotors.co.ke
```

## 5. app/config.py
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

## 6. app/database.py
```python
from supabase import create_client, Client
from app.config import settings

supabase: Client = create_client(settings.supabase_url, settings.supabase_service_key)
```

## 7. app/dependencies.py
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

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> dict:
    try:
        return jwt.decode(credentials.credentials, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user
```

## 8. app/main.py (starter — routers added in later steps)
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Radiant Motors API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Radiant Motors API running"}
```

## 9. Run server
```bash
uvicorn app.main:app --reload --port 8000
```
Visit: http://localhost:8000/docs
