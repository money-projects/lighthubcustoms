from fastapi import APIRouter, HTTPException, Depends, Request
from app.database import supabase
from app.dependencies import get_current_user
from app.models.user import UserUpdate, PasswordChange, UserOut
from app.limiter import limiter
import boto3
from app.config import settings

router = APIRouter()

cognito = boto3.client("cognito-idp", region_name=settings.cognito_region)

@router.post("/register")
@limiter.limit("10/minute")
def register(request: Request, body: dict):
    try:
        cognito.sign_up(
            ClientId=settings.cognito_client_id,
            Username=body["email"],
            Password=body["password"],
            UserAttributes=[
                {"Name": "email", "Value": body["email"]},
                {"Name": "name",  "Value": body.get("name", "")},
            ],
        )
        return {"message": "Verification code sent to email"}
    except cognito.exceptions.UsernameExistsException:
        raise HTTPException(400, "User already exists")
    except Exception as e:
        raise HTTPException(400, str(e))

@router.post("/confirm")
def confirm(body: dict):
    try:
        cognito.confirm_sign_up(
            ClientId=settings.cognito_client_id,
            Username=body["email"],
            ConfirmationCode=body["code"],
        )
        return {"message": "Email confirmed"}
    except Exception as e:
        raise HTTPException(400, str(e))

@router.post("/login")
@limiter.limit("10/minute")
def login(request: Request, body: dict):
    try:
        res = cognito.initiate_auth(
            ClientId=settings.cognito_client_id,
            AuthFlow="USER_PASSWORD_AUTH",
            AuthParameters={"USERNAME": body["email"], "PASSWORD": body["password"]},
        )
        tokens = res["AuthenticationResult"]
        return {
            "access_token":  tokens["AccessToken"],
            "id_token":      tokens["IdToken"],
            "refresh_token": tokens["RefreshToken"],
        }
    except cognito.exceptions.NotAuthorizedException:
        raise HTTPException(401, "Invalid credentials")
    except cognito.exceptions.UserNotConfirmedException:
        raise HTTPException(403, "Email not confirmed")
    except Exception as e:
        raise HTTPException(400, str(e))

@router.post("/refresh")
def refresh(body: dict):
    try:
        res = cognito.initiate_auth(
            ClientId=settings.cognito_client_id,
            AuthFlow="REFRESH_TOKEN_AUTH",
            AuthParameters={"REFRESH_TOKEN": body["refresh_token"]},
        )
        tokens = res["AuthenticationResult"]
        return {"access_token": tokens["AccessToken"], "id_token": tokens["IdToken"]}
    except Exception as e:
        raise HTTPException(401, str(e))

@router.post("/forgot-password")
@limiter.limit("5/minute")
def forgot_password(request: Request, body: dict):
    try:
        cognito.forgot_password(ClientId=settings.cognito_client_id, Username=body["email"])
        return {"message": "Reset code sent to email"}
    except Exception as e:
        raise HTTPException(400, str(e))

@router.post("/reset-password")
def reset_password(body: dict):
    try:
        cognito.confirm_forgot_password(
            ClientId=settings.cognito_client_id,
            Username=body["email"],
            ConfirmationCode=body["code"],
            Password=body["new_password"],
        )
        return {"message": "Password reset successful"}
    except Exception as e:
        raise HTTPException(400, str(e))

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

@router.post("/logout")
def logout():
    return {"message": "Logged out"}
