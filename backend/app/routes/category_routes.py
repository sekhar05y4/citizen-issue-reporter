from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.models import Category
from app.utils.helpers import api_response

category_bp = Blueprint('category_bp', __name__)

@category_bp.route('', methods=['GET'])
def get_categories():
    categories = Category.query.filter_by(active=True).all()
    return api_response(True, 'Categories retrieved', [c.to_dict() for c in categories])


@category_bp.route('', methods=['POST'])
@jwt_required()
def create_category():
    identity = get_jwt_identity()
    if identity.get('role') != 'ADMIN':
        return api_response(False, 'Unauthorized: Admin privilege required', status_code=403)

    data = request.get_json() or {}
    name = data.get('name', '').strip()
    description = data.get('description', '').strip()
    icon = data.get('icon', 'other').strip()

    if not name:
        return api_response(False, 'Category name is required', status_code=400)

    if Category.query.filter_by(name=name).first():
        return api_response(False, 'Category already exists', status_code=409)

    cat = Category(name=name, description=description, icon=icon, active=True)
    db.session.add(cat)
    db.session.commit()
    return api_response(True, 'Category created successfully', cat.to_dict(), status_code=201)
