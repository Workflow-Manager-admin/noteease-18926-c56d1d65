import React from 'react';
import './App.css';
import MainContainer from './MainContainer';

// PUBLIC_INTERFACE
function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> <span style={{ color: '#4A90E2' }}>NoteEase</span>
            </div>
            <span style={{ fontWeight: 400, color: "#adb8be", fontSize: 17 }}>Take smart notes</span>
          </div>
        </div>
      </nav>
      <MainContainer />
    </div>
  );
}

export default App;