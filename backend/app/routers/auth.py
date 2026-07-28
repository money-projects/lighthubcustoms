from fastapi import APIRouter, HTTPException, Depends
from passlib.context import CryptContext
from google.oauth2 import id_token
from google.auth.transport import requests as grequests
from app.models.user import UserRegister, UserLogin, UserUpdate, PasswordChange, UserOut
from app.database import supabase
from app.config import settings
from app.dependencies import create_token, get_current_user

router = APIRouter()
pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/register")
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

@router.post("/login")
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

@router.post("/google")
def google_auth(body: dict):
    if not settings.google_client_id:
        raise HTTPException(500, "Google OAuth not configured")
    try:
        info = id_token.verify_oauth2_token(body.get("token"), grequests.Request(), settings.google_client_id)
    except Exception:
        raise HTTPException(401, "Invalid Google token")

    email = info["email"]
    name  = info.get("name", email.split("@")[0])

    res = supabase.table("users").select("*").eq("email", email).execute()
    if res.data:
        user = res.data[0]
        user.pop("password", None)
    else:
        user = {"email": email, "name": name, "phone": None, "password": None, "role": "user", "verified": True}
        supabase.table("users").insert(user).execute()

    token = create_token(email, user["role"])
    return {"token": token, "user": user}
