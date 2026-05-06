import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isInitialized, setIsInitialized] = useState(true);

  useEffect(() => {
    // Enforce light theme for SimplyTek UI
    setTheme('light');
    document.documentElement.classList.remove('dark');
    localStorage.setItem('vibeit-theme', 'light');
  }, []);

  const toggleTheme = () => {
    // Theme toggle disabled
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isInitialized }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
