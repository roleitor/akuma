from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    PROJECT_NAME: str = "Akuma QR Validator"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api"

    DATABASE_URL: str = "postgresql://user:password@localhost:5432/akuma_qr"
    REDIS_URL: str = "redis://localhost:6379"

    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    PRIVATE_KEY_PATH: str = "./keys/private_key.pem"
    PUBLIC_KEY_PATH: str = "./keys/public_key.pem"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
