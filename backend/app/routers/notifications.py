from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Literal
from datetime import datetime
from app.database import supabase
from app.dependencies import get_current_user, require_admin

router = APIRouter()

class BroadcastBody(BaseModel):
    title: str
    message: str
    type: Literal["info", "success", "warning", "error"] = "info"

@router.get("")
def get_all(user: dict = Depends(get_current_user)):
    return supabase.table("notifications").select("*").eq("user_id", user["sub"]).order("created_at", desc=True).execute().data

@router.put("/{notification_id}/read")
def mark_read(notification_id: str, user: dict = Depends(get_current_user)):
    supabase.table("notifications").update({"is_read": True}).eq("notification_id", notification_id).eq("user_id", user["sub"]).execute()
    return {"message": "Marked as read"}

@router.put("/read-all")
def mark_all_read(user: dict = Depends(get_current_user)):
    supabase.table("notifications").update({"is_read": True}).eq("user_id", user["sub"]).execute()
    return {"message": "All marked as read"}

@router.delete("/{notification_id}")
def delete(notification_id: str, user: dict = Depends(get_current_user)):
    supabase.table("notifications").delete().eq("notification_id", notification_id).eq("user_id", user["sub"]).execute()
    return {"message": "Deleted"}

@router.post("/broadcast")
def broadcast(body: BroadcastBody, _: dict = Depends(require_admin)):
    users = supabase.table("users").select("email").execute().data
    now = datetime.utcnow().isoformat()
    notifs = [{
        "notification_id": f"NOTIF-{int(datetime.utcnow().timestamp()*1000)}-{i}",
        "user_id": u["email"],
        "title": body.title,
        "message": body.message,
        "type": body.type,
        "is_read": False,
        "created_at": now
    } for i, u in enumerate(users)]
    supabase.table("notifications").insert(notifs).execute()
    return {"message": f"Sent to {len(users)} users"}
