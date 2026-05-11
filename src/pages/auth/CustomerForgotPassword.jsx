import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import logo from '../../assets/favicon.jpeg';
import customerAuthService from '../../services/customerAuthService';

const CustomerForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email address is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await customerAuthService.forgotPassword(email.trim());
      const message = response?.message || 'If an account exists for this email, a reset link has been sent.';
      setSubmitted(true);
      setSuccessMessage(message);
      toast.success('Password reset email sent');
    } catch (err) {
      const errorMsg = err.message || 'Unable to send reset email. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Forgot Password</h1>
          <p className="text-slate-500 text-sm">We will email you a secure link to reset your password.</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8">
          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {submitted && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          )}

          {!submitted ? (
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
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="Email Address"
                    className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-slate-900 placeholder-slate-400 text-sm"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium text-sm rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending email...
                  </>
                ) : (
                  <>Send Reset Link</>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <Link
                to="/auth/customer/login"
                className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium text-sm rounded-md hover:bg-blue-700 transition-colors text-center block"
              >
                Return to Login
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setSuccessMessage('');
                }}
                className="w-full py-2.5 px-4 border border-slate-300 text-slate-700 font-medium text-sm rounded-md hover:bg-slate-50 transition-colors"
              >
                Send another email
              </button>
            </div>
          )}

          {!submitted && (
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-slate-500">Remembered your password?</span>
              </div>
            </div>
          )}

          {!submitted && (
            <Link
              to="/auth/customer/login"
              className="w-full py-2.5 px-4 bg-slate-100 text-slate-700 font-medium text-sm rounded-md hover:bg-slate-200 transition-colors text-center block"
            >
              Back to Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerForgotPassword;
