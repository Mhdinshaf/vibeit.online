import { Navigate, Outlet } from 'react-router-dom';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

const ProtectedCustomerRoute = () => {
  const { isAuthenticated, loading } = useCustomerAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/auth/customer/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedCustomerRoute;
