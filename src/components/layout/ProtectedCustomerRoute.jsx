import { Navigate, Outlet } from 'react-router-dom';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

const ProtectedCustomerRoute = () => {
  const { isAuthenticated, loading, customer } = useCustomerAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Check both: token exists AND customer data loaded
  // This prevents redirects while customer state is being populated
  const token = localStorage.getItem('vibeit_customer_token');
  const customerData = localStorage.getItem('vibeit_customer_data');
  
  console.log('🛡️ ProtectedCustomerRoute: Checking auth', { 
    loading, 
    isAuth: isAuthenticated(), 
    hasToken: !!token, 
    hasCustomerData: !!customerData, 
    customerLoaded: !!customer,
    willAllow: isAuthenticated() && (!!token)
  });

  if (!isAuthenticated() || !token) {
    console.log('🚫 ProtectedCustomerRoute: NOT authenticated, redirecting to /auth/customer/login');
    return <Navigate to="/auth/customer/login" replace />;
  }

  console.log('✅ ProtectedCustomerRoute: Authenticated, allowing access');
  return <Outlet />;
};

export default ProtectedCustomerRoute;
