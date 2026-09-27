from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy import inspect, text

from . import models  # noqa: F401
from .admin import router as admin_router
from .api.routes import router as api_router
from .config import settings
from .database import Base, SessionLocal, engine
from .seed import seed_mock_data


def migrate_schema() -> None:
    category_columns = {column["name"] for column in inspect(engine).get_columns("categories")}
    columns = {column["name"] for column in inspect(engine).get_columns("chapters")}
    with engine.begin() as connection:
        if "parent_id" not in category_columns:
            connection.execute(text("ALTER TABLE categories ADD COLUMN parent_id INTEGER"))
        if "text_path" not in columns:
            connection.execute(text("ALTER TABLE chapters ADD COLUMN text_path VARCHAR(500)"))
        if "voice_id" not in columns:
            connection.execute(text("ALTER TABLE chapters ADD COLUMN voice_id INTEGER"))


def recover_interrupted_jobs() -> None:
    """A process restart cannot resume BackgroundTasks; make those jobs retryable."""
    with SessionLocal() as db:
        for chapter in db.query(models.Chapter).filter(models.Chapter.status == models.JobStatus.processing).all():
            audio_ready = bool(chapter.audio_path and (settings.media_root / chapter.audio_path).exists())
            text_ready = bool(chapter.text_path and (settings.media_root / chapter.text_path).exists())
            if audio_ready:
                chapter.status = models.JobStatus.completed
            else:
                chapter.status = models.JobStatus.pending if text_ready else models.JobStatus.pending
                chapter.error_message = "Job TTS được phục hồi sau khi backend khởi động lại"
        db.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings.media_root.mkdir(parents=True, exist_ok=True)
    (settings.media_root / "uploads").mkdir(exist_ok=True)
    (settings.media_root / "audio").mkdir(exist_ok=True)
    (settings.media_root / "texts").mkdir(exist_ok=True)
    Base.metadata.create_all(engine)
    migrate_schema()
    with SessionLocal() as db:
        seed_mock_data(db)
    recover_interrupted_jobs()
    yield


app = FastAPI(title="Nghiện Sách API", version="0.1.0", lifespan=lifespan)
app.add_middleware(SessionMiddleware, secret_key=settings.session_secret, same_site="lax", https_only=False)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
app.state.templates = Jinja2Templates(directory="app/templates")
app.mount("/static", StaticFiles(directory="app/static"), name="static")
app.mount("/media/audio", StaticFiles(directory=settings.media_root / "audio", check_dir=False), name="audio")
app.mount("/media/texts", StaticFiles(directory=settings.media_root / "texts", check_dir=False), name="texts")
app.include_router(api_router)
app.include_router(admin_router)


@app.get("/", include_in_schema=False)
def home():
    return RedirectResponse("/admin")
