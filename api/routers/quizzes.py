from fastapi import APIRouter

router = APIRouter(
    prefix="/api/quizzes",
    tags=["Quizzes"],
    responses={404: {"description": "Not found"}},
)
