import api from './api';

const CUSTOMER_TOKEN_KEY = 'vibeit_customer_token';
const CUSTOMER_DATA_KEY = 'vibeit_customer_data';

// Helper for environment-aware logging
const devWarn = (...args) => {
  if (import.meta.env.DEV) {
    console.warn?.(...args);
  }
};

export const customerAuthService = {
  /**
   * Register new customer
   * @param {string} email 
   * @param {string} password 
   * @param {string} firstName 
   * @param {string} lastName 
   * @param {string} phone 
   * @returns {Promise<{token: string, customer: object}>}
   */
  async register(email, password, firstName, lastName, phone) {
    try {
      const response = await api.post('/customer/auth/register', {
        email,
        password,
        firstName,
        lastName,
        phone,
      });
      const { token, customer } = response.data;
      
      // Store in localStorage
      localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
      localStorage.setItem(CUSTOMER_DATA_KEY, JSON.stringify(customer));
      
      // Set auth header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Login customer user
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{token: string, customer: object}>}
   */
  async login(email, password) {
    try {
      const response = await api.post('/customer/auth/login', { email, password });
      const { token, customer } = response.data;
      
      // Store in localStorage
      localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
      localStorage.setItem(CUSTOMER_DATA_KEY, JSON.stringify(customer));
      
      // Set auth header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Logout - clear all auth data
   */
  logout() {
    localStorage.removeItem(CUSTOMER_TOKEN_KEY);
    localStorage.removeItem(CUSTOMER_DATA_KEY);
    delete api.defaults.headers.common['Authorization'];
  },

  /**
   * Get customer profile
   * @returns {Promise<object>}
   */
  async getProfile() {
    try {
      const response = await api.get('/customer/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update customer profile
   * @param {object} data 
   * @returns {Promise<{customer: object}>}
   */
  async updateProfile(data) {
    try {
      const response = await api.put('/customer/profile', data);
      const { customer } = response.data;
      
      // Update localStorage
      localStorage.setItem(CUSTOMER_DATA_KEY, JSON.stringify(customer));
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Request password reset
   * @param {string} email 
   * @returns {Promise<object>}
   */
  async forgotPassword(email) {
    try {
      const response = await api.post('/customer/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Reset password with token
   * @param {string} token 
   * @param {string} newPassword 
   * @returns {Promise<object>}
   */
  async resetPassword(token, newPassword) {
    try {
      const response = await api.post(`/customer/auth/reset-password/${token}`, { newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Check if customer is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!localStorage.getItem(CUSTOMER_TOKEN_KEY);
  },

  /**
   * Get stored token
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem(CUSTOMER_TOKEN_KEY);
  },

  /**
   * Get stored customer data - safely handles corrupted/invalid JSON
   * @returns {object|null}
   */
  getStoredCustomer() {
    try {
      const customer = localStorage.getItem(CUSTOMER_DATA_KEY);
      if (!customer) return null;
      
      const parsed = JSON.parse(customer);
      return parsed;
    } catch (error) {
      devWarn('⚠️ Corrupted customer data in localStorage, clearing it:', error.message);
      // Clear the corrupted data to prevent repeated errors
      localStorage.removeItem(CUSTOMER_DATA_KEY);
      localStorage.removeItem(CUSTOMER_TOKEN_KEY);
      return null;
    }
  },

  /**
   * Initialize auth header from localStorage token
   */
  initializeAuthHeader() {
    const token = this.getToken();
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  },
};

// Initialize auth header on module load
customerAuthService.initializeAuthHeader();

export default customerAuthService;
