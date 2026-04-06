import api from './api';

const TOKEN_KEY = 'vibeit_token';
const ADMIN_KEY = 'vibeit_admin';

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
   * Get stored admin data
   * @returns {object|null}
   */
  getStoredAdmin() {
    const admin = localStorage.getItem(ADMIN_KEY);
    return admin ? JSON.parse(admin) : null;
  },
};

export default authService;
