from app import db
from app.models.models import User, Department, Category, AdminUser, Complaint, ComplaintStatusHistory, Notification
from datetime import datetime, timedelta

def seed_database():
    # 1. Categories
    if Category.query.count() == 0:
        categories = [
            Category(name='Potholes & Road Damage', description='Damaged asphalt, craters, dangerous road cracks, or missing manhole covers', icon='road'),
            Category(name='Garbage & Waste', description='Overflowing public bins, uncollected curbside waste, littered streets', icon='trash'),
            Category(name='Water Leakage', description='Broken municipal pipelines, continuous water waste, tap leakages', icon='water'),
            Category(name='Broken Street Lights', description='Dark streets, flickering lamps, broken fixtures, exposed wiring', icon='lightbulb'),
            Category(name='Drainage Problems', description='Blocked gutters, waterlogging, overflowing sewage lines', icon='drain'),
            Category(name='Illegal Dumping', description='Unauthorized dumping of debris, chemical waste, hazardous materials', icon='dumping'),
            Category(name='Other Civic Issues', description='Encroachment, damaged public benches, park maintenance, etc.', icon='other'),
        ]
        db.session.add_all(categories)
        db.session.commit()

    # 2. Departments
    if Department.query.count() == 0:
        departments = [
            Department(name='Roads & Infrastructure', description='Handles potholes, pavements, traffic signs, and municipal bridges'),
            Department(name='Waste Management & Sanitation', description='Responsible for waste collection, dump yards, and public cleanliness'),
            Department(name='Water Supply & Sewerage', description='Maintains drinking water pipelines, sewage flow, and storm drainage'),
            Department(name='Electricity & Lighting', description='Maintains streetlights, high masts, transformers, and public power lines'),
            Department(name='Public Health & Environment', description='Manages vector control, environmental hazards, and pollution issues'),
        ]
        db.session.add_all(departments)
        db.session.commit()

    # 3. Users (Citizen & Admin & Officer)
    if User.query.filter_by(email='citizen@demo.local').first() is None:
        demo_citizen = User(
            name='Rahul Sharma',
            email='citizen@demo.local',
            phone='+91 98765 43210',
            role='CITIZEN'
        )
        demo_citizen.set_password('DemoPass123!')
        db.session.add(demo_citizen)
        db.session.commit()

    if AdminUser.query.filter_by(email='admin@demo.local').first() is None:
        demo_admin = AdminUser(
            name='Dr. Anita Verma (Chief Municipal Officer)',
            email='admin@demo.local',
            role='ADMIN'
        )
        demo_admin.set_password('DemoPass123!')
        db.session.add(demo_admin)

    if AdminUser.query.filter_by(email='officer@demo.local').first() is None:
        roads_dept = Department.query.filter_by(name='Roads & Infrastructure').first()
        demo_officer = AdminUser(
            name='Vikram Singh (Ward Inspector)',
            email='officer@demo.local',
            role='OFFICER',
            department_id=roads_dept.id if roads_dept else None
        )
        demo_officer.set_password('DemoPass123!')
        db.session.add(demo_officer)

    db.session.commit()

    # 4. Seed Sample Complaints if empty
    if Complaint.query.count() == 0:
        citizen = User.query.filter_by(email='citizen@demo.local').first()
        cat_road = Category.query.filter_by(name='Potholes & Road Damage').first()
        cat_water = Category.query.filter_by(name='Water Leakage').first()
        cat_light = Category.query.filter_by(name='Broken Street Lights').first()
        dept_road = Department.query.filter_by(name='Roads & Infrastructure').first()
        dept_water = Department.query.filter_by(name='Water Supply & Sewerage').first()
        officer = AdminUser.query.filter_by(email='officer@demo.local').first()

        c1 = Complaint(
            complaint_number='CMP-2026-000001',
            user_id=citizen.id,
            category_id=cat_road.id,
            title='Severe crater near Central Bus Stand',
            description='Deep pothole obstructing bus lanes and causing vehicle suspension damage.',
            latitude=28.6139,
            longitude=77.2090,
            address='Central Bus Stand Terminal, Ring Road Sector 4',
            priority='HIGH',
            status='IN_PROGRESS',
            assigned_department_id=dept_road.id if dept_road else None,
            assigned_officer_id=officer.id if officer else None,
            created_at=datetime.utcnow() - timedelta(days=2),
            updated_at=datetime.utcnow() - timedelta(hours=8)
        )
        db.session.add(c1)
        db.session.flush()

        h1 = ComplaintStatusHistory(complaint_id=c1.id, status='SUBMITTED', remarks='Issue submitted by citizen', changed_by='Citizen', created_at=datetime.utcnow() - timedelta(days=2))
        h2 = ComplaintStatusHistory(complaint_id=c1.id, status='UNDER_REVIEW', remarks='Triage review by Municipal Control Desk', changed_by='Admin', created_at=datetime.utcnow() - timedelta(days=1, hours=12))
        h3 = ComplaintStatusHistory(complaint_id=c1.id, status='ASSIGNED', remarks='Assigned to Roads & Infrastructure squad', changed_by='Admin', created_at=datetime.utcnow() - timedelta(days=1))
        h4 = ComplaintStatusHistory(complaint_id=c1.id, status='IN_PROGRESS', remarks='Asphalt resurfacing crew dispatched to site', changed_by='Officer Vikram Singh', created_at=datetime.utcnow() - timedelta(hours=8))
        db.session.add_all([h1, h2, h3, h4])

        c2 = Complaint(
            complaint_number='CMP-2026-000002',
            user_id=citizen.id,
            category_id=cat_water.id,
            title='Continuous pipeline leakage on Market Road',
            description='Drinking water pipeline burst wasting hundreds of gallons daily.',
            latitude=28.6200,
            longitude=77.2150,
            address='Shop 42, Main Market Road',
            priority='URGENT',
            status='RESOLVED',
            assigned_department_id=dept_water.id if dept_water else None,
            created_at=datetime.utcnow() - timedelta(days=4),
            resolved_at=datetime.utcnow() - timedelta(hours=12)
        )
        db.session.add(c2)
        db.session.flush()

        h2_1 = ComplaintStatusHistory(complaint_id=c2.id, status='SUBMITTED', remarks='Submitted via mobile app', changed_by='Citizen', created_at=datetime.utcnow() - timedelta(days=4))
        h2_2 = ComplaintStatusHistory(complaint_id=c2.id, status='RESOLVED', remarks='Pipeline valve sealed and pressure tested successfully', changed_by='Water Dept Engineer', created_at=datetime.utcnow() - timedelta(hours=12))
        db.session.add_all([h2_1, h2_2])

        c3 = Complaint(
            complaint_number='CMP-2026-000003',
            user_id=citizen.id,
            category_id=cat_light.id,
            title='Street light flickering on Lane 9',
            description='Three consecutive LED pole lights inoperative after lightning storm.',
            latitude=28.6080,
            longitude=77.2020,
            address='Lane 9, Residential Colony, Ward 15',
            priority='MEDIUM',
            status='SUBMITTED',
            created_at=datetime.utcnow() - timedelta(hours=5)
        )
        db.session.add(c3)
        db.session.flush()

        h3_1 = ComplaintStatusHistory(complaint_id=c3.id, status='SUBMITTED', remarks='Logged in civic registry', changed_by='Citizen', created_at=datetime.utcnow() - timedelta(hours=5))
        db.session.add(h3_1)

        # Seed initial notification for citizen
        notif1 = Notification(
            user_id=citizen.id,
            complaint_id=c1.id,
            title='Grievance Under Repair',
            message='Complaint #CMP-2026-000001 (Road damage) is now IN_PROGRESS. Asphalt crew has arrived on site.',
            type='STATUS_UPDATE'
        )
        notif2 = Notification(
            user_id=citizen.id,
            complaint_id=c2.id,
            title='Issue Resolved',
            message='Complaint #CMP-2026-000002 has been marked as RESOLVED. Please rate our service.',
            type='RESOLUTION'
        )
        db.session.add_all([notif1, notif2])
        db.session.commit()
