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
| Suspicious_PDF_Characteristics | document | Medium | 2 or more suspicious PDF characteristics found |
| Suspicious_PowerShell_Execution | document | High | 2 or more PowerShell execution keywords found |
| Suspicious_OLE_Objects | document | Medium | 2 or more suspicious OLE object keywords found |
| Credential_Theft_Keywords | phishing | High | 3 or more credential theft keywords found |
| Embedded_PE_in_Document | document   | Critical | File has PE magic bytes (MZ) with a document extension |

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

## API Reference

### `GET /api/health`
Returns the current status of the backend server.

**Response**
```json
{
  "status": "ok",
  "scan_engine": "Python Rules",
  "max_file_size_mb": 50
}
```

---

### `GET /api/rules`
Returns a list of all loaded detection rules.

**Response**
```json
{
  "engine": "Python Rules",
  "total_rules": 9,
  "rules": [
    {
      "name": "Malicious_Macro_Keywords",
      "description": "Detects suspicious VBA macro keywords in documents",
      "severity": "high",
      "category": "document"
    }
  ]
}
```

---

### `POST /api/scan`
Accepts one or more files and returns scan results for each.

**Request**
- Content-Type: `multipart/form-data`
- Field name: `files` (one or more files)
- Maximum file size: 50 MB

**Response**
```json
{
  "scan_complete": true,
  "files_scanned": 1,
  "overall_threat_level": "critical",
  "results": [
    {
      "filename": "document.docx",
      "threat_level": "critical",
      "summary": "Detected 2 threat indicator(s): 1 ransomware, 1 phishing.",
      "matches": [
        {
          "rule": "Ransomware_Note_Keywords",
          "description": "Detects common ransomware ransom note keywords",
          "severity": "critical",
          "category": "ransomware",
          "matched_patterns": ["bitcoin", "decrypt", "private key"]
        }
      ],
      "file_info": {
        "size": 28672,
        "type": "ZIP/Office Open XML (DOCX/XLSX/PPTX)",
        "entropy": 7.812,
        "sha256": "a3f1...",
        "md5": "d41d..."
      },
      "scan_engine": "Python Rules"
    }
  ]
}
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

Both servers must be running simultaneously for the scan functionality to work.

---

## Technology Stack

| Layer    | Technology          |
|----------|---------------------|
| Frontend | React 18, CSS       |
| Routing  | React Router DOM    |
| Backend  | Python 3, Flask     |
| CORS     | Flask-CORS          |
| Scanning | Python rules        |
