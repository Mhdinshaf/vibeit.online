import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import toast from 'react-hot-toast';
import logo from '../../assets/favicon.jpeg';

const CustomerLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, verifyMfa, resendMfa, startGoogleLogin, isAuthenticated } = useCustomerAuth();
  
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

      const response = await login(formData.email, formData.password);

      if (response?.mfaRequired) {
        setMfaRequired(true);
        setMfaToken(response.mfaToken || '');
        setMfaMethod(response.method || 'email');
        setResendCooldown(response.method === 'email' ? 60 : 0);
        toast.success('Enter your verification code to continue.');
        return;
      }

      toast.success('Login successful!');
      
      // Force re-render by reading fresh data from localStorage
      // This ensures Navbar sees the updated customer before navigation
      await new Promise(resolve => setTimeout(resolve, 50));
      
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
      toast.success('Login successful!');
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

  const handleGoogleLogin = () => {
    toast.success('Redirecting to Google...');
    startGoogleLogin(from);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050b18] flex items-center justify-center px-4 py-10 sm:py-12 overflow-x-clip">
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Login to VIBEIT</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Please enter your details below</p>
        </div>

        <div className="premium-card p-6 sm:p-8">
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

          {mfaRequired ? (
            <form onSubmit={handleVerifyMfa} className="space-y-5">
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                {mfaMethod === 'totp'
                  ? 'Open your authenticator app and enter the 6-digit code.'
                  : 'We sent a verification code to your email. Enter it below.'}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit code"
                  className="form-input pl-4 pr-4 py-2.5"
                  disabled={isVerifyingMfa}
                />
              </div>

              <button
                type="submit"
                disabled={isVerifyingMfa}
                className="btn-primary w-full py-2.5 px-4 text-sm flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="btn-outline w-full py-2.5 px-4 text-sm flex items-center justify-center gap-2"
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
                className="w-full text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                Use a different account
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="form-input pl-12 pr-4 py-2.5"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="form-input pl-12 pr-12 py-2.5"
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
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Remember me</span>
                </label>
                <Link
                  to="/auth/customer/forgot-password"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-2.5 px-4 text-sm flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Login
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="btn-outline w-full py-2.5 px-4 text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M21.35 11.1H12v2.98h5.35c-.23 1.5-1.73 4.4-5.35 4.4-3.22 0-5.84-2.67-5.84-5.97s2.62-5.97 5.84-5.97c1.84 0 3.07.79 3.78 1.46l2.58-2.5C16.7 3.94 14.56 3 12 3 7.03 3 3 7.03 3 12s4.03 9 9 9c5.19 0 8.62-3.64 8.62-8.77 0-.59-.06-1.04-.27-1.13z" />
                </svg>
                Sign in with Google
              </button>
            </form>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">New customer?</span>
            </div>
          </div>

          <Link
            to="/auth/customer/register"
            className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-center block"
          >
            Create an Account
          </Link>
        </div>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          By logging in, you agree to our{' '}
          <a href="/about" className="text-slate-700 dark:text-slate-300 hover:underline">
            Terms & Conditions
          </a>
        </p>
      </div>
    </div>
  );
};

export default CustomerLogin;
