import os, jwt
from fastapi import Request
from pwdlib import PasswordHash
from aiohttp import ClientSession
from datetime import datetime, timedelta, timezone
from .database import Database

password_hash = PasswordHash.recommended()
SECRET_KEY = os.environ.get("SECRET_KEY")
ALGORITHM = os.environ.get("ALGORITHM")

def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)

def get_password_hash(password):
    return password_hash.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expires_delta = expires_delta or timedelta(days=30)
    to_encode.update({"exp": datetime.now(timezone.utc) + expires_delta})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except:
        return {}

async def get_current_user(request: Request):
    db: Database = request.app.state.db
    token = request.cookies.get("token")
    payload = decode_access_token(token)
    user_email: str = payload.get("sub")
    if user_email is None or payload.get("type") != "token":
        return
    user = await db.get_user_by_email(user_email)
    return user

async def verify_cf_turnstile(turnstile_token: str) -> bool:
    async with ClientSession() as session:
        async with session.post("https://challenges.cloudflare.com/turnstile/v0/siteverify", json={"secret": os.environ.get("CF_TURNSTILE_SECRET"), "response": turnstile_token}) as response:
            data = await response.json()
            return data.get("success", False)