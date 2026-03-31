from flask import Flask # type: ignore
from dotenv import load_dotenv
import os

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['ARTICLES_DIR'] = os.path.join(os.path.dirname(__file__), '..', 'data', 'articles')
    
    os.makedirs(app.config['ARTICLES_DIR'], exist_ok=True)

    from app.routes.public import public_bp
    from app.routes.admin import admin_bp
    
    app.register_blueprint(public_bp)
    app.register_blueprint(admin_bp, url_prefix='/admin')
    
    return app