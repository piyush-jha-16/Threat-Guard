import React, { useState, useEffect } from 'react';
import './ScanResults.css';

const SEVERITY_CONFIG = {
    clean: { label: 'CLEAN', icon: '✓', class: 'severity-clean' },
    low: { label: 'LOW', icon: '⚠', class: 'severity-low' },
    medium: { label: 'MEDIUM', icon: '⚠', class: 'severity-medium' },
    high: { label: 'HIGH', icon: '✕', class: 'severity-high' },
    critical: { label: 'CRITICAL', icon: '☠', class: 'severity-critical' },
    unknown: { label: 'UNKNOWN', icon: '?', class: 'severity-unknown' },
};

const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

const ThreatBadge = ({ level }) => {
    const config = SEVERITY_CONFIG[level] || SEVERITY_CONFIG.unknown;
    return (
        <div className={`threat-badge ${config.class}`}>
            <span className="badge-icon">{config.icon}</span>
            <span className="badge-label">{config.label}</span>
        </div>
    );
};

const FileResult = ({ result, index }) => {
    const [expanded, setExpanded] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), index * 80);
        return () => clearTimeout(timer);
    }, [index]);

    const config = SEVERITY_CONFIG[result.threat_level] || SEVERITY_CONFIG.unknown;
    const hasMatches = result.matches && result.matches.length > 0;

    if (result.error) {
        return (
            <div className={`file-result error-result ${visible ? 'visible' : ''}`}>
                <div className="result-header">
                    <div className="result-filename">
                        <span className="file-icon-svg">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M14 2H6C4.9 2 4 2.9 4 4v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z" stroke="currentColor" strokeWidth="2" />
                                <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </span>
                        {result.filename}
                    </div>
                    <div className="threat-badge severity-unknown">
                        <span className="badge-icon">!</span>
                        <span className="badge-label">ERROR</span>
                    </div>
                </div>
                <p className="error-message">{result.error}</p>
            </div>
        );
    }

    return (
        <div className={`file-result ${config.class.replace('severity-', 'result-')} ${visible ? 'visible' : ''}`}>
            <div className="result-header" onClick={() => hasMatches && setExpanded(!expanded)}>
                <div className="result-filename">
                    <span className="file-icon-svg">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M14 2H6C4.9 2 4 2.9 4 4v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z" stroke="currentColor" strokeWidth="2" />
                            <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </span>
                    <div className="filename-stack">
                        <span className="filename-text">{result.filename}</span>
                        <span className="file-meta">
                            {result.file_info?.type} &bull; {formatBytes(result.file_info?.size || 0)}
                        </span>
                    </div>
                </div>
                <div className="result-right">
                    <ThreatBadge level={result.threat_level} />
                    {hasMatches && (
                        <span className={`expand-arrow ${expanded ? 'rotated' : ''}`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    )}
                </div>
            </div>

            <div className="result-summary">{result.summary}</div>

            {expanded && hasMatches && (
                <div className="matches-section">
                    <div className="matches-grid">
                        {result.matches.map((match, i) => (
                            <MatchCard key={i} match={match} />
                        ))}
                    </div>

                    {result.file_info && (
                        <div className="file-hashes">
                            <h5 className="hashes-title">File Metadata</h5>
                            <div className="hash-row">
                                <span className="hash-label">SHA-256</span>
                                <code className="hash-value">{result.file_info.sha256}</code>
                            </div>
                            <div className="hash-row">
                                <span className="hash-label">MD5</span>
                                <code className="hash-value">{result.file_info.md5}</code>
                            </div>
                            <div className="hash-row">
                                <span className="hash-label">Entropy</span>
                                <span className="hash-value">{result.file_info.entropy} / 8.0</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const MatchCard = ({ match }) => {
    const sev = match.severity?.toLowerCase() || 'medium';
    return (
        <div className={`match-card match-${sev}`}>
            <div className="match-header">
                <span className={`match-severity severity-dot-${sev}`}>{sev.toUpperCase()}</span>
                <span className="match-category">{match.category}</span>
            </div>
            <div className="match-rule">{match.rule.replace(/_/g, ' ')}</div>
            <div className="match-desc">{match.description}</div>
            {match.matched_patterns && match.matched_patterns.length > 0 && (
                <div className="match-patterns">
                    {match.matched_patterns.slice(0, 4).map((p, i) => (
                        <code key={i} className="pattern-tag">{p}</code>
                    ))}
                    {match.matched_patterns.length > 4 && (
                        <code className="pattern-tag more-tag">+{match.matched_patterns.length - 4} more</code>
                    )}
                </div>
            )}
        </div>
    );
};

const ScanResults = ({ results, scanEngine, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 50);
        return () => clearTimeout(timer);
    }, []);

    if (!results) return null;

    const overallLevel = results.overall_threat_level || 'clean';
    const config = SEVERITY_CONFIG[overallLevel] || SEVERITY_CONFIG.unknown;
    const fileResults = results.results || [];

    return (
        <div className={`scan-results-container ${visible ? 'visible' : ''}`}>
            {/* Overall summary bar */}
            <div className={`scan-summary-bar ${config.class}`}>
                <div className="summary-left">
                    <div className="summary-icon">{config.icon}</div>
                    <div className="summary-text">
                        <h3>Scan Complete</h3>
                        <p>
                            {fileResults.length} file{fileResults.length !== 1 ? 's' : ''} scanned &bull; Overall threat level: <strong>{config.label}</strong>
                        </p>
                    </div>
                </div>
                <div className="summary-right">
                    {scanEngine && (
                        <span className="engine-badge">{scanEngine}</span>
                    )}
                    <button className="close-results-btn" onClick={onClose} title="Close results">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Per-file results */}
            <div className="file-results-list">
                {fileResults.map((result, i) => (
                    <FileResult key={i} result={result} index={i} />
                ))}
            </div>
        </div>
    );
};

export default ScanResults;
