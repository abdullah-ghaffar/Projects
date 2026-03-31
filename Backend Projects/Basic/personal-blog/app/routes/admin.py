from flask import Blueprint, render_template, redirect, url_for, flash, session, request
from datetime import date
from app.services.article_service import ArticleService
from app.repositories.article_repository import ArticleRepository
from app.config import Config
from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, DateField
from wtforms.validators import DataRequired, ValidationError

admin_bp = Blueprint('admin', __name__)

repo = ArticleRepository("data/articles")
service = ArticleService(repo)

class ArticleForm(FlaskForm):
    title = StringField('Article Title', validators=[DataRequired()])
    publish_date = DateField('Publishing Date', 
                             format='%Y-%m-%d', 
                             validators=[DataRequired()],
                             default=date.today)
    content = TextAreaField('Content', validators=[DataRequired()])

    def validate_publish_date(self, field):
        if field.data is None:
            raise ValidationError("Please select a valid publishing date.")

# ====================== LOGIN ======================
@admin_bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        if (username == Config.ADMIN_USERNAME and password == Config.ADMIN_PASSWORD):
            session['admin_logged_in'] = True
            flash("Login successful!")
            return redirect(url_for('admin.dashboard'))
        flash("Invalid username or password")
    return render_template("login.html")

@admin_bp.before_request
def check_login():
    if request.endpoint != 'admin.login' and not session.get('admin_logged_in'):
        return redirect(url_for('admin.login'))

@admin_bp.route("/logout")
def logout():
    session.pop('admin_logged_in', None)
    flash("Logged out successfully")
    return redirect(url_for('public.home'))

# ====================== DASHBOARD ======================
@admin_bp.route("/dashboard")
def dashboard():
    articles = service.get_all_articles()
    return render_template("admin/dashboard.html", articles=articles)

# ====================== NEW ARTICLE ======================
@admin_bp.route("/new", methods=["GET", "POST"])
def new_article():
    form = ArticleForm()
    if form.validate_on_submit():
        service.create_article(
            title=form.title.data,
            content=form.content.data,
            publish_date=form.publish_date.data
        )
        flash("Article published successfully!")
        return redirect(url_for('admin.dashboard'))
    
    return render_template("admin/new.html", form=form)

# ====================== EDIT ARTICLE ======================
@admin_bp.route("/edit/<int:article_id>", methods=["GET", "POST"])
def edit_article(article_id):
    article = service.get_article(article_id)
    if not article:
        flash("Article not found!")
        return redirect(url_for('admin.dashboard'))

    form = ArticleForm(obj=article)
    
    if form.validate_on_submit():
        service.update_article(
            article_id=article_id,
            title=form.title.data,
            content=form.content.data,
            publish_date=form.publish_date.data
        )
        flash("Article updated successfully!")
        return redirect(url_for('admin.dashboard'))
    
    return render_template("admin/edit.html", form=form, article=article)

# ====================== DELETE ARTICLE ======================
@admin_bp.route("/delete/<int:article_id>", methods=["POST"])
def delete_article(article_id):
    service.delete_article(article_id)
    flash("Article deleted successfully!")
    return redirect(url_for('admin.dashboard'))