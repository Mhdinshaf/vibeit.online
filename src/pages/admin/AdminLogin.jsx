import { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { loginAdmin } from '../../services/api';
import { useAuthStore } from '../../context/store';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  // Redirect if already logged in
  const token = localStorage.getItem('vbToken');
  if (token) {
    return <Navigate to="/admin" replace />;
  }

  const { mutate: login, isPending } = useMutation({
    mutationFn: loginAdmin,
    onSuccess: (data) => {
      setAuth(data.admin, data.token);
      toast.success(`Welcome back, ${data.admin.name}!`);
      navigate('/admin');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      toast.error('Please fill in all fields');
      return;
    }

    login(credentials);
  };

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#0F172A' }}
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                VB
              </div>
              <span className="text-2xl font-bold text-gray-900">VIBEIT</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-sm text-gray-600">
              Enter your credentials to access the dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={credentials.email}
                onChange={handleChange}
                className="form-input dark:bg-gray-800"
                placeholder="admin@vibeit.lk"
                disabled={isPending}
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={credentials.password}
                onChange={handleChange}
                className="form-input dark:bg-gray-800"
                placeholder="••••••••"
                disabled={isPending}
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  LOGGING IN...
                </>
              ) : (
                'LOGIN'
              )}
            </button>
          </form>

          {/* View Store Link */}
          <div className="mt-6 text-center">
            <Link 
              to="/" 
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              View Store →
            </Link>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm text-gray-400 mt-6">
          VibeIt.lk Admin Portal
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
