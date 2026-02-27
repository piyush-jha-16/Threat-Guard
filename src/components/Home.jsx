import React, { useState, useEffect } from 'react';
import './Home.css';

const Home = () => {
    const [showFeatures, setShowFeatures] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const contentElement = document.querySelector('.content');
            const scrollPosition = contentElement?.scrollTop || 0;
            setShowFeatures(scrollPosition > 100);
        };

        const contentElement = document.querySelector('.content');
        contentElement?.addEventListener('scroll', handleScroll);
        return () => contentElement?.removeEventListener('scroll', handleScroll);
    }, []);
    const features = [
        {
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            title: 'Document Scanning',
            description: 'Analyze PDFs, Office files, and other documents for hidden malware, malicious macros, and embedded threats. Our deep inspection detects even the most sophisticated document-based attacks.'
        },
        {
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="9" y1="1" x2="9" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="15" y1="1" x2="15" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="9" y1="20" x2="9" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="15" y1="20" x2="15" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="20" y1="9" x2="23" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="20" y1="14" x2="23" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="1" y1="9" x2="4" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="1" y1="14" x2="4" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            title: 'Executable Analysis',
            description: 'Perform static and behavioral analysis on executable files. Detect trojans, ransomware, and other malicious programs before they can harm your system with our advanced sandbox technology.'
        },
        {
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            title: 'URL Inspection',
            description: 'Check URLs for phishing attempts, malware distribution, and suspicious redirects. Get real-time threat intelligence and reputation scoring for any web address before clicking.'
        },
        {
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            title: 'Real-time Protection',
            description: 'Stay protected with continuous monitoring and instant threat alerts. Our AI-powered engine learns from millions of samples to provide cutting-edge protection against emerging threats.'
        }
    ];

    return (
        <div className="home-section">
            <header className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="hero-badge-dot"></span>
                        <span>Trusted Security Platform</span>
                    </div>
                    <h1 className="hero-title">Enterprise-Grade Security Analysis</h1>
                    <p className="hero-description">
                        Comprehensive threat detection and analysis platform for modern security operations.
                        Protect your organization with advanced scanning capabilities and real-time monitoring.
                    </p>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-number">90%</span>
                            <span className="stat-label">Threat Detection Rate</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-number">&lt;5s</span>
                            <span className="stat-label">Average Scan Time</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-number">Secure</span>
                            <span className="stat-label">Scanning is done safely</span>
                        </div>
                    </div>
                </div>
                <div className="scroll-indicator">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </header>

            <div className={`features-grid ${showFeatures ? 'visible' : ''}`}>
                {features.map((feature, index) => (
                    <div className="feature-card" key={index}>
                        <div className="feature-icon">
                            {feature.icon}
                        </div>
                        <div className="feature-content">
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    </div>
                ))}
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
        </div>
    );
};

export default Home;
