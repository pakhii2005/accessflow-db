import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pb-8 border-b border-gray-800">
          <div>
            <div className="text-2xl font-bold text-white mb-2 hover:scale-105 transition-transform inline-block">
              AccessFlow
            </div>
            <p className="text-gray-400">Making the web accessible for everyone.</p>
          </div>
          <div className="flex gap-8">
            <Link 
              to="/accessibility-statement" 
              className="text-lg text-gray-300 hover:text-white transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1"
            >
              Accessibility Statement
            </Link>
            <Link 
              to="/privacy-policy" 
              className="text-lg text-gray-300 hover:text-white transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/contact" 
              className="text-lg text-gray-300 hover:text-white transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1"
            >
              Contact
            </Link>
          </div>
        </div>
        <p className="text-center text-gray-400 mt-8 text-lg">
          © 2025 AccessFlow. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;