import React, { useState } from 'react';
import { Eye, Type, Keyboard, Check, ArrowRight } from 'lucide-react';

const Features = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const features = [
    {
      icon: Eye,
      title: "Total Contrast Control",
      description: "Instantly apply high-contrast, dark, or custom-tuned color modes to any website, making it readable for you.",
      gradient: "from-blue-500 to-blue-600",
      features: ["High contrast mode", "Dark mode", "Custom themes"]
    },
    {
      icon: Type,
      title: "Readable Fonts, Everywhere",
      description: "Enlarge all text to the perfect size for your reading comfort. No more squinting to read tiny fonts.",
      gradient: "from-purple-500 to-purple-600",
      features: ["Adjustable text size", "Font customization", "Line spacing"]
    },
    {
      icon: Keyboard,
      title: "Clear Keyboard Navigation",
      description: "We automatically find and fix keyboard navigation issues, so you can browse with confidence.",
      gradient: "from-green-500 to-green-600",
      features: ["Tab navigation", "Skip links", "Focus indicators"]
    }
  ];

  return (
    <section id="features" className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
            Your Web, Your Way
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features that put you in control of your browsing experience
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative p-8 rounded-2xl border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 bg-white hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
            >
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 transition-transform duration-300 ${
                hoveredIndex === index ? 'scale-110 rotate-3' : 'scale-100'
              }`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                {feature.description}
              </p>

              <div className={`overflow-hidden transition-all duration-300 ${
                hoveredIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  {feature.features.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-700">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`absolute bottom-4 right-4 transition-all duration-300 ${
                hoveredIndex === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
              }`}>
                <ArrowRight className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;