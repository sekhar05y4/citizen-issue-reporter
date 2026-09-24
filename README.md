# Citizen Issue Reporter (Civic Grievance Redressal System)

A production-quality civic issue reporting and municipal grievance redressal platform. The system connects citizens directly with municipal departments for reporting, tracking, and resolving public civic issues such as potholes, garbage accumulation, broken streetlights, water leakage, and drainage blockages.

Built with **Flutter (Mobile)**, **Python Flask (REST API)**, and **React + TypeScript (Admin Web Portal)**.

---

## 🏛️ System Architecture

```
                 CITIZEN (Mobile Device)
                            │
               ┌────────────┴────────────┐
               ▼                         ▼
         Online (REST)            Offline (Local Queue)
               │                         │
               ▼                         ▼
      ┌─────────────────┐       ┌─────────────────┐
      │   Flutter App   │       │  Pending Sync   │
      │  (Material 3)   │       │  Draft Storage  │
      └────────┬────────┘       └────────┬────────┘
               │                         │ (Auto-sync on reconnect)
               ├─────────────────────────┘
               ▼
      ═══════════════════════════════════════════════
                 FLASK REST API BACKEND
        (JWT Auth • Role-based Security • Uploads)
      ═══════════════════════════════════════════════
               │                         │
               ▼                         ▼
      ┌─────────────────┐       ┌─────────────────┐
      │ SQLite Database │       │ Local File Store│
      │  (8 Relational  │       │(Uploaded Photos)│
      │     Tables)     │       └─────────────────┘
      └────────┬────────┘
               ▲
               │ REST / HTTP (JWT)
               │
      ┌────────┴────────┐
      │ React Admin App │
      │(Vite+Leaflet Map│
      └─────────────────┘
               ▲
               │
       MUNICIPAL OFFICIAL / DESK
```

---

## 🚀 Key Features

### 📱 Citizen Mobile App (Flutter)
- **12 Fully Functional Screens**:
  1. **Splash Screen**: Animated branding & token auto-login check.
  2. **Login Screen**: JWT-authenticated login with demo pre-fill & server IP config.
  3. **Sign Up Screen**: Citizen account registration with instant offline profile fallback.
  4. **Home Dashboard**: Quick metric counters, emergency hotline banner, categories grid, recent grievances.
  5. **Report Issue Screen**: Category selection, title, description, camera/gallery attachment, interactive OpenStreetMap GPS pin-point, reverse geocoded landmark address, priority level.
  6. **Select Category**: Searchable catalog of civic issue categories (Roads, Waste, Water, Lighting, Drainage, etc.).
  7. **Complaint Tracking**: 5-stage visual progress timeline (`SUBMITTED` ➔ `UNDER_REVIEW` ➔ `ASSIGNED` ➔ `IN_PROGRESS` ➔ `RESOLVED`), municipal officer remarks, incident map.
  8. **Complaint History**: Multi-tab filter (`All`, `Pending`, `In Progress`, `Resolved`), live keyword search.
  9. **Notifications**: In-app notifications with read/unread tracking and status event alerts.
  10. **Profile Screen**: Citizen info, verified badge, editable details, complaint statistics, logout.
  11. **Feedback & Rating**: Post-resolution 1-5 star rating and service quality comments.
  12. **Help & Support**: 24x7 municipal emergency numbers (112, 101, 108), FAQs accordion, and toll-free desk info.
- **Offline-First Resilience**: Drafts saved to on-device queue when network is unavailable, with explicit "Pending Sync" tags and one-tap background synchronization.
- **Zero Paid APIs**: Uses free OpenStreetMap tiles (`flutter_map` / `latlong2`), device GPS, and local backend storage.

### 💻 Municipal Admin Portal (React + TypeScript + Vite)
- **Executive Analytics Dashboard**: Real-time KPI cards, category breakdown progress bars, urgent triage feed.
- **Complaints Command Center**: Filter by category, department, priority, and resolution status with live search.
- **Incident Map (Leaflet / OpenStreetMap)**: Live interactive map showing complaints color-coded by status with popup inspection cards.
- **Interactive Triage & Assignment**: Assign complaints to municipal departments (Roads, Water, Waste, etc.) and field officers, update status, and log official inspection remarks that notify the citizen instantly.
- **Citizens & Staff Directory**: Manage registered citizens and department inspectors.
- **Department Manager**: Add and manage municipal engineering units.
- **Citizen Feedback & SLA Reports**: Satisfaction score tracking (1-5 stars) and resolution efficiency metrics.

### ⚙️ Backend REST API (Python Flask)
- SQLAlchemy ORM with SQLite database.
- JWT bearer authentication & password hashing (Werkzeug).
- Role-based access control (`CITIZEN`, `OFFICER`, `ADMIN`).
- Automated database creation & realistic demo data seeding.
- Multipart image upload handling with validation and unique filename generation.
- Full Pytest automated test suite.

---

## 📦 Repository Structure

```
citizen-issue-reporter/
├── mobile_app/           # Flutter Mobile Application
│   ├── android/          # Android platform files & permissions
│   ├── assets/           # Images and icons
│   ├── lib/              # Clean Architecture Dart source code
│   │   ├── core/         # Config, theme, constants, router, API client
│   │   ├── models/       # User, Complaint, Category, Notification, Feedback models
│   │   ├── services/     # Auth, Complaint, Offline sync services
│   │   ├── features/     # 12 distinct feature screen modules
│   │   └── shared/       # Reusable cards, badges, dialogs, widgets
│   ├── test/             # Flutter widget and unit test suites
│   └── pubspec.yaml      # Dependencies configuration
│
├── admin_panel/          # React + TypeScript + Vite Admin Web Portal
│   ├── src/
│   │   ├── components/   # Sidebar, StatusBadge, PriorityBadge, ComplaintModal
│   │   ├── pages/        # Dashboard, Complaints, Map, Departments, Users, Feedback, Reports, Settings, Login
│   │   ├── services/     # REST API client with JWT auth
│   │   └── types.ts      # TypeScript interfaces
│   ├── package.json      # React dependencies
│   └── vite.config.ts    # Vite bundler configuration
│
├── backend/              # Python Flask REST API
│   ├── app/
│   │   ├── config/       # App configuration
│   │   ├── database/     # Database seeder with demo accounts & sample complaints
│   │   ├── models/       # SQLAlchemy relational models
│   │   ├── routes/       # Auth, Complaint, Admin, Category, Notification, Feedback routes
│   │   └── utils/        # Image upload & response helpers
│   ├── tests/            # Pytest test suite
│   ├── uploads/          # Uploaded complaint photo evidence
│   ├── requirements.txt  # Python pip dependencies
│   ├── run.py            # Development server runner
│   └── pytest.ini        # Pytest configuration
│
├── database/             # Raw SQL schema & seed files
│   ├── schema.sql
│   └── seed_data.sql
│
├── docs/                 # Detailed architectural & API specifications
│   ├── architecture.md
│   ├── api-documentation.md
│   ├── database-design.md
│   ├── setup-guide.md
│   └── testing.md
│
├── .gitignore            # Git exclusion rules (no keys, build artifacts, node_modules)
├── .env.example          # Environment configuration template
└── README.md             # Master project guide
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@demo.local` | `DemoPass123!` | Chief Municipal Officer: Full access to all complaints, departments, reports, and triage |
| **Officer** | `officer@demo.local` | `DemoPass123!` | Ward Inspector: Department grievance triage, status update, field remarks |
| **Citizen** | `citizen@demo.local` | `DemoPass123!` | Citizen: File complaints, track status, receive notifications, rate resolution |

---

## 🛠️ Local Development & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- Flutter SDK 3.22+
- Git

---

### 1. Start Flask Backend
```bash
cd backend

# Create & activate virtual environment (Windows)
python -m venv .venv
.\.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask API server
python run.py
```
> The API server runs at `http://127.0.0.1:5000` (and `http://0.0.0.0:5000`). Database tables and initial sample data are automatically initialized on startup!

---

### 2. Start React Admin Panel
```bash
cd admin_panel

# Install npm dependencies
npm install

# Start Vite development server
npm run dev
```
> Open `http://localhost:5173` in your browser to access the Municipal Admin Portal. Click **Demo Admin** on the login screen for instant sign-in.

---

### 3. Start Flutter Mobile App
```bash
cd mobile_app

# Fetch dependencies
flutter pub get

# Run on connected device, emulator, or Chrome
flutter run
```

#### 🌐 Connecting Mobile App to Backend:
The mobile app features a centralized configuration for easy network switching:
- **Android Emulator**: Uses default `http://10.0.2.2:5000/api`
- **Physical Phone on Wi-Fi**: Tap the **⚙️ Settings icon** on the Login screen and enter `http://<YOUR_PC_LAN_IP>:5000/api`
- **Web / Desktop**: Uses `http://127.0.0.1:5000/api`

---

## 🧪 Running Automated Tests

### 1. Backend Tests (Pytest)
```bash
cd backend
.\.venv\Scripts\pytest
```
*Tests registration, login, JWT auth, complaint creation, state transition history, and admin analytics.*

### 2. Frontend Tests (React / TypeScript Build)
```bash
cd admin_panel
npm run build
```
*Verifies type-safety and bundles the React production assets.*

### 3. Mobile Tests (Flutter)
```bash
cd mobile_app
flutter analyze
flutter test
```
*Validates Dart linter standards and executes widget and integration tests.*

---

## 📱 Building Android APK

To build the release APK for Android distribution:

```bash
cd mobile_app
flutter build apk --release
```

The generated APK will be available at:
```
mobile_app/build/app/outputs/flutter-apk/app-release.apk
```

---

## 🔒 Security & Privacy Practices
- **No Plaintext Passwords**: Password hashing via PBKDF2/SHA256 (Werkzeug).
- **JWT Authorization**: Bearer tokens protecting admin and citizen endpoints.
- **SQL Injection Prevention**: SQLAlchemy parameterized queries across all database operations.
- **Zero Committed Secrets**: `.env` and SQLite databases excluded from Git via `.gitignore`.
- **File Validation**: Image upload validation by MIME type and size limits.

---

## 📄 License
This project is open-source and built for civic innovation and college/hackathon demonstration.
