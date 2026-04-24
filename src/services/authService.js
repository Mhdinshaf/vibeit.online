import api from './api';

const TOKEN_KEY = 'vibeit_token';
const ADMIN_KEY = 'vibeit_admin';

// Helper for environment-aware logging
const devWarn = (...args) => {
  if (import.meta.env.DEV) {
    console.warn?.(...args);
  }
};

export const authService = {
  /**
   * Login admin user
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{token: string, admin: object}>}
   */
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const { token, admin } = response.data;
    
    // Store in localStorage
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
    
    return response.data;
  },

  /**
   * Logout - clear all auth data
   */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
  },

  /**
   * Get current user profile
   * @returns {Promise<object>}
   */
  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Get stored token
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Get stored admin data - safely handles corrupted/invalid JSON
   * @returns {object|null}
   */
  getStoredAdmin() {
    try {
      const admin = localStorage.getItem(ADMIN_KEY);
      if (!admin) return null;
      
      const parsed = JSON.parse(admin);
      return parsed;
    } catch (error) {
      devWarn('⚠️ Corrupted admin data in localStorage, clearing it:', error.message);
      // Clear the corrupted data to prevent repeated errors
      localStorage.removeItem(ADMIN_KEY);
      return null;
    }
  },
};

export default authService;
