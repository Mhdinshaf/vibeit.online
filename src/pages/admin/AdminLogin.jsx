import { useState } from 'react';
import { Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { Loader2, AlertCircle, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, admin, loading } = useAuth();
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (admin) {
    const from = location.state?.from?.pathname || '/admin';
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!credentials.email || !credentials.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const data = await login(credentials.email, credentials.password);
      const adminName = data.admin?.name || data.name || 'Admin';
      toast.success(`Welcome back, ${adminName}!`);
      
      setTimeout(() => {
        const from = location.state?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      }, 100);
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid credentials. Please try again.';
      setError(message);
      toast.error(message);
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setError('');
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-slate-50 overflow-x-clip">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
              VB
            </div>
            <span className="text-2xl font-semibold tracking-tight text-slate-900">VIBEIT</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-8 lg:p-10 border border-slate-200">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 text-sm font-medium px-4 py-2 rounded-full mb-4">
              <Lock className="w-4 h-4" />
              Admin Access
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500">
              Enter your credentials to access the dashboard
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={credentials.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-900 focus:bg-white transition-colors"
                  placeholder="admin@gmail.com"
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-900 focus:bg-white transition-colors"
                  placeholder="••••••••"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold uppercase tracking-wide py-4 rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  SIGNING IN...
                </>
              ) : (
                <>
                  SIGN IN
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900 font-medium transition-colors group"
            >
              View Store
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-8">
          VibeIt.lk Admin Portal • Secure Access
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
