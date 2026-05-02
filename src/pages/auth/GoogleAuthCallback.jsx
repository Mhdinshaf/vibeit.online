import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import customerAuthService from '../../services/customerAuthService';

export default function GoogleAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Extract token and customer data from URL parameters
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const customerData = params.get('customer');

        if (!token) {
          navigate('/login', { state: { error: 'Authentication failed: No token received' } });
          return;
        }

        // Parse JWT to extract customer info (instead of relying on URL param)
        let customerId = null;
        let firstName = null;
        let email = null;
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            customerId = payload.customerId;
            email = payload.email;
            firstName = payload.name;
          }
        } catch {
          // Continue with available data
        }

        // Store token in localStorage
        localStorage.setItem('vibeit_customer_token', token);
        
        // Build customer object from JWT + URL param data
        let customerObj = null;
        if (customerId && email) {
          // Create customer object from JWT data
          customerObj = {
            _id: customerId,
            email,
            firstName: firstName || 'Customer',
            lastName: '',
          };
          
          // If backend also sent full customer data in URL param, merge it
          if (customerData) {
            try {
              const parsedCustomer = JSON.parse(decodeURIComponent(customerData));
              customerObj = { ...customerObj, ...parsedCustomer };
            } catch {
              // Continue with JWT-extracted data
            }
          }
          
          localStorage.setItem('vibeit_customer_data', JSON.stringify(customerObj));
        } else if (customerData) {
          // Fallback: try to parse customer from URL param
          try {
            customerObj = JSON.parse(decodeURIComponent(customerData));
            localStorage.setItem('vibeit_customer_data', JSON.stringify(customerObj));
          } catch {
            // Continue without customer data
          }
        }

        // Initialize auth header for future requests
        customerAuthService.initializeAuthHeader();

        // Emit custom event to notify auth context of the update
        window.dispatchEvent(new CustomEvent('vibeit:auth-updated', {
          detail: { token, customerData: customerObj }
        }));

        // Get redirect path from localStorage (set before Google redirect)
        const redirectPath = localStorage.getItem('vibeit_post_login_redirect') || '/customer/dashboard';
        localStorage.removeItem('vibeit_post_login_redirect');

        // Add delay to ensure context has processed the storage update
        // This prevents a race condition where the route guard checks auth before the context updates
        // Also ensures Axios interceptor has time to set the Authorization header
        await new Promise(resolve => setTimeout(resolve, 500));

        // Redirect to the stored path
        navigate(redirectPath);
      } catch {
        navigate('/login', { state: { error: 'Authentication failed' } });
      }
    };

    handleGoogleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}
