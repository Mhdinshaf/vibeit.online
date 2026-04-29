import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import toast from 'react-hot-toast';
import logo from '../../assets/favicon.jpeg';

const CustomerLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, startGoogleLogin, isAuthenticated } = useCustomerAuth();
  
  // Determine where to redirect after login
  const searchParams = new URLSearchParams(location.search);
  const from = location.state?.from?.pathname || searchParams.get('from') || '/customer/dashboard';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  if (isAuthenticated()) {
    navigate('/customer/dashboard');
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Basic validation
      if (!formData.email || !formData.password) {
        setError('Email and password are required');
        setIsLoading(false);
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      await login(formData.email, formData.password);
      toast.success('Login successful!');
      // Redirect to the original location or dashboard
      navigate(from);
    } catch (err) {
      const errorMsg = err.message || 'Login failed. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.success('Redirecting to Google...');
    startGoogleLogin(from);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10 sm:py-12 overflow-x-clip">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 mx-auto">
              <img
                src={logo}
                alt="VIBEIT logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1 className="text-3xl font-semibold text-slate-900 mb-2 tracking-tight">VIBEIT</h1>
          <p className="text-slate-600">Customer Login</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {from === '/checkout' && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-slate-100 border border-slate-200 rounded-xl">
              <CheckCircle className="w-5 h-5 text-slate-700 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700"><strong>Heads up!</strong> You'll be returned to checkout after login to complete your order.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-900 focus:bg-white transition-colors text-slate-900 placeholder-slate-400"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-900 focus:bg-white transition-colors text-slate-900 placeholder-slate-400"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-2 border-slate-300 accent-slate-900 cursor-pointer"
                  disabled={isLoading}
                />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <Link
                to="/auth/customer/forgot-password"
                className="text-sm text-slate-700 hover:text-slate-900 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Login
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M21.35 11.1H12v2.98h5.35c-.23 1.5-1.73 4.4-5.35 4.4-3.22 0-5.84-2.67-5.84-5.97s2.62-5.97 5.84-5.97c1.84 0 3.07.79 3.78 1.46l2.58-2.5C16.7 3.94 14.56 3 12 3 7.03 3 3 7.03 3 12s4.03 9 9 9c5.19 0 8.62-3.64 8.62-8.77 0-.59-.06-1.04-.27-1.13z" />
              </svg>
              Continue with Google
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-slate-500">New customer?</span>
            </div>
          </div>

          <Link
            to="/auth/customer/register"
            className="w-full py-3 px-4 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors text-center"
          >
            Create New Account
          </Link>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          By logging in, you agree to our{' '}
          <a href="/about" className="text-slate-700 hover:underline">
            Terms & Conditions
          </a>
        </p>
      </div>
    </div>
  );
};

export default CustomerLogin;
