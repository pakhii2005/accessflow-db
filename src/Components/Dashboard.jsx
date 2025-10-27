import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Settings, User, Eye, Type, Keyboard, 
  TrendingUp, Activity, Zap, ArrowRight,
  CheckCircle, Sparkles, Edit
} from 'lucide-react';

// 1. THIS VARIABLE LETS YOUR CODE WORK IN DEV AND PRODUCTION
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DashboardPage = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch user profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // If no token, redirect to login
      if (!token) {
        navigate('/login');
        return;
      }

      // =========================================================
      // 2. THIS IS THE CORRECTED AXIOS CALL
      // =========================================================
      const response = await axios.get(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProfile(response.data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      
      // If unauthorized, redirect to login
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to load profile. Please try again.');
      }
      
      setIsLoading(false);
    }
  };

  // Stats data
  const stats = [
    { 
      icon: Eye, 
      label: 'Sites Enhanced', 
      value: '147', 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    { 
      icon: TrendingUp, 
      label: 'Hours Saved', 
      value: '32', 
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    { 
      icon: Activity, 
      label: 'Active Days', 
      value: '21', 
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    }
  ];

  // Quick settings preview
  const quickSettings = [
    { icon: Eye, label: 'Contrast Mode', value: profile?.settings?.contrast || 'None' },
    { icon: Type, label: 'Font Size', value: profile?.settings?.fontSize || 'Default' },
    { icon: Keyboard, label: 'Keyboard Nav', value: 'Enabled' } // Placeholder value
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 px-4">
        <div className="max-w-2xl mx-auto py-16 text-center">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
            <p className="text-xl text-red-800 mb-4">{error}</p>
            <button
              onClick={fetchProfile}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-blue-50 to-white pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header with Welcome Message */}
        <div className="mb-8"> {/* Removed animation class */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-5xl font-extrabold text-gray-900 mb-2 flex items-center gap-3">
                <Sparkles className="h-10 w-10 text-blue-600 animate-pulse" />
                Welcome Back!
              </h1>
              <p className="text-xl text-gray-600">
                Your personalized accessibility dashboard
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/profile"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg px-8 py-4 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Edit className="h-5 w-5" />
                Edit Your Profile
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"> {/* Removed animation class */}
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 transform transition-all hover:scale-105 hover:shadow-2xl cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-lg mb-1">{stat.label}</p>
                  <p className="text-4xl font-extrabold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-4 rounded-xl`}>
                  <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${stat.color}`}
                  style={{ width: '75%' }} // Removed animation class
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Settings Overview */}
          <div className="lg:col-span-2"> {/* Removed animation class */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <Settings className="h-8 w-8 text-blue-600" />
                  Current Settings
                </h2>
                <Link
                  to="/profile"
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 hover:gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-3 py-2"
                >
                  Customize
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {quickSettings.map((setting, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-3 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                        <setting.icon className="h-6 w-6 text-gray-700" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-lg">{setting.label}</p>
                        <p className="text-gray-600">{setting.value}</p>
                      </div>
                    </div>
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                ))}
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-100">
                <div className="flex items-start gap-4">
                  <Zap className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Pro Tip: Fine-tune Your Experience
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Visit your profile page to customize contrast levels, adjust font sizes, and configure keyboard shortcuts to match your exact needs.
                    </p>
                    <Link
                      to="/profile"
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Go to Profile Settings
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <div> {/* Removed animation class */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 sticky top-24">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4 transform hover:scale-110 transition-transform">
                  <User className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Your Profile</h3>
                <p className="text-gray-600">Profile ID: {profile?.profile_id || 'Loading...'}</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-700 font-medium">
                    <CheckCircle className="h-5 w-5" />
                    <span>Profile Active</span>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-700 font-medium">
                    <Zap className="h-5 w-5" />
                    <span>Auto-Apply Enabled</span>
                  </div>
                </div>
              </div>

              <Link
                to="/profile"
                className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center text-lg px-6 py-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Manage Settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. THE <style jsx> BLOCK HAS BEEN REMOVED */}
    </div>
  );
};

export default DashboardPage;