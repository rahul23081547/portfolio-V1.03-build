import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { MousePointer } from 'lucide-react';

interface CustomCursorProps {
  isWebsiteLoaded?: boolean;
}

const CustomCursor = ({ isWebsiteLoaded = true }: CustomCursorProps) => {
  const [isCustomCursor, setIsCustomCursor] = useState(() => {
    const saved = localStorage.getItem('isCustomCursor');
    // Default to false (system cursor) instead of true
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [shouldShowCursor, setShouldShowCursor] = useState(false);
  
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  // Optimized spring config for minimal lag and smooth movement
  const springConfig = { damping: 35, stiffness: 1000, mass: 0.05 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  // Enhanced mobile detection
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
    localStorage.setItem('isCustomCursor', JSON.stringify(isCustomCursor));
  }, [isCustomCursor]);

  // Only show cursor after website is fully loaded
  useEffect(() => {
    if (isWebsiteLoaded && !isMobile) {
      // Small delay to ensure smooth transition from loading
      const timer = setTimeout(() => {
        setShouldShowCursor(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShouldShowCursor(false);
    }
  }, [isWebsiteLoaded, isMobile]);

  useEffect(() => {
    // High-performance mouse tracking with throttling
    let animationFrameId: number;
    let lastUpdateTime = 0;
    const throttleDelay = 8; // ~120fps for ultra-smooth movement
    
    const updateMousePosition = (e: MouseEvent) => {
      const now = performance.now();
      
      if (now - lastUpdateTime >= throttleDelay) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        
        animationFrameId = requestAnimationFrame(() => {
          cursorX.set(e.clientX);
          cursorY.set(e.clientY);
        });
        
        lastUpdateTime = now;
      }
    };

    // Optimized hover detection with better selectors
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        target.hasAttribute('role') && ['button', 'link'].includes(target.getAttribute('role')!) ||
        target.style.cursor === 'pointer';
      
      setIsHovering(isInteractive);
    };

    // Only add cursor functionality when it should be shown AND user has enabled custom cursor
    if (shouldShowCursor && isCustomCursor && !isMobile) {
      window.addEventListener('mousemove', updateMousePosition, { passive: true });
      document.addEventListener('mouseover', handleMouseEnter, { passive: true });
      document.body.style.cursor = 'none';
      
      // Prevent cursor from showing on touch events
      document.addEventListener('touchstart', () => {
        document.body.style.cursor = 'auto';
      }, { passive: true });
    } else {
      document.body.style.cursor = 'auto';
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.body.style.cursor = 'auto';
    };
  }, [shouldShowCursor, isCustomCursor, isMobile, cursorX, cursorY]);

  const toggleCursor = () => {
    if (!isMobile) {
      setIsCustomCursor(!isCustomCursor);
    }
  };

  // Optimized animation variants
  const variants = {
    default: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", damping: 35, stiffness: 1000, mass: 0.05 }
    },
    hover: {
      scale: 2,
      opacity: 0.8,
      transition: { type: "spring", damping: 35, stiffness: 1000, mass: 0.05 }
    }
  };

  // Don't render anything on mobile devices or before website is loaded
  if (isMobile || !shouldShowCursor) {
    return null;
  }

  return (
    <>
      {/* Desktop-only cursor toggle button */}
      <button
        onClick={toggleCursor}
        className="fixed bottom-6 left-6 z-50 p-3 bg-dark-800/90 hover:bg-dark-700 backdrop-blur-sm rounded-full shadow-lg transition-all duration-300 group border border-dark-600/50 hover:scale-110"
        title={isCustomCursor ? "Switch to default cursor" : "Switch to custom cursor"}
      >
        <MousePointer 
          className={`w-5 h-5 transition-colors duration-300 ${
            isCustomCursor ? 'text-primary-500' : 'text-gray-400'
          }`}
        />
        {/* Subtle glow effect */}
        <div className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
          isCustomCursor ? 'bg-primary-500/20 opacity-100' : 'opacity-0'
        } blur-md -z-10`}></div>
      </button>

      {/* Custom cursor elements - only show when enabled */}
      {isCustomCursor && (
        <>
          {/* Main cursor dot */}
          <motion.div
            className="fixed top-0 left-0 w-3 h-3 bg-primary-500 rounded-full pointer-events-none mix-blend-difference z-50"
            style={{
              x: smoothX,
              y: smoothY,
              translateX: '-50%',
              translateY: '-50%'
            }}
            animate={isHovering ? "hover" : "default"}
            variants={variants}
          />
          
          {/* Outer ring */}
          <motion.div
            className="fixed top-0 left-0 w-8 h-8 border border-primary-500/30 rounded-full pointer-events-none z-50"
            style={{
              x: smoothX,
              y: smoothY,
              translateX: '-50%',
              translateY: '-50%'
            }}
            transition={{ type: "spring", damping: 30, stiffness: 800, mass: 0.05 }}
          />
        </>
      )}
    </>
  );
};

export default CustomCursor;