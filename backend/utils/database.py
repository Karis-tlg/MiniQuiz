import os
from typing import Literal
from datetime import datetime, timezone
from pymongo.asynchronous.mongo_client import AsyncMongoClient

class Database:
    def __init__(self):
        self.client = AsyncMongoClient(os.environ.get("MONGODB_URI"))
        self.db = self.client["users"]
        self.users = self.db["users"]
        self.quizzes = self.db["quizzes"]
        self.history = self.db["history"]

    async def get_user(self, user_id: str):
        return await self.users.find_one({"_id": user_id})

    async def get_user_by_email(self, email: str):
        return await self.users.find_one({"email": email})
    
    async def has_user(self, email: str):
        return (await self.users.count_documents({"email": email}, limit=1)) > 0

    async def create_user(self, username: str, email: str,  avatar: str, password: str = None, login_type: Literal["email", "google", "discord"] = "email", disabled: bool = False, role: Literal["member", "admin"] = "member", createAt: datetime = None):
        data = {"username": username, "avatar": avatar, "email": email, "password": password, "login_type": login_type, "disabled": disabled, "role": role, "createAt": createAt or datetime.now(timezone.utc)}
        return await self.users.insert_one(data)
    
    async def update_user(self, email: str, data: dict):
        return await self.users.update_one({"email": email}, {"$set": data})

    async def delete_user(self, email: str):
        return await self.users.delete_one({"email": email})
    
    async def get_quiz(self, quiz_id: str):
        return await self.quizzes.find_one({"_id": quiz_id})
    
    async def create_quiz(self, data: dict):
        return await self.quizzes.insert_one(data)
    
    async def update_quiz(self, quiz_id: str, data: dict):
        return await self.quizzes.update_one({"_id": quiz_id}, {"$set": data})
    
    async def delete_quiz(self, quiz_id: str):
        return await self.quizzes.delete_one({"_id": quiz_id})

    async def close(self):
        await self.client.close()