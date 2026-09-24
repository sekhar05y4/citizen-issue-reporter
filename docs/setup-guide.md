# Setup Guide - Citizen Issue Reporter

## Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- Flutter SDK 3.22+ with Android toolchain
- Git

## 1. Backend Setup
```bash
cd backend
python -m venv .venv
# Windows:
.\.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
python run.py
```
Backend runs at `http://127.0.0.1:5000` (and `http://0.0.0.0:5000`).

## 2. Admin Panel Setup
```bash
cd admin_panel
npm install
npm run dev
```
Admin Panel runs at `http://localhost:5173`.

## 3. Flutter Mobile App Setup
```bash
cd mobile_app
flutter pub get
flutter run
```

### Network Configuration for Mobile:
Edit `mobile_app/lib/core/config/app_config.dart` or pass `--dart-define=API_URL=...`
- Android Emulator: `http://10.0.2.2:5000/api`
- Physical Phone over Wi-Fi: `http://<YOUR_PC_LAN_IP>:5000/api`
- Local Web / Desktop: `http://127.0.0.1:5000/api`
