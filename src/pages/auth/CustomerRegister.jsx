import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, Loader2, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import toast from 'react-hot-toast';
import logo from '../../assets/favicon.jpeg';

const CustomerRegister = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useCustomerAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validation
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
        setError('All fields are required');
        setIsLoading(false);
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      if (!/^[\d\s\-\+\(\)]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
        setError('Please enter a valid phone number');
        setIsLoading(false);
        return;
      }

      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        setError(passwordError);
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      if (!formData.agreeTerms) {
        setError('Please agree to the terms and conditions');
        setIsLoading(false);
        return;
      }

      await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.phone
      );
      toast.success('Registration successful! Welcome to VIBEIT');
      navigate('/customer/dashboard');
    } catch (err) {
      const errorMsg = err.message || 'Registration failed. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg shadow-blue-200 bg-slate-900 mx-auto">
              <img
                src={logo}
                alt="VIBEIT logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">VIBEIT</h1>
          <p className="text-gray-600">Create Your Account</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-lg shadow-blue-100 border border-gray-100 p-8">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className="w-full pl-10 pr-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:bg-white focus:ring-0 transition-all duration-300 text-sm text-gray-900 placeholder-gray-400"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className="w-full pl-10 pr-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:bg-white focus:ring-0 transition-all duration-300 text-sm text-gray-900 placeholder-gray-400"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:bg-white focus:ring-0 transition-all duration-300 text-sm text-gray-900 placeholder-gray-400"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+94 71 234 5678"
                  className="w-full pl-10 pr-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:bg-white focus:ring-0 transition-all duration-300 text-sm text-gray-900 placeholder-gray-400"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:bg-white focus:ring-0 transition-all duration-300 text-sm text-gray-900 placeholder-gray-400"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Min 8 chars, 1 uppercase, 1 lowercase, 1 number
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:bg-white focus:ring-0 transition-all duration-300 text-sm text-gray-900 placeholder-gray-400"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms Agreement */}
            <label className="flex items-start gap-2 cursor-pointer pt-2">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-4 h-4 rounded border-2 border-gray-300 accent-blue-600 cursor-pointer mt-0.5"
                disabled={isLoading}
              />
              <span className="text-xs text-gray-600">
                I agree to the{' '}
                <a href="/about" className="text-blue-600 hover:underline">
                  Terms & Conditions
                </a>{' '}
                and{' '}
                <a href="/about" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            to="/auth/customer/login"
            className="w-full py-2.5 px-4 border-2 border-blue-200 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-300 text-center text-sm"
          >
            Login Here
          </Link>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-500 mt-4">
          We'll never share your information without your permission
        </p>
      </div>
    </div>
  );
};

export default CustomerRegister;
