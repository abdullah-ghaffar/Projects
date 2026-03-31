import json
from pathlib import Path
from datetime import datetime
from typing import Optional
from app.models.article import Article

class ArticleRepository:
    def __init__(self, articles_dir: str):
        self.articles_dir = Path(articles_dir)
        self.articles_dir.mkdir(parents=True, exist_ok=True)

    def _get_next_id(self) -> int:
        files = list(self.articles_dir.glob("*.json"))
        if not files:
            return 1
        ids = [int(f.stem) for f in files if f.stem.isdigit()]
        return max(ids) + 1 if ids else 1

    def save(self, article: Article):
        if article.id == 0:
            article.id = self._get_next_id()
        file_path = self.articles_dir / f"{article.id}.json"
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(article.to_dict(), f, ensure_ascii=False, indent=2)

    def get_all(self) -> list[Article]:
        articles = []
        for file in self.articles_dir.glob("*.json"):
            try:
                with open(file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    articles.append(Article.from_dict(data))
            except:
                continue
        return sorted(articles, key=lambda a: a.publish_date, reverse=True)

    def get_by_id(self, article_id: int) -> Optional[Article]:
        file_path = self.articles_dir / f"{article_id}.json"
        if not file_path.exists():
            return None
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            return Article.from_dict(data)

    def delete(self, article_id: int):
        file_path = self.articles_dir / f"{article_id}.json"
        if file_path.exists():
            file_path.unlink()