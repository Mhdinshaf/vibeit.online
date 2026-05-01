import { createContext, useContext, useState, useEffect } from 'react';
import { customerAuthService } from '../services/customerAuthService';

const CustomerAuthContext = createContext(null);

// Helper for environment-aware logging
const devError = (...args) => {
  if (import.meta.env.DEV) {
    console.error?.(...args);
  }
};

export const CustomerAuthProvider = ({ children }) => {
  // Initialize customer from localStorage synchronously to avoid flash
  const [customer, setCustomer] = useState(() => customerAuthService.getStoredCustomer());
  const [loading, setLoading] = useState(true);

  // Check authentication on mount - synchronous localStorage check first
  useEffect(() => {
    const token = localStorage.getItem('vibeit_customer_token');
    const customerData = localStorage.getItem('vibeit_customer_data');
    
    if (token && customerData) {
      try {
        const parsed = JSON.parse(customerData);
        setCustomer(parsed);
      } catch (e) {
        devError('Failed to parse customer data:', e);
        customerAuthService.logout();
        setCustomer(null);
      }
    } else {
      setCustomer(null);
    }
    setLoading(false);
  }, []);

  // Listen for custom auth update event (from GoogleAuthCallback)
  useEffect(() => {
    const handleAuthUpdated = (event) => {
      const token = localStorage.getItem('vibeit_customer_token');
      const customerData = localStorage.getItem('vibeit_customer_data');
      
      if (token && customerData) {
        try {
          const parsed = JSON.parse(customerData);
          setCustomer(parsed);
        } catch (err) {
          devError('Failed to parse customer data from auth event:', err);
          customerAuthService.logout();
          setCustomer(null);
        }
      }
    };

    window.addEventListener('vibeit:auth-updated', handleAuthUpdated);
    return () => window.removeEventListener('vibeit:auth-updated', handleAuthUpdated);
  }, []);

  /**
   * Register new customer
   * @param {string} email 
   * @param {string} password 
   * @param {string} firstName 
   * @param {string} lastName 
   * @param {string} phone 
   * @returns {Promise<object>}
   */
  const register = async (email, password, firstName, lastName, phone) => {
    const response = await customerAuthService.register(email, password, firstName, lastName, phone);
    const customerData = response.customer || response;
    setCustomer(customerData);
    return response;
  };

  /**
   * Login customer
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<object>}
   */
  const login = async (email, password) => {
    const response = await customerAuthService.login(email, password);
    const customerData = response.customer || response;
    setCustomer(customerData);
    return response;
  };

  /**
   * Start Google OAuth login
   * @param {string} redirectPath
   */
  const startGoogleLogin = (redirectPath) => {
    customerAuthService.startGoogleLogin(redirectPath);
  };

  /**
   * Logout function
   */
  const logout = () => {
    customerAuthService.logout();
    setCustomer(null);
  };

  /**
   * Update customer profile
   * @param {object} updatedData 
   * @returns {Promise<object>}
   */
  const updateProfile = async (updatedData) => {
    const response = await customerAuthService.updateProfile(updatedData);
    const customerData = response.customer || response;
    setCustomer(customerData);
    return response;
  };

  /**
   * Check if customer is authenticated
   * @returns {boolean}
   */
  const isAuthenticated = () => {
    return customerAuthService.isAuthenticated();
  };

  const value = {
    customer,
    loading,
    register,
    login,
    startGoogleLogin,
    logout,
    updateProfile,
    isAuthenticated,
  };

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

/**
 * Hook to use customer auth context
 * @returns {{customer: object, loading: boolean, register: Function, login: Function, logout: Function, updateProfile: Function, isAuthenticated: Function}}
 */
export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};

export default CustomerAuthContext;
