from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from utils.database import Database
from utils.mail import MailClient

from routers import users
from routers import quizzes

import dotenv

dotenv.load_dotenv("../.env.local")

db = Database()
mail = MailClient()
app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json", redoc_url="/api/redoc")
app.state.db = db
app.state.mail = mail

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(quizzes.router)
