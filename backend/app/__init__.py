from flask import Flask
from flask_cors import CORS
from config import config
import os


def create_app(config_name=None):
    """Application factory for creating Flask app."""
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'default')

    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # Enable CORS for frontend
    CORS(app, origins=['http://localhost:3000', 'http://localhost:5173'])

    # Register blueprints
    from app.routes import stocks_bp, health_bp, crypto_bp
    app.register_blueprint(stocks_bp, url_prefix='/api/stocks')
    app.register_blueprint(health_bp, url_prefix='/api')
    app.register_blueprint(crypto_bp, url_prefix='/api/crypto')

    return app
