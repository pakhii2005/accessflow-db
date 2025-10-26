// ============================================
// FILE: src/Components/Navbar.jsx (Corrected)
// ============================================

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, LayoutDashboard, Menu, X } from 'lucide-react';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Logout handler
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('userEmail');
    
    // Update authentication state
    setIsLoggedIn(false);
    
    // Close mobile menu if open
    setMobileMenuOpen(false);
    
    // Navigate to home page
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            to={isLoggedIn ? "/dashboard" : "/"} 
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 transform hover:scale-105 transition-transform"
          >
            AccessFlow
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {!isLoggedIn ? (
              // Links for logged OUT users
              <>
                <Link 
                  to="/#features" 
                  className="text-lg text-gray-700 hover:text-blue-600 transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-3 py-2"
                >
                  Features
                </Link>
                <Link 
                  to="/#how-it-works" 
                  className="text-lg text-gray-700 hover:text-blue-600 transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-3 py-2"
                >
                  How It Works
                </Link>
              </>
            ) : (
              // Links for logged IN users
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-2 text-lg text-gray-700 hover:text-blue-600 transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-3 py-2"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 text-lg text-gray-700 hover:text-blue-600 transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-3 py-2"
                >
                  <User className="h-5 w-5" />
                  My Profile
                </Link>
              </>
            )}
          </div>
          
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {!isLoggedIn ? (
              // Buttons for logged OUT users
              <>
                <Link 
                  to="/login" 
                  className="text-lg text-gray-700 hover:text-blue-600 transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-4 py-2"
                >
                  Log In
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-blue-600 text-white text-lg px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Sign Up Free
                </Link>
              </>
            ) : (
              // Logout button for logged IN users
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-lg px-6 py-3 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <LogOut className="h-5 w-5" />
                Log Out
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          // This className has been fixed (removed animate-slide-down)
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              {!isLoggedIn ? (
                // Mobile links for logged OUT users
                <>
                  <Link 
                    to="/#features"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Features
                  </Link>
                  <Link 
                    to="/#how-it-works"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    How It Works
                  </Link>
                  <Link 
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Log In
                  </Link>
                  <Link 
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-blue-600 text-white text-lg px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                  >
                    Sign Up Free
                  </Link>
                </>
              ) : (
                // Mobile links for logged IN users
                <>
                  <Link 
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-lg text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link 
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-lg text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <User className="h-5 w-5" />
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-lg px-6 py-3 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <LogOut className="h-5 w-5" />
                    Log Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* The <style jsx> block has been removed */}
    </nav>
  );
};

export default Navbar;