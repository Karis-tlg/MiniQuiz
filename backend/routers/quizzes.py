from typing import Annotated, List
from datetime import datetime, timezone
from bson import ObjectId
from fastapi import APIRouter, Depends, UploadFile, Request, HTTPException

from ..utils.database import Database
from ..utils.models import Quiz, QuizRandomize, UserResponse
from ..utils.auth import auth_manager
from ..utils.storage import Storage

router = APIRouter(
    prefix="/api/quizzes",
    tags=["Quizzes"],
    responses={404: {"description": "Not found"}}
)
@router.post("/upload/image")
async def upload_image(request: Request, quiz_id: str, file: UploadFile, user: Annotated[UserResponse, Depends(auth_manager.get_current_user)]):
    if not user["email"]:
        raise HTTPException(status_code=401, detail="Not authenticated")
    storage: Storage = request.app.state.storage
    return {"status": "success", "message": "Image uploaded", "url": (await storage.upload(file, user["email"])).get("secure_url")} 

@router.post("/new")
async def new_quiz(request: Request, user: Annotated[UserResponse, Depends(auth_manager.get_current_user)]):
    if not user["email"]:
        raise HTTPException(status_code=401, detail="Not authenticated")
    db: Database = request.app.state.db
    quiz = Quiz(title="Không có tiêu đề", questions=[], randomize=QuizRandomize(), author=user["_id"], createAt=datetime.now(timezone.utc), updateAt=datetime.now(timezone.utc))
    quiz_db = await db.create_quiz(quiz.model_dump())
    return {"status": "success", "quiz_id": str(quiz_db.inserted_id)}

@router.post("/{quiz_id}/update")
async def update_quiz(request: Request, quiz_id: str, data: dict, user: Annotated[UserResponse, Depends(auth_manager.get_current_user)]):
    if not user["email"]:
        raise HTTPException(status_code=401, detail="Not authenticated")
    db: Database = request.app.state.db
    result = await db.update_quiz(ObjectId(quiz_id), user["_id"], data)
    if not result.matched_count:
        raise HTTPException(status_code=404, detail="Quiz not found or unauthorized")
    return {"status": "success", "message": "Quiz updated"}

@router.get("/stats")
async def quiz_stats(request: Request, user: Annotated[UserResponse, Depends(auth_manager.get_current_user)]):
    if not user["email"]:
        raise HTTPException(status_code=401, detail="Not authenticated")
    db: Database = request.app.state.db
    quiz_create_count = await db.quizzes.count_documents({"author": user["_id"]})
    quiz_done_count = await db.history.count_documents({"author": user["_id"]})
    return {"status": "success", "quiz_created": quiz_create_count, "quiz_done": quiz_done_count}

@router.get("/{quiz_id}/editor")
async def quiz_editor(request: Request, quiz_id: str, user: Annotated[UserResponse, Depends(auth_manager.get_current_user)]):
    if not user["email"]:
        raise HTTPException(status_code=401, detail="Not authenticated")
    db: Database = request.app.state.db
    quiz_data = await db.quizzes.find_one({"_id": ObjectId(quiz_id), "author": user["_id"]})
    if not quiz_data:
        raise HTTPException(status_code=404, detail="Quiz not found")
    quiz = Quiz(**quiz_data)
    return {"status": "success", "data": quiz}

@router.get("/page/{page}")
async def quiz_page(request: Request, page: int, user: Annotated[UserResponse, Depends(auth_manager.get_current_user)]):
    if not user["email"]:
        raise HTTPException(status_code=401, detail="Not authenticated")
    db: Database = request.app.state.db
    if page < 1:
        raise HTTPException(status_code=400, detail="Page must be greater than 0")
    cursor = await db.quizzes.aggregate([
        {"$match": {"author": user["_id"]}},
        {"$skip": (page - 1) * 10},
        {"$limit": 10},
        {"$project": {
            "_id": {"$toString": "$_id"},
            "title": 1,
            "updateAt": 1,
            "question_count": {"$size": "$questions"}
        }}
    ])
    quizzes = await cursor.to_list(length=10)
    max_page = (await db.quizzes.count_documents({"author": user["_id"]}) + 9) // 10
    return {"status": "success", "quizzes": quizzes, "max_page": max_page}