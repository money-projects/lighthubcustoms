from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from app.database import supabase
from app.dependencies import require_admin

router = APIRouter()

class BulbDataBody(BaseModel):
    make: str
    model: str
    year_from: Optional[int] = None
    year_to: Optional[int] = None
    headlight: Optional[str] = None
    fog_light: Optional[str] = None
    tail_light: Optional[str] = None
    interior: Optional[str] = None

@router.get("")
def get_all():
    return supabase.table("bulb_data").select("*").execute().data

@router.get("/makes")
def get_makes():
    res = supabase.table("bulb_data").select("make").execute()
    return list({r["make"] for r in res.data})

@router.get("/models/{make}")
def get_models(make: str):
    res = supabase.table("bulb_data").select("model").eq("make", make).execute()
    return [r["model"] for r in res.data]

@router.get("/{make}/{model}")
def get_by_vehicle(make: str, model: str):
    res = supabase.table("bulb_data").select("*").eq("vehicle_key", f"{make}#{model}").execute()
    if not res.data:
        raise HTTPException(404, "Vehicle not found")
    return res.data[0]

@router.post("", status_code=201)
def add(body: BulbDataBody, _: dict = Depends(require_admin)):
    data = {**body.model_dump(), "vehicle_key": f"{body.make}#{body.model}"}
    supabase.table("bulb_data").insert(data).execute()
    return data

@router.put("/{make}/{model}")
def update(make: str, model: str, body: BulbDataBody, _: dict = Depends(require_admin)):
    return supabase.table("bulb_data").update(body.model_dump()).eq("vehicle_key", f"{make}#{model}").execute().data[0]

@router.delete("/{make}/{model}")
def delete(make: str, model: str, _: dict = Depends(require_admin)):
    supabase.table("bulb_data").delete().eq("vehicle_key", f"{make}#{model}").execute()
    return {"message": "Deleted"}
