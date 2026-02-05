import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="auth-container">
      <div className="auth-section">
        <div className="auth-wrapper">
          {/* Login Form */}
          <div className={`auth-box login-box ${isLogin ? 'active' : ''}`}>
            <div className="auth-header">
              <h2>Welcome Back</h2>
              <p>Sign in to your Threat Guard account</p>
            </div>
            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <input type="email" placeholder="name@company.com" required />
                </div>
              </div>
              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                  <input type="password" placeholder="Enter your password" required />
                </div>
              </div>
              <button type="submit" className="auth-button">Sign In</button>
            </form>
            <div className="auth-footer">
              <p>Don't have an account? <button className="switch-button" onClick={toggleAuthMode}>Sign Up</button></p>
            </div>
          </div>

          {/* Register Form */}
          <div className={`auth-box register-box ${!isLogin ? 'active' : ''}`}>
            <div className="auth-header">
              <h2>Create Account</h2>
              <p>Join Threat Guard for advanced security</p>
            </div>
            <form className="auth-form register-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <input type="text" placeholder="John" required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <div className="input-wrapper">
                    <div className="input-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <input type="text" placeholder="Doe" required />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <input type="email" placeholder="name@company.com" required />
                </div>
              </div>
              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                  <input type="password" placeholder="Create a password" required />
                </div>
              </div>
              <button type="submit" className="auth-button">Create Account</button>
            </form>
            <div className="auth-footer">
              <p>Already have an account? <button className="switch-button" onClick={toggleAuthMode}>Sign In</button></p>
            </div>
          </div>
        </div>
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

export default Login;
