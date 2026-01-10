import React, { useState } from 'react';
import TopNavigation from './components/TopNavigation.jsx';
import BottomNavigation from './components/BottomNavigation.jsx';
import Login from './components/Login.jsx';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');

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
      <TopNavigation />
      <div className="content">
        {renderContent()}
      </div>
      <BottomNavigation activeTab={currentView} onTabChange={setCurrentView} />
    </div>
  );
}

export default App;
