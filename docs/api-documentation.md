# API Documentation - Citizen Issue Reporter

All endpoints conform to standard JSON response wrappers:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

## Authentication Endpoints
- `POST /api/auth/register` : Register a new citizen account
- `POST /api/auth/login` : Citizen / Officer / Admin login with email & password -> returns JWT access token
- `POST /api/auth/logout` : Invalidate local session
- `GET /api/auth/me` : Fetch currently authenticated user profile

## Category Endpoints
- `GET /api/categories` : List active civic issue categories

## Complaint Endpoints
- `POST /api/complaints` : Submit a new complaint (multipart/form-data or JSON with base64/file)
- `GET /api/complaints` : List complaints for the logged-in citizen (or all for admin)
- `GET /api/complaints/<id>` : Get details for a specific complaint
- `GET /api/complaints/<id>/history` : Get audit status timeline for a complaint

## Notification Endpoints
- `GET /api/notifications` : List notifications for the authenticated user
- `PUT /api/notifications/<id>/read` : Mark a notification as read
- `PUT /api/notifications/read-all` : Mark all notifications as read

## Feedback Endpoints
- `POST /api/complaints/<id>/feedback` : Submit 1-5 star rating and comment
- `GET /api/feedback` : List feedback summaries (Admin only)

## Admin Endpoints (Require ADMIN or OFFICER role)
- `GET /api/admin/dashboard` : Analytics summary, status counts, breakdown by category
- `GET /api/admin/complaints` : Filtered & paginated complaint list
- `PUT /api/admin/complaints/<id>/status` : Update status and log remarks
- `PUT /api/admin/complaints/<id>/assign` : Assign department or officer
- `GET /api/admin/users` : List registered citizens and staff
- `GET /api/admin/departments` : List and manage municipal departments
