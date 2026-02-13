import re
from datetime import timedelta
from fastapi import APIRouter, Request, Response, HTTPException, Depends
from fastapi.responses import RedirectResponse
from typing import Annotated
from ..utils import auth
from ..utils.mail import MailClient
from ..utils.models import UserResponse, UserCreate, UserLogin
from ..utils.database import Database

router = APIRouter(
    prefix="/api/user",
    tags=["Auth"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=UserResponse)
async def get_user(user: Annotated[UserResponse, Depends(auth.get_current_user)]):
    if user is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

@router.post("/register")
async def create_user(request: Request, user: UserCreate, turnstile_token: str):
    if not await auth.verify_cf_turnstile(turnstile_token):
        raise HTTPException(status_code=400, detail="Vui lòng xác minh captcha trước khi đăng ký")
    db: Database = request.app.state.db
    mail: MailClient = request.app.state.mail
    if await auth.get_current_user(request) is not None:
        raise HTTPException(status_code=401, detail="Bạn đã đăng nhập")
    if await db.get_user_by_email(user.email) is not None:
        raise HTTPException(status_code=400, detail="Email đã tồn tại")
    if re.match(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", user.email) is None:
        raise HTTPException(status_code=400, detail="Email không hợp lệ")
    if re.match(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=]).{8,}$", user.password) is None:
        raise HTTPException(status_code=400, detail="Mật khẩu không hợp lệ")
    if re.match(r"^[a-zA-Z0-9]{4,}$", user.username) is None:
        raise HTTPException(status_code=400, detail="Tên người dùng không hợp lệ")
    user.password = auth.get_password_hash(user.password)
    user_data = user.model_dump(by_alias=True)
    user_data["type"] = "create_user"
    verify_token = auth.create_access_token(user_data, timedelta(minutes=30))
    await mail.send_mail("Xác minh tài khoản", user.email, 6002, {"username": user.username, "url": f"https://miniquizzes.vercel.app/api/auth/verify?token={verify_token}"})
    return {"status": "success", "message": "Vui lòng xác minh email bằng liên kết đã được gửi tới hòm thư"}

@router.get("/verify")
async def verify_user(request: Request, token: str):
    db: Database = request.app.state.db
    user_data = auth.decode_access_token(token)
    if not user_data or user_data.get("type") != "create_user":
        return RedirectResponse("/auth?message=Xác minh không hợp lệ&type=error", status_code=302)
    user = UserCreate(**user_data)
    await db.create_user(user.username, user.email, user.avatar, user.password, "email")
    return RedirectResponse("/auth?message=Tài khoản đã được tạo, đăng nhập để tiếp tục", status_code=302)

@router.post("/login")
async def login_user(request: Request, response: Response, user: UserLogin, turnstile_token: str):
    if not await auth.verify_cf_turnstile(turnstile_token):
        raise HTTPException(status_code=400, detail="Vui lòng xác minh captcha trước khi đăng nhập")
    if await auth.get_current_user(request) is not None:
        raise HTTPException(status_code=401, detail="Bạn đã đăng nhập")
    db: Database = request.app.state.db
    user_db = await db.get_user_by_email(user.email)
    if user_db is None:
        raise HTTPException(status_code=400, detail="Người dùng không tồn tại")
    if not auth.verify_password(user.password, user_db["password"]):
        raise HTTPException(status_code=400, detail="Sai mật khẩu")
    response.set_cookie("token", auth.create_access_token({"type": "token", "sub": user.email}), httponly=True, secure=True)
    return {"status": "success", "message": "Đăng nhập thanh cong"}

@router.post("/logout")
async def logout_user(response: Response):
    response.delete_cookie("token")
    return {"status": "success", "message": "Đăng xuất thành công"}

@router.post("/forgot-password")
async def forgot_password(request: Request, email: str, turnstile_token: str):
    if not await auth.verify_cf_turnstile(turnstile_token):
        raise HTTPException(status_code=400, detail="Vui lòng xác minh captcha trước khi gửi yêu cầu thay đổi mật khâu")
    db: Database = request.app.state.db
    mail: MailClient = request.app.state.mail
    user_db = await db.get_user_by_email(email)
    if user_db is None:
        raise HTTPException(status_code=400, detail="Người dùng không tồn tại")
    verify_token = auth.create_access_token({"type": "reset_password", "email": email}, timedelta(minutes=30))
    await mail.send_mail("Thay đổi mật khẩu", email, 6008, {"username": user_db["username"], "url": f"https://miniquizzes.vercel.app/api/auth/reset-password?token={verify_token}"})
    return {"status": "success", "message": "Email đã được gửi tới hòm thư, vui lòng truy cập liên kết trong email để thay đổi mật khẩu"}

@router.post("/reset-password")
async def reset_password(request: Request, token: str, password: str, turnstile_token: str):
    if not await auth.verify_cf_turnstile(turnstile_token):
        raise HTTPException(status_code=400, detail="Vui lòng xác minh captcha trước khi thay đổi mật khâu")
    db: Database = request.app.state.db
    token_data = auth.decode_access_token(token)
    if not token_data or token_data.get("type") != "reset_password":
        raise HTTPException(status_code=400, detail="Yêu cầu thay đổi mật khẩu không hợp lệ")
    if re.match(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=]).{8,}$", password) is None:
        raise HTTPException(status_code=400, detail="Mật khẩu không hợp lệ")
    email = token_data.get("email")
    await db.update_user(email, {"password": auth.get_password_hash(password)})
    return RedirectResponse("/auth?message=Thay đổi mật khâu thành công, đăng nhập để tiếp tục&type=success", status_code=302)

@router.delete("/delete")
async def delete_user(request: Request, user: Annotated[UserResponse, Depends(auth.get_current_user)]):
    if user is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    db: Database = request.app.state.db
    await db.delete_user(user["email"])
    return {"status": "success", "message": "User deleted"}
