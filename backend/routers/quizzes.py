from typing import Annotated, List
from fastapi import APIRouter, Depends, UploadFile, Request, HTTPException

from ..utils.database import Database
from ..utils.models import Quiz, QuizCreate, UserResponse
from ..utils.auth import auth_manager
from ..utils.storage import Storage

router = APIRouter(
    prefix="/api/quizzes",
    tags=["Quizzes"],
    responses={404: {"description": "Not found"}}
)
@router.post("/upload/image")
async def upload_image(request: Request, file: UploadFile, user: Annotated[UserResponse, Depends(auth_manager.get_current_user)]):
    if not user["email"]:
        raise HTTPException(status_code=401, detail="Not authenticated")
    storage: Storage = request.app.state.storage
    return {"status": "success", "message": "Image uploaded", "url": (await storage.upload(file, user["email"])).get("secure_url")} 

@router.post("/new")
async def new_quiz(request: Request, quiz_data: QuizCreate, user: Annotated[UserResponse, Depends(auth_manager.get_current_user)]):
    if not user["email"]:
        raise HTTPException(status_code=401, detail="Not authenticated")
    db: Database = request.app.state.db
    quiz = Quiz(author=user["email"], **quiz_data.model_dump())
    quiz_db = await db.create_quiz(quiz.model_dump())
    return {"status": "success", "message": "Quiz đã được tạo", "id": str(quiz_db.inserted_id)}