import API from './api';

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
    const response = await API.post('/auth/login', { email, password });
    const responseData = response.data;

    // Handle different response formats from backend
    let token = responseData.token || responseData.accessToken || responseData.jwtToken;
    let adminData = responseData.admin || responseData.user || responseData;

    if (!token) {
      throw new Error('Backend did not return a token. Response keys: ' + Object.keys(responseData).join(', '));
    }

    // Store in localStorage
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(adminData));

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
    const response = await API.get('/auth/me');
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
      return JSON.parse(admin);
    } catch {
      localStorage.removeItem(ADMIN_KEY);
      return null;
    }
  },
};

export default authService;
