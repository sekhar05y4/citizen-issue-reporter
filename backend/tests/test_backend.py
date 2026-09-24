import pytest
from app import create_app, db
from app.models.models import User, AdminUser, Complaint, Category, Department

class TestConfig:
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'test-secret'
    JWT_SECRET_KEY = 'test-jwt-secret-key-that-is-at-least-32-bytes-long!'
    UPLOAD_FOLDER = 'tests_uploads'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024

@pytest.fixture
def app():
    app = create_app(TestConfig)
    yield app

@pytest.fixture
def client(app):
    return app.test_client()

def test_health_check(client):
    res = client.get('/api/health')
    assert res.status_code == 200
    data = res.get_json()
    assert data['success'] is True

def test_categories_endpoint(client):
    res = client.get('/api/categories')
    assert res.status_code == 200
    data = res.get_json()
    assert data['success'] is True
    assert len(data['data']) > 0

def test_user_registration_and_login(client):
    # Register
    res = client.post('/api/auth/register', json={
        'name': 'Test Citizen',
        'email': 'newcitizen@example.com',
        'phone': '1234567890',
        'password': 'Password123!'
    })
    assert res.status_code == 201
    data = res.get_json()
    assert data['success'] is True
    assert 'access_token' in data['data']

    # Login
    res_login = client.post('/api/auth/login', json={
        'email': 'newcitizen@example.com',
        'password': 'Password123!'
    })
    assert res_login.status_code == 200
    login_data = res_login.get_json()
    assert login_data['success'] is True

def test_complaint_creation_and_tracking(client):
    # Create complaint
    res = client.post('/api/complaints', json={
        'category_id': 1,
        'title': 'Test Broken Pipeline',
        'description': 'Water flooding the whole street corner',
        'latitude': 28.5,
        'longitude': 77.2,
        'address': 'Test Ward 5',
        'priority': 'HIGH'
    })
    assert res.status_code == 201
    comp = res.get_json()['data']
    assert 'complaint_number' in comp
    assert comp['status'] == 'SUBMITTED'
    comp_id = comp['id']

    # Get details
    res_detail = client.get(f'/api/complaints/{comp_id}')
    assert res_detail.status_code == 200
    assert res_detail.get_json()['data']['id'] == comp_id

    # Update status via Admin endpoint
    res_status = client.put(f'/api/admin/complaints/{comp_id}/status', json={
        'status': 'IN_PROGRESS',
        'remarks': 'Assigned repair team',
        'changed_by': 'Admin Officer'
    })
    assert res_status.status_code == 200
    assert res_status.get_json()['data']['status'] == 'IN_PROGRESS'

    # Check status history
    res_hist = client.get(f'/api/complaints/{comp_id}/history')
    assert res_hist.status_code == 200
    history = res_hist.get_json()['data']
    assert len(history) >= 2

def test_admin_dashboard_stats(client):
    res = client.get('/api/admin/dashboard')
    assert res.status_code == 200
    data = res.get_json()['data']
    assert 'total_complaints' in data
    assert 'category_breakdown' in data
