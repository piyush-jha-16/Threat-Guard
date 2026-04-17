"""
url_scanner.py - URL threat analysis for Threat Guard.
Pure-Python URL pattern matching and heuristic checks.
"""

from __future__ import annotations

import hashlib
import ipaddress
import re
from urllib.parse import parse_qs, urlparse


SEVERITY_ORDER = {"clean": 0, "low": 1, "medium": 2, "high": 3, "critical": 4}

URL_RULES = [
    {
        "name": "URL_Phishing_Keywords",
        "description": "Detects common phishing keywords in URL path or query",
        "severity": "high",
        "category": "url",
        "patterns": [
            b"login", b"sign in", b"signin", b"verify", b"update",
            b"secure", b"account", b"password", b"confirm", b"payment",
        ],
        "condition": 2,
        "case_insensitive": True,
    },
    {
        "name": "URL_Redirect_Parameters",
        "description": "Detects redirect-style parameters often used in phishing chains",
        "severity": "medium",
        "category": "url",
        "patterns": [b"redirect=", b"url=", b"next=", b"continue=", b"return=", b"goto="],
        "condition": 1,
        "case_insensitive": True,
    },
    {
        "name": "URL_Obfuscation_Indicators",
        "description": "Detects URL encoding and punycode markers commonly used to hide malicious destinations",
        "severity": "medium",
        "category": "url",
        "patterns": [b"%2e", b"%2f", b"%40", b"%3a", b"xn--"],
        "condition": 2,
        "case_insensitive": True,
    },
    {
        "name": "Dangerous_URL_Schemes",
        "description": "Detects non-web schemes that are rarely safe for user-entered URLs",
        "severity": "critical",
        "category": "url",
        "patterns": [b"javascript:", b"data:", b"vbscript:", b"file:"],
        "condition": 1,
        "case_insensitive": True,
    },
]

SUSPICIOUS_TLDS = {
    ".zip", ".mov", ".top", ".xyz", ".click", ".work", ".quest", ".support",
    ".cam", ".ru", ".cn", ".info", ".icu", ".online", ".site", ".tk",
}


def _normalize_url(raw_url: str) -> tuple[str, bool]:
    candidate = (raw_url or "").strip()
    if not candidate:
        return "", False

    if not re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*://", candidate):
        candidate = "http://" + candidate

    parsed = urlparse(candidate)
    is_valid = bool(parsed.scheme and parsed.netloc)
    return candidate, is_valid


def _sha256(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8", errors="ignore")).hexdigest()


def _deduplicate(matches: list[dict]) -> list[dict]:
    seen = set()
    unique = []
    for match in matches:
        key = match["rule"]
        if key not in seen:
            seen.add(key)
            unique.append(match)
    return unique


def _compute_threat_level(matches: list[dict]) -> str:
    if not matches:
        return "clean"
    max_sev = max((SEVERITY_ORDER.get(match["severity"], 0) for match in matches), default=0)
    return {v: k for k, v in SEVERITY_ORDER.items()}.get(max_sev, "low")


def _scan_rules(url_value: str) -> list[dict]:
    matches = []
    url_lower = url_value.lower()

    for rule in URL_RULES:
        hit_count = 0
        matched_patterns = []

        for pattern in rule["patterns"]:
            search_data = url_lower if rule.get("case_insensitive") else url_value
            search_pattern = pattern.decode("utf-8", errors="ignore") if rule.get("case_insensitive") else pattern.decode("utf-8", errors="ignore")
            if search_pattern.lower() in search_data:
                hit_count += 1
                matched_patterns.append(search_pattern)

        if hit_count >= rule["condition"]:
            matches.append({
                "rule": rule["name"],
                "description": rule["description"],
                "severity": rule["severity"],
                "category": rule["category"],
                "matched_patterns": matched_patterns,
            })

    return matches


def _heuristic_checks(parsed_url, original_url: str) -> list[dict]:
    checks = []
    host = parsed_url.hostname or ""
    path = parsed_url.path or ""
    query = parsed_url.query or ""
    netloc = parsed_url.netloc or ""
    lower_url = original_url.lower()

    if parsed_url.scheme not in {"http", "https"}:
        checks.append({
            "rule": "Unsupported_URL_Scheme",
            "description": "URL uses a non-web scheme that may trigger unsafe behavior",
            "severity": "critical",
            "category": "url",
            "matched_patterns": [parsed_url.scheme],
        })

    if parsed_url.username or parsed_url.password:
        checks.append({
            "rule": "Embedded_Credentials_In_URL",
            "description": "URL embeds credentials in the authority section",
            "severity": "high",
            "category": "url",
            "matched_patterns": [netloc],
        })

    try:
        ipaddress.ip_address(host)
        checks.append({
            "rule": "IPAddress_Host",
            "description": "URL uses a raw IP address instead of a domain name",
            "severity": "medium",
            "category": "url",
            "matched_patterns": [host],
        })
    except ValueError:
        pass

    if host.startswith("xn--") or ".xn--" in host:
        checks.append({
            "rule": "Punycode_Domain",
            "description": "URL contains punycode that can hide a lookalike domain",
            "severity": "high",
            "category": "url",
            "matched_patterns": [host],
        })

    if len(original_url) >= 120:
        checks.append({
            "rule": "Long_URL",
            "description": "URL is unusually long and may be obfuscated",
            "severity": "low",
            "category": "url",
            "matched_patterns": [f"Length: {len(original_url)}"],
        })

    if host:
        host_parts = [part for part in host.split(".") if part]
        if len(host_parts) >= 5:
            checks.append({
                "rule": "Deep_Subdomain_Chain",
                "description": "URL has many nested subdomains, a common phishing pattern",
                "severity": "medium",
                "category": "url",
                "matched_patterns": [host],
            })

        if any(host.endswith(tld) for tld in SUSPICIOUS_TLDS):
            checks.append({
                "rule": "Suspicious_TLD",
                "description": "URL uses a top-level domain frequently abused in phishing campaigns",
                "severity": "medium",
                "category": "url",
                "matched_patterns": [host.rsplit(".", 1)[-1]],
            })

    if query:
        query_keys = parse_qs(query, keep_blank_values=True).keys()
        redirect_keys = {"redirect", "redir", "url", "next", "return", "continue", "dest"}
        if any(key.lower() in redirect_keys for key in query_keys):
            checks.append({
                "rule": "Query_Redirect_Parameter",
                "description": "URL includes a redirect parameter that can be used to hide the final destination",
                "severity": "medium",
                "category": "url",
                "matched_patterns": [query],
            })

    risky_keywords = ["login", "signin", "verify", "update", "secure", "account", "password", "wallet", "invoice"]
    if sum(1 for keyword in risky_keywords if keyword in lower_url) >= 2:
        checks.append({
            "rule": "URL_Phishing_Language",
            "description": "URL path or query includes multiple phishing-related terms",
            "severity": "high",
            "category": "url",
            "matched_patterns": [keyword for keyword in risky_keywords if keyword in lower_url],
        })

    if "%" in original_url and len(re.findall(r"%[0-9a-fA-F]{2}", original_url)) >= 3:
        checks.append({
            "rule": "Heavy_Encoding",
            "description": "URL contains heavy percent-encoding that can be used to hide malicious destinations",
            "severity": "medium",
            "category": "url",
            "matched_patterns": ["Percent-encoded sequences"],
        })

    if path.count("/") >= 6:
        checks.append({
            "rule": "Deep_Path",
            "description": "URL path is unusually deep and may be trying to evade detection",
            "severity": "low",
            "category": "url",
            "matched_patterns": [path],
        })

    return checks


def scan_url(raw_url: str) -> dict:
    """Scan a URL string and return a structured threat analysis result."""
    normalized_url, is_valid = _normalize_url(raw_url)
    parsed_url = urlparse(normalized_url) if normalized_url else urlparse("")

    rule_matches = _scan_rules(normalized_url)
    heuristic_matches = _heuristic_checks(parsed_url, normalized_url) if normalized_url else []
    all_matches = _deduplicate(rule_matches + heuristic_matches)

    if not normalized_url:
        threat_level = "clean"
        summary = "No URL was provided."
    else:
        threat_level = _compute_threat_level(all_matches)
        if not all_matches:
            summary = "No suspicious indicators were found in the URL."
        else:
            matched_rules = ", ".join(match["rule"] for match in all_matches)
            summary = f"Detected {len(all_matches)} URL threat indicator(s): {matched_rules}."

    return {
        "url": raw_url,
        "normalized_url": normalized_url,
        "threat_level": threat_level,
        "matches": all_matches,
        "summary": summary,
        "url_info": {
            "is_valid": is_valid,
            "scheme": parsed_url.scheme,
            "host": parsed_url.hostname,
            "path": parsed_url.path,
            "query": parsed_url.query,
            "length": len(normalized_url),
            "sha256": _sha256(normalized_url),
        },
        "scan_engine": "URL Rules",
    }