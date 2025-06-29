import React, { useEffect, useState } from 'react';
import { Triangle } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Optimized progress animation with requestAnimationFrame
    let animationFrameId: number;
    let startTime: number;
    const duration = 2500; // 2.5 seconds for progress
    
    const animateProgress = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progressValue = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(Math.floor(progressValue));
      
      if (progressValue < 100) {
        animationFrameId = requestAnimationFrame(animateProgress);
      }
    };
    
    animationFrameId = requestAnimationFrame(animateProgress);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      // Small delay before fade out for better UX
      const timer = setTimeout(() => setFadeOut(true), 300);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <div className={`fixed inset-0 bg-dark-950 z-50 flex items-center justify-center transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* Optimized animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-dark-950 to-dark-900/20 animate-gradient-x"></div>
        
        {/* Center content */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-12">
            <Triangle 
              className="h-24 w-24 text-primary-500 animate-float"
              style={{ filter: 'drop-shadow(0 0 20px rgba(255, 0, 0, 0.3))' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-primary-500 rounded-full animate-pulse"
                style={{ filter: 'blur(8px)' }}></div>
            </div>
          </div>

          {/* Loading text */}
          <h2 className="text-2xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 animate-pulse">
            Loading Experience
          </h2>

          {/* Optimized progress bar */}
          <div className="w-64 h-1 bg-dark-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-100 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Progress percentage */}
          <p className="text-primary-400 mt-4 font-medium">
            {progress}%
          </p>
        </div>

        {/* Optimized animated particles - reduced count for performance */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary-500 rounded-full animate-float lite-mode:animate-none"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: 0.3
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;