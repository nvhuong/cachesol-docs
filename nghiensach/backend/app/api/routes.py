from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy import or_, select
from sqlalchemy.orm import Session, selectinload

from ..config import settings
from ..auth import admin_auth
from ..database import get_db
from ..models import Book, Category, Chapter, JobStatus
from ..schemas import BookDetail, BookOut, BookPage, CategoryOut, ChapterOut, LibraryOut, ListenStartOut, SynthesizeRequest, VoiceOut
from ..models import Voice
from ..services import extract_chapter_text, process_chapter, synthesize_chapter_audio

router = APIRouter(prefix="/api/v1")


def chapter_out(chapter: Chapter) -> ChapterOut:
    base = settings.public_base_url.rstrip("/") + "/media/"
    return ChapterOut(
        id=chapter.id, book_id=chapter.book_id, title=chapter.title,
        position=chapter.position, status=chapter.status,
        text=chapter.extracted_text, pdf_url=settings.public_base_url.rstrip("/") + f"/api/v1/chapters/{chapter.id}/pdf",
        text_url=base + chapter.text_path if chapter.text_path else None,
        audio_url=settings.public_base_url.rstrip("/") + f"/api/v1/chapters/{chapter.id}/audio" if chapter.audio_path else None,
        error_message=chapter.error_message,
        voice_id=chapter.voice_id,
    )


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/categories", response_model=list[CategoryOut])
def categories(db: Session = Depends(get_db)):
    return db.scalars(select(Category).order_by(Category.name)).all()


@router.get("/books", response_model=BookPage)
def books(category_id: int | None = None, q: str | None = None, cursor: str | None = None, limit: int = 20, sort: str = "new", db: Session = Depends(get_db)):
    offset = int(cursor or 0)
    stmt = select(Book)
    if sort == "hot":
        stmt = stmt.order_by(Book.title.desc())
    else:
        stmt = stmt.order_by(Book.id.desc())
    if category_id is not None:
        stmt = stmt.where(Book.category_id == category_id)
    if q and q.strip():
        needle = f"%{q.strip()}%"
        stmt = stmt.where(or_(Book.title.ilike(needle), Book.author.ilike(needle), Book.description.ilike(needle)))
    items = db.scalars(stmt.limit(min(limit, 50) + 1).offset(max(offset, 0))).all()
    has_more = len(items) > min(limit, 50)
    items = items[:min(limit, 50)]
    return {"items": items, "next_cursor": str(offset + len(items)) if has_more else None}


@router.get("/library", response_model=LibraryOut)
def library(db: Session = Depends(get_db)):
    all_books = db.scalars(select(Book).order_by(Book.id.desc())).all()
    return {"recent": all_books[:3], "favorites": [book for book in all_books if book.id in {2, 4, 6}]}


def enqueue_if_needed(chapter: Chapter | None, tasks: BackgroundTasks, db: Session) -> bool:
    if chapter is None or chapter.status == JobStatus.processing:
        return False
    if chapter.text_path and chapter.audio_path and (settings.media_root / chapter.text_path).exists() and (settings.media_root / chapter.audio_path).exists():
        return False
    chapter.status = JobStatus.processing
    chapter.error_message = None
    db.commit()
    tasks.add_task(process_chapter, chapter.id)
    return True


@router.get("/books/{book_id}", response_model=BookDetail)
def book(book_id: int, tasks: BackgroundTasks, db: Session = Depends(get_db)):
    item = db.scalar(select(Book).options(selectinload(Book.chapters)).where(Book.id == book_id))
    if item is None:
        raise HTTPException(404, "Không tìm thấy sách")
    enqueue_if_needed(item.chapters[0] if item.chapters else None, tasks, db)
    return BookDetail(**BookOut.model_validate(item).model_dump(), chapters=[chapter_out(c) for c in item.chapters])


@router.get("/chapters/{chapter_id}", response_model=ChapterOut)
def chapter(chapter_id: int, tasks: BackgroundTasks, db: Session = Depends(get_db)):
    item = db.get(Chapter, chapter_id)
    if item is None:
        raise HTTPException(404, "Không tìm thấy chương")
    enqueue_if_needed(item, tasks, db)
    next_chapter = db.scalar(
        select(Chapter)
        .where(Chapter.book_id == item.book_id, Chapter.position > item.position)
        .order_by(Chapter.position)
        .limit(1)
    )
    enqueue_if_needed(next_chapter, tasks, db)
    return chapter_out(item)


@router.post("/chapters/{chapter_id}/start-listening", response_model=ListenStartOut)
def start_listening(chapter_id: int, tasks: BackgroundTasks, db: Session = Depends(get_db)):
    item = db.get(Chapter, chapter_id)
    if item is None:
        raise HTTPException(404, "Không tìm thấy chương")
    next_chapter = db.scalar(select(Chapter).where(Chapter.book_id == item.book_id, Chapter.position > item.position).order_by(Chapter.position).limit(1))
    current_started = enqueue_if_needed(item, tasks, db)
    next_started = enqueue_if_needed(next_chapter, tasks, db)
    if current_started or next_started:
        status = "generation_started"
    else:
        status = "already_ready"
    return {"chapter_id": item.id, "next_chapter_id": next_chapter.id if next_chapter else None, "status": status}


@router.get("/chapters/{chapter_id}/pdf", response_class=FileResponse)
def chapter_pdf(chapter_id: int, db: Session = Depends(get_db)):
    item = db.get(Chapter, chapter_id)
    if item is None:
        raise HTTPException(404, "Không tìm thấy chương")
    path = settings.media_root / item.pdf_path
    if not path.exists():
        raise HTTPException(404, "Không tìm thấy PDF")
    return FileResponse(path, media_type="application/pdf", filename=f"chapter-{chapter_id}.pdf", content_disposition_type="inline", headers={"Cache-Control": "private, no-store, max-age=0", "X-Content-Type-Options": "nosniff"})


@router.get("/chapters/{chapter_id}/audio", response_class=FileResponse)
def chapter_audio(chapter_id: int, db: Session = Depends(get_db)):
    item = db.get(Chapter, chapter_id)
    if item is None:
        raise HTTPException(404, "Không tìm thấy chương")
    if not item.audio_path:
        raise HTTPException(404, "Audio của chương chưa sẵn sàng")
    path = settings.media_root / item.audio_path
    if not path.exists():
        raise HTTPException(404, "Không tìm thấy audio")
    return FileResponse(path, media_type="audio/wav", filename=f"chapter-{chapter_id}.wav", content_disposition_type="inline", headers={"Cache-Control": "private, no-store, max-age=0", "Accept-Ranges": "bytes", "X-Content-Type-Options": "nosniff"})


@router.get("/voices", response_model=list[VoiceOut])
def voices(db: Session = Depends(get_db)):
    return db.scalars(select(Voice).where(Voice.active.is_(True)).order_by(Voice.name)).all()


@router.post("/admin/chapters/{chapter_id}/extract-text", status_code=202)
def api_extract_text(chapter_id: int, tasks: BackgroundTasks, _: str = Depends(admin_auth), db: Session = Depends(get_db)):
    item = db.get(Chapter, chapter_id)
    if item is None:
        raise HTTPException(404, "Không tìm thấy chương")
    item.status = JobStatus.processing
    db.commit()
    tasks.add_task(extract_chapter_text, chapter_id)
    return {"status": "processing", "operation": "pdf_to_text", "chapter_id": chapter_id}


@router.post("/admin/chapters/{chapter_id}/synthesize", status_code=202)
def api_synthesize(chapter_id: int, payload: SynthesizeRequest, tasks: BackgroundTasks, _: str = Depends(admin_auth), db: Session = Depends(get_db)):
    item = db.get(Chapter, chapter_id)
    voice = db.get(Voice, payload.voice_id)
    if item is None:
        raise HTTPException(404, "Không tìm thấy chương")
    if voice is None or not voice.active:
        raise HTTPException(400, "Giọng đọc không hợp lệ")
    item.voice_id = voice.id
    item.status = JobStatus.processing
    db.commit()
    tasks.add_task(synthesize_chapter_audio, chapter_id, voice.id)
    return {"status": "processing", "operation": "text_to_speech", "chapter_id": chapter_id, "voice_id": voice.id}
