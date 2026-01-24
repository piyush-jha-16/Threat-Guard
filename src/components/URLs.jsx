import React, { useState } from 'react';
import './URLs.css';

const URLs = () => {
    const [urls, setUrls] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            // Basic URL validation
            try {
                const url = new URL(inputValue.trim());
                setUrls(prev => [...prev, { url: url.href, timestamp: new Date() }]);
                setInputValue('');
            } catch (error) {
                // If URL is invalid, still add it (user might want to check)
                setUrls(prev => [...prev, { url: inputValue.trim(), timestamp: new Date() }]);
                setInputValue('');
            }
        }
    };

    const removeUrl = (index) => {
        setUrls(prev => prev.filter((_, i) => i !== index));
    };

    const formatTimestamp = (date) => {
        return date.toLocaleTimeString();
    };

    return (
        <>
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
                    <div className="input-wrapper">
                        <div className="input-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.4791 3.53087C19.5521 2.60383 18.298 2.07799 16.987 2.0666C15.676 2.0552 14.413 2.55918 13.47 3.47L11.75 5.18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14 11C13.5705 10.4259 13.0226 9.95083 12.3934 9.60707C11.7643 9.26331 11.0685 9.05889 10.3533 9.00768C9.63819 8.95646 8.92037 9.05965 8.24861 9.31023C7.57685 9.5608 6.96689 9.95303 6.46 10.46L3.46 13.46C2.54918 14.403 2.04519 15.6661 2.05659 16.977C2.06798 18.288 2.59382 19.5421 3.52086 20.4691C4.44791 21.3962 5.70197 21.922 7.01296 21.9334C8.32394 21.9448 9.58695 21.4408 10.53 20.53L12.24 18.82" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Enter URL to scan (e.g., https://example.com)"
                            className="url-input"
                        />
                        <button type="submit" className="submit-btn">
                            <span>Scan</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>

            {urls.length > 0 && (
                <div className="urls-list">
                    <div className="urls-header">
                        <h4>Submitted URLs ({urls.length})</h4>
                        <button className="clear-all-btn" onClick={() => setUrls([])}>
                            Clear All
                        </button>
                    </div>
                    {urls.map((item, index) => (
                        <div key={index} className="url-item">
                            <div className="url-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                    <path d="M2 12H22" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                            <div className="url-info">
                                <span className="url-text">{item.url}</span>
                                <span className="url-time">Added at {formatTimestamp(item.timestamp)}</span>
                            </div>
                            <button className="remove-btn" onClick={() => removeUrl(index)}>
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
                    <a href="#privacy">Privacy Policy</a>
                    <span className="footer-divider">•</span>
                    <a href="#terms">Terms of Service</a>
                    <span className="footer-divider">•</span>
                    <a href="#contact">Contact</a>
                </div>
            </div>
        </footer>
        </>
    );
};

export default URLs;
