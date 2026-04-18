from pydantic_settings import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    # App
    APP_NAME: str = "Arvix Labs"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    CORS_ORIGINS: str = "https://arvix-frontend-666036188871.asia-south1.run.app,http://localhost:3000,*"

    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/arvix_db"

    # JWT
    SECRET_KEY: str = "super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Gemini
    GEMINI_API_KEY: str = ""

    # Firebase
    FIREBASE_PROJECT_ID: str = ""
    FIREBASE_CLIENT_EMAIL: str = ""
    FIREBASE_PRIVATE_KEY: str = ""
    FIREBASE_STORAGE_BUCKET: str = ""

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Email (OTP)
    MAIL_USERNAME: str = "arvixlabs@gmail.com"
    MAIL_PASSWORD: str = "iuai xkil dyft rzjf"
    MAIL_FROM: str = "arvixlabs@gmail.com"
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"

    class Config:
        env_file = ".env"
        extra = "ignore"

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
