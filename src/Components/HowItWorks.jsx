import React, { useState } from 'react';

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: "1",
      title: "Create Your Profile",
      description: "Sign up for a free account and define your personal accessibility needs in our simple dashboard.",
      color: "bg-blue-600",
      details: "Takes less than 2 minutes"
    },
    {
      number: "2",
      title: "Add the Extension",
      description: "Install our browser extension in seconds. It works seamlessly with Chrome, Firefox, and Edge.",
      color: "bg-purple-600",
      details: "One-click installation"
    },
    {
      number: "3",
      title: "Browse Freely",
      description: "Visit any website and watch it automatically transform to match your preferences. No configuration needed.",
      color: "bg-green-600",
      details: "Works on all websites"
    }
  ];

  return (
    <section id="how-it-works" className="bg-gradient-to-b from-gray-50 to-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
            Get set up in minutes.
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Three simple steps to a more accessible web
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {steps.map((step, index) => (
            <div 
              key={index}
              onMouseEnter={() => setActiveStep(index)}
              className="relative cursor-pointer"
            >
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-1 bg-gradient-to-r from-gray-200 to-gray-100">
                  <div 
                    className={`h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ${
                      activeStep > index ? 'w-full' : 'w-0'
                    }`}
                  ></div>
                </div>
              )}
              
              <div className={`relative z-10 text-center transition-all duration-300 ${
                activeStep === index ? 'scale-105' : 'scale-100'
              }`}>
                <div className={`inline-flex items-center justify-center w-20 h-20 ${step.color} text-white text-3xl font-bold rounded-2xl mb-6 shadow-lg transition-all duration-300 ${
                  activeStep === index ? 'shadow-2xl ring-4 ring-blue-200' : ''
                }`}>
                  {step.number}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                
                <p className="text-lg text-gray-600 leading-relaxed mb-2">
                  {step.description}
                </p>

                <p className={`text-sm font-medium text-blue-600 transition-all duration-300 ${
                  activeStep === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}>
                  {step.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;