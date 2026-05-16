import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import StoreLayout from './components/layout/StoreLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import CustomerLayout from './components/layout/CustomerLayout';
import ProtectedCustomerRoute from './components/layout/ProtectedCustomerRoute';
import ScrollToTop from './components/layout/ScrollToTop';

// Shop Pages
import HomePage from './pages/shop/HomePage';
import ShopPage from './pages/shop/ShopPage';
import ProductPage from './pages/shop/ProductPage';
import CartPage from './pages/shop/CartPage';
import CheckoutPage from './pages/shop/CheckoutPage';
import OrderSuccess from './pages/shop/OrderSuccess';
import AboutPage from './pages/shop/AboutPage';
import ContactPage from './pages/shop/ContactPage';

// Auth Pages
import AdminLogin from './pages/admin/AdminLogin';
import CustomerLogin from './pages/auth/CustomerLogin';
import CustomerRegister from './pages/auth/CustomerRegister';
import CustomerForgotPassword from './pages/auth/CustomerForgotPassword';
import CustomerResetPassword from './pages/auth/CustomerResetPassword';
import GoogleAuthCallback from './pages/auth/GoogleAuthCallback';
import CustomerDashboard from './pages/customer/CustomerDashboard';

// Admin Pages - Lazy loaded for code splitting
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminAddProduct = lazy(() => import('./pages/admin/AdminAddProduct'));
const AdminEditProduct = lazy(() => import('./pages/admin/AdminEditProduct'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminOrderDetail = lazy(() => import('./pages/admin/AdminOrderDetail'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminPromotions = lazy(() => import('./pages/admin/AdminPromotions'));
const AdminMfaStatus = lazy(() => import('./pages/admin/AdminMfaStatus'));

// Loading Spinner
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Store Routes */}
        <Route element={<StoreLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Customer Auth Routes (no layout) */}
        <Route path="/login" element={<CustomerLogin />} />
        <Route path="/auth/customer/login" element={<CustomerLogin />} />
        <Route path="/auth/customer/register" element={<CustomerRegister />} />
        <Route path="/auth/customer/forgot-password" element={<CustomerForgotPassword />} />
        <Route path="/auth/customer/reset-password/:token" element={<CustomerResetPassword />} />
        <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />

        {/* Protected Customer Routes */}
        <Route element={<ProtectedCustomerRoute />}>
          <Route element={<CustomerLayout />}>
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          </Route>
        </Route>

        {/* Admin Login (no layout) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes - Wrapped with Suspense for lazy loading */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Suspense fallback={<LoadingSpinner />}><AdminDashboard /></Suspense>} />
            <Route path="/admin/products" element={<Suspense fallback={<LoadingSpinner />}><AdminProducts /></Suspense>} />
            <Route path="/admin/products/add" element={<Suspense fallback={<LoadingSpinner />}><AdminAddProduct /></Suspense>} />
            <Route path="/admin/products/edit/:id" element={<Suspense fallback={<LoadingSpinner />}><AdminEditProduct /></Suspense>} />
            <Route path="/admin/orders" element={<Suspense fallback={<LoadingSpinner />}><AdminOrders /></Suspense>} />
            <Route path="/admin/orders/:id" element={<Suspense fallback={<LoadingSpinner />}><AdminOrderDetail /></Suspense>} />
            <Route path="/admin/customers" element={<Suspense fallback={<LoadingSpinner />}><AdminCustomers /></Suspense>} />
            <Route path="/admin/promotions" element={<Suspense fallback={<LoadingSpinner />}><AdminPromotions /></Suspense>} />
            <Route path="/admin/mfa-status" element={<Suspense fallback={<LoadingSpinner />}><AdminMfaStatus /></Suspense>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
