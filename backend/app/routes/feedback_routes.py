from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from app import db
from app.models.models import Feedback, Complaint
from app.utils.helpers import api_response

feedback_bp = Blueprint('feedback_bp', __name__)

@feedback_bp.route('/complaints/<int:complaint_id>/feedback', methods=['POST'])
def submit_feedback(complaint_id):
    user_id = 1
    try:
        verify_jwt_in_request(optional=True)
        identity = get_jwt_identity()
        if identity and 'id' in identity:
            user_id = identity['id']
    except Exception:
        pass

    complaint = db.session.get(Complaint, complaint_id)
    if not complaint:
        return api_response(False, 'Complaint not found', status_code=404)

    # Check for existing feedback
    existing = Feedback.query.filter_by(complaint_id=complaint_id).first()
    if existing:
        return api_response(False, 'Feedback has already been submitted for this complaint', status_code=409)

    data = request.get_json() or {}
    rating = data.get('rating', 5)
    comment = data.get('comment', '').strip()

    if not isinstance(rating, int) or rating < 1 or rating > 5:
        return api_response(False, 'Rating must be an integer between 1 and 5', status_code=400)

    fb = Feedback(complaint_id=complaint_id, user_id=user_id, rating=rating, comment=comment)
    db.session.add(fb)
    db.session.commit()

    return api_response(True, 'Feedback submitted successfully', fb.to_dict(), status_code=201)


@feedback_bp.route('/feedback', methods=['GET'])
def get_all_feedback():
    feedbacks = Feedback.query.order_by(Feedback.created_at.desc()).all()
    return api_response(True, 'Feedback list retrieved', [f.to_dict() for f in feedbacks])
