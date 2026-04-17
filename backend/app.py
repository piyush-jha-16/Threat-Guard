import os
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
from scanner import scan_file
from url_scanner import scan_url

YARA_AVAILABLE = False

app = Flask(__name__)

# Allow all origins for local development (React dev server on :3000)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Maximum upload size: 50 MB
app.config["MAX_CONTENT_LENGTH"] = 50 * 1024 * 1024


# ─── Health check ─────────────────────────────────────────────────────────────

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "scan_engine": "Python Rules",
        "max_file_size_mb": 50,
    })


# ─── Rules list ───────────────────────────────────────────────────────────────

@app.route("/api/rules", methods=["GET"])
def list_rules():
    from scanner import PYTHON_RULES
    rules_info = [
        {
            "name": r["name"],
            "description": r["description"],
            "severity": r["severity"],
            "category": r["category"],
        }
        for r in PYTHON_RULES
    ]
    return jsonify({
        "engine": "Python Rules" + (" + YARA" if YARA_AVAILABLE else ""),
        "total_rules": len(rules_info),
        "rules": rules_info,
    })


# ─── Scan endpoint ────────────────────────────────────────────────────────────

@app.route("/api/scan", methods=["POST"])
def scan():
    if "files" not in request.files:
        return jsonify({"error": "No files provided. Send files using the 'files' field."}), 400

    uploaded_files = request.files.getlist("files")
    if not uploaded_files or all(f.filename == "" for f in uploaded_files):
        return jsonify({"error": "No files selected."}), 400

    results = []

    for uploaded_file in uploaded_files:
        filename = uploaded_file.filename or "unknown"
        try:
            file_data = uploaded_file.read()
            if not file_data:
                results.append({
                    "filename": filename,
                    "error": "File is empty.",
                    "threat_level": "unknown",
                })
                continue

            scan_result = scan_file(file_data, filename)
            results.append(scan_result)

        except Exception as e:
            traceback.print_exc()
            results.append({
                "filename": filename,
                "error": f"Scan failed: {str(e)}",
                "threat_level": "unknown",
            })

    # Overall threat level = highest across all files
    level_map = {"clean": 0, "low": 1, "medium": 2, "high": 3, "critical": 4, "unknown": -1}
    max_level = max(
        (level_map.get(r.get("threat_level", "unknown"), -1) for r in results),
        default=0,
    )
    overall_level = {v: k for k, v in level_map.items() if v >= 0}.get(max_level, "clean")

    return jsonify({
        "scan_complete": True,
        "files_scanned": len(results),
        "overall_threat_level": overall_level,
        "results": results,
    })


# ─── URL scan endpoint ──────────────────────────────────────────────────────

@app.route("/api/scan-url", methods=["POST"])
def scan_url_endpoint():
    payload = request.get_json(silent=True) or {}
    raw_url = (payload.get("url") or request.form.get("url") or "").strip()

    if not raw_url:
        return jsonify({"error": "No URL provided."}), 400

    try:
        result = scan_url(raw_url)
        return jsonify(result)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"URL scan failed: {str(e)}"}), 500


# ─── Error handlers ───────────────────────────────────────────────────────────

@app.errorhandler(413)
def too_large(e):
    return jsonify({"error": "File too large. Maximum size is 50 MB."}), 413


@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found."}), 404


@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Internal server error."}), 500


# ─── Entry point ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"[Threat Guard Backend] Starting on port {port}")
    app.run(host="0.0.0.0", port=port, debug=True)
