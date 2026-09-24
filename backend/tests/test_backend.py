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
    with app.app_context():
        yield app

@pytest.fixture
def client(app):
    return app.test_client()

def test_health_check(client):
    res = client.get('/api/health')
    assert res.status_code == 200
    data = res.get_json()
    assert data['success'] is True

def test_separate_role_logins_and_rejections(client):
    # 1. Citizen login with Citizen credentials -> SUCCESS
    res = client.post('/api/auth/login', json={
        'email': 'citizen@demo.local',
        'password': 'Citizen@123',
        'expected_role': 'CITIZEN'
    })
    assert res.status_code == 200
    citizen_data = res.get_json()
    assert citizen_data['success'] is True
    citizen_token = citizen_data['data']['access_token']

    # 2. Citizen login with Officer credentials -> FAIL
    res_fail1 = client.post('/api/auth/login', json={
        'email': 'officer@demo.local',
        'password': 'Officer@123',
        'expected_role': 'CITIZEN'
    })
    assert res_fail1.status_code == 403
    assert 'not authorized for the selected portal' in res_fail1.get_json()['message']

    # 3. Citizen login with Admin credentials -> FAIL
    res_fail2 = client.post('/api/auth/login', json={
        'email': 'admin@demo.local',
        'password': 'Admin@123',
        'expected_role': 'CITIZEN'
    })
    assert res_fail2.status_code == 403

    # 4. Officer login with Officer credentials -> SUCCESS
    res_off = client.post('/api/auth/login', json={
        'email': 'officer@demo.local',
        'password': 'Officer@123',
        'expected_role': 'OFFICER'
    })
    assert res_off.status_code == 200
    officer_token = res_off.get_json()['data']['access_token']

    # 5. Officer login with Citizen credentials -> FAIL
    res_fail3 = client.post('/api/auth/login', json={
        'email': 'citizen@demo.local',
        'password': 'Citizen@123',
        'expected_role': 'OFFICER'
    })
    assert res_fail3.status_code == 403

    # 6. Officer login with Admin credentials -> FAIL
    res_fail4 = client.post('/api/auth/login', json={
        'email': 'admin@demo.local',
        'password': 'Admin@123',
        'expected_role': 'OFFICER'
    })
    assert res_fail4.status_code == 403

    # 7. Admin login with Admin credentials -> SUCCESS
    res_adm = client.post('/api/auth/login', json={
        'email': 'admin@demo.local',
        'password': 'Admin@123',
        'expected_role': 'ADMIN'
    })
    assert res_adm.status_code == 200
    admin_token = res_adm.get_json()['data']['access_token']

    # 8. Admin login with Citizen credentials -> FAIL
    res_fail5 = client.post('/api/auth/login', json={
        'email': 'citizen@demo.local',
        'password': 'Citizen@123',
        'expected_role': 'ADMIN'
    })
    assert res_fail5.status_code == 403

    # 9. Admin login with Officer credentials -> FAIL
    res_fail6 = client.post('/api/auth/login', json={
        'email': 'officer@demo.local',
        'password': 'Officer@123',
        'expected_role': 'ADMIN'
    })
    assert res_fail6.status_code == 403

    # 10. Citizen directly visits /api/admin/users -> DENIED
    res_citizen_denied = client.get('/api/admin/users', headers={
        'Authorization': f'Bearer {citizen_token}'
    })
    assert res_citizen_denied.status_code == 403

    # 11. Officer directly visits /api/admin/users -> DENIED
    res_officer_denied = client.get('/api/admin/users', headers={
        'Authorization': f'Bearer {officer_token}'
    })
    assert res_officer_denied.status_code == 403

    # 12. Admin accesses authorized admin API -> ALLOWED
    res_admin_allowed = client.get('/api/admin/users', headers={
        'Authorization': f'Bearer {admin_token}'
    })
    assert res_admin_allowed.status_code == 200
    assert res_admin_allowed.get_json()['success'] is True

def test_complaint_ownership_and_access_control(client):
    # Login citizen 1
    res_c1 = client.post('/api/auth/login', json={
        'email': 'citizen@demo.local',
        'password': 'Citizen@123',
        'expected_role': 'CITIZEN'
    })
    c1_token = res_c1.get_json()['data']['access_token']

    # Register citizen 2
    res_reg = client.post('/api/auth/register', json={
        'name': 'Second Citizen',
        'email': 'citizen2@demo.local',
        'phone': '9998887776',
        'password': 'Password123!'
    })
    c2_token = res_reg.get_json()['data']['access_token']

    # Citizen 1 creates a complaint
    res_create = client.post('/api/complaints', json={
        'category_id': 1,
        'title': 'Pothole on Citizen 1 Lane',
        'description': 'Large crater damaging vehicles',
        'address': 'Ward 10'
    }, headers={'Authorization': f'Bearer {c1_token}'})
    assert res_create.status_code == 201
    comp_id = res_create.get_json()['data']['id']

    # Citizen 1 can view own complaint
    res_view1 = client.get(f'/api/complaints/{comp_id}', headers={'Authorization': f'Bearer {c1_token}'})
    assert res_view1.status_code == 200

    # Citizen 2 cannot view Citizen 1's complaint
    res_view2 = client.get(f'/api/complaints/{comp_id}', headers={'Authorization': f'Bearer {c2_token}'})
    assert res_view2.status_code == 403
