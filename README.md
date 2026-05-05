<div align="center">
# Threat Guard: Files & URL Security Analysis Platform
</div>
<div align="center">

![React](https://img.shields.io/badge/REACT-18-d4a017?style=flat-square&labelColor=222222)
![Flask](https://img.shields.io/badge/FLASK-3.0-d4a017?style=flat-square&labelColor=222222)
![Python](https://img.shields.io/badge/PYTHON-3.10+-d4a017?style=flat-square&labelColor=222222)
![License](https://img.shields.io/badge/LICENSE-MIT-d4a017?style=flat-square&labelColor=222222)

**Document Security Analysis Platform with Rule-Based Threat Detection**

[View Project](#getting-started) · [API Reference](#api-reference) · [Report Bug](https://github.com/piyush-jha-16/Threat-Guard/issues)

</div>

---

Threat Guard combines a React frontend with a Python Flask backend to scan uploaded documents for threats using rule-based pattern matching.

---

## Features

- Document upload and scanning via a drag-and-drop interface
- Real-time threat detection using a pure-Python rule engine
- URL inspection with phishing, redirect, and obfuscation checks
- Per-file scan results with matched rule details, severity classification, and file metadata (SHA-256, MD5, entropy)
- Dark and light theme support
- Responsive layout with bottom navigation

---

## How the Scanner Works

When a user uploads a document and clicks **Start Scan**, the following process runs:

```
+--------------------------+
|   User uploads file(s)   |
|   via the Documents page |
+-----------+--------------+
            |
            v
+-----------+--------------+
|  POST /api/scan          |
|  Flask receives the file |
|  as multipart/form-data  |
+-----------+--------------+
            |
            v
+-----------+--------------+
|  File Metadata           |
|  - Detect file type      |
|    (magic bytes)         |
|  - Calculate entropy     |
|  - Compute SHA-256, MD5  |
+-----------+--------------+
            |
            v
+-----------+--------------+
|  Pattern Matching        |
|  Run all rules against   |
|  raw file bytes.         |
|                          |
|  Each rule defines:      |
|  - A list of patterns    |
|  - A minimum match count |
|  - A severity level      |
|  - A category            |
+-----------+--------------+
            |
            v
+-----------+--------------+
|  Heuristic Checks        |
|  - PE magic bytes in a   |
|    document extension    |
|    (e.g. .docx with MZ   |
|    header) = CRITICAL    |
+-----------+--------------+
            |
            v
+-----------+--------------+
|  Deduplicate matches     |
|  Compute overall threat  |
|  level from highest      |
|  severity match          |
+-----------+--------------+
            |
            v
+-----------+--------------+
|  JSON response returned  |
|  to the frontend         |
|                          |
|  - threat_level          |
|  - matches[]             |
|  - summary               |
|  - file_info             |
+-----------+--------------+
            |
            v
+-----------+--------------+
|  ScanResults component   |
|  renders threat badge,   |
|  match cards, and file   |
|  metadata in the UI      |
+--------------------------+
```

### Threat Levels

| Level    | Description                                              |
|----------|----------------------------------------------------------|
| CLEAN    | No rules matched. File appears safe.                     |
| LOW      | Minor indicators present. Low confidence of threat.      |
| MEDIUM   | Moderate indicators such as SQL injection patterns.      |
| HIGH     | Strong indicators such as phishing text or VBA macros.   |
| CRITICAL | Definitive threat indicators such as ransomware content. |

### Detection Rules

| Rule                    | Category   | Severity | Trigger Condition                                      |
|-------------------------|------------|----------|--------------------------------------------------------|
| Malicious_Macro_Keywords| document   | High     | 3 or more VBA macro keywords found                     |
| Ransomware_Note_Keywords| ransomware | Critical | 3 or more ransom note keywords found                   |
| Ransomware_Extensions   | ransomware | Critical | Any ransomware file extension string found             |
| Phishing_Keywords       | phishing   | High     | Any phishing social-engineering phrase found           |
| SQL_Injection_Patterns  | injection  | Medium   | 2 or more SQL injection patterns found                 |
| Embedded_HTML_Or_Script_Payloads | document | High | 2 or more HTML/script payload markers found            |

---

## Project Structure

```
Threat-Guard/
├── backend/
│   ├── app.py              # Flask application, API routes
│   ├── scanner.py          # Rule-based scanning engine
│   └── requirements.txt    # Python dependencies
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── BottomNavigation.jsx
│   │   ├── Documents.jsx
│   │   ├── Executables.jsx
│   │   ├── FileUpload.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── ScanResults.jsx
│   │   ├── TopNavigation.jsx
│   │   └── URLs.jsx
│   ├── App.jsx
│   ├── index.jsx
│   └── *.css
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v14 or higher
- Python 3.10 or higher
- pip

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/threat-guard.git
cd Threat-Guard
```

**2. Install frontend dependencies**
```bash
npm install
```

**3. Install backend dependencies**
```bash
cd backend
pip install flask flask-cors
```

### Running the Application

**Start the backend** (from the `backend/` directory):
```bash
python app.py
```
The API will be available at `http://localhost:5000`.

**Start the frontend** (from the project root):
```bash
npm start
```
The application will open at `http://localhost:3000`.

Both servers must be running simultaneously for the file and URL scan functionality to work.

---

## Technology Stack

| Layer    | Technology          |
|----------|---------------------|
| Frontend | React 18, CSS       |
| Routing  | React Router DOM    |
| Backend  | Python 3, Flask     |
| CORS     | Flask-CORS          |
| Scanning | Python rules        |
