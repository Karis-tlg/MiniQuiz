from typing import Annotated, List
from datetime import datetime, timezone
from bson import ObjectId
from fastapi import APIRouter, Depends, File, Form, UploadFile, Request, HTTPException

from ..utils.database import Database
from ..utils.models import Quiz, QuizLock, QuizData, QuizRandomize, User
from ..utils.auth import auth_manager
from ..utils.limiter import limiter
from ..utils.storage import Storage

router = APIRouter(
    prefix="/api/quizzes",
    tags=["Quizzes"],
    responses={404: {"description": "Not found"}}
)

@router.get("/stats")
async def quiz_stats(request: Request, user: Annotated[User, Depends(auth_manager.get_current_user)]):
    if user is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    db: Database = request.app.state.db
    quiz_create_count = await db.quizzes.count_documents({"author": user.id})
    quiz_done_count = await db.history.count_documents({"author": user.id})
    return {"status": "success", "quiz_created": quiz_create_count, "quiz_done": quiz_done_count}

@router.post("/new")
@limiter.limit("10/10minute")
async def new_quiz(request: Request, user: Annotated[User, Depends(auth_manager.get_current_user)]):
    if user is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    db: Database = request.app.state.db
    quiz = Quiz(title="Không có tiêu đề", version=1, questions=[], images={}, randomize=QuizRandomize(), author=user.id, createAt=datetime.now(timezone.utc), updateAt=datetime.now(timezone.utc))
    quiz_db = await db.create_quiz(quiz.model_dump(mode="json"))
    return {"status": "success", "quiz_id": str(quiz_db.inserted_id)}

@router.post("/{quiz_id}/update")
@limiter.limit("60/10minute")
async def update_quiz(request: Request, user: Annotated[User, Depends(auth_manager.get_current_user)], quiz_id: str, data: str = Form(...), images: List[UploadFile] = File(default=[])):
    if user is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    db: Database = request.app.state.db
    storage: Storage = request.app.state.storage
    data = QuizData.model_validate_json(data)
    quiz_data = await db.quizzes.find_one({"quiz_id": ObjectId(quiz_id), "author": user.id}, sort=[("version", -1)])
    if not quiz_data:
        raise HTTPException(status_code=404, detail="Quiz not found or unauthorized")
    
    images_used = Storage.get_used_images(data.questions)
    uploaded_images = await storage.uploads(images, images_used, user.id, quiz_id)
    quiz_data["images"].update(uploaded_images)
    for img in quiz_data["images"].copy().keys():
        if img.split("/")[-1] not in images_used:
            await storage.remove(img)
            del quiz_data["images"][img]

    quiz = Quiz(**data.model_dump(by_alias=True), quiz_id=quiz_data["quiz_id"], images=quiz_data["images"], version=quiz_data["version"] + 1, author=user.id, createAt=quiz_data["createAt"], updateAt=datetime.now(timezone.utc))
    await db.create_quiz(quiz.model_dump(by_alias=True))
    return {"status": "success", "message": "Quiz updated"}

@router.get("/{quiz_id}/quiz")
async def quiz_quiz(request: Request, quiz_id: str, user: Annotated[User, Depends(auth_manager.get_current_user)]):
    if user is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    db: Database = request.app.state.db
    quiz_data = await db.quizzes.find_one({"quiz_id": ObjectId(quiz_id), "author": user.id}, sort=[("version", -1)])
    if not quiz_data:
        raise HTTPException(status_code=404, detail="Quiz not found")
    quiz = QuizLock(**quiz_data)
    return {"status": "success", "data": quiz}

@router.get("/{quiz_id}/editor")
@limiter.limit("60/10minute")
async def quiz_editor(request: Request, quiz_id: str, user: Annotated[User, Depends(auth_manager.get_current_user)]):
    if user is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    db: Database = request.app.state.db
    quiz_data = await db.quizzes.find_one({"quiz_id": ObjectId(quiz_id), "author": user.id}, sort=[("version", -1)])
    if not quiz_data:
        raise HTTPException(status_code=404, detail="Quiz not found")
    quiz = Quiz(**quiz_data)
    quiz.images = {k.split("/")[-1]: v for k, v in quiz.images.items()}
    return {"status": "success", "data": quiz}

@router.get("/page/{page}")
@limiter.limit("100/minute")
async def quiz_page(request: Request, page: int, user: Annotated[User, Depends(auth_manager.get_current_user)]):
    if user is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    db: Database = request.app.state.db
    if page < 1:
        raise HTTPException(status_code=400, detail="Page must be greater than 0")
    cursor = await db.quizzes.aggregate([
        {"$match": {"author": user.id}},
        {"$skip": (page - 1) * 10},
        {"$limit": 10},
        {"$project": {
            "_id": 0,
            "quiz_id": {"$toString": "$quiz_id"},
            "title": 1,
            "updateAt": 1,
            "question_count": {"$size": "$questions"}
        }}
    ])
    quizzes = await cursor.to_list(length=10)
    max_page = (await db.quizzes.count_documents({"author": user.id}) + 9) // 10
    return {"status": "success", "quizzes": quizzes, "max_page": max_page}