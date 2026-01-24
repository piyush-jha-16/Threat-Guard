import React, { useState, useEffect } from 'react';
import TopNavigation from './components/TopNavigation.jsx';
import BottomNavigation from './components/BottomNavigation.jsx';
import Login from './components/Login.jsx';
import Home from './components/Home.jsx';
import Documents from './components/Documents.jsx';
import Executables from './components/Executables.jsx';
import URLs from './components/URLs.jsx';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.querySelector('.content')?.scrollTop || 0;
      setIsScrolled(scrollTop > 100);
    };

    const contentElement = document.querySelector('.content');
    contentElement?.addEventListener('scroll', handleScroll);

    return () => {
      contentElement?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <Home />;
      case 'documents':
        return <Documents />;
      case 'executables':
        return <Executables />;
      case 'urls':
        return <URLs />;
      case 'portal':
        return <Login />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="App">
      <TopNavigation isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <div className="content">
        {renderContent()}
      </div>
      <BottomNavigation activeTab={currentView} onTabChange={setCurrentView} isScrolled={isScrolled} />
    </div>
  );
}

export default App;
