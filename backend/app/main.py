from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api.v1 import auth, cms, ai, analytics, founders, media, grievances, technologies, contact, admin
import uvicorn

from app.db.database import Base, engine
from app.core.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        from app.db.database import ApprovedAdmin, SessionLocal, engine
        
        # ── AUTO-MIGRATION ──
        import sqlite3
        from app.core.config import settings
        import os
        
        # Determine DB path (similar to database.py)
        if "sqlite" in settings.DATABASE_URL:
            db_path = settings.DATABASE_URL.replace("sqlite:///", "")
            if not os.path.isabs(db_path):
                db_path = os.path.join(os.getcwd(), db_path)
        else:
            db_path = os.path.join(os.getcwd(), "arvix_demo.db")

        if os.path.exists(db_path):
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            cursor.execute("PRAGMA table_info(complaints)")
            columns = [col[1] for col in cursor.fetchall()]
            if "remarks" not in columns:
                print("[MIGRATION] Injecting 'remarks' column into 'complaints' table...")
                cursor.execute("ALTER TABLE complaints ADD COLUMN remarks TEXT")
                conn.commit()
            conn.close()

        Base.metadata.create_all(bind=engine)
        
        db = SessionLocal()
        if not db.query(ApprovedAdmin).filter(ApprovedAdmin.email == "arvixlabs@gmail.com").first():
            db.add(ApprovedAdmin(email="arvixlabs@gmail.com", role="super_admin"))
            db.commit()
        db.close()
        print("[SERVER] Arvix Labs API started (Neural Synchronization Complete)")
    except Exception as e:
        print(f"[SERVER] Operational failure: {e}")
    yield
    print("[SERVER] Arvix Labs API shutdown")

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
    allow_origins=[o.strip() for o in settings.CORS_ORIGINS.split(",")],
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
app.include_router(admin.router,        prefix=PREFIX)

@app.get("/")
async def root():
    return {"name": "Arvix Labs API", "version": "2.0.0", "docs": "/api/docs"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
