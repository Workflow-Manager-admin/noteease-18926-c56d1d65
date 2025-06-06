import React, { createContext, useMemo, useState, useEffect, useContext } from 'react';
import './App.css';
import MainContainer from './MainContainer';

// Create ThemeContext and helper hook
const ThemeContext = createContext();

/**
 * PUBLIC_INTERFACE
 * Custom hook to access theme context
 */
export function useTheme() {
  return useContext(ThemeContext);
}

// PUBLIC_INTERFACE
function App() {
  // Check system preference for default
  const getPreferred = () => {
    if (typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  };

  const [theme, setTheme] = useState(getPreferred);

  // Persist theme preference
  useEffect(() => {
    const stored = localStorage.getItem('noteease-theme');
    if (stored && (stored === 'dark' || stored === 'light')) setTheme(stored);
  }, []);
  useEffect(() => {
    // Update CSS variables for theme
    if (theme === 'dark') {
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    } else {
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
    }
    localStorage.setItem('noteease-theme', theme);
  }, [theme]);

  const contextValue = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <div className="app">
        <nav className="navbar">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div className="logo">
                <span className="logo-symbol">*</span> <span style={{ color: '#4A90E2' }}>NoteEase</span>
              </div>
              <span style={{ fontWeight: 400, color: "var(--navbar-desc)", fontSize: 17 }}>Take smart notes</span>
            </div>
          </div>
        </nav>
        <MainContainer />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;