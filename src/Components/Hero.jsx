import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Sparkles, ChevronDown, ArrowRight } from 'lucide-react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main className="relative bg-gradient-to-b from-blue-50 to-white pt-32 pb-24 sm:pt-40 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className={`inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8 transform transition-all duration-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <Sparkles className="h-4 w-4 animate-pulse" />
          <span>Free forever • No credit card required</span>
        </div>
        
        <h1 className={`text-6xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight transform transition-all duration-700 delay-100 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          The web, adapted for you.{' '}
          <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent inline-block hover:scale-105 transition-transform pb-2">
            Instantly.
          </span>
        </h1>
        
        <p className={`text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed transform transition-all duration-700 delay-200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          Stop fighting inconsistent websites. AccessFlow is a free tool that remakes any page to fit your personal accessibility needs.
        </p>
        
        <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transform transition-all duration-700 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <Link 
            to="/signup" 
            className="group inline-flex items-center gap-2 bg-blue-600 text-white text-xl px-10 py-5 rounded-lg font-medium hover:bg-blue-700 transition-all hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Get Started for Free
            <Zap className="h-5 w-5 group-hover:rotate-12 transition-transform" />
          </Link>
          <a 
            href="#features" 
            className="group inline-flex items-center gap-2 bg-white text-gray-900 text-xl px-10 py-5 rounded-lg font-medium border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-all hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Learn More
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
        
        <p className="text-gray-500 mt-8 text-lg animate-fade-in">
          Join 50,000+ users browsing with confidence
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-gray-400" />
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
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-in 0.5s both;
        }
      `}</style>
    </main>
  );
};

export default Hero;