# Threat Guard URL Scanner Guide

## Overview

The URL scanner in Threat Guard is a backend, rule-based detector implemented in `backend/url_scanner.py` and exposed through a Flask API endpoint in `backend/app.py`.

It is designed to identify suspicious or malicious URL characteristics using:

- Static pattern rules
- Structural heuristics
- Severity-based aggregation (clean -> critical)

This scanner does **not** currently call external reputation feeds (for example Google Safe Browsing or VirusTotal). Detection is based on local logic only.

---

## High-Level Flow

1. User submits a URL from the frontend page (`src/components/URLs.jsx`).
2. Frontend sends `POST /api/scan-url` with JSON payload `{ "url": "..." }`.
3. Flask endpoint (`scan_url_endpoint`) validates input and calls `scan_url(raw_url)`.
4. URL scanner performs normalization, rule matching, and heuristic analysis.
5. Scanner returns a structured JSON response with:
   - `threat_level`
   - `matches`
   - `summary`
   - parsed URL metadata (`url_info`)
6. Frontend displays threat badge, summary text, and matched indicators.

---

## API Contract

### Endpoint

- Method: `POST`
- Route: `/api/scan-url`
- Content-Type: `application/json`

### Request Body

```json
{
  "url": "https://example.com/login?next=https://evil.site"
}
```

### Success Response (example)

```json
{
  "url": "https://example.com/login?next=https://evil.site",
  "normalized_url": "https://example.com/login?next=https://evil.site",
  "threat_level": "high",
  "matches": [
    {
      "rule": "URL_Phishing_Keywords",
      "description": "Detects common phishing keywords in URL path or query",
      "severity": "high",
      "category": "url",
      "matched_patterns": ["login", "secure"]
    },
    {
      "rule": "Query_Redirect_Parameter",
      "description": "URL includes a redirect parameter that can be used to hide the final destination",
      "severity": "medium",
      "category": "url",
      "matched_patterns": ["next=https://evil.site"]
    }
  ],
  "summary": "Detected 2 URL threat indicator(s): URL_Phishing_Keywords, Query_Redirect_Parameter.",
  "url_info": {
    "is_valid": true,
    "scheme": "https",
    "host": "example.com",
    "path": "/login",
    "query": "next=https://evil.site",
    "length": 55,
    "sha256": "<sha256-hash>"
  },
  "scan_engine": "URL Rules"
}
```

### Error Responses

- `400`: no URL provided
- `500`: scanner exception

---

## Core Components

## 1. URL Normalization

Function: `_normalize_url(raw_url)`

Behavior:

- Trims whitespace
- Adds default scheme `http://` when user omits a scheme
- Validates URL structure using `urlparse`
- Returns:
  - normalized URL string
  - boolean validity flag

Example:

- Input: `example.com/login`
- Normalized: `http://example.com/login`

---

## 2. Static Rule Matching

Function: `_scan_rules(url_value)`

Rule metadata includes:

- `name`
- `description`
- `severity`
- `category`
- `patterns`
- `condition` (minimum hit count)
- `case_insensitive`

A rule matches only when number of matched patterns is `>= condition`.

### Current Rules

1. `URL_Phishing_Keywords` (high)
- Detects phishing language in URL text
- Keywords include: `login`, `signin`, `verify`, `update`, `account`, `password`, `payment`, and similar
- Condition: 2 or more keyword hits

2. `URL_Redirect_Parameters` (medium)
- Detects redirect chaining parameters
- Patterns include: `redirect=`, `url=`, `next=`, `continue=`, `return=`, `goto=`
- Condition: at least 1 hit

3. `URL_Obfuscation_Indicators` (medium)
- Detects URL obfuscation markers
- Patterns include: `%2e`, `%2f`, `%40`, `%3a`, `xn--`
- Condition: at least 2 hits

4. `Dangerous_URL_Schemes` (critical)
- Detects dangerous non-web schemes
- Patterns include: `javascript:`, `data:`, `vbscript:`, `file:`
- Condition: at least 1 hit

---

## 3. Heuristic Checks

Function: `_heuristic_checks(parsed_url, original_url)`

These checks evaluate URL structure and suspicious characteristics beyond direct pattern matching.

### Heuristics in Scanner

1. `Unsupported_URL_Scheme` (critical)
- Triggered when scheme is not `http` or `https`

2. `Embedded_Credentials_In_URL` (high)
- Triggered when URL authority contains username or password
- Example: `http://user:pass@example.com`

3. `IPAddress_Host` (medium)
- Triggered when hostname is a raw IP address instead of domain name

4. `Punycode_Domain` (high)
- Triggered when host uses punycode (`xn--`)

5. `Long_URL` (low)
- Triggered when URL length is at least 120 characters

6. `Deep_Subdomain_Chain` (medium)
- Triggered when hostname has many labels (5 or more parts)

7. `Suspicious_TLD` (medium)
- Triggered when host ends with configured high-risk TLD list
- Includes examples like `.zip`, `.top`, `.xyz`, `.click`, `.ru`, `.cn`, `.tk`, and others

8. `Query_Redirect_Parameter` (medium)
- Triggered when query keys include redirect-like semantics
- Keys include: `redirect`, `redir`, `url`, `next`, `return`, `continue`, `dest`

9. `URL_Phishing_Language` (high)
- Triggered when at least 2 risky words are present in URL text
- Keyword set includes terms like `login`, `verify`, `secure`, `account`, `password`, `wallet`, `invoice`

10. `Heavy_Encoding` (medium)
- Triggered when URL contains at least 3 percent-encoded byte sequences

11. `Deep_Path` (low)
- Triggered when URL path depth is high (`/` count >= 6)

---

## Deduplication and Severity Aggregation

### Deduplication

Function: `_deduplicate(matches)`

- If the same rule appears multiple times, scanner keeps one entry per rule name.

### Threat Level Selection

Function: `_compute_threat_level(matches)`

Severity order:

- clean = 0
- low = 1
- medium = 2
- high = 3
- critical = 4

Final `threat_level` is the maximum severity among all matched indicators.

Examples:

- Only low findings -> `low`
- Medium + high findings -> `high`
- Any critical finding -> `critical`
- No findings -> `clean`

---

## Output Fields Explained

`scan_url(raw_url)` returns:

- `url`: original input as submitted
- `normalized_url`: scanner-normalized URL used for analysis
- `threat_level`: final severity bucket
- `matches`: list of triggered rule/heuristic objects
- `summary`: human-readable explanation
- `url_info`:
  - `is_valid`: parse validity flag
  - `scheme`, `host`, `path`, `query`
  - `length`: normalized URL length
  - `sha256`: hash fingerprint of normalized URL
- `scan_engine`: fixed value `URL Rules`

---

## Frontend Rendering Behavior

In `src/components/URLs.jsx`:

- Submits user input to backend route `/api/scan-url`
- Stores returned scan objects in local history state
- Displays:
  - threat badge (`clean`, `low`, `medium`, `high`, `critical`)
  - scan summary text
  - matched rule tags
  - scanned timestamp

---

## Example Trigger Scenarios

1. Suspicious redirect chain

Input:

`https://trusted.example.com/login?next=http://evil.xyz`

Likely findings:

- `URL_Phishing_Keywords` (if enough phishing words)
- `URL_Redirect_Parameters` or `Query_Redirect_Parameter`
- `Suspicious_TLD` (if ending TLD is in list)

2. Dangerous scheme payload

Input:

`javascript:alert('xss')`

Likely findings:

- `Dangerous_URL_Schemes`
- `Unsupported_URL_Scheme`

Final level likely: `critical`

3. Obfuscated lookalike link

Input:

`http://xn--paypa1-4ve.com/%2f%2e%40/login/secure`

Likely findings:

- `URL_Obfuscation_Indicators`
- `Punycode_Domain`
- `Heavy_Encoding`
- phishing language rules

---

## Strengths

- Fast local analysis with no external dependency
- Explainable findings with matched rules and patterns
- Consistent severity model for UI and API consumers
- Works even in offline or restricted environments

---

## Current Limitations

1. No reputation intelligence
- Does not verify against live blocklists/safe-browsing feeds

2. Potential false positives
- Legitimate URLs can include redirect params or long encoded paths

3. Potential false negatives
- Newly registered malicious domains without obvious lexical signals may pass as clean

4. No active content inspection
- Scanner does not fetch URL destination content, redirects, TLS cert profile, WHOIS age, or hosting risk

---

## Recommended Improvements

1. Integrate reputation APIs
- Google Safe Browsing
- VirusTotal URL scan/reputation

2. Add allowlist and organization policy controls
- Internal trusted domains
- Environment-specific exceptions

3. Add confidence scoring
- Combine severity with weighted confidence score

4. Add telemetry and tuning
- Track false positive/false negative feedback
- Update suspicious TLD and keyword sets periodically

5. Add unit tests for rule coverage
- Ensure each rule has positive and negative test vectors

---

## Quick Test Checklist

Use these sample categories in local tests:

1. Clean URL
- `https://example.com/docs`

2. Phishing language
- `https://service.example.com/verify/account/update`

3. Redirect parameter abuse
- `https://safe.example.com?next=http://evil.site`

4. Dangerous scheme
- `data:text/html;base64,PHNjcmlwdD4=`

5. Punycode and encoding
- `http://xn--something.com/%2f%2e%40/path`

6. IP-based host
- `http://185.99.10.12/login`

---

## File References

- Scanner logic: `backend/url_scanner.py`
- URL API endpoint: `backend/app.py`
- URL scanner frontend page: `src/components/URLs.jsx`

---

## Summary

Threat Guard URL scanning currently uses deterministic, explainable rule and heuristic logic. It is effective for identifying many common phishing and malicious URL patterns, especially lexical and structural indicators, and produces a transparent result model suitable for UI display and API integration. For production-grade coverage, combine this with external reputation intelligence and ongoing rule tuning.
