import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, Loader2, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import toast from 'react-hot-toast';
import logo from '../../assets/favicon.jpeg';

const CustomerRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, verifyMfa, resendMfa, isAuthenticated } = useCustomerAuth();
  
  // Determine where to redirect after registration
  const from = location.state?.from?.pathname || '/customer/dashboard';
  
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
  const [isVerifyingMfa, setIsVerifyingMfa] = useState(false);
  const [isResendingMfa, setIsResendingMfa] = useState(false);
  const [error, setError] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaToken, setMfaToken] = useState('');
  const [mfaMethod, setMfaMethod] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Redirect if already logged in - use useEffect
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/customer/dashboard');
    }
  }, [isAuthenticated, navigate]);

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

      if (!/^[\d\s\-+()]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
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

      const response = await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.phone
      );
      if (response?.mfaRequired) {
        setMfaRequired(true);
        setMfaToken(response.mfaToken || '');
        setMfaMethod(response.method || 'email');
        setResendCooldown(response.method === 'email' ? 60 : 0);
        toast.success('Enter your verification code to continue.');
        return;
      }

      toast.success('Registration successful! Welcome to VIBEIT');
      navigate(from);
    } catch (err) {
      const errorMsg = err.message || 'Registration failed. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!mfaRequired || resendCooldown <= 0 || mfaMethod !== 'email') return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [mfaRequired, resendCooldown, mfaMethod]);

  const resolveMfaErrorMessage = (err, fallback) => {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      '';
    const normalized = message.toLowerCase();
    if (
      normalized.includes('smtp') ||
      normalized.includes('email') && normalized.includes('unavailable') ||
      normalized.includes('delivery')
    ) {
      return 'OTP delivery is temporarily unavailable. Try again later or use an authenticator.';
    }
    return fallback;
  };

  const handleVerifyMfa = async (e) => {
    e.preventDefault();
    setError('');
    const trimmed = otpCode.trim();
    if (trimmed.length !== 6) {
      setError('Enter the 6-digit verification code.');
      return;
    }

    try {
      setIsVerifyingMfa(true);
      await verifyMfa(mfaToken, trimmed);
      toast.success('Registration complete! Welcome to VIBEIT');
      await new Promise(resolve => setTimeout(resolve, 50));
      navigate(from);
    } catch (err) {
      const errorMsg = resolveMfaErrorMessage(err, 'Verification failed. Please try again.');
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsVerifyingMfa(false);
    }
  };

  const handleResendMfa = async () => {
    try {
      setIsResendingMfa(true);
      const response = await resendMfa(mfaToken);
      if (response?.mfaToken) {
        setMfaToken(response.mfaToken);
      }
      setResendCooldown(60);
      toast.success('A new code has been sent.');
    } catch (err) {
      const errorMsg = resolveMfaErrorMessage(err, 'Failed to resend code.');
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsResendingMfa(false);
    }
  };

  const handleResetMfa = () => {
    setMfaRequired(false);
    setMfaToken('');
    setMfaMethod('');
    setOtpCode('');
    setResendCooldown(0);
    setError('');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10 sm:py-12 overflow-x-clip">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 overflow-hidden mx-auto flex items-center justify-center">
              <img
                src={logo}
                alt="VIBEIT logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Create Account</h1>
          <p className="text-slate-500 text-sm">Join VIBEIT today</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8">
          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {from === '/checkout' && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-slate-100 border border-slate-200 rounded-xl">
              <CheckCircle className="w-5 h-5 text-slate-700 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700"><strong>Quick setup!</strong> After registration, you'll go straight to checkout to complete your order.</p>
            </div>
          )}

          {mfaRequired ? (
            <form onSubmit={handleVerifyMfa} className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {mfaMethod === 'totp'
                  ? 'Open your authenticator app and enter the 6-digit code.'
                  : 'We sent a verification code to your email. Enter it below.'}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit code"
                  className="w-full pl-4 pr-4 py-2.5 bg-white border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm text-slate-900 placeholder-slate-400"
                  disabled={isVerifyingMfa}
                />
              </div>

              <button
                type="submit"
                disabled={isVerifyingMfa}
                className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 text-sm"
              >
                {isVerifyingMfa ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Continue'
                )}
              </button>

              {mfaMethod === 'email' && (
                <button
                  type="button"
                  onClick={handleResendMfa}
                  disabled={isResendingMfa || resendCooldown > 0}
                  className="w-full py-2.5 px-4 border border-slate-300 text-slate-700 font-medium text-sm rounded-md hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  {isResendingMfa
                    ? 'Resending...'
                    : resendCooldown > 0
                      ? `Resend available in ${resendCooldown}s`
                      : 'Resend code'}
                </button>
              )}

              <button
                type="button"
                onClick={handleResetMfa}
                className="w-full text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Use a different account
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm text-slate-900 placeholder-slate-400"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm text-slate-900 placeholder-slate-400"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm text-slate-900 placeholder-slate-400"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm text-slate-900 placeholder-slate-400"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm text-slate-900 placeholder-slate-400"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Min 8 chars, 1 uppercase, 1 lowercase, 1 number
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm text-slate-900 placeholder-slate-400"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
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

              <label className="flex items-start gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer mt-0.5"
                  disabled={isLoading}
                />
                <span className="text-xs text-slate-600">
                  I agree to the{' '}
                  <a href="/about" className="text-slate-700 hover:underline">
                    Terms & Conditions
                  </a>{' '}
                  and{' '}
                  <a href="/about" className="text-slate-700 hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 text-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                  </>
                )}
              </button>
            </form>
          )}

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-slate-500">Already have an account?</span>
            </div>
          </div>

          <Link
            to="/auth/customer/login"
            className="w-full py-2.5 px-4 bg-slate-100 text-slate-700 font-medium rounded-md hover:bg-slate-200 transition-colors text-center text-sm block"
          >
            Login Here
          </Link>
        </div>

        <p className="text-center text-xs text-slate-500 mt-4">
          We'll never share your information without your permission
        </p>
      </div>
    </div>
  );
};

export default CustomerRegister;
