# Threat Guard - Complete Project Details

## 1. What This Project Is

Threat Guard is a full-stack web application for **security analysis of files and URLs**.

It provides:
- File scanning for documents and executables
- URL scanning for phishing and suspicious link indicators
- Threat classification using severity levels (`clean`, `low`, `medium`, `high`, `critical`)
- Explainable scan output (matched rules, reasons, metadata, hashes)

This is a **rule-based detection platform** built for practical cybersecurity analysis and demonstration.

## 2. Why This Project Was Made

Threat Guard appears to be built as a **college cybersecurity project** to:
- Demonstrate secure software design with a frontend + backend architecture
- Show how rule-based malware/phishing detection works in practice
- Provide a simple UI for users to scan files and URLs quickly
- Produce explainable outputs instead of black-box decisions

It is useful for learning:
- Threat detection fundamentals
- Static file analysis concepts
- URL risk heuristics
- End-to-end secure app development with React and Flask

## 3. How This Project Is Made (Architecture)

Threat Guard uses a 2-tier app architecture:

### Frontend (React)
- Built with React 18
- Handles user interaction, file upload UI, URL input UI, and result rendering
- Calls backend REST APIs over HTTP (`http://localhost:5000`)

### Backend (Flask)
- Built with Flask + Flask-CORS
- Exposes API endpoints for health, rules, file scanning, and URL scanning
- Runs pure Python scanning engines (`scanner.py` and `url_scanner.py`)

### Data Flow
1. User uploads one or more files or submits a URL.
2. Frontend sends request to backend API.
3. Backend scanner applies static rules + heuristics.
4. Backend computes threat level and returns structured JSON.
5. Frontend displays overall status, per-indicator details, and metadata.

## 4. Tech Stack

### Frontend
- React 18 (`react`, `react-dom`)
- React Scripts 5 (`react-scripts`)
- React Router DOM (installed in dependencies)
- Plain CSS component styling

### Backend
- Python 3.x
- Flask 3.0.3
- Flask-CORS 4.0.0

### Security/Analysis Logic
- Rule-based signature/pattern matching
- Heuristic checks for suspicious structures
- Hashing with SHA-256 and MD5
- Shannon entropy calculation for file content analysis
- File signature detection using magic bytes

## 5. Major Features and Functionality

## 5.1 Home Experience
- Branded landing page with project purpose and feature cards
- Navigation to all scanner workflows
- Theme toggle (dark/light) with localStorage persistence

## 5.2 Document Scanning
- Upload and scan document formats (like PDF, DOC/DOCX, XLS/XLSX, PPT/PPTX, TXT, RTF, ODT)
- Detects indicators such as:
  - Malicious macro keywords
  - Ransomware note language
  - Phishing language
  - SQL injection payload strings in content
  - Suspicious PDF characteristics
  - Suspicious OLE object markers
  - PowerShell execution patterns

## 5.3 Executable Scanning
- Upload and scan executable/script-oriented formats (EXE, DLL, BAT, SH, etc.)
- Detects indicators such as:
  - Malware-related executable strings
  - Download-and-execute behavior markers
  - Script host abuse patterns
  - High-entropy packed/obfuscated executable signals

## 5.4 URL Scanning
- Input URL and scan instantly
- Rule + heuristic checks include:
  - Phishing keywords in URL text
  - Redirect parameter abuse (`next=`, `url=`, `redirect=` etc.)
  - Obfuscation markers (`%2e`, `%2f`, punycode)
  - Dangerous schemes (`javascript:`, `data:`, `file:`, etc.)
  - Raw IP host usage
  - Embedded credentials in URL
  - Deep subdomain chain / deep path
  - Suspicious TLD usage
  - Heavy percent-encoding

## 5.5 Scan Results UI
- Shows overall threat level for scan batch
- Per-file/per-URL findings with:
  - Rule name
  - Description
  - Severity
  - Category
  - Matched patterns
- File metadata shown in results:
  - File type guess
  - File size
  - Entropy
  - SHA-256 hash
  - MD5 hash

## 5.6 API and Operational Features
- Health endpoint
- Rule listing endpoint
- Max file size enforcement (50 MB)
- Basic structured JSON error responses
- CORS enabled for frontend-backend local development

## 6. Backend API Endpoints

### `GET /api/health`
Returns service status and scanner information.

### `GET /api/rules`
Returns configured Python rule metadata (name, description, severity, category).

### `POST /api/scan`
Scans uploaded file(s) from multipart form field `files`.

Response includes:
- `scan_complete`
- `files_scanned`
- `overall_threat_level`
- `results[]` with detailed per-file analysis

### `POST /api/scan-url`
Scans one URL from JSON body `{ "url": "..." }`.

Response includes:
- `threat_level`
- `matches[]`
- `summary`
- `url_info` metadata

## 7. Threat Severity Model

Threat Guard uses this severity order:
- `clean` = 0
- `low` = 1
- `medium` = 2
- `high` = 3
- `critical` = 4

The final threat level is the **maximum severity** found across matched indicators.

## 8. Current Project Structure (High-Level)

- `backend/` - Flask APIs and scanners
  - `app.py` - API routes and app setup
  - `scanner.py` - file scanning logic
  - `url_scanner.py` - URL scanning logic
- `src/` - React frontend
  - `components/` - page and UI components
  - `App.jsx` - main app container/navigation logic
- `public/` - static frontend files
- `build/` - production build output
- `test_files/` - sample test files for validation/demo
- `README.md` and `URL_SCANNER_GUIDE.md` - existing project docs

## 9. Strengths of This Implementation

- Clear separation of UI and scanning engine
- Explainable findings (not opaque model-only output)
- Deterministic behavior (same input -> same result)
- Easy to extend by adding/modifying rules
- Fast for local scans (no required cloud dependency)

## 10. Known Limitations

- Primarily static/rule-based detection (no dynamic sandbox execution)
- No external reputation feeds integrated by default
- Novel/obfuscated threats may evade static keyword logic
- Login page is UI-only in current state (no backend auth flow)
- Threat scoring is severity-max based, not probabilistic risk modeling

## 11. How to Run the Project

## 11.1 Frontend
1. Install dependencies:
   `npm install`
2. Start frontend:
   `npm start`

Runs on `http://localhost:3000`.

## 11.2 Backend
1. Install Python dependencies from root (or backend context):
   `pip install -r requirements.txt`
2. Start backend:
   `python backend/app.py`

Runs on `http://localhost:5000`.

Both frontend and backend must run together for full functionality.

## 12. Future Scope (Possible Enhancements)

- Add authentication and user account persistence
- Integrate external threat intelligence APIs
- Add dynamic sandboxing for executables/documents
- Add report export (PDF/JSON)
- Add scan history storage in database
- Improve scoring by combining weighted indicators
- Add automated test suite for rules and API behavior

---

This document summarizes what Threat Guard is, why it exists, how it is implemented, and what features/functionality are currently included in the repository.
