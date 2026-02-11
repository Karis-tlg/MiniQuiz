from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def index():
    return {"message": "Hello from FastAPI on Vercel"}

@app.get("/api/hello")
def hello():
    return {"message": "Hello from FastAPI on Vercel"}

@app.get("/hello")
def hello2():
    return {"message": "Hello from FastAPI on Vercel"}