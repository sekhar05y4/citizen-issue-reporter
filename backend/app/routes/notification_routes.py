from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from app import db
from app.models.models import Notification
from app.utils.helpers import api_response

notification_bp = Blueprint('notification_bp', __name__)

@notification_bp.route('', methods=['GET'])
def get_notifications():
    user_id = 1
    try:
        verify_jwt_in_request(optional=True)
        identity = get_jwt_identity()
        if identity and 'id' in identity:
            user_id = identity['id']
    except Exception:
        pass

    notifications = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).all()
    return api_response(True, 'Notifications retrieved', [n.to_dict() for n in notifications])


@notification_bp.route('/<int:notif_id>/read', methods=['PUT'])
def mark_read(notif_id):
    notif = db.session.get(Notification, notif_id)
    if not notif:
        return api_response(False, 'Notification not found', status_code=404)
    notif.is_read = True
    db.session.commit()
    return api_response(True, 'Notification marked as read', notif.to_dict())


@notification_bp.route('/read-all', methods=['PUT'])
def mark_all_read():
    user_id = 1
    try:
        verify_jwt_in_request(optional=True)
        identity = get_jwt_identity()
        if identity and 'id' in identity:
            user_id = identity['id']
    except Exception:
        pass

    Notification.query.filter_by(user_id=user_id, is_read=False).update({'is_read': True})
    db.session.commit()
    return api_response(True, 'All notifications marked as read')
