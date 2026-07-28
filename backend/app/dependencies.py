import requests as http_requests
from functools import lru_cache
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.config import settings
from app.database import supabase

bearer_scheme = HTTPBearer()

@lru_cache(maxsize=1)
def get_jwks():
    return http_requests.get(settings.cognito_jwks_url).json()

def verify_cognito_token(token: str) -> dict:
    try:
        jwks = get_jwks()
        return jwt.decode(
            token,
            jwks,
            algorithms=["RS256"],
            audience=settings.cognito_client_id,
            options={"verify_at_hash": False},
        )
    except JWTError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> dict:
    claims = verify_cognito_token(credentials.credentials)
    email = claims.get("email") or claims.get("username") or claims.get("cognito:username")

    # auto-provision user in Supabase on first login
    res = supabase.table("users").select("email,role").eq("email", email).execute()
    if not res.data:
        supabase.table("users").insert({
            "email": email,
            "name": claims.get("name", email.split("@")[0]),
            "phone": None,
            "password": None,
            "role": "user",
            "verified": True,
        }).execute()
        role = "user"
    else:
        role = res.data[0]["role"]

    return {"sub": email, "role": role}

def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user
