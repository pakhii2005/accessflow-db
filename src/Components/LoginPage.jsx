import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LogIn, Mail, Lock, AlertCircle, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

const LoginPage = ({ setIsLoggedIn }) => {
  // State management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Navigation function
  const navigate = useNavigate();

  // Animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    setIsLoading(true);

    try {
      // Send login request to backend
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      // Get token from response
      const token = response.data.token;

      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Optionally save remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('userEmail', email);
      }

      // Update authentication state
      setIsLoggedIn(true);

      // Redirect to dashboard
      navigate('/dashboard');

    } catch (err) {
      // Handle error response
      const errorMessage = err.response?.data?.error || 'An error occurred during login';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-blue-50 to-white pt-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className={`max-w-md mx-auto py-16 relative z-10 transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-4 transform hover:scale-110 hover:rotate-3 transition-all shadow-lg">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-lg text-gray-600 flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600 animate-pulse" />
            Sign in to continue to your dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 transform transition-all hover:shadow-2xl hover:scale-[1.02]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <label 
                htmlFor="login-email" 
                className="block text-lg font-medium text-gray-900 mb-2"
              >
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all hover:border-gray-400"
                  placeholder="you@example.com"
                  aria-label="Email address"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <label 
                htmlFor="login-password" 
                className="block text-lg font-medium text-gray-900 mb-2"
              >
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all hover:border-gray-400"
                  placeholder="Enter your password"
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center focus:outline-none focus:ring-2 focus:ring-purple-500 rounded transition-transform hover:scale-110"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between animate-fade-in animation-delay-300">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer transition-transform hover:scale-110"
                />
                <label htmlFor="remember-me" className="ml-2 block text-base text-gray-900 cursor-pointer select-none">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-base font-medium text-purple-600 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1 transition-all hover:-translate-y-0.5"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div 
                className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-lg animate-shake"
                role="alert"
                aria-live="polite"
              >
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <p className="text-lg font-medium text-red-800">
                    Login Failed
                  </p>
                  <p className="text-base text-red-700 mt-1">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-medium py-4 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transform"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Log In
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Don't have an account?
              </span>
            </div>
          </div>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <Link
              to="/signup"
              className="text-lg font-medium text-purple-600 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded px-2 py-1 transition-all hover:-translate-y-0.5 inline-block"
            >
              Create a new account
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <p className="mt-8 text-center text-sm text-gray-500 animate-fade-in animation-delay-500">
          🔒 Your connection is secure and encrypted
        </p>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-in forwards;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;