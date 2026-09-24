from datetime import datetime
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from app import db
from app.models.models import Complaint, ComplaintStatusHistory, Notification, Department, AdminUser, User, Category, Feedback
from app.utils.helpers import api_response, role_required

admin_bp = Blueprint('admin_bp', __name__)

@admin_bp.route('/dashboard', methods=['GET'])
@role_required('ADMIN', 'OFFICER')
def get_dashboard_stats():
    total_complaints = Complaint.query.count()
    submitted = Complaint.query.filter_by(status='SUBMITTED').count()
    under_review = Complaint.query.filter_by(status='UNDER_REVIEW').count()
    assigned = Complaint.query.filter_by(status='ASSIGNED').count()
    in_progress = Complaint.query.filter_by(status='IN_PROGRESS').count()
    resolved = Complaint.query.filter_by(status='RESOLVED').count()
    closed = Complaint.query.filter_by(status='CLOSED').count()
    rejected = Complaint.query.filter_by(status='REJECTED').count()

    total_citizens = User.query.filter_by(role='CITIZEN').count()
    total_departments = Department.query.filter_by(active=True).count()

    # Category breakdown
    categories = Category.query.filter_by(active=True).all()
    category_stats = []
    for cat in categories:
        cnt = Complaint.query.filter_by(category_id=cat.id).count()
        category_stats.append({
            'id': cat.id,
            'name': cat.name,
            'icon': cat.icon,
            'count': cnt
        })

    # Recent complaints
    recent = Complaint.query.order_by(Complaint.created_at.desc()).limit(6).all()

    return api_response(True, 'Dashboard analytics retrieved', {
        'total_complaints': total_complaints,
        'submitted': submitted,
        'under_review': under_review,
        'assigned': assigned,
        'in_progress': in_progress,
        'resolved': resolved,
        'closed': closed,
        'rejected': rejected,
        'total_citizens': total_citizens,
        'total_departments': total_departments,
        'category_breakdown': category_stats,
        'recent_complaints': [c.to_dict(include_history=False) for c in recent]
    })


@admin_bp.route('/complaints', methods=['GET'])
@role_required('ADMIN', 'OFFICER')
def get_admin_complaints():
    identity = get_jwt_identity()
    role = identity.get('role') if isinstance(identity, dict) else 'ADMIN'
    user_id = identity.get('id') if isinstance(identity, dict) else None
    department_id = identity.get('department_id') if isinstance(identity, dict) else None

    status = request.args.get('status')
    category_id = request.args.get('category_id')
    req_dept_id = request.args.get('department_id')
    priority = request.args.get('priority')
    search = request.args.get('search', '').strip()

    query = Complaint.query

    # If Officer, limit to assigned department or officer
    if role == 'OFFICER':
        if department_id:
            query = query.filter(
                (Complaint.assigned_department_id == department_id) | 
                (Complaint.assigned_officer_id == user_id)
            )
        else:
            if user_id:
                query = query.filter_by(assigned_officer_id=user_id)

    if status and status != 'ALL':
        query = query.filter_by(status=status)
    if category_id and category_id != 'ALL':
        query = query.filter_by(category_id=int(category_id))
    if req_dept_id and req_dept_id != 'ALL' and role == 'ADMIN':
        query = query.filter_by(assigned_department_id=int(req_dept_id))
    if priority and priority != 'ALL':
        query = query.filter_by(priority=priority)
    if search:
        query = query.filter(
            (Complaint.title.ilike(f'%{search}%')) |
            (Complaint.complaint_number.ilike(f'%{search}%')) |
            (Complaint.address.ilike(f'%{search}%'))
        )

    complaints = query.order_by(Complaint.created_at.desc()).all()
    return api_response(True, 'Complaints retrieved', [c.to_dict() for c in complaints])


@admin_bp.route('/complaints/<int:complaint_id>/status', methods=['PUT'])
@role_required('ADMIN', 'OFFICER')
def update_complaint_status(complaint_id):
    complaint = db.session.get(Complaint, complaint_id)
    if not complaint:
        return api_response(False, 'Complaint not found', status_code=404)

    data = request.get_json() or {}
    new_status = data.get('status', '').strip().upper()
    remarks = data.get('remarks', '').strip()
    changed_by = data.get('changed_by', 'Municipal Staff').strip()

    valid_statuses = ['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED']
    if new_status not in valid_statuses:
        return api_response(False, f'Invalid status. Allowed: {valid_statuses}', status_code=400)

    old_status = complaint.status
    complaint.status = new_status
    complaint.updated_at = datetime.utcnow()

    if new_status in ['RESOLVED', 'CLOSED'] and not complaint.resolved_at:
        complaint.resolved_at = datetime.utcnow()

    # Record in history
    history = ComplaintStatusHistory(
        complaint_id=complaint.id,
        status=new_status,
        remarks=remarks if remarks else f'Status transition from {old_status} to {new_status}',
        changed_by=changed_by
    )
    db.session.add(history)

    # Trigger notification for the citizen
    notif_msg = f'Your complaint #{complaint.complaint_number} status changed to {new_status}.'
    if remarks:
        notif_msg += f' Remarks: {remarks}'

    notif = Notification(
        user_id=complaint.user_id,
        complaint_id=complaint.id,
        title=f'Status Update: {new_status}',
        message=notif_msg,
        type='RESOLUTION' if new_status == 'RESOLVED' else 'STATUS_UPDATE'
    )
    db.session.add(notif)
    db.session.commit()

    return api_response(True, f'Status updated to {new_status}', complaint.to_dict())


@admin_bp.route('/complaints/<int:complaint_id>/assign', methods=['PUT'])
@role_required('ADMIN')
def assign_complaint(complaint_id):
    complaint = db.session.get(Complaint, complaint_id)
    if not complaint:
        return api_response(False, 'Complaint not found', status_code=404)

    data = request.get_json() or {}
    department_id = data.get('department_id')
    officer_id = data.get('officer_id')
    priority = data.get('priority')

    if department_id:
        dept = db.session.get(Department, int(department_id))
        if dept:
            complaint.assigned_department_id = dept.id
            if complaint.status == 'SUBMITTED':
                complaint.status = 'ASSIGNED'

    if officer_id:
        officer = db.session.get(AdminUser, int(officer_id))
        if officer:
            complaint.assigned_officer_id = officer.id

    if priority:
        complaint.priority = priority.upper()

    complaint.updated_at = datetime.utcnow()

    history = ComplaintStatusHistory(
        complaint_id=complaint.id,
        status=complaint.status,
        remarks=f'Assigned to department: {complaint.department.name if complaint.department else "General"}',
        changed_by='Admin Desk'
    )
    db.session.add(history)
    db.session.commit()

    return api_response(True, 'Assignment updated successfully', complaint.to_dict())


@admin_bp.route('/users', methods=['GET'])
@role_required('ADMIN')
def get_users():
    citizens = User.query.order_by(User.created_at.desc()).all()
    return api_response(True, 'Citizens list', [u.to_dict() for u in citizens])


@admin_bp.route('/departments', methods=['GET'])
@role_required('ADMIN', 'OFFICER')
def get_departments():
    depts = Department.query.all()
    return api_response(True, 'Departments list', [d.to_dict() for d in depts])


@admin_bp.route('/departments', methods=['POST'])
@role_required('ADMIN')
def create_department():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    description = data.get('description', '').strip()

    if not name:
        return api_response(False, 'Department name is required', status_code=400)

    dept = Department(name=name, description=description, active=True)
    db.session.add(dept)
    db.session.commit()
    return api_response(True, 'Department created', dept.to_dict(), status_code=201)


@admin_bp.route('/officers', methods=['GET'])
@role_required('ADMIN')
def get_officers():
    officers = AdminUser.query.all()
    return api_response(True, 'Staff & officers list', [o.to_dict() for o in officers])
