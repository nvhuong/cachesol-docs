from pathlib import Path
from textwrap import wrap

from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from sqlalchemy import select
from sqlalchemy.orm import Session

from .config import settings
from .models import Book, Category, Chapter, Voice


MOCK_BOOK_TITLE = "Hành trình qua miền xanh"
MOCK_CHAPTERS = [
    (
        "Khởi hành",
        "Buổi sáng, An rời thành phố với một chiếc ba lô nhỏ và cuốn sổ tay. "
        "Cậu muốn tìm hiểu những cánh rừng đã nuôi dưỡng dòng sông quê mình. "
        "Chuyến xe dừng bên con đường đất đỏ, nơi mùi cỏ mới và tiếng chim mở ra một thế giới hoàn toàn khác. "
        "An ghi dòng đầu tiên: Mọi hành trình lớn đều bắt đầu bằng một bước chân bình dị.",
    ),
    (
        "Khu rừng biết kể chuyện",
        "Người kiểm lâm dẫn An đi qua những thân cây cổ thụ. Mỗi vòng gỗ lưu lại một mùa mưa, một mùa nắng và cả dấu vết của những lần cháy rừng. "
        "An hiểu rằng khu rừng không im lặng; nó kể chuyện bằng lá, bằng đất và bằng dòng nước chảy dưới những tầng rễ sâu. "
        "Cậu bắt đầu thu âm âm thanh thiên nhiên để chia sẻ với bạn bè.",
    ),
    (
        "Trở về và gieo hạt",
        "Sau nhiều ngày, An trở về trường với đầy những câu chuyện trong sổ. Cậu cùng các bạn lập một góc đọc sách về thiên nhiên và trồng những cây bản địa trong sân. "
        "Họ nhận ra bảo vệ môi trường không nhất thiết bắt đầu bằng điều phi thường. Một hạt giống, một trang sách và một hành động đúng mỗi ngày cũng có thể tạo nên thay đổi.",
    ),
]

MOCK_BOOKS = [
    {
        "title": "Một ngày sống chậm",
        "category": "Phát triển bản thân",
        "author": "Linh Chi",
        "description": "Những bài thực hành nhỏ giúp ta sống tỉnh thức, nhẹ nhàng và có chủ đích hơn mỗi ngày.",
        "cover_url": "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=800&q=80",
        "chapters": ["Bắt đầu từ hơi thở", "Dọn lại tâm trí", "Niềm vui giản dị"],
    },
    {
        "title": "Những mùa hoa trên phố",
        "category": "Văn học Việt Nam",
        "author": "Mai An",
        "description": "Tản văn dịu dàng về ký ức, thành phố và những người khiến ta luôn muốn trở về.",
        "cover_url": "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80",
        "chapters": ["Tháng ba có mùi nắng", "Quán quen cuối phố", "Một lời chào mùa cũ"],
    },
    {
        "title": "Bản đồ của những vì sao",
        "category": "Khoa học & khám phá",
        "author": "Đỗ Minh",
        "description": "Chuyến du hành dễ hiểu qua vũ trụ, từ những ngôi sao đầu tiên đến câu hỏi về sự sống.",
        "cover_url": "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80",
        "chapters": ["Đêm đầu tiên nhìn lên trời", "Những mặt trời xa xôi", "Đi tìm dấu vết sự sống"],
    },
    {
        "title": "Bếp nhà có nắng",
        "category": "Gia đình & đời sống",
        "author": "Hạ Vy",
        "description": "Câu chuyện ấm áp về những bữa cơm nhà, ký ức gia đình và cách yêu thương được trao đi.",
        "cover_url": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
        "chapters": ["Mùi cơm mới", "Công thức của mẹ", "Bữa cơm đoàn viên"],
    },
]


def _create_pdf(path: Path, title: str, body: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    font_name = "Helvetica"
    font_path = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
    if font_path.exists():
        font_name = "DejaVuSans"
        if font_name not in pdfmetrics.getRegisteredFontNames():
            pdfmetrics.registerFont(TTFont(font_name, str(font_path)))
    pdf = canvas.Canvas(str(path))
    pdf.setTitle(title)
    pdf.setFont(font_name, 18)
    pdf.drawString(60, 780, title)
    text = pdf.beginText(60, 735)
    text.setFont(font_name, 12)
    text.setLeading(20)
    for paragraph in body.split("\n"):
        for line in wrap(paragraph, width=78):
            text.textLine(line)
        text.textLine("")
    pdf.drawText(text)
    pdf.save()


def seed_mock_data(db: Session) -> None:
    voice_presets = [
        ("Phạm Tuyên", "Phạm Tuyên", "Bắc", "Nam", "Giọng kể chuyện ấm và rõ", True),
        ("Minh Đức", "Minh Đức", "Bắc", "Nam", "Giọng nam tự nhiên", False),
        ("Quang Sơn", "Quang Sơn", "Trung", "Nam", "Giọng miền Trung truyền cảm", False),
        ("Ngọc Trân", "Ngọc Trân", "Trung", "Nữ", "Giọng nữ miền Trung nhẹ nhàng", False),
    ]
    default_voice = None
    for name, provider_key, region, gender, description, is_default in voice_presets:
        voice = db.scalar(select(Voice).where(Voice.provider_key == provider_key))
        if voice is None:
            voice = Voice(name=name, provider_key=provider_key, region=region, gender=gender, description=description, is_default=is_default)
            db.add(voice)
            db.flush()
        if is_default:
            default_voice = voice
    db.commit()
    category_descriptions = {
        "Truyện truyền cảm hứng": "Những câu chuyện tích cực dành cho mọi lứa tuổi.",
        "Tiểu thuyết": "Những câu chuyện dài để đắm mình trong nhiều thế giới khác nhau.",
        "Phát triển bản thân": "Sách giúp xây dựng thói quen tốt và một đời sống cân bằng.",
        "Văn học Việt Nam": "Tản văn, truyện ngắn và những lát cắt thân thuộc của đời sống Việt.",
        "Khoa học & khám phá": "Những câu hỏi lớn được kể lại bằng ngôn ngữ gần gũi.",
        "Gia đình & đời sống": "Các câu chuyện ấm áp về con người, gia đình và căn nhà nhỏ.",
    }
    parent_names = {"Văn học": "Văn học và truyện kể", "Đời sống": "Kỹ năng, gia đình và những thói quen tốt", "Khám phá": "Khoa học, thiên nhiên và thế giới quanh ta"}
    parents: dict[str, Category] = {}
    for name, description in parent_names.items():
        parent = db.scalar(select(Category).where(Category.name == name))
        if parent is None:
            parent = Category(name=name, description=description)
            db.add(parent)
            db.flush()
        parents[name] = parent
    categories: dict[str, Category] = {}
    for name, description in category_descriptions.items():
        category = db.scalar(select(Category).where(Category.name == name))
        if category is None:
            parent_name = "Văn học" if name in {"Văn học Việt Nam", "Truyện truyền cảm hứng", "Tiểu thuyết"} else "Khám phá" if name == "Khoa học & khám phá" else "Đời sống"
            category = Category(name=name, description=description, parent_id=parents[parent_name].id)
            db.add(category)
            db.flush()
        elif category.parent_id is None:
            parent_name = "Văn học" if name in {"Văn học Việt Nam", "Truyện truyền cảm hứng", "Tiểu thuyết"} else "Khám phá" if name == "Khoa học & khám phá" else "Đời sống"
            category.parent_id = parents[parent_name].id
        categories[name] = category

    def create_book(title: str, category: Category, author: str, description: str, cover_url: str, chapter_titles: list[str], body_prefix: str) -> None:
        if db.scalar(select(Book).where(Book.title == title)) is not None:
            return
        book = Book(category_id=category.id, title=title, author=author, description=description, cover_url=cover_url)
        db.add(book)
        db.flush()
        for position, chapter_title in enumerate(chapter_titles, start=1):
            body = f"{body_prefix} {chapter_title}. Đây là nội dung mẫu để trải nghiệm quy trình đọc PDF, trích xuất văn bản và nghe sách nói trong ứng dụng Nghiện Sách."
            relative = Path("uploads") / f"mock-{book.id}-chapter-{position}.pdf"
            _create_pdf(settings.media_root / relative, chapter_title, body)
            db.add(Chapter(book_id=book.id, title=chapter_title, position=position, pdf_path=str(relative), voice_id=default_voice.id if default_voice else None))

    create_book(MOCK_BOOK_TITLE, categories["Truyện truyền cảm hứng"], "Nghiện Sách Studio", "Một truyện mẫu ba chương về thiên nhiên, việc đọc và những thay đổi nhỏ tạo nên giá trị lớn.", "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80", [title for title, _ in MOCK_CHAPTERS], "Một hành trình xanh bắt đầu từ một bước chân bình dị.")
    for item in MOCK_BOOKS:
        create_book(item["title"], categories[item["category"]], item["author"], item["description"], item["cover_url"], item["chapters"], item["description"])
    db.commit()
