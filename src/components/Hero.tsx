import React, { useEffect, useState, lazy, Suspense } from 'react';
import { ChevronDown } from 'lucide-react';

// Lazy load Spline component with proper error handling
const Spline = lazy(() => import('@splinetool/react-spline'));

const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [splineLoaded, setSplineLoaded] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const onSplineLoad = () => {
    setSplineLoaded(true);
  };

  // Smooth scroll to case studies section
  const scrollToCaseStudies = () => {
    const caseStudiesSection = document.getElementById('case-studies');
    if (caseStudiesSection) {
      caseStudiesSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section id="home" className="min-h-screen flex flex-col justify-center relative">
      {/* 3D Background - Optimized with error boundary */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${splineLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Suspense fallback={
          <div className="w-full h-full bg-dark-950 flex items-center justify-center">
            <div className="text-gray-400">Loading 3D Experience...</div>
          </div>
        }>
          <Spline 
            scene="https://prod.spline.design/qq0TtCDqqs06lA0W/scene.splinecode"
            onLoad={onSplineLoad}
            onError={() => {
              console.warn('Spline failed to load, continuing without 3D background');
              setSplineLoaded(true); // Continue without 3D if it fails
            }}
          />
        </Suspense>
      </div>

      {/* Content positioned with minimal spacing */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className={`space-y-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <h2 className="text-2xl sm:text-3xl font-medium text-gray-300 font-inter">
              Hi, I am
            </h2>
            
            {/* Interactive Rahul Text */}
            <div className="relative group cursor-pointer">
              <h1 className="text-5xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 animate-gradient-x pb-2 font-orbitron transition-all duration-500 group-hover:scale-105 group-hover:drop-shadow-2xl lite-mode:group-hover:scale-100">
                Rahul
              </h1>
              
              {/* Interactive glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-r from-primary-400/20 to-primary-600/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 lite-mode:opacity-0`}></div>
              
              {/* Floating particles on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none lite-mode:opacity-0">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-primary-400 rounded-full animate-float lite-mode:animate-none"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: `${2 + Math.random() * 2}s`,
                    }}
                  ></div>
                ))}
              </div>
              
              {/* Ripple effect on click */}
              <div className="absolute inset-0 rounded-full opacity-0 group-active:opacity-100 group-active:animate-ping bg-primary-500/30 transition-opacity duration-200 lite-mode:animate-none"></div>
            </div>

            <div className="space-y-4">
              <p className="text-xl sm:text-2xl font-bold text-gray-300 font-orbitron">
                <span className="text-primary-500">UI/UX Designer</span> & <span className="text-primary-500">Creative Technologist</span>
              </p>
              <p className="text-gray-400 text-lg max-w-2xl leading-relaxed font-inter">
                Building digital experiences that don't just look futuristic—but feel intuitive. I blend full-stack development with immersive UI/UX design to shape interfaces that truly connect with users.
              </p>
            </div>
            <div className="pt-4 flex flex-wrap gap-4">
              <a 
                href="#contact" 
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-primary-600/20 transform hover:-translate-y-1 font-inter lite-mode:hover:translate-y-0"
              >
                Get in Touch
              </a>
              <button 
                onClick={scrollToCaseStudies}
                className="px-6 py-3 bg-dark-700 border border-dark-600 hover:bg-dark-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:-translate-y-1 font-inter lite-mode:hover:translate-y-0 cursor-pointer"
              >
                View Projects
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce lite-mode:animate-none">
        <a href="#about" className="text-gray-400 hover:text-primary-500 transition-colors duration-300">
          <ChevronDown size={32} />
        </a>
      </div>
    </section>
  );
};

export default Hero;