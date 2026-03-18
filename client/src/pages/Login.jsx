import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import Loader from '../components/Loader';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate(result.user.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
    setLoading(false);
  };

  const fillCredentials = (email, password) => {
    setFormData({ email, password });
    setError('');
  };

  const testAccounts = [
    { role: 'admin', email: 'hemalatha080705@gmail.com', password: 'HemaG', label: 'Admin' },
    { role: 'user', email: 'user@test.com', password: 'user123', label: 'Student' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Inter', sans-serif; }
        
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(-1deg); }
        }
        .float1 { animation: float1 6s ease-in-out infinite; }
        .float2 { animation: float2 7s ease-in-out infinite; }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        
        .input-float {
          position: relative;
        }
        .input-float label {
          position: absolute;
          left: 1rem; top: 1rem; pointer-events: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          color: #9ca3af; font-weight: 500; font-size: 0.875rem;
        }
        .input-float input:focus + label,
        .input-float input:not(:placeholder-shown) + label {
          top: -0.5rem; left: 0.75rem; font-size: 0.75rem;
          color: #8b5cf6; background: white; padding: 0 0.25rem;
        }
        .input-float input {
          padding: 1.25rem 1rem 1rem; width: 100%; border: none;
          background: rgba(255,255,255,0.6); border-radius: 1rem;
          font-size: 1rem; backdrop-filter: blur(10px);
          transition: all 0.2s; outline: none;
        }
        .input-float input:focus {
          background: white; box-shadow: 0 10px 30px rgba(139,92,246,0.2);
          transform: translateY(-2px);
        }
      `}</style>

      <div className="max-w-md w-full space-y-8 relative">
        {/* Decorative elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 float1" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-300 to-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 float2" />

        {/* Main card */}
        <div className="glass-card p-10 rounded-3xl shadow-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              CourseAI
            </h1>
            <p className="text-xl font-medium text-gray-600">AI-Powered Learning Platform</p>
          </div>

          {error && (
            <div className="bg-gradient-to-r from-red-400 to-red-500 text-white p-4 rounded-2xl mb-8 shadow-lg flex items-center gap-3 animate-pulse">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="input-float">
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
                placeholder=" "
                required
                className="input-float-input"
              />
              <label>Email Address</label>
            </div>

            {/* Password Field */}
            <div className="input-float">
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('')}
                placeholder=" "
                required
              />
              <label>Password</label>
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? '🙈' : '👁'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-purple-600 shadow-sm focus:ring-purple-500"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>

              <Link to="/forgot-password" className="text-sm font-medium text-purple-600 hover:text-purple-500 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <Loader />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-600 mb-4">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-purple-600 hover:text-purple-700">
                Sign up
              </Link>
            </p>

            <div className="border-t border-gray-200 pt-6">
              <p className="text-xs text-gray-500 mb-4">🔧 Quick Test Login</p>
              <div className="grid grid-cols-2 gap-3">
                {testAccounts.map((acc, i) => (
                  <button
                    key={i}
                    className="p-3 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 rounded-xl transition-all text-left text-sm font-medium hover:shadow-md"
                    onClick={() => fillCredentials(acc.email, acc.password)}
                  >
                    <div className="font-bold text-purple-700">{acc.label}</div>
                    <div className="text-xs text-gray-600 truncate">{acc.email}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

