import os
from datetime import datetime
from flask import Blueprint, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from app import db
from app.models.models import Complaint, ComplaintStatusHistory, Notification, Category, User, AdminUser
from app.utils.helpers import api_response, save_uploaded_file, generate_complaint_number

complaint_bp = Blueprint('complaint_bp', __name__)

@complaint_bp.route('', methods=['POST'])
def create_complaint():
    # Authenticated user or default demo citizen
    user_id = 1
    user_role = 'CITIZEN'
    try:
        verify_jwt_in_request(optional=True)
        identity = get_jwt_identity()
        if identity and isinstance(identity, dict) and 'id' in identity:
            user_id = identity['id']
            user_role = identity.get('role', 'CITIZEN')
    except Exception:
        pass

    # Ensure user exists
    user = db.session.get(User, user_id)
    if not user:
        user = User.query.filter_by(email='citizen@demo.local').first()
        if user:
            user_id = user.id

    # Handle multipart/form-data or JSON
    if request.is_json:
        data = request.get_json() or {}
        image_filename = None
    else:
        data = request.form.to_dict()
        image_file = request.files.get('image')
        image_filename = save_uploaded_file(image_file, current_app.config['UPLOAD_FOLDER']) if image_file else None

    category_id = data.get('category_id')
    title = data.get('title', '').strip()
    description = data.get('description', '').strip()
    address = data.get('address', '').strip()
    priority = data.get('priority', 'MEDIUM').upper()

    lat = float(data.get('latitude')) if data.get('latitude') else None
    lng = float(data.get('longitude')) if data.get('longitude') else None

    if not title or not description or not category_id:
        return api_response(False, 'Title, description, and category are required', status_code=400)

    category = db.session.get(Category, int(category_id))
    if not category:
        return api_response(False, 'Invalid category selected', status_code=400)

    complaint_no = generate_complaint_number(db.session, Complaint)

    complaint = Complaint(
        complaint_number=complaint_no,
        user_id=user_id,
        category_id=category.id,
        title=title,
        description=description,
        latitude=lat,
        longitude=lng,
        address=address if address else 'Location captured via GPS',
        image_path=image_filename,
        priority=priority,
        status='SUBMITTED'
    )
    db.session.add(complaint)
    db.session.flush()

    # Log initial status history
    history = ComplaintStatusHistory(
        complaint_id=complaint.id,
        status='SUBMITTED',
        remarks='Grievance reported by citizen',
        changed_by='Citizen'
    )
    db.session.add(history)

    # Generate acknowledgement notification
    notif = Notification(
        user_id=user_id,
        complaint_id=complaint.id,
        title='Grievance Registered',
        message=f'Your issue #{complaint_no} ({title}) has been submitted and queued for departmental triage.',
        type='SUBMITTED'
    )
    db.session.add(notif)
    db.session.commit()

    return api_response(True, 'Grievance submitted successfully', complaint.to_dict(), status_code=201)


@complaint_bp.route('', methods=['GET'])
def get_complaints():
    user_id = None
    role = 'CITIZEN'
    department_id = None

    try:
        verify_jwt_in_request(optional=True)
        identity = get_jwt_identity()
        if identity and isinstance(identity, dict):
            user_id = identity.get('id')
            role = identity.get('role', 'CITIZEN')
            department_id = identity.get('department_id')
    except Exception:
        pass

    if role == 'ADMIN':
        # Admin has full system visibility
        complaints = Complaint.query.order_by(Complaint.created_at.desc()).all()
    elif role == 'OFFICER':
        # Officer sees complaints assigned to their department or assigned to them directly
        query = Complaint.query
        if department_id:
            query = query.filter(
                (Complaint.assigned_department_id == department_id) | 
                (Complaint.assigned_officer_id == user_id)
            )
        else:
            if user_id:
                query = query.filter_by(assigned_officer_id=user_id)
        complaints = query.order_by(Complaint.created_at.desc()).all()
    else:
        # Citizen only sees their own complaints
        target_uid = user_id if user_id else 1
        complaints = Complaint.query.filter_by(user_id=target_uid).order_by(Complaint.created_at.desc()).all()

    return api_response(True, 'Complaints retrieved', [c.to_dict() for c in complaints])


@complaint_bp.route('/<int:complaint_id>', methods=['GET'])
def get_complaint_detail(complaint_id):
    complaint = db.session.get(Complaint, complaint_id)
    if not complaint:
        return api_response(False, 'Complaint not found', status_code=404)

    # Verify authorization
    try:
        verify_jwt_in_request(optional=True)
        identity = get_jwt_identity()
        if identity and isinstance(identity, dict):
            role = identity.get('role')
            user_id = identity.get('id')
            department_id = identity.get('department_id')

            # Citizen can only view their own complaint
            if role == 'CITIZEN' and complaint.user_id != user_id:
                return api_response(False, 'Unauthorized: You can only view your own complaints', status_code=403)
            
            # Officer can view assigned complaints or complaints in their department
            if role == 'OFFICER':
                if department_id and complaint.assigned_department_id and complaint.assigned_department_id != department_id and complaint.assigned_officer_id != user_id:
                    # check department mismatch
                    pass
    except Exception:
        pass

    return api_response(True, 'Complaint details retrieved', complaint.to_dict())


@complaint_bp.route('/<int:complaint_id>/history', methods=['GET'])
def get_complaint_history(complaint_id):
    complaint = db.session.get(Complaint, complaint_id)
    if not complaint:
        return api_response(False, 'Complaint not found', status_code=404)

    history = ComplaintStatusHistory.query.filter_by(complaint_id=complaint_id).order_by(ComplaintStatusHistory.created_at.asc()).all()
    return api_response(True, 'Status history retrieved', [h.to_dict() for h in history])


@complaint_bp.route('/<int:complaint_id>', methods=['DELETE'])
@jwt_required()
def delete_complaint(complaint_id):
    identity = get_jwt_identity()
    if not isinstance(identity, dict) or identity.get('role') != 'ADMIN':
        return api_response(False, 'Unauthorized: Admin privilege required', status_code=403)

    complaint = db.session.get(Complaint, complaint_id)
    if not complaint:
        return api_response(False, 'Complaint not found', status_code=404)

    db.session.delete(complaint)
    db.session.commit()
    return api_response(True, 'Complaint deleted successfully')
