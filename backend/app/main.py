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
        from sqlalchemy import text, inspect
        from app.db.database import engine
        
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        if "complaints" in tables:
            existing_columns = [col['name'] for col in inspector.get_columns("complaints")]
            
            with engine.begin() as conn:
                if "remarks" not in existing_columns:
                    print("[MIGRATION] Injecting 'remarks' column into 'complaints' table...")
                    conn.execute(text("ALTER TABLE complaints ADD COLUMN remarks TEXT"))
                
                if "submitter_name" not in existing_columns:
                    print("[MIGRATION] Injecting 'submitter_name' column into 'complaints' table...")
                    conn.execute(text("ALTER TABLE complaints ADD COLUMN submitter_name TEXT"))
                    
                if "submitter_email" not in existing_columns:
                    print("[MIGRATION] Injecting 'submitter_email' column into 'complaints' table...")
                    conn.execute(text("ALTER TABLE complaints ADD COLUMN submitter_email TEXT"))
        else:
            print("[MIGRATION] 'complaints' table not found, skipping column injection (will be created by create_all)")
        
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
