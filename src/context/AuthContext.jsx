import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

// Helper for environment-aware logging
const devError = (...args) => {
  if (import.meta.env.DEV) {
    console.error?.(...args);
  }
};

export const AuthProvider = ({ children }) => {
  // Initialize admin from localStorage synchronously to avoid flash
  const [admin, setAdmin] = useState(() => authService.getStoredAdmin());
  const [loading, setLoading] = useState(true);

  // Check authentication on mount - synchronous localStorage check first
  useEffect(() => {
    const token = localStorage.getItem('vibeit_token');
    const adminData = localStorage.getItem('vibeit_admin');
    
    if (token && adminData) {
      try {
        setAdmin(JSON.parse(adminData));
      } catch (e) {
        devError('Failed to parse admin data:', e);
        authService.logout();
        setAdmin(null);
      }
    } else {
      setAdmin(null);
    }
    setLoading(false);
  }, []);

  /**
   * Login function
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<object>}
   */
  const login = async (email, password) => {
    const response = await authService.login(email, password);
    // Handle both {token, admin} and {token, ...adminData} response formats
    const adminData = response.admin || response;
    setAdmin(adminData);
    return response;
  };

  /**
   * Logout function
   */
  const logout = () => {
    authService.logout();
    setAdmin(null);
  };

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  const isAuthenticated = () => {
    return authService.isAuthenticated();
  };

  const value = {
    admin,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use auth context
 * @returns {{admin: object, loading: boolean, login: Function, logout: Function, isAuthenticated: Function}}
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
