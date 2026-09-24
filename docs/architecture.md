# System Architecture - Citizen Issue Reporter

## 1. High Level Overview
Citizen Issue Reporter is built upon a 3-tier decoupled architecture designed for high scalability, local reliability, and strict separation between the data storage and client presentation tiers.

```
+-------------------------------------------------------------+
|                        CITIZEN (Mobile)                     |
|  Flutter App (Dart) • Material 3 • OpenStreetMap (flutter_map) |
|  Offline Sync Queue • Camera/Gallery • Local Notifications  |
+------------------------------+------------------------------+
                               |
                           REST / HTTP
                               |
+------------------------------v------------------------------+
|                     FLASK REST API BACKEND                  |
|  Python 3.10 • Flask • SQLAlchemy ORM • SQLite • JWT Auth   |
|  Role Authorization • File Storage Engine • Auto Seeds     |
+--------------+---------------+----------------+-------------+
               |               |                |
      +--------v-------+  +----v----+   +-------v-------+
      | SQLite DB      |  | Uploads |   | Event Logging |
      | Multi-table    |  | Storage |   | Status Hist.  |
      +----------------+  +---------+   +---------------+
                               ^
                               | REST / HTTP
+------------------------------+------------------------------+
|                   OFFICIAL / ADMIN (Web)                    |
|  React 18 • TypeScript • Vite • TailwindCSS • OpenStreetMap  |
|  Interactive Map • Stats Analytics • Triage & Assignments  |
+-------------------------------------------------------------+
```

## 2. Key Components
- **Mobile Client**: Flutter application running on Android with offline-first state machine.
- **Admin Client**: React Single Page Application utilizing Vite, Tailwind CSS, Lucide icons, and Leaflet OpenStreetMap.
- **REST Backend**: Python Flask application exposing RESTful JSON endpoints with JWT Bearer authentication.
- **Storage Layer**: Relational SQLite database with automated seeding and local storage for uploaded citizen photos.
