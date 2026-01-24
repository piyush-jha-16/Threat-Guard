import React from 'react';
import FileUpload from './FileUpload';
import './Documents.css';

const Documents = () => {
    const documentIcon = (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    return (
        <>
        <div className="documents-section">
            <div className="section-header">
                <div className="header-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className="header-content">
                    <h1>Document Scanner</h1>
                    <p>Upload documents to scan for malicious content and embedded threats</p>
                </div>
            </div>

            <div className="supported-formats">
                <h3>Supported Formats</h3>
                <div className="format-tags">
                    <span className="format-tag">PDF</span>
                    <span className="format-tag">DOC/DOCX</span>
                    <span className="format-tag">XLS/XLSX</span>
                    <span className="format-tag">PPT/PPTX</span>
                    <span className="format-tag">TXT</span>
                    <span className="format-tag">RTF</span>
                    <span className="format-tag">ODT</span>
                </div>
            </div>

            <FileUpload
                title="Upload Documents"
                description="Drag and drop your documents here, or click to browse"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.odt"
                icon={documentIcon}
                multiple={true}
            />
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

export default Documents;
