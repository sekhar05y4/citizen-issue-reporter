import os
import uuid
from functools import wraps
from werkzeug.utils import secure_filename
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_uploaded_file(file_storage, upload_folder):
    if not file_storage or file_storage.filename == '':
        return None
    if not allowed_file(file_storage.filename):
        return None
    
    ext = file_storage.filename.rsplit('.', 1)[1].lower()
    unique_filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(upload_folder, unique_filename)
    file_storage.save(filepath)
    return unique_filename

def generate_complaint_number(db_session, complaint_model):
    from datetime import datetime
    year = datetime.utcnow().year
    count = db_session.query(complaint_model).count() + 1
    return f"CMP-{year}-{count:06d}"

def api_response(success=True, message="", data=None, errors=None, status_code=200):
    payload = {
        'success': success,
        'message': message,
        'data': data if data is not None else ({} if success else None),
    }
    if errors is not None:
        payload['errors'] = errors
    return jsonify(payload), status_code

def role_required(*allowed_roles):
    """
    Decorator to enforce JWT authentication and check that the user's role
    matches one of the allowed roles.
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            try:
                verify_jwt_in_request()
            except Exception:
                return api_response(False, "Authentication token required or expired", status_code=401)
            
            identity = get_jwt_identity()
            user_role = identity.get('role') if isinstance(identity, dict) else None
            
            if not user_role or user_role not in allowed_roles:
                return api_response(False, "Unauthorized: Insufficient role permissions", status_code=403)
            
            return fn(*args, **kwargs)
        return wrapper
    return decorator
