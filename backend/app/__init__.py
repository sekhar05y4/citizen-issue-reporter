import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from .config.config import Config

db = SQLAlchemy()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_class)

    # Ensure directories
    os.makedirs(app.instance_path, exist_ok=True)
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    db.init_app(app)
    jwt.init_app(app)

    # Register Blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.category_routes import category_bp
    from app.routes.complaint_routes import complaint_bp
    from app.routes.notification_routes import notification_bp
    from app.routes.feedback_routes import feedback_bp
    from app.routes.admin_routes import admin_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(category_bp, url_prefix='/api/categories')
    app.register_blueprint(complaint_bp, url_prefix='/api/complaints')
    app.register_blueprint(notification_bp, url_prefix='/api/notifications')
    app.register_blueprint(feedback_bp, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    # Serve static uploaded photos
    @app.route('/uploads/<filename>')
    def serve_uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return {
            'success': True,
            'message': 'Citizen Issue Reporter API is operating nominally',
            'data': {'status': 'healthy', 'version': '1.0.0'}
        }, 200

    # Auto-create tables & seed data in app context
    with app.app_context():
        db.create_all()
        from app.database.seeder import seed_database
        seed_database()

    return app
