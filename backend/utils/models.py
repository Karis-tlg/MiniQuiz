from __future__ import annotations
from pydantic import BaseModel, EmailStr, HttpUrl
from typing import Dict, List, Literal, Callable, Type, Any
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId
from pydantic_core import CoreSchema, core_schema

class PydanticObjectId(ObjectId):
    """
    Custom Pydantic type for MongoDB ObjectId validation and serialization.
    """

    @classmethod
    def __get_pydantic_core_schema__(
        cls, source: Type[Any], handler: Callable[[Any], CoreSchema]
    ) -> CoreSchema:
        """
        Defines how Pydantic should handle this type internally.
        """
        return core_schema.no_info_after_validator_function(
            cls._validate,
            core_schema.any_schema(),
            serialization=core_schema.to_string_ser_schema(),
        )

    @classmethod
    def _validate(cls, value: Any) -> ObjectId:
        """
        Validates the input value as a valid ObjectId.
        """
        if not isinstance(value, ObjectId):
            try:
                # Attempt to convert from a string if not already an ObjectId
                return ObjectId(value)
            except (InvalidId, TypeError) as e:
                raise ValueError("Not a valid ObjectId") from e
        return value
    
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
    role: Literal["member", "admin"]
    createAt: datetime

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
    author: PydanticObjectId
    createAt: datetime
    updateAt: datetime
