import os, hashlib
from fastapi import UploadFile
import cloudinary
from cloudinary.uploader import upload

class Storage:
    def __init__(self):
        cloudinary.config(
            cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME"),
            api_key=os.environ.get("CLOUDINARY_API_KEY"),
            api_secret=os.environ.get("CLOUDINARY_API_SECRET"),
            secure=True
        )

    async def upload(self, file: UploadFile, user: str):
        data = await file.read()
        return upload(data, folder=user, public_id=hashlib.sha256(data).hexdigest())