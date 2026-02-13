from pydantic import BaseModel, EmailStr

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    avatar: str
    password: str

class UserResponse(BaseModel):
    username: str
    email: EmailStr
    avatar: str
    disabled: bool