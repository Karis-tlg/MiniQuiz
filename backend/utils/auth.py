import os, jwt
from fastapi import Request
from pwdlib import PasswordHash
from httpx import AsyncClient
from authlib.integrations.starlette_client import OAuth
from datetime import datetime, timedelta, timezone
from .database import Database

class Auth:
    def __init__(self):
        self.password_hash = PasswordHash.recommended()
        self.SECRET_KEY = os.environ.get("SECRET_KEY")
        self.ALGORITHM = os.environ.get("ALGORITHM")
        self.oauthlib = OAuth()

        self.oauthlib.register(
            "discord",
            client_id=os.environ.get("DISCORD_CLIENT_ID"),
            client_secret=os.environ.get("DISCORD_CLIENT_SECRET"),
            client_kwargs={"scope": "identify email"},
            access_token_url='https://discord.com/api/oauth2/token',
            authorize_url='https://discord.com/api/oauth2/authorize',
            api_base_url='https://discord.com/api/',
        )

        self.oauthlib.register(
            name='google',
            client_id=os.environ.get("GOOGLE_CLIENT_ID"),
            client_secret=os.environ.get("GOOGLE_CLIENT_SECRET"),
            server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
            client_kwargs={'scope': 'openid email profile'}
        )

    def verify_password(self, plain_password, hashed_password):
        return self.password_hash.verify(plain_password, hashed_password)

    def get_password_hash(self, password):
        return self.password_hash.hash(password)

    def create_access_token(self, data: dict, expires_delta: timedelta = None):
        to_encode = data.copy()
        expires_delta = expires_delta or timedelta(days=30)
        to_encode.update({"exp": datetime.now(timezone.utc) + expires_delta})
        encoded_jwt = jwt.encode(to_encode, self.SECRET_KEY, algorithm=self.ALGORITHM)
        return encoded_jwt


    def decode_access_token(self, token: str):
        try:
            return jwt.decode(token, self.SECRET_KEY, algorithms=[self.ALGORITHM])
        except:
            return {}

    async def get_current_user(self, request: Request):
        db: Database = request.app.state.db
        token = request.cookies.get("token")
        payload = self.decode_access_token(token)
        user_email: str = payload.get("sub")
        if user_email is None or payload.get("type") != "token":
            return
        user = await db.get_user_by_email(user_email)
        return user

    async def has_user_logged_in(self, request: Request) -> bool:
        db: Database = request.app.state.db
        token = request.cookies.get("token")
        payload = self.decode_access_token(token)
        user_email: str = payload.get("sub")
        if user_email is None or payload.get("type") != "token":
            return False
        return await db.has_user(user_email)

    async def verify_cf_turnstile(turnstile_token: str) -> bool:
        async with AsyncClient() as client:
            response = await client.post(
                "https://challenges.cloudflare.com/turnstile/v0/siteverify",
                json={
                    "secret": os.environ.get("CF_TURNSTILE_SECRET"),
                    "response": turnstile_token
                }
            )
            data = response.json()
            return data.get("success", False)
        
auth_manager = Auth()