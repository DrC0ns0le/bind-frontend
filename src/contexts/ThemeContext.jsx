import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Theme can be 'light', 'dark', or 'system' (null means system)
  const [themeMode, setThemeMode] = useState(() => {
    const saved = localStorage.getItem('themeMode');
    return saved || 'system'; // default to system preference
  });

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const applyTheme = () => {
      let shouldBeDark;

      if (themeMode === 'system') {
        // Follow system preference
        shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        // Use explicit user choice
        shouldBeDark = themeMode === 'dark';
      }

      setIsDarkMode(shouldBeDark);

      // Apply classes to document
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();

    // Listen for system preference changes when in system mode
    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme();
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prev => {
      // Cycle through: light → dark → system → light
      let newMode;
      if (prev === 'light') {
        newMode = 'dark';
      } else if (prev === 'dark') {
        newMode = 'system';
      } else {
        newMode = 'light';
      }

      if (newMode === 'system') {
        localStorage.removeItem('themeMode');
      } else {
        localStorage.setItem('themeMode', newMode);
      }

      return newMode;
    });
  };

  const setSystemTheme = () => {
    setThemeMode('system');
    localStorage.removeItem('themeMode');
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, themeMode, toggleTheme, setSystemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
