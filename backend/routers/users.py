import os
import re
from datetime import timedelta
from fastapi import APIRouter, Request, Response, HTTPException, Depends
from fastapi.responses import RedirectResponse
from typing import Annotated
from ..utils.auth import auth_manager
from ..utils.limiter import limiter
from ..utils.mail import MailClient
from ..utils.models import UserResponse, UserCreate, UserLogin, User
from ..utils.database import Database

APP_URL = os.environ.get("APP_URL", "https://miniquiz.xyz").rstrip("/")

router = APIRouter(
    prefix="/api/user",
    tags=["Auth"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=UserResponse)
async def get_user(user: Annotated[User, Depends(auth_manager.get_current_user)]):
    if user is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

@router.get("/logged-in")
async def is_logged_in(logged_in: Annotated[bool, Depends(auth_manager.has_user_logged_in)]):
    return {"logged_in": logged_in}

@router.post("/register")
@limiter.limit("3/10minute")
async def create_user(request: Request, user: UserCreate, turnstile_token: str):
    if not await auth_manager.verify_cf_turnstile(turnstile_token):
        raise HTTPException(status_code=400, detail="Vui lòng xác minh captcha trước khi đăng ký")
    db: Database = request.app.state.db
    mail: MailClient = request.app.state.mail
    if await auth_manager.has_user_logged_in(request):
        raise HTTPException(status_code=401, detail="Bạn đã đăng nhập")
    if await db.get_user_by_email(user.email.lower()) is not None:
        raise HTTPException(status_code=400, detail="Email đã tồn tại")
    if re.match(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,256}$", user.email.lower()) is None:
        raise HTTPException(status_code=400, detail="Email không hợp lệ")
    if re.match(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=]).{8,128}$", user.password) is None:
        raise HTTPException(status_code=400, detail="Mật khẩu không hợp lệ")
    if re.match(r"^[a-zA-Z0-9]{4,32}$", user.username) is None:
        raise HTTPException(status_code=400, detail="Tên người dùng không hợp lệ")
    user.password = auth_manager.get_password_hash(user.password)
    user_data = user.model_dump(by_alias=True)
    user_data["type"] = "create_user"
    verify_token = auth_manager.create_access_token(user_data, timedelta(minutes=30))
    await mail.send_mail("Xác minh tài khoản", user.email.lower(), 6002, {"username": user.username, "url": f"{APP_URL}/api/user/verify?token={verify_token}"})
    return {"status": "success", "message": "Vui lòng xác minh email bằng liên kết đã được gửi tới hòm thư"}

@router.get("/verify")
@limiter.limit("5/10minute")
async def verify_user(request: Request, token: str):
    db: Database = request.app.state.db
    user_data = auth_manager.decode_access_token(token)
    if not user_data or user_data.get("type") != "create_user":
        return RedirectResponse("/auth?message=Xác minh không hợp lệ&type=error", status_code=302)
    user = UserCreate(**user_data)
    await db.create_user(user.username, user.email, user.avatar, user.password, "email")
    return RedirectResponse("/auth?message=Tài khoản đã được tạo, đăng nhập để tiếp tục", status_code=302)

@router.post("/login")
@limiter.limit("5/10minute")
async def login_user(request: Request, response: Response, user: UserLogin, turnstile_token: str):
    if not await auth_manager.verify_cf_turnstile(turnstile_token):
        raise HTTPException(status_code=400, detail="Vui lòng xác minh captcha trước khi đăng nhập")
    if await auth_manager.get_current_user(request) is not None:
        raise HTTPException(status_code=401, detail="Bạn đã đăng nhập")
    db: Database = request.app.state.db
    user_db = await db.get_user_by_email(user.email)
    if user_db is None:
        raise HTTPException(status_code=400, detail="Người dùng không tồn tại")
    if user_db["password"] is None:
        raise HTTPException(status_code=400, detail="Tài khoản không được đăng nhập bằng mật khẩu")
    if not auth_manager.verify_password(user.password, user_db["password"]):
        raise HTTPException(status_code=400, detail="Sai mật khẩu")
    response.set_cookie("token", auth_manager.create_access_token({"type": "token", "sub": user.email}), httponly=True, secure=True)
    return {"status": "success", "message": "Đăng nhập thành công"}

@router.post("/logout")
@limiter.limit("30/minute")
async def logout_user(request: Request, response: Response):
    response.delete_cookie("token")
    return {"status": "success", "message": "Đăng xuất thành công"}

@router.post("/forgot-password")
@limiter.limit("5/10minute")
async def forgot_password(request: Request, turnstile_token: str, email: str):
    if not await auth_manager.verify_cf_turnstile(turnstile_token):
        raise HTTPException(status_code=400, detail="Vui lòng xác minh captcha trước khi gửi yêu cầu thay đổi mật khâu")
    db: Database = request.app.state.db
    mail: MailClient = request.app.state.mail
    user_db = await db.get_user_by_email(email)
    if user_db is None:
        raise HTTPException(status_code=400, detail="Người dùng không tồn tại")
    verify_token = auth_manager.create_access_token({"type": "reset_password", "email": email}, timedelta(minutes=30))
    await mail.send_mail("Thay đổi mật khẩu", email, 6008, {"username": user_db["username"], "url": f"{APP_URL}/auth?form=3&token={verify_token}"})
    return {"status": "success", "message": "Email đã được gửi tới hòm thư, vui lòng truy cập liên kết trong email để thay đổi mật khẩu"}

@router.post("/reset-password")
@limiter.limit("10/10minute")
async def reset_password(request: Request, token: str, password: str, turnstile_token: str):
    if not await auth_manager.verify_cf_turnstile(turnstile_token):
        raise HTTPException(status_code=400, detail="Vui lòng xác minh captcha trước khi thay đổi mật khâu")
    db: Database = request.app.state.db
    token_data = auth_manager.decode_access_token(token)
    if not token_data or token_data.get("type") != "reset_password":
        raise HTTPException(status_code=400, detail="Yêu cầu thay đổi mật khẩu không hợp lệ")
    if re.match(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=]).{8,128}$", password) is None:
        raise HTTPException(status_code=400, detail="Mật khẩu không hợp lệ")
    email = token_data.get("email")
    await db.update_user(email, {"password": auth_manager.get_password_hash(password)})
    return {"status": "success", "message": "Thay đổi mật khẩu thành công"}

@router.delete("/delete")
@limiter.limit("5/10minute")
async def delete_user(request: Request, user: Annotated[User, Depends(auth_manager.get_current_user)]):
    if user is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    db: Database = request.app.state.db
    await db.delete_user(user.email)
    return {"status": "success", "message": "User deleted"}

@router.get("/discord/login")
@limiter.limit("30/10minute")
async def discord_login(request: Request):
    redirect_uri = os.environ.get("DISCORD_REDIRECT_URI", f"{APP_URL}/api/user/discord/callback")
    return await auth_manager.oauthlib.discord.authorize_redirect(request, redirect_uri=redirect_uri)

@router.get("/google/login")
@limiter.limit("30/10minute")
async def google_login(request: Request):
    redirect_uri = os.environ.get("GOOGLE_REDIRECT_URI", f"{APP_URL}/api/user/google/callback")
    return await auth_manager.oauthlib.google.authorize_redirect(request, redirect_uri=redirect_uri)

@router.get("/discord/callback")
@limiter.limit("60/10minute")
async def discord_callback(request: Request):
    token = await auth_manager.oauthlib.discord.authorize_access_token(request)
    resp = await auth_manager.oauthlib.discord.get('users/@me', token=token)
    user_data = resp.json()

    if not user_data:
        return RedirectResponse("/auth?message=Không tìm thấy người dùng&type=error", status_code=302)

    db: Database = request.app.state.db
    user_avatar_url = f"https://cdn.discordapp.com/avatars/{user_data['id']}/{user_data['avatar']}.webp" if user_data.get("avatar") else "https://cdn.discordapp.com/embed/avatars/1.png"
    user_db = await db.get_user_by_email(user_data["email"])

    if user_db is None:
        await db.create_user(user_data["username"], user_data["email"], user_avatar_url, login_type="discord")
    elif user_db.get("login_type") != "discord":
        return RedirectResponse("/auth?message=Tài khoản không được tạo bằng Discord&type=error", status_code=302)
    
    response = RedirectResponse("/dashboard", status_code=302)
    response.set_cookie("token", auth_manager.create_access_token({"type": "token", "sub": user_data["email"]}), httponly=True, secure=True)
    return response

@router.get("/google/callback")
@limiter.limit("60/10minute")
async def google_callback(request: Request):
    token = await auth_manager.oauthlib.google.authorize_access_token(request)
    user_data = token.get("userinfo", {})

    if not user_data:
        return RedirectResponse("/auth?message=Không tìm thấy người dùng&type=error", status_code=302)
    
    db: Database = request.app.state.db
    user_db = await db.get_user_by_email(user_data["email"])

    if user_db is None:
        await db.create_user(user_data["name"], user_data["email"], user_data["picture"], login_type="google")
    elif user_db.get("login_type") != "google":
        return RedirectResponse("/auth?message=Tài khoản không được tạo bằng Google&type=error", status_code=302)
    
    response = RedirectResponse("/dashboard", status_code=302)
    response.set_cookie("token", auth_manager.create_access_token({"type": "token", "sub": user_data["email"]}), httponly=True, secure=True)
    return response
