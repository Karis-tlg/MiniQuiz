from typing import Annotated
from datetime import datetime, timezone
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
    quiz = Quiz(author=user["_id"], createAt=datetime.now(timezone.utc), updateAt=datetime.now(timezone.utc), **quiz_data.model_dump())
    quiz_db = await db.create_quiz(quiz.model_dump())
    return {"status": "success", "message": "Quiz đã được tạo", "id": str(quiz_db.inserted_id)}

@router.get("/stats")
async def quiz_stats(request: Request, user: Annotated[UserResponse, Depends(auth_manager.get_current_user)]):
    if not user["email"]:
        raise HTTPException(status_code=401, detail="Not authenticated")
    db: Database = request.app.state.db
    quiz_create_count = await db.quizzes.count_documents({"author": user["_id"]})
    quiz_done_count = await db.history.count_documents({"author": user["_id"]})
    return {"status": "success", "quiz_created": quiz_create_count, "quiz_done": quiz_done_count}

@router.get("/page/{page}")
async def quiz_page(request: Request, page: int, user: Annotated[UserResponse, Depends(auth_manager.get_current_user)]):
    if not user["email"]:
        raise HTTPException(status_code=401, detail="Not authenticated")
    db: Database = request.app.state.db
    quizzes = await db.quizzes.find({"author": user["_id"]}).skip((page - 1) * 10).limit(10).to_list(length=10)
    for quiz in quizzes:
        quiz["_id"] = str(quiz["_id"])
        quiz["author"] = str(quiz["author"])
    return {"status": "success", "quizzes": quizzes}