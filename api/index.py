from fastapi import FastAPI

app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")

@app.get("/")
def index():
    return {"message": "Hello from FastAPI on Vercel /"}

@app.get("/api/hello")
def hello():
    return {"message": "Hello from FastAPI on Vercel /api/hello"}

@app.get("/hello")
def hello2():
    return {"message": "Hello from FastAPI on Vercel /hello"}