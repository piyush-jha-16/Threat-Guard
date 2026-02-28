import React, { useState, useRef } from 'react';
import './FileUpload.css';

const BACKEND_URL = 'http://localhost:5000';

const FileUpload = ({ accept, multiple = true, title, description, icon, onScanComplete }) => {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [scanState, setScanState] = useState('idle'); // idle | scanning | done | error
    const [scanError, setScanError] = useState(null);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFiles(droppedFiles);
    };

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        handleFiles(selectedFiles);
    };

    const handleFiles = (newFiles) => {
        setScanState('idle');
        setScanError(null);
        if (multiple) {
            setFiles(prev => [...prev, ...newFiles]);
        } else {
            setFiles(newFiles.slice(0, 1));
        }
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        if (files.length <= 1) {
            setScanState('idle');
            setScanError(null);
            if (onScanComplete) onScanComplete(null);
        }
    };

    const clearAll = () => {
        setFiles([]);
        setScanState('idle');
        setScanError(null);
        if (onScanComplete) onScanComplete(null);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const handleScan = async () => {
        if (!files.length) return;
        setScanState('scanning');
        setScanError(null);
        if (onScanComplete) onScanComplete(null); // clear previous results

        const formData = new FormData();
        files.forEach(file => formData.append('files', file));

        try {
            const response = await fetch(`${BACKEND_URL}/api/scan`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || `Server error: ${response.status}`);
            }

            const data = await response.json();
            setScanState('done');
            if (onScanComplete) onScanComplete(data);
        } catch (err) {
            console.error('[FileUpload] Scan error:', err);
            setScanState('error');
            setScanError(
                err.message.includes('fetch') || err.message.includes('Failed')
                    ? 'Cannot reach backend. Make sure the Flask server is running on port 5000.'
                    : err.message
            );
        }
    };

    return (
        <div className="file-upload-container">
            <div
                className={`upload-zone ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />

                <div className="upload-icon">
                    {icon || (
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </div>

                <h3 className="upload-title">{title || 'Upload Files'}</h3>
                <p className="upload-description">
                    {description || 'Drag and drop files here, or click to select'}
                </p>
                <p className="upload-hint">
                    {accept ? `Accepted: ${accept}` : 'All file types accepted'}
                </p>
            </div>

            {files.length > 0 && (
                <div className="files-list">
                    <div className="files-header">
                        <div className="header-left">
                            <h4>Uploaded Files ({files.length})</h4>
                            <button
                                className={`scan-btn ${scanState === 'scanning' ? 'scanning' : ''}`}
                                onClick={handleScan}
                                disabled={scanState === 'scanning'}
                            >
                                {scanState === 'scanning' ? (
                                    <>
                                        <span className="scan-spinner" />
                                        Scanning…
                                    </>
                                ) : (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.134 17 3 13.866 3 10C3 6.134 6.134 3 10 3C13.866 3 17 6.134 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        {scanState === 'done' ? 'Re-scan' : 'Start Scan'}
                                    </>
                                )}
                            </button>
                        </div>
                        <button className="clear-all-btn" onClick={clearAll}>
                            Clear All
                        </button>
                    </div>

                    {scanState === 'error' && scanError && (
                        <div className="scan-error-banner">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            {scanError}
                        </div>
                    )}

                    {files.map((file, index) => (
                        <div key={index} className="file-item">
                            <div className="file-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="file-info">
                                <span className="file-name">{file.name}</span>
                                <span className="file-size">{formatFileSize(file.size)}</span>
                            </div>
                            <button className="remove-btn" onClick={() => removeFile(index)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
