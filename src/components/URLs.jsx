import React, { useState } from 'react';
import './URLs.css';

const BACKEND_URL = 'http://localhost:5000';

const THREAT_LABELS = {
    clean: 'Clean',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
};

const URLs = () => {
    const [inputValue, setInputValue] = useState('');
    const [scans, setScans] = useState([]);
    const [scanState, setScanState] = useState('idle');
    const [scanError, setScanError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = inputValue.trim();
        if (!url) {
            return;
        }

        setScanState('scanning');
        setScanError(null);

        try {
            const response = await fetch(`${BACKEND_URL}/api/scan-url`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || `Server error: ${response.status}`);
            }

            const data = await response.json();
            setScans(prev => [{ ...data, scanned_at: new Date().toISOString() }, ...prev]);
            setInputValue('');
            setScanState('done');
        } catch (error) {
            console.error('[URLs] Scan error:', error);
            setScanState('error');
            setScanError(
                error.message.includes('fetch') || error.message.includes('Failed')
                    ? 'Cannot reach backend. Make sure the Flask server is running on port 5000.'
                    : error.message
            );
        }
    };

    const removeScan = (index) => {
        setScans(prev => prev.filter((_, i) => i !== index));
    };

    const clearAll = () => {
        setScans([]);
        setScanState('idle');
        setScanError(null);
    };

    const formatTimestamp = (value) => {
        const date = new Date(value);
        return date.toLocaleString();
    };

    const getThreatClass = (level) => {
        return `threat-badge ${level || 'clean'}`;
    };

    return (
        <div className="urls-page-container">
            <div className="urls-section">
                <div className="section-header">
                    <div className="header-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="header-content">
                        <h1>URL Scanner</h1>
                        <p>Check URLs for phishing, malware, and security threats</p>
                    </div>
                </div>

                <div className="url-input-container">
                    <form onSubmit={handleSubmit} className="url-input-form">
                        <div className="url-input-wrapper">
                            <div className="url-input-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.4791 3.53087C19.5521 2.60383 18.298 2.07799 16.987 2.0666C15.676 2.0552 14.413 2.55918 13.47 3.47L11.75 5.18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M14 11C13.5705 10.4259 13.0226 9.95083 12.3934 9.60707C11.7643 9.26331 11.0685 9.05889 10.3533 9.00768C9.63819 8.95646 8.92037 9.05965 8.24861 9.31023C7.57685 9.5608 6.96689 9.95303 6.46 10.46L3.46 13.46C2.54918 14.403 2.04519 15.6661 2.05659 16.977C2.06798 18.288 2.59382 19.5421 3.52086 20.4691C4.44791 21.3962 5.70197 21.922 7.01296 21.9334C8.32394 21.9448 9.58695 21.4408 10.53 20.53L12.24 18.82" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Enter URL to scan, for example https://example.com/login"
                                className="url-input"
                            />
                            <button type="submit" className="submit-btn">
                                <span>{scanState === 'scanning' ? 'Scanning…' : 'Scan URL'}</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>

                {scanError && (
                    <div className="scan-error-banner url-error">
                        {scanError}
                    </div>
                )}

                {scans.length > 0 && (
                    <div className="urls-list">
                        <div className="urls-header">
                            <h4>Scan History ({scans.length})</h4>
                            <button className="clear-all-btn" onClick={clearAll}>
                                Clear All
                            </button>
                        </div>
                        {scans.map((item, index) => (
                            <div key={index} className={`url-item threat-${item.threat_level || 'clean'}`}>
                                <div className="url-icon threat-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                        <path d="M2 12H22" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </div>
                                <div className="url-info url-result-info">
                                    <span className="url-text">{item.normalized_url || item.url}</span>
                                    <span className={getThreatClass(item.threat_level)}>{THREAT_LABELS[item.threat_level] || 'Unknown'}</span>
                                    <span className="url-time">Scanned at {formatTimestamp(item.scanned_at)}</span>
                                    <span className="url-summary">{item.summary}</span>
                                    {item.matches?.length > 0 && (
                                        <div className="url-match-tags">
                                            {item.matches.map((match) => (
                                                <span key={match.rule} className="url-match-tag">
                                                    {match.rule}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button className="remove-btn" onClick={() => removeScan(index)}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <footer className="home-footer">
                <div className="footer-content">
                    <p>&copy; 2026 Threat Guard. All rights reserved.</p>
                    <div className="footer-links">
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>Rule Based Detection</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default URLs;
