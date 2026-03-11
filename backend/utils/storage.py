import asyncio
import os, hashlib, re
from typing import List
import cloudinary
from cloudinary.uploader import upload, destroy
from fastapi import UploadFile
from .models import QuizQuestion

class Storage:
    def __init__(self):
        cloudinary.config(
            cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME"),
            api_key=os.environ.get("CLOUDINARY_API_KEY"),
            api_secret=os.environ.get("CLOUDINARY_API_SECRET"),
            secure=True
        )

    @staticmethod
    def get_used_images(questions: List[QuizQuestion]) -> set:
        images = set()
        for q in questions: 
            images.update(re.findall(r"!\[.*?\]\(([a-f0-9]{64}_[0-9]+)\)", q.question))
        return images
    
    @staticmethod
    async def get_hash256(data: bytes):
        return f"{hashlib.sha256(data).hexdigest()}_{len(data)}"

    async def remove(self, public_id: str):
        return destroy(public_id)
    
    async def upload(self, data: bytes, user: str, quiz_id: str, public_id: str):
        return upload(data, folder=f"{user}/{quiz_id}", public_id=public_id)

    async def uploads(self, images: List[UploadFile], images_used: set, user: str, quiz_id: str):
        tasks = []
        for image in images:
            data = await image.read()
            hash256_file = await self.get_hash256(data)
            if hash256_file in images_used:
                tasks.append(self.upload(data, user, quiz_id, hash256_file))
        
        results = await asyncio.gather(*tasks)
        return {res.get("public_id"): res.get("secure_url") for res in results}
