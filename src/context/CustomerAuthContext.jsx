import { createContext, useContext, useState, useEffect } from 'react';
import { customerAuthService } from '../services/customerAuthService';

const CustomerAuthContext = createContext(null);

// Utility function to load stored customer
const loadStoredCustomer = () => {
  try {
    const customerData = localStorage.getItem('vibeit_customer_data');
    if (customerData) {
      return JSON.parse(customerData);
    }
  } catch {
    // Failed to initialize
  }
  return null;
};

export const CustomerAuthProvider = ({ children }) => {
  // Helper for environment-aware logging
  const devError = (...args) => {
    if (import.meta.env.DEV) {
      console.error?.(...args);
    }
  };

  // Initialize customer from localStorage synchronously to avoid flash
  const [customer, setCustomer] = useState(() => loadStoredCustomer());
  const [loading, setLoading] = useState(true); // Track initialization state

  // Mount effect - verify auth on component mount
  // Note: Empty dependency array intentional - this should only run once on mount
  // We intentionally check 'customer' without depending on it to avoid loops
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const token = localStorage.getItem('vibeit_customer_token');
    const customerData = localStorage.getItem('vibeit_customer_data');
    
    // If token exists but customer state is null, load it now
    if (token && !customer && customerData) {
      try {
        const parsed = JSON.parse(customerData);
        setCustomer(parsed);
      } catch {
        devError('Failed to parse customer data');
        customerAuthService.logout();
        setCustomer(null);
      }
    } else if (!token && customer) {
      // Token removed, clear customer state
      setCustomer(null);
    }
    
    // Mark initialization as complete
    setLoading(false);
  }, []); // Empty dependency array - runs once on mount

  // Listen for custom auth update event (from GoogleAuthCallback or email login)
  useEffect(() => {
    const handleAuthUpdated = (event) => {
      console.log('📬 CustomerAuthContext: Received vibeit:auth-updated event', {
        detail: event.detail,
        timestamp: new Date().toISOString()
      });
      
      const token = localStorage.getItem('vibeit_customer_token');
      const customerData = localStorage.getItem('vibeit_customer_data');
      
      console.log('📬 CustomerAuthContext: Loading auth state from storage', {
        hasToken: !!token,
        tokenLength: token?.length,
        hasCustomerData: !!customerData,
        timestamp: new Date().toISOString()
      });
      
      if (token && customerData) {
        try {
          const parsed = JSON.parse(customerData);
          console.log('✅ CustomerAuthContext: Auth state synced, customer loaded:', {
            email: parsed.email,
            id: parsed._id,
            timestamp: new Date().toISOString()
          });
          setCustomer(parsed);
          // Reset loading flag since we've just synced
          setLoading(false);
        } catch (err) {
          console.error('❌ CustomerAuthContext: Failed to parse customer data from auth event:', err);
          devError('Failed to parse customer data from auth event:', err);
          customerAuthService.logout();
          setCustomer(null);
          setLoading(false);
        }
      }
    };

    window.addEventListener('vibeit:auth-updated', handleAuthUpdated);
    return () => window.removeEventListener('vibeit:auth-updated', handleAuthUpdated);
  }, []);

  // Also watch for storage changes (handles cross-tab auth, or same-tab updates)
  useEffect(() => {
    const handleStorageChange = (storageEvent) => {
      if (storageEvent.key === 'vibeit_customer_data' || storageEvent.key === 'vibeit_customer_token') {
        const token = localStorage.getItem('vibeit_customer_token');
        const customerData = localStorage.getItem('vibeit_customer_data');
        
        if (token && customerData) {
          try {
            const parsed = JSON.parse(customerData);
            setCustomer(parsed);
          } catch (err) {
            devError('Failed to parse customer data from storage:', err);
          }
        } else {
          setCustomer(null);
        }
      }
    };

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
    const response = await customerAuthService.login(email, password);
    
    const customerData = response.customer || response;
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

// eslint-disable-next-line react-refresh/only-export-components
export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};

export default CustomerAuthContext;
