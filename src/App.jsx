import React, { useState, useEffect } from 'react';
import TopNavigation from './components/TopNavigation.jsx';
import BottomNavigation from './components/BottomNavigation.jsx';
import Login from './components/Login.jsx';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  useEffect(() => {
    // Apply theme class to document root
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    // Save theme preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const renderContent = () => {
    if (currentView === 'portal') {
      return <Login />;
    }
    
    return (
      <>
        <h1>Threat Guard</h1>
        <p>Security Monitoring System</p>
      </>
    );
  };

  return (
    <div className="App">
      <TopNavigation isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <div className="content">
        {renderContent()}
      </div>
      <BottomNavigation activeTab={currentView} onTabChange={setCurrentView} />
    </div>
  );
}

export default App;
