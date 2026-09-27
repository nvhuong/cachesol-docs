from app.services import split_text


def test_split_text_keeps_content_and_limits_chunks():
    text = "Câu đầu tiên. " * 100
    chunks = split_text(text, max_chars=120)
    assert len(chunks) > 1
    assert all(len(chunk) <= 120 for chunk in chunks)
    assert "Câu đầu tiên." in chunks[0]


def test_split_empty_text():
    assert split_text("") == []
