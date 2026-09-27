from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "sqlite:///./data/app.db"
    media_root: Path = Path("./data")
    public_base_url: str = "http://localhost:8000"
    admin_username: str = "admin"
    admin_password: str = "admin"
    session_secret: str = "dev-only-change-in-production"
    tts_mock: bool = False
    tts_voice: str = "Phạm Tuyên"
    tts_backend: str = "onnx"
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
