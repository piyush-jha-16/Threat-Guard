# Threat Guard

A security monitoring platform that combines a React frontend with a Python Flask backend for real-time threat detection and analysis.

Threat Guard provides a comprehensive solution for identifying and analyzing security threats through document scanning, URL reputation checking, and real-time monitoring. The application features an intuitive interface built with React, backed by a robust Flask API that handles threat analysis and data processing.

## File Structure

```
Threat-Guard/
├── public/
│   └── index.html              # HTML entry point
├── src/
│   ├── App.jsx                 # Main application component
│   ├── App.css                 # Application styles
│   ├── index.jsx               # React entry point
│   ├── index.css               # Global styles
│   └── components/
│       ├── BottomNavigation.jsx    # Navigation component
│       └── BottomNavigation.css    # Navigation styles
├── package.json                # Frontend dependencies
└── README.md                   # Documentation
```

## Features

- **Document Scanning** - Analyze file uploads for malware and suspicious patterns
- **URL Reputation Checking** - Real-time URL scanning against threat databases
- **Real-time Dashboard** - Monitor security events and threat indicators
- **Secure Authentication** - User authentication and session management

## Setup

### Frontend

```bash
npm install
npm start
```

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

