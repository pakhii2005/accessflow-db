import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, Mail, Lock, AlertCircle, Eye, EyeOff, CheckCircle, Sparkles } from 'lucide-react';

// 1. THIS VARIABLE LETS YOUR CODE WORK IN DEV AND PRODUCTION
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SignupPage = ({ setIsLoggedIn }) => {
  // State management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Navigation function
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const calculatePasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 10) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    setPasswordStrength(calculatePasswordStrength(pwd));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // =========================================================
      // 2. THIS IS THE CORRECTED AXIOS CALL
      // =========================================================
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        email,
        password
      });

      const token = response.data.token;
      localStorage.setItem('token', token);

      // Update authentication state
      setIsLoggedIn(true);

      navigate('/dashboard');

    } catch (err) {
      const errorMessage = err.response?.data?.error || 'An error occurred during registration';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-white pt-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background blobs (styling only) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      <div className={`max-w-md mx-auto py-16 relative z-10 transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl mb-4 transform hover:scale-110 hover:rotate-3 transition-all shadow-lg">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-lg text-gray-600 flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600 animate-pulse" />
            Start browsing with accessibility in minutes
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 transform transition-all hover:shadow-2xl hover:scale-[1.02]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <label htmlFor="email" className="block text-lg font-medium text-gray-900 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <label htmlFor="password" className="block text-lg font-medium text-gray-900 mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={handlePasswordChange}
                  className="block w-full pl-12 pr-12 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
                  placeholder="Minimum 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-transform hover:scale-110"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-3 space-y-2"> {/* Removed animation class */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-500 transform ${
                          i < passwordStrength 
                            ? `${strengthColors[passwordStrength - 1]} scale-y-100` 
                            : 'bg-gray-200 scale-y-50'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-sm font-medium transition-colors ${
                    passwordStrength > 2 ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    Password Strength: {strengthLabels[passwordStrength - 1] || 'Too Short'}
                  </p>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-lg"> {/* Removed animation class */}
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <p className="text-lg font-medium text-red-800">Registration Failed</p>
                  <p className="text-base text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-medium py-4 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transform"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Sign Up Free'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-lg font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1 transition-all hover:-translate-y-0.5 inline-block"
            >
              Log in instead
            </Link>
          </div>
        </div>

        {/* Privacy Notice */}
        <p className="mt-8 text-center text-sm text-gray-500"> {/* Removed animation class */}
          By signing up, you agree to our{' '}
          <Link to="/terms" className="text-blue-600 hover:text-blue-700 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link to="/privacy" className="text-blue-600 hover:text-blue-700 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
            Privacy Policy
          </Link>
        </p>
      </div>

      {/* 3. THE <style jsx> BLOCK HAS BEEN REMOVED. */}
    </div>
  );
};

export default SignupPage;