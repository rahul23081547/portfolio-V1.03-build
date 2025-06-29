import React, { useState, useEffect } from 'react';
import { Zap, ZapOff } from 'lucide-react';

const LiteModeToggle: React.FC = () => {
  const [isLiteMode, setIsLiteMode] = useState(() => {
    const saved = localStorage.getItem('isLiteMode');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Enhanced mobile detection - completely remove from mobile
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = 
        window.innerWidth <= 1024 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        ('ontouchstart' in window) || 
        (navigator.maxTouchPoints > 0) ||
        window.matchMedia('(pointer: coarse)').matches;
      
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('isLiteMode', JSON.stringify(isLiteMode));
    
    // Apply lite mode class to document body
    if (isLiteMode) {
      document.body.classList.add('lite-mode');
    } else {
      document.body.classList.remove('lite-mode');
    }
  }, [isLiteMode]);

  const toggleLiteMode = () => {
    setIsLiteMode(!isLiteMode);
  };

  // Completely remove from mobile - no rendering at all
  if (isMobile) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-20 z-50">
      <div 
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Tooltip */}
        <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-dark-800/95 backdrop-blur-sm text-white text-sm rounded-lg border border-dark-600/50 whitespace-nowrap transition-all duration-300 pointer-events-none ${
          showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          {isLiteMode ? 'Switch to Full Version' : 'Switch to Lite Version'}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-dark-800/95"></div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleLiteMode}
          className={`group relative w-12 h-12 rounded-full border-2 transition-all duration-300 hover:scale-110 active:scale-95 ${
            isLiteMode 
              ? 'bg-gray-600/90 border-gray-500/50 hover:bg-gray-500 hover:border-gray-400/70' 
              : 'bg-primary-600/90 border-primary-500/50 hover:bg-primary-500 hover:border-primary-400/70'
          } backdrop-blur-sm shadow-lg hover:shadow-xl`}
          aria-label={isLiteMode ? 'Switch to Full Version' : 'Switch to Lite Version'}
        >
          {/* Background Glow */}
          <div className={`absolute inset-0 rounded-full transition-opacity duration-300 blur-lg scale-150 ${
            isLiteMode 
              ? 'bg-gray-500/30 opacity-0 group-hover:opacity-100' 
              : 'bg-primary-500/30 opacity-0 group-hover:opacity-100'
          }`}></div>

          {/* Icon */}
          <div className="relative z-10 flex items-center justify-center w-full h-full">
            {isLiteMode ? (
              <ZapOff className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
            ) : (
              <Zap className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
            )}
          </div>

          {/* Pulse Animation (only in full mode) */}
          {!isLiteMode && (
            <div className="absolute inset-0 rounded-full bg-primary-500/30 animate-ping opacity-75"></div>
          )}

          {/* Ripple Effect on Click */}
          <div className="absolute inset-0 rounded-full opacity-0 group-active:opacity-100 group-active:animate-ping bg-white/30 transition-opacity duration-200"></div>
        </button>

        {/* Status Indicator */}
        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-dark-900 transition-colors duration-300 ${
          isLiteMode ? 'bg-gray-400' : 'bg-primary-400'
        }`}></div>
      </div>
    </div>
  );
};

export default LiteModeToggle;