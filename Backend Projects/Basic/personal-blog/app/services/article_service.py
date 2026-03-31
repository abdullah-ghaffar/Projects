from datetime import datetime
from app.models.article import Article
from app.repositories.article_repository import ArticleRepository

class ArticleService:
    def __init__(self, repo: ArticleRepository):
        self.repo = repo

    def get_all_articles(self):
        return self.repo.get_all()

    def get_article(self, article_id: int):
        return self.repo.get_by_id(article_id)

    def create_article(self, title: str, content: str, publish_date: datetime):
        article = Article(id=0, title=title, content=content, publish_date=publish_date)
        self.repo.save(article)
        return article

    def update_article(self, article_id: int, title: str, content: str, publish_date: datetime):
        article = self.repo.get_by_id(article_id)
        if not article:
            return None
        article.title = title
        article.content = content
        article.publish_date = publish_date
        self.repo.save(article)
        return article

    def delete_article(self, article_id: int):
        self.repo.delete(article_id)