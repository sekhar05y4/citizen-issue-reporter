from flask import Blueprint, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models.models import User, AdminUser
from app.utils.helpers import api_response

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    phone = data.get('phone', '').strip()
    password = data.get('password', '').strip()

    if not name or not email or not password:
        return api_response(False, 'Name, email, and password are required', status_code=400)

    if User.query.filter_by(email=email).first() or AdminUser.query.filter_by(email=email).first():
        return api_response(False, 'An account with this email already exists', status_code=409)

    user = User(name=name, email=email, phone=phone, role='CITIZEN')
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity={'id': user.id, 'role': user.role, 'email': user.email})
    return api_response(True, 'Account registered successfully', {
        'access_token': access_token,
        'user': user.to_dict()
    }, status_code=201)


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()

    if not email or not password:
        return api_response(False, 'Email and password are required', status_code=400)

    # 1. Check Citizen User
    citizen = User.query.filter_by(email=email).first()
    if citizen and citizen.check_password(password):
        access_token = create_access_token(identity={'id': citizen.id, 'role': citizen.role, 'email': citizen.email})
        return api_response(True, 'Login successful', {
            'access_token': access_token,
            'user': citizen.to_dict()
        })

    # 2. Check Admin / Officer User
    admin = AdminUser.query.filter_by(email=email).first()
    if admin and admin.check_password(password):
        access_token = create_access_token(identity={'id': admin.id, 'role': admin.role, 'email': admin.email})
        return api_response(True, 'Staff login successful', {
            'access_token': access_token,
            'user': admin.to_dict()
        })

    return api_response(False, 'Invalid email or password', status_code=401)


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_identity = get_jwt_identity()
    user_id = current_identity.get('id')
    role = current_identity.get('role')

    if role in ['ADMIN', 'OFFICER']:
        admin = db.session.get(AdminUser, user_id)
        if not admin:
            return api_response(False, 'User not found', status_code=404)
        return api_response(True, 'Current staff profile', admin.to_dict())

    citizen = db.session.get(User, user_id)
    if not citizen:
        return api_response(False, 'User not found', status_code=404)
    return api_response(True, 'Current citizen profile', citizen.to_dict())


@auth_bp.route('/logout', methods=['POST'])
def logout():
    return api_response(True, 'Logged out successfully')
