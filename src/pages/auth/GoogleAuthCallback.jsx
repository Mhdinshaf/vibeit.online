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
          console.error('No token found in callback URL');
          navigate('/login', { state: { error: 'Authentication failed: No token received' } });
          return;
        }

        // Store token in localStorage
        localStorage.setItem('vibeit_customer_token', token);
        
        // Store customer data if provided
        if (customerData) {
          try {
            const parsedCustomer = JSON.parse(decodeURIComponent(customerData));
            localStorage.setItem('vibeit_customer_data', JSON.stringify(parsedCustomer));
          } catch (parseError) {
            console.warn('Failed to parse customer data from callback:', parseError);
          }
        }

        // Initialize auth header for future requests
        customerAuthService.initializeAuthHeader();

        // Emit custom event to notify auth context of the update
        window.dispatchEvent(new CustomEvent('vibeit:auth-updated', {
          detail: { token, customerData }
        }));

        // Get redirect path from localStorage (set before Google redirect)
        const redirectPath = localStorage.getItem('vibeit_post_login_redirect') || '/customer/dashboard';
        localStorage.removeItem('vibeit_post_login_redirect');

        // Redirect to the stored path
        navigate(redirectPath);
      } catch (error) {
        console.error('Error handling Google callback:', error);
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
