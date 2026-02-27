"""
scanner.py - Document Scanner for Threat Guard
Pure-Python pattern matching engine focused on document threat detection.
"""

import os
import hashlib
import math
from collections import Counter

# ─── Severity ordering ───────────────────────────────────────────────────────
SEVERITY_ORDER = {"clean": 0, "low": 1, "medium": 2, "high": 3, "critical": 4}
SEVERITY_COLORS = {
    "clean": "green",
    "low": "yellow",
    "medium": "orange",
    "high": "red",
    "critical": "darkred",
}

# ─── Pure-Python rule definitions ────────────────────────────────────────────
# Each rule is a dict with: name, description, severity, category, patterns (list of bytes/str)
# condition: number of patterns that must match (default 1 = any)

PYTHON_RULES = [
    # --- VBA Macros ---
    {
        "name": "Malicious_Macro_Keywords",
        "description": "Detects suspicious VBA macro keywords in documents",
        "severity": "high",
        "category": "document",
        "patterns": [
            b"autoopen", b"auto_open", b"document_open", b"workbook_open",
            b"shell", b"wscript.shell", b"createobject", b"getobject"
        ],
        "condition": 3,
        "case_insensitive": True,
    },
    # --- Ransomware ---
    {
        "name": "Ransomware_Note_Keywords",
        "description": "Detects common ransomware ransom note keywords",
        "severity": "critical",
        "category": "ransomware",
        "patterns": [
            b"your files have been encrypted", b"bitcoin",
            b"decrypt", b"private key", b"payment", b"deadline"
        ],
        "condition": 3,
        "case_insensitive": True,
    },
    {
        "name": "Ransomware_Extensions",
        "description": "Detects ransomware-related file extension strings embedded in document",
        "severity": "critical",
        "category": "ransomware",
        "patterns": [
            b".locked", b".encrypted", b".crypto",
            b".cerber", b".locky", b".zepto", b".osiris"
        ],
        "condition": 1,
        "case_insensitive": True,
    },
    # --- Phishing ---
    {
        "name": "Phishing_Keywords",
        "description": "Detects common phishing keywords in document content",
        "severity": "high",
        "category": "phishing",
        "patterns": [
            b"verify your account", b"confirm your identity",
            b"suspended account", b"unusual activity",
            b"click here immediately", b"urgent action required"
        ],
        "condition": 1,
        "case_insensitive": True,
    },
    # --- SQL Injection ---
    {
        "name": "SQL_Injection_Patterns",
        "description": "Detects SQL injection patterns embedded in document",
        "severity": "medium",
        "category": "injection",
        "patterns": [
            b"' OR '1'='1", b"UNION SELECT", b"DROP TABLE",
            b"INSERT INTO", b"xp_cmdshell", b"; exec"
        ],
        "condition": 2,
        "case_insensitive": True,
    },
]

# ─── Magic bytes for file type detection ─────────────────────────────────────
MAGIC_BYTES = {
    b"MZ": "PE Executable (Windows EXE/DLL)",
    b"\x7fELF": "ELF Executable (Linux)",
    b"\xca\xfe\xba\xbe": "Mach-O Executable (macOS)",
    b"%PDF": "PDF Document",
    b"PK\x03\x04": "ZIP/Office Open XML (DOCX/XLSX/PPTX)",
    b"\xd0\xcf\x11\xe0": "OLE Compound Document (DOC/XLS)",
    b"#!": "Shell Script",
    b"MThd": "MIDI File",
    b"\xff\xd8\xff": "JPEG Image",
    b"\x89PNG": "PNG Image",
}


def _detect_file_type(data: bytes) -> str:
    for magic, desc in MAGIC_BYTES.items():
        if data[:len(magic)] == magic:
            return desc
    return "Unknown / Text File"


def _calculate_entropy(data: bytes) -> float:
    """Shannon entropy — high values indicate encryption/packing."""
    if not data:
        return 0.0
    counter = Counter(data)
    length = len(data)
    entropy = -sum(
        (count / length) * math.log2(count / length)
        for count in counter.values()
        if count > 0
    )
    return round(entropy, 4)


def _is_pe(data: bytes) -> bool:
    return len(data) >= 2 and data[:2] == b"MZ"


def _sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def _md5(data: bytes) -> str:
    return hashlib.md5(data).hexdigest()


# ─── Pure-Python scanner ──────────────────────────────────────────────────────

def _python_scan(data: bytes) -> list[dict]:
    """Run all Python-based rules against raw file bytes."""
    matches = []
    data_lower = data.lower()

    for rule in PYTHON_RULES:
        hit_count = 0
        matched_patterns = []

        for pattern in rule["patterns"]:
            search_data = data_lower if rule.get("case_insensitive") else data
            search_pat = pattern.lower() if rule.get("case_insensitive") else pattern

            if search_pat in search_data:
                hit_count += 1
                try:
                    matched_patterns.append(pattern.decode("utf-8", errors="replace"))
                except Exception:
                    matched_patterns.append(repr(pattern))

        if hit_count >= rule["condition"]:
            matches.append({
                "rule": rule["name"],
                "description": rule["description"],
                "severity": rule["severity"],
                "category": rule["category"],
                "matched_patterns": matched_patterns,
            })

    return matches


# ─── Heuristic checks ────────────────────────────────────────────────────────

def _heuristic_checks(data: bytes, filename: str, entropy: float) -> list[dict]:
    """Heuristic check: flag executables disguised as documents."""
    checks = []
    ext = os.path.splitext(filename)[1].lower()

    # Executable disguised as a document
    doc_exts = {".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".rtf", ".odt", ".txt"}
    if _is_pe(data) and ext in doc_exts:
        checks.append({
            "rule": "Embedded_PE_in_Document",
            "description": "File has executable (PE) magic bytes but uses a document extension — possible malware disguise",
            "severity": "critical",
            "category": "document",
            "matched_patterns": [f"Extension: {ext}", "Magic bytes: MZ (PE executable)"],
        })

    return checks


# ─── Deduplicate matches ──────────────────────────────────────────────────────

def _deduplicate(matches: list[dict]) -> list[dict]:
    seen = set()
    unique = []
    for m in matches:
        key = m["rule"]
        if key not in seen:
            seen.add(key)
            unique.append(m)
    return unique


# ─── Compute overall threat level ────────────────────────────────────────────

def _compute_threat_level(matches: list[dict]) -> str:
    if not matches:
        return "clean"
    max_sev = max(
        (SEVERITY_ORDER.get(m["severity"].lower(), 0) for m in matches),
        default=0,
    )
    return {v: k for k, v in SEVERITY_ORDER.items()}.get(max_sev, "low")


# ─── Public API ──────────────────────────────────────────────────────────────

def scan_file(file_data: bytes, filename: str) -> dict:
    """
    Scan a file and return a structured result dict.
    """
    # File metadata
    entropy = _calculate_entropy(file_data)
    file_type = _detect_file_type(file_data)
    sha256 = _sha256(file_data)
    md5 = _md5(file_data)

    # Run scanners
    python_matches = _python_scan(file_data)
    heuristic_matches = _heuristic_checks(file_data, filename, entropy)

    all_matches = _deduplicate(python_matches + heuristic_matches)
    threat_level = _compute_threat_level(all_matches)

    # Build summary
    if not all_matches:
        summary = "No threats detected. File appears clean."
    else:
        cat_counts: dict[str, int] = {}
        for m in all_matches:
            cat_counts[m["category"]] = cat_counts.get(m["category"], 0) + 1
        parts = [f"{v} {k}" for k, v in cat_counts.items()]
        summary = f"Detected {len(all_matches)} threat indicator(s): {', '.join(parts)}."

    return {
        "filename": filename,
        "threat_level": threat_level,
        "matches": all_matches,
        "summary": summary,
        "file_info": {
            "size": len(file_data),
            "type": file_type,
            "entropy": entropy,
            "sha256": sha256,
            "md5": md5,
            "is_pe": _is_pe(file_data),
        },
        "scan_engine": "Python Rules",
    }
