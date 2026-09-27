from __future__ import annotations

import re
import logging
import threading
import wave
from pathlib import Path

import numpy as np
import soundfile as sf
from pypdf import PdfReader

from .config import settings
from .database import SessionLocal
from .models import Chapter, JobStatus, Voice

logger = logging.getLogger(__name__)
TTS_LOCK = threading.Lock()


def extract_pdf_text(path: Path) -> str:
    reader = PdfReader(path)
    pages = [(page.extract_text() or "").strip() for page in reader.pages]
    text = "\n\n".join(page for page in pages if page)
    return re.sub(r"[ \t]+", " ", text).strip()


def split_text(text: str, max_chars: int = 900) -> list[str]:
    paragraphs = [p.strip() for p in re.split(r"\n{2,}", text) if p.strip()]
    chunks: list[str] = []
    for paragraph in paragraphs:
        sentences = re.split(r"(?<=[.!?…])\s+", paragraph)
        current = ""
        for sentence in sentences:
            if len(sentence) > max_chars:
                if current:
                    chunks.append(current)
                    current = ""
                chunks.extend(sentence[i:i + max_chars] for i in range(0, len(sentence), max_chars))
                continue
            if len(current) + len(sentence) + 1 <= max_chars:
                current = f"{current} {sentence}".strip()
            else:
                if current:
                    chunks.append(current)
                current = sentence
        if current:
            chunks.append(current)
    return chunks


def _mock_wav(output: Path, seconds: int = 1) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(output), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(48_000)
        wav.writeframes(b"\x00\x00" * 48_000 * seconds)


def synthesize(text: str, output: Path, voice_name: str | None = None) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    if settings.tts_mock:
        _mock_wav(output)
        return
    from vieneu import Vieneu

    tts = Vieneu(mode="v3turbo", backend=settings.tts_backend)
    pieces = []
    for chunk in split_text(text):
        audio = tts.infer(chunk, voice=voice_name or settings.tts_voice)
        pieces.append(np.asarray(audio, dtype=np.float32))
        pieces.append(np.zeros(14_400, dtype=np.float32))
    if not pieces:
        raise ValueError("PDF không chứa văn bản có thể đọc")
    sf.write(output, np.concatenate(pieces), 48_000)


def _save_extracted_text(db, chapter: Chapter) -> str:
    if chapter.text_path and (settings.media_root / chapter.text_path).exists():
        return (settings.media_root / chapter.text_path).read_text(encoding="utf-8")
    text = extract_pdf_text(settings.media_root / chapter.pdf_path)
    if not text:
        raise ValueError("Không trích xuất được chữ; PDF có thể là bản scan và cần OCR")
    text_rel = Path("texts") / f"chapter-{chapter.id}.txt"
    text_file = settings.media_root / text_rel
    text_file.parent.mkdir(parents=True, exist_ok=True)
    text_file.write_text(text, encoding="utf-8")
    chapter.text_path = str(text_rel)
    chapter.extracted_text = text
    db.commit()
    return text


def extract_chapter_text(chapter_id: int) -> None:
    with SessionLocal() as db:
        chapter = db.get(Chapter, chapter_id)
        if chapter is None:
            return
        chapter.status = JobStatus.processing
        chapter.error_message = None
        db.commit()
        try:
            _save_extracted_text(db, chapter)
            chapter.status = JobStatus.completed if chapter.audio_path else JobStatus.pending
        except Exception as exc:
            chapter.status = JobStatus.failed
            chapter.error_message = str(exc)[:2000]
        db.commit()


def synthesize_chapter_audio(chapter_id: int, voice_id: int | None = None) -> None:
    with SessionLocal() as db:
        chapter = db.get(Chapter, chapter_id)
        if chapter is None:
            return
        if chapter.audio_path and (settings.media_root / chapter.audio_path).exists():
            chapter.status = JobStatus.completed
            db.commit()
            logger.info("TTS skip chapter=%s: audio already exists", chapter_id)
            return
        chapter.status = JobStatus.processing
        chapter.error_message = None
        if voice_id is not None:
            chapter.voice_id = voice_id
        db.commit()
        try:
            # VieNeu loads a large ONNX model and is not safe to run concurrently.
            # All requests share this process-wide queue so bursts of triggers run
            # one job at a time instead of leaving chapters stuck in processing.
            with TTS_LOCK:
                logger.info("TTS start chapter=%s", chapter_id)
                text = _save_extracted_text(db, chapter)
                voice = db.get(Voice, chapter.voice_id) if chapter.voice_id else db.query(Voice).filter(Voice.is_default.is_(True), Voice.active.is_(True)).first()
                voice_name = voice.provider_key if voice else settings.tts_voice
                audio_rel = Path("audio") / f"chapter-{chapter.id}.wav"
                synthesize(text, settings.media_root / audio_rel, voice_name)
                chapter.audio_path = str(audio_rel)
                chapter.extracted_text = text
                chapter.status = JobStatus.completed
                logger.info("TTS completed chapter=%s file=%s", chapter_id, settings.media_root / audio_rel)
        except Exception as exc:
            chapter.status = JobStatus.failed
            chapter.error_message = str(exc)[:2000]
            logger.exception("TTS failed chapter=%s", chapter_id)
        db.commit()


def process_chapter(chapter_id: int) -> None:
    synthesize_chapter_audio(chapter_id)
