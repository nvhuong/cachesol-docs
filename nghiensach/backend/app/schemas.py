from pydantic import BaseModel, ConfigDict

from .models import JobStatus


class APIModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class CategoryOut(APIModel):
    id: int
    parent_id: int | None
    name: str
    description: str


class BookOut(APIModel):
    id: int
    category_id: int
    title: str
    author: str
    description: str
    cover_url: str | None


class ChapterOut(APIModel):
    id: int
    book_id: int
    title: str
    position: int
    status: JobStatus
    text: str
    pdf_url: str
    text_url: str | None
    audio_url: str | None
    error_message: str | None
    voice_id: int | None


class VoiceOut(APIModel):
    id: int
    name: str
    provider_key: str
    description: str
    region: str
    gender: str
    active: bool


class SynthesizeRequest(BaseModel):
    voice_id: int


class BookDetail(BookOut):
    chapters: list[ChapterOut]


class BookPage(APIModel):
    items: list[BookOut]
    next_cursor: str | None


class LibraryOut(BaseModel):
    recent: list[BookOut]
    favorites: list[BookOut]


class ListenStartOut(BaseModel):
    chapter_id: int
    next_chapter_id: int | None
    status: str
