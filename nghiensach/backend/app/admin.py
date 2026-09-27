from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, HTTPException, Request, UploadFile, status
from fastapi.responses import FileResponse, RedirectResponse
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from .config import settings
from .auth import admin_auth, credentials_are_valid
from .database import get_db
from .database import SessionLocal
from .models import Book, Category, Chapter, JobStatus, Voice
from .services import extract_chapter_text, process_chapter, synthesize, synthesize_chapter_audio

router = APIRouter(prefix="/admin")
def page(request: Request, name: str, **context):
    return request.app.state.templates.TemplateResponse(request=request, name=name, context=context)


@router.get("/login")
def login_page(request: Request):
    if request.session.get("admin_user"):
        return RedirectResponse("/admin", 303)
    return page(request, "admin/login.html", error=None)


@router.post("/login")
def login(request: Request, username: str = Form(...), password: str = Form(...)):
    if not credentials_are_valid(username, password):
        return page(request, "admin/login.html", error="Tài khoản hoặc mật khẩu không đúng")
    request.session.clear()
    request.session["admin_user"] = username
    return RedirectResponse("/admin", 303)


@router.post("/logout")
def logout(request: Request):
    request.session.clear()
    return RedirectResponse("/admin/login", 303)


@router.get("")
def dashboard(request: Request, _: str = Depends(admin_auth), db: Session = Depends(get_db)):
    counts = {
        "categories": db.scalar(select(func.count(Category.id))),
        "books": db.scalar(select(func.count(Book.id))),
        "chapters": db.scalar(select(func.count(Chapter.id))),
        "ready": db.scalar(select(func.count(Chapter.id)).where(Chapter.status == JobStatus.completed)),
    }
    recent = db.scalars(select(Chapter).options(selectinload(Chapter.book)).order_by(Chapter.updated_at.desc()).limit(8)).all()
    return page(request, "admin/dashboard.html", counts=counts, chapters=recent)


@router.get("/categories")
def category_list(request: Request, _: str = Depends(admin_auth), db: Session = Depends(get_db)):
    return page(request, "admin/categories.html", categories=db.scalars(select(Category).order_by(Category.name)).all())


@router.post("/categories")
def category_create(name: str = Form(...), description: str = Form(""), _: str = Depends(admin_auth), db: Session = Depends(get_db)):
    db.add(Category(name=name.strip(), description=description.strip()))
    db.commit()
    return RedirectResponse("/admin/categories", 303)


@router.post("/categories/{item_id}/delete")
def category_delete(item_id: int, _: str = Depends(admin_auth), db: Session = Depends(get_db)):
    item = db.get(Category, item_id)
    if item:
        db.delete(item)
        db.commit()
    return RedirectResponse("/admin/categories", 303)


@router.get("/books")
def book_list(request: Request, _: str = Depends(admin_auth), db: Session = Depends(get_db)):
    books = db.scalars(select(Book).options(selectinload(Book.category)).order_by(Book.title)).all()
    categories = db.scalars(select(Category).order_by(Category.name)).all()
    return page(request, "admin/books.html", books=books, categories=categories)


@router.post("/books")
def book_create(category_id: int = Form(...), title: str = Form(...), author: str = Form(""), description: str = Form(""), cover_url: str = Form(""), _: str = Depends(admin_auth), db: Session = Depends(get_db)):
    db.add(Book(category_id=category_id, title=title.strip(), author=author.strip(), description=description.strip(), cover_url=cover_url.strip() or None))
    db.commit()
    return RedirectResponse("/admin/books", 303)


@router.post("/books/{item_id}/delete")
def book_delete(item_id: int, _: str = Depends(admin_auth), db: Session = Depends(get_db)):
    item = db.get(Book, item_id)
    if item:
        db.delete(item)
        db.commit()
    return RedirectResponse("/admin/books", 303)


@router.get("/chapters")
def chapter_list(request: Request, book_id: int | None = None, _: str = Depends(admin_auth), db: Session = Depends(get_db)):
    stmt = select(Chapter).options(selectinload(Chapter.book)).order_by(Chapter.book_id, Chapter.position)
    if book_id:
        stmt = stmt.where(Chapter.book_id == book_id)
    return page(request, "admin/chapters.html", chapters=db.scalars(stmt).all(), books=db.scalars(select(Book).order_by(Book.title)).all(), voices=db.scalars(select(Voice).where(Voice.active.is_(True)).order_by(Voice.name)).all(), selected_book=book_id)


@router.post("/chapters")
async def chapter_create(book_id: int = Form(...), title: str = Form(...), position: int = Form(...), pdf: UploadFile = File(...), _: str = Depends(admin_auth), db: Session = Depends(get_db)):
    if pdf.content_type != "application/pdf" and not (pdf.filename or "").lower().endswith(".pdf"):
        raise HTTPException(400, "Chỉ chấp nhận file PDF")
    upload_dir = settings.media_root / "uploads"
    upload_dir.mkdir(parents=True, exist_ok=True)
    relative = Path("uploads") / f"{uuid4().hex}.pdf"
    destination = settings.media_root / relative
    size = 0
    with destination.open("wb") as target:
        while chunk := await pdf.read(1024 * 1024):
            size += len(chunk)
            if size > 100 * 1024 * 1024:
                destination.unlink(missing_ok=True)
                raise HTTPException(413, "PDF tối đa 100 MB")
            target.write(chunk)
    db.add(Chapter(book_id=book_id, title=title.strip(), position=position, pdf_path=str(relative)))
    db.commit()
    return RedirectResponse(f"/admin/chapters?book_id={book_id}", 303)


@router.post("/chapters/{chapter_id}/process")
def chapter_process(chapter_id: int, tasks: BackgroundTasks, _: str = Depends(admin_auth), db: Session = Depends(get_db)):
    item = db.get(Chapter, chapter_id)
    if item:
        item.status = JobStatus.pending
        item.error_message = None
        db.commit()
        tasks.add_task(process_chapter, chapter_id)
    return RedirectResponse("/admin/chapters", 303)


@router.post("/chapters/{chapter_id}/extract-text")
def chapter_extract_text(chapter_id: int, tasks: BackgroundTasks, _: str = Depends(admin_auth), db: Session = Depends(get_db)):
    item = db.get(Chapter, chapter_id)
    if item:
        item.status = JobStatus.processing
        item.error_message = None
        db.commit()
        tasks.add_task(extract_chapter_text, chapter_id)
    return RedirectResponse("/admin/chapters", 303)


@router.post("/chapters/{chapter_id}/synthesize")
def chapter_synthesize(chapter_id: int, tasks: BackgroundTasks, voice_id: int = Form(...), _: str = Depends(admin_auth), db: Session = Depends(get_db)):
    item = db.get(Chapter, chapter_id)
    if item:
        item.voice_id = voice_id
        item.status = JobStatus.processing
        item.error_message = None
        db.commit()
        tasks.add_task(synthesize_chapter_audio, chapter_id, voice_id)
    return RedirectResponse("/admin/chapters", 303)


@router.get("/voices")
def voice_list(request: Request, _: str = Depends(admin_auth), db: Session = Depends(get_db)):
    voices = db.scalars(select(Voice).order_by(Voice.name)).all()
    sample_ids = {voice.id for voice in voices if (settings.media_root / "audio" / f"voice-{voice.id}-sample.wav").exists()}
    return page(request, "admin/voices.html", voices=voices, sample_ids=sample_ids)


@router.post("/voices")
def voice_create(name: str = Form(...), provider_key: str = Form(...), region: str = Form(""), gender: str = Form(""), description: str = Form(""), _: str = Depends(admin_auth), db: Session = Depends(get_db)):
    db.add(Voice(name=name.strip(), provider_key=provider_key.strip(), region=region.strip(), gender=gender.strip(), description=description.strip()))
    db.commit()
    return RedirectResponse("/admin/voices", 303)


def _generate_voice_sample(voice_id: int, sample_text: str) -> None:
    with SessionLocal() as db:
        voice = db.get(Voice, voice_id)
        if voice is None:
            return
        output = settings.media_root / "audio" / f"voice-{voice.id}-sample.wav"
        synthesize(sample_text, output, voice.provider_key)


@router.post("/voices/{voice_id}/sample")
def voice_sample(voice_id: int, tasks: BackgroundTasks, sample_text: str = Form("Xin chào, đây là bản nghe thử giọng đọc trên Nghiện Sách."), _: str = Depends(admin_auth), db: Session = Depends(get_db)):
    voice = db.get(Voice, voice_id)
    if voice is None:
        raise HTTPException(404, "Không tìm thấy giọng đọc")
    tasks.add_task(_generate_voice_sample, voice_id, sample_text.strip()[:1000])
    return RedirectResponse("/admin/voices", 303)


@router.get("/voices/{voice_id}/sample", response_class=FileResponse)
def voice_sample_file(voice_id: int, _: str = Depends(admin_auth), db: Session = Depends(get_db)):
    if db.get(Voice, voice_id) is None:
        raise HTTPException(404, "Không tìm thấy giọng đọc")
    path = settings.media_root / "audio" / f"voice-{voice_id}-sample.wav"
    if not path.exists():
        raise HTTPException(404, "Chưa có sample, hãy tạo sample trước")
    return FileResponse(path, media_type="audio/wav", filename=f"voice-{voice_id}-sample.wav", content_disposition_type="inline", headers={"Cache-Control": "no-store"})


@router.post("/voices/{voice_id}/toggle")
def voice_toggle(voice_id: int, _: str = Depends(admin_auth), db: Session = Depends(get_db)):
    voice = db.get(Voice, voice_id)
    if voice:
        voice.active = not voice.active
        db.commit()
    return RedirectResponse("/admin/voices", 303)


@router.post("/chapters/{chapter_id}/delete-text")
def chapter_delete_text(chapter_id: int, _: str = Depends(admin_auth), db: Session = Depends(get_db)):
    item = db.get(Chapter, chapter_id)
    if item:
        if item.text_path:
            (settings.media_root / item.text_path).unlink(missing_ok=True)
        item.text_path = None
        item.extracted_text = ""
        item.status = JobStatus.pending
        item.error_message = None
        db.commit()
    return RedirectResponse("/admin/chapters", 303)


@router.post("/chapters/{chapter_id}/delete-audio")
def chapter_delete_audio(chapter_id: int, _: str = Depends(admin_auth), db: Session = Depends(get_db)):
    item = db.get(Chapter, chapter_id)
    if item:
        if item.audio_path:
            (settings.media_root / item.audio_path).unlink(missing_ok=True)
        item.audio_path = None
        item.status = JobStatus.pending if item.text_path else JobStatus.pending
        item.error_message = None
        db.commit()
    return RedirectResponse("/admin/chapters", 303)


@router.post("/chapters/{chapter_id}/save-text")
def chapter_save_text(chapter_id: int, text: str = Form(""), _: str = Depends(admin_auth), db: Session = Depends(get_db)):
    item = db.get(Chapter, chapter_id)
    if item:
        text = text.strip()
        if item.text_path is None:
            item.text_path = f"texts/chapter-{item.id}.txt"
        target = settings.media_root / item.text_path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(text, encoding="utf-8")
        item.extracted_text = text
        item.status = JobStatus.pending if not item.audio_path else item.status
        item.error_message = None
        db.commit()
    return RedirectResponse("/admin/chapters", 303)


@router.post("/chapters/{chapter_id}/delete")
def chapter_delete(chapter_id: int, _: str = Depends(admin_auth), db: Session = Depends(get_db)):
    item = db.get(Chapter, chapter_id)
    if item:
        (settings.media_root / item.pdf_path).unlink(missing_ok=True)
        if item.audio_path:
            (settings.media_root / item.audio_path).unlink(missing_ok=True)
        if item.text_path:
            (settings.media_root / item.text_path).unlink(missing_ok=True)
        db.delete(item)
        db.commit()
    return RedirectResponse("/admin/chapters", 303)
