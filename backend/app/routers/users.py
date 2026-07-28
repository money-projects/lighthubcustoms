from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Literal
from app.database import supabase
from app.dependencies import require_admin

router = APIRouter()

class RoleUpdate(BaseModel):
    role: Literal["user", "admin"]

@router.get("")
def list_users(_: dict = Depends(require_admin)):
    return supabase.table("users").select("email,name,phone,role,verified,created_at").execute().data

@router.get("/{email}")
def get_user(email: str, _: dict = Depends(require_admin)):
    res = supabase.table("users").select("email,name,phone,role,verified,created_at").eq("email", email).execute()
    if not res.data:
        raise HTTPException(404, "User not found")
    return res.data[0]

@router.put("/{email}/role")
def update_role(email: str, body: RoleUpdate, _: dict = Depends(require_admin)):
    supabase.table("users").update({"role": body.role}).eq("email", email).execute()
    return {"message": "Role updated"}

@router.delete("/{email}")
def delete_user(email: str, _: dict = Depends(require_admin)):
    supabase.table("users").delete().eq("email", email).execute()
    return {"message": "User deleted"}
