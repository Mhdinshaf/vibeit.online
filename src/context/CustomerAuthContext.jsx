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
  const [customer, setCustomer] = useState(() => {
    try {
      const customerData = localStorage.getItem('vibeit_customer_data');
      if (customerData) {
        return JSON.parse(customerData);
      }
    } catch (e) {
      console.warn('Failed to initialize customer from localStorage:', e);
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  // Mount effect - verify auth on component mount
  useEffect(() => {
    const token = localStorage.getItem('vibeit_customer_token');
    const customerData = localStorage.getItem('vibeit_customer_data');
    
    console.log('🎲 CustomerAuthContext: Mount check', { hasToken: !!token, hasCustomerData: !!customerData, customerState: !!customer });
    
    // If token exists but customer state is null, load it now
    if (token && !customer && customerData) {
      try {
        const parsed = JSON.parse(customerData);
        console.log('✅ CustomerAuthContext: Loading customer from storage on mount', { firstName: parsed.firstName, email: parsed.email });
        setCustomer(parsed);
      } catch (e) {
        devError('Failed to parse customer data:', e);
        customerAuthService.logout();
        setCustomer(null);
      }
    } else if (!token && customer) {
      // Token removed, clear customer state
      console.log('🔄 CustomerAuthContext: Token removed, clearing customer state');
      setCustomer(null);
    }
  }, [customer]);

  // Listen for custom auth update event (from GoogleAuthCallback or email login)
  useEffect(() => {
    const handleAuthUpdated = (event) => {
      console.log('🎯 CustomerAuthContext: Received vibeit:auth-updated event');
      const token = localStorage.getItem('vibeit_customer_token');
      const customerData = localStorage.getItem('vibeit_customer_data');
      
      console.log('📍 CustomerAuthContext: Checking localStorage', { hasToken: !!token, hasCustomerData: !!customerData });
      
      if (token && customerData) {
        try {
          const parsed = JSON.parse(customerData);
          console.log('✅ CustomerAuthContext: Setting customer state from event', { firstName: parsed.firstName, email: parsed.email });
          setCustomer(parsed);
        } catch (err) {
          devError('Failed to parse customer data from auth event:', err);
          customerAuthService.logout();
          setCustomer(null);
        }
      } else {
        console.log('⚠️ CustomerAuthContext: Auth event received but no token/data in localStorage');
        setCustomer(null);
      }
    };

    console.log('🔧 CustomerAuthContext: Attaching vibeit:auth-updated listener');
    window.addEventListener('vibeit:auth-updated', handleAuthUpdated);
    return () => window.removeEventListener('vibeit:auth-updated', handleAuthUpdated);
  }, []);

  // Also watch for storage changes (handles cross-tab auth, or same-tab updates)
  useEffect(() => {
    const handleStorageChange = (e) => {
      console.log('🔄 CustomerAuthContext: Storage change event', { key: e.key });
      if (e.key === 'vibeit_customer_data' || e.key === 'vibeit_customer_token') {
        const token = localStorage.getItem('vibeit_customer_token');
        const customerData = localStorage.getItem('vibeit_customer_data');
        
        if (token && customerData) {
          try {
            const parsed = JSON.parse(customerData);
            console.log('✅ CustomerAuthContext: Setting customer state from storage event', { firstName: parsed.firstName, email: parsed.email });
            setCustomer(parsed);
          } catch (err) {
            devError('Failed to parse customer data from storage:', err);
          }
        } else {
          console.log('ℹ️ CustomerAuthContext: Storage cleared, setting customer to null');
          setCustomer(null);
        }
      }
    };

    console.log('🔧 CustomerAuthContext: Attaching storage listener');
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
    console.log('🔑 CustomerAuthContext.login: Called for', email);
    const response = await customerAuthService.login(email, password);
    console.log('🔑 CustomerAuthContext.login: Backend response', { hasCustomer: !!response.customer, token: response.token?.substring(0, 20) + '...' });
    
    const customerData = response.customer || response;
    console.log('🔑 CustomerAuthContext.login: Setting customer state', { firstName: customerData?.firstName, email: customerData?.email });
    setCustomer(customerData);
    
    // Emit auth updated event so any listeners know to refresh
    window.dispatchEvent(new CustomEvent('vibeit:auth-updated', {
      detail: { customerData }
    }));
    
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
