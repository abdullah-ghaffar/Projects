from flask import Blueprint, render_template, abort
from app.services.article_service import ArticleService
from app.repositories.article_repository import ArticleRepository
from app import create_app  # for config

public_bp = Blueprint('public', __name__)

repo = ArticleRepository("data/articles")
service = ArticleService(repo)

@public_bp.route("/")
@public_bp.route("/home")
def home():
    articles = service.get_all_articles()
    return render_template("home.html", articles=articles)

@public_bp.route("/article/<int:article_id>")
def article(article_id):
    article = service.get_article(article_id)
    if not article:
        abort(404)
    return render_template("article.html", article=article)