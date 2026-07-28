from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from app.models.address import AddressCreate, AddressOut
from app.database import supabase
from app.dependencies import get_current_user

router = APIRouter()

@router.get("")
def get_addresses(user: dict = Depends(get_current_user)):
    return supabase.table("addresses").select("*").eq("user_id", user["sub"]).execute().data

@router.get("/{address_id}")
def get_address(address_id: str, user: dict = Depends(get_current_user)):
    res = supabase.table("addresses").select("*").eq("address_id", address_id).eq("user_id", user["sub"]).execute()
    if not res.data:
        raise HTTPException(404, "Address not found")
    return res.data[0]

@router.post("", status_code=201)
def add_address(body: AddressCreate, user: dict = Depends(get_current_user)):
    if body.is_default:
        supabase.table("addresses").update({"is_default": False}).eq("user_id", user["sub"]).execute()
    address = {**body.model_dump(), "user_id": user["sub"], "address_id": f"ADDR-{int(datetime.utcnow().timestamp()*1000)}"}
    supabase.table("addresses").insert(address).execute()
    return address

@router.put("/{address_id}")
def update_address(address_id: str, body: AddressCreate, user: dict = Depends(get_current_user)):
    if body.is_default:
        supabase.table("addresses").update({"is_default": False}).eq("user_id", user["sub"]).execute()
    return supabase.table("addresses").update(body.model_dump()).eq("address_id", address_id).eq("user_id", user["sub"]).execute().data[0]

@router.delete("/{address_id}")
def delete_address(address_id: str, user: dict = Depends(get_current_user)):
    supabase.table("addresses").delete().eq("address_id", address_id).eq("user_id", user["sub"]).execute()
    return {"message": "Address deleted"}

@router.put("/{address_id}/default")
def set_default(address_id: str, user: dict = Depends(get_current_user)):
    supabase.table("addresses").update({"is_default": False}).eq("user_id", user["sub"]).execute()
    supabase.table("addresses").update({"is_default": True}).eq("address_id", address_id).eq("user_id", user["sub"]).execute()
    return {"message": "Default address set"}
