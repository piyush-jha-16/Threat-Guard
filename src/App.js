import React from 'react';
import BottomNavigation from './components/BottomNavigation';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="content">
        <h1>Threat Guard</h1>
        <p>Security Monitoring System</p>
      </div>
      <BottomNavigation />
    </div>
  );
}

export default App;
