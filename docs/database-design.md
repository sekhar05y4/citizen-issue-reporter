# Database Design - Citizen Issue Reporter

## Entity Relationship Overview
The system models civic grievances, life-cycle transitions, municipal triage, and citizen engagement.

### Tables:
1. `users`: Citizen credentials, name, email, phone, role.
2. `admin_users`: Department officers and super-admins with department links.
3. `departments`: Functional municipal units (Roads, Water, Waste, etc.).
4. `categories`: Complaint types with UI icon mappings.
5. `complaints`: Core record with `CMP-YYYY-XXXXXX` tracking ID, GPS coordinates, reverse-geocoded address, photo reference, priority, status, and department linkages.
6. `complaint_status_history`: Audit trail capturing every status transition, timestamp, actor, and remarks.
7. `notifications`: In-app event alerts for users when complaint status changes.
8. `feedback`: Post-resolution citizen satisfaction rating and comments.
