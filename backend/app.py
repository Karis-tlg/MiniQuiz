import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from .utils.database import Database
from .utils.mail import MailClient
from .utils.storage import Storage
from .routers import users
from .routers import quizzes

if os.path.exists("../.env.local"):
    import dotenv
    dotenv.load_dotenv("../.env.local")

db = Database()
mail = MailClient()
storage = Storage()
app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json", redoc_url="/api/redoc")

app.state.db = db
app.state.mail = mail
app.state.storage = storage

app.add_middleware(SessionMiddleware, secret_key=os.environ.get("SECRET_KEY"))
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(quizzes.router)
