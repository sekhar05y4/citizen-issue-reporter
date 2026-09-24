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


def _perform_login(expected_role=None):
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()
    req_expected_role = data.get('expected_role') or expected_role

    if not email or not password:
        return api_response(False, 'Email and password are required', status_code=400)

    # 1. Search across User (CITIZEN) and AdminUser (ADMIN / OFFICER)
    found_user = None
    user_type = None

    citizen = User.query.filter_by(email=email).first()
    if citizen and citizen.check_password(password):
        found_user = citizen
        user_type = 'CITIZEN'
    else:
        admin_officer = AdminUser.query.filter_by(email=email).first()
        if admin_officer and admin_officer.check_password(password):
            found_user = admin_officer
            user_type = admin_officer.role

    # Check if credentials are valid
    if not found_user:
        return api_response(False, 'Invalid email or password.', status_code=401)

    actual_role = found_user.role

    # 2. Strict Role Verification against portal
    if req_expected_role and req_expected_role.upper() != actual_role.upper():
        return api_response(False, 'These credentials are not authorized for the selected portal.', status_code=403)

    # 3. Create authenticated JWT token
    token_payload = {
        'id': found_user.id,
        'role': actual_role,
        'email': found_user.email,
        'department_id': getattr(found_user, 'department_id', None)
    }
    access_token = create_access_token(identity=token_payload)

    return api_response(True, f'{actual_role.capitalize()} login successful', {
        'access_token': access_token,
        'user': found_user.to_dict()
    })


@auth_bp.route('/login', methods=['POST'])
def login():
    return _perform_login()


@auth_bp.route('/login/citizen', methods=['POST'])
def login_citizen():
    return _perform_login(expected_role='CITIZEN')


@auth_bp.route('/login/officer', methods=['POST'])
def login_officer():
    return _perform_login(expected_role='OFFICER')


@auth_bp.route('/login/admin', methods=['POST'])
def login_admin():
    return _perform_login(expected_role='ADMIN')


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
