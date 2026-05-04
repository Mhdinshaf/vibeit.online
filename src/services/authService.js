import API from './api';

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
    const response = await API.post('/auth/login', { email, password });
    const responseData = response.data;
    
    console.log('🔐 FULL Login response:', responseData);
    
    // Handle different response formats from backend
    let token = responseData.token || responseData.accessToken || responseData.jwtToken;
    let adminData = responseData.admin || responseData.user || responseData;
    
    console.log('🔐 Token extracted:', token);
    console.log('🔐 Admin data extracted:', adminData);
    
    if (!token) {
      console.error('❌ NO TOKEN IN RESPONSE!', 'Available keys:', Object.keys(responseData));
      throw new Error('Backend did not return a token. Response keys: ' + Object.keys(responseData).join(', '));
    }
    
    // Store in localStorage
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(adminData));
    
    console.log('✅ Token saved to localStorage');
    console.log('✅ Admin data saved to localStorage');
    console.log('✅ Token in storage is now:', localStorage.getItem(TOKEN_KEY) ? 'EXISTS' : 'MISSING');
    
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
