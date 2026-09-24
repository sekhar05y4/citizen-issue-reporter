import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'citizen-issue-secret-key-2026-demo')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'citizen-issue-jwt-secret-key-2026')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URI', 'sqlite:///citizen_issue_reporter.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max
