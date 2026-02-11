from fastapi import FastAPI

app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")

@app.get("/api/hello")
def hello():
    return {"message": "Hello from FastAPI on Vercel"}
