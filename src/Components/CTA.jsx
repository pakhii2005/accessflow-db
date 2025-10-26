import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap } from 'lucide-react';

const CTA = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <Shield className="h-16 w-16 text-blue-200 mx-auto mb-6 animate-pulse" />
        
        <h2 className="text-5xl font-extrabold text-white mb-6">
          Take back control of your browsing experience.
        </h2>
        
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Join thousands of users who have already transformed how they experience the web.
        </p>
        
        <Link 
          to="/signup"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="inline-flex items-center gap-2 bg-white text-blue-600 text-xl px-10 py-5 rounded-lg font-bold hover:bg-blue-50 transition-all hover:shadow-2xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
        >
          Sign Up and Download Free
          <Zap className={`h-5 w-5 transition-transform duration-300 ${
            isHovered ? 'rotate-12 scale-110' : ''
          }`} />
        </Link>
        
        <p className="text-blue-200 mt-6 text-lg">
          No credit card required • Free forever
        </p>
      </div>
    </section>
  );
};

export default CTA;