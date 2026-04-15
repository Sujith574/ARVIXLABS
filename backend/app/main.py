from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api.v1 import auth, cms, ai, analytics, founders, media, grievances, technologies, contact
import uvicorn

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("✅ Arvix Labs API — started")
    yield
    print("🔴 Arvix Labs API — shutdown")

app = FastAPI(
    title="Arvix Labs API",
    description="AI-powered Government Data Intelligence Platform",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PREFIX = "/api/v1"
app.include_router(auth.router,         prefix=PREFIX)
app.include_router(cms.router,          prefix=PREFIX)
app.include_router(ai.router,           prefix=PREFIX)
app.include_router(analytics.router,    prefix=PREFIX)
app.include_router(founders.router,     prefix=PREFIX)
app.include_router(media.router,        prefix=PREFIX)
app.include_router(grievances.router,   prefix=PREFIX)
app.include_router(technologies.router, prefix=PREFIX)
app.include_router(contact.router,      prefix=PREFIX)

@app.get("/")
async def root():
    return {"name": "Arvix Labs API", "version": "2.0.0", "docs": "/api/docs"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
