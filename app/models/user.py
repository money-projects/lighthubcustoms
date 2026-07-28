from pydantic import BaseModel, EmailStr
from typing import Literal, Optional

class UserRegister(BaseModel):
    email: EmailStr
    name: str
    phone: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

class UserOut(BaseModel):
    email: str
    name: str
    phone: Optional[str] = None
    role: Literal["user", "admin"]
    verified: bool
