import React from 'react';
import Hero from '../Components/Hero';
import Features from '../Components/Features';
import HowItWorks from '../Components/HowItWorks';
import CTA from '../Components/CTA';
import Footer from '../Components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
};

export default HomePage;