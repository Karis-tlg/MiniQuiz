from __future__ import annotations
from pydantic import BaseModel, EmailStr, HttpUrl
from typing import Dict, List

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    avatar: HttpUrl
    password: str

class UserResponse(BaseModel):
    username: str
    email: EmailStr
    avatar: HttpUrl
    disabled: bool

class QuizOption(BaseModel):
    id: str
    label: str

class QuizQuestion(BaseModel):
    id: str
    type: str
    question: str
    options: List[QuizOption]
    answer: str | Dict[str, str]

class QuizRandomize(BaseModel):
    questions: bool
    options: bool

class QuizCreate(BaseModel):
    _id: str
    title: str
    randomize: QuizRandomize
    questions: List[QuizQuestion]

class Quiz(QuizCreate):
    author: EmailStr
