import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Timeline from './components/Timeline';
import Showcase3D from './components/Showcase3D';
import DesignCarousel from './components/DesignCarousel';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import CustomCursor from './components/CustomCursor';
import AudioControl from './components/AudioControl';
import MobileAlert from './components/MobileAlert';
import RealityTransition from './components/RealityTransition';
import EasterEggPopup from './components/EasterEggPopup';
import LiteModeToggle from './components/LiteModeToggle';
import SwiggyCaseStudy from './pages/SwiggyCaseStudy';
import SkillUpCaseStudy from './pages/SkillUpCaseStudy';
import ConnectCaseStudy from './pages/ConnectCaseStudy';
import OlaCaseStudy from './pages/OlaCaseStudy';
import SecretRealityPage from './pages/SecretRealityPage';

function HomePage() {
  // Check if loading screen was already shown this session
  const [isLoading, setIsLoading] = useState(() => {
    const loadingShown = sessionStorage.getItem('loadingScreenShown');
    return loadingShown !== 'true';
  });
  
  const [showContent, setShowContent] = useState(false);
  const [showRealityTransition, setShowRealityTransition] = useState(false);
  const [showEasterEggHint, setShowEasterEggHint] = useState(false);
  const [showEasterEggDiscovered, setShowEasterEggDiscovered] = useState(false);
  const [easterEggTimer, setEasterEggTimer] = useState<NodeJS.Timeout | null>(null);
  const [exploredPercentage, setExploredPercentage] = useState(0);
  const [unknownRealityDiscovered, setUnknownRealityDiscovered] = useState(false);
  const [unknownRealityVisited, setUnknownRealityVisited] = useState(false);
  const [easterEggShownThisSession, setEasterEggShownThisSession] = useState(false);
  const [sectionsViewed, setSectionsViewed] = useState(new Set<string>());
  const [caseStudiesViewed, setCaseStudiesViewed] = useState(new Set<string>());
  const [portfolioScrollCompleted, setPortfolioScrollCompleted] = useState(false);
  const [websiteFullyLoaded, setWebsiteFullyLoaded] = useState(false);

  // Check if Easter egg was already shown this session
  useEffect(() => {
    const easterEggShown = sessionStorage.getItem('easterEggShown');
    const realityDiscovered = localStorage.getItem('unknownRealityDiscovered');
    const realityVisited = sessionStorage.getItem('unknownRealityVisited');
    const viewedSections = sessionStorage.getItem('viewedSections');
    const viewedCaseStudies = sessionStorage.getItem('viewedCaseStudies');
    const scrollCompleted = sessionStorage.getItem('portfolioScrollCompleted');
    
    if (easterEggShown === 'true') {
      setEasterEggShownThisSession(true);
    }
    
    if (realityDiscovered === 'true') {
      setUnknownRealityDiscovered(true);
    }

    if (realityVisited === 'true') {
      setUnknownRealityVisited(true);
    }

    if (viewedSections) {
      setSectionsViewed(new Set(JSON.parse(viewedSections)));
    }

    if (viewedCaseStudies) {
      setCaseStudiesViewed(new Set(JSON.parse(viewedCaseStudies)));
    }

    if (scrollCompleted === 'true') {
      setPortfolioScrollCompleted(true);
    }
  }, []);

  // Scroll restoration effect
  useEffect(() => {
    const lastScrollPosition = sessionStorage.getItem('lastScrollPosition');
    if (lastScrollPosition) {
      // Restore scroll position after a short delay to ensure content is loaded
      setTimeout(() => {
        window.scrollTo(0, parseInt(lastScrollPosition, 10));
        sessionStorage.removeItem('lastScrollPosition');
      }, 100);
    }
  }, []);

  // Track portfolio scroll completion
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = scrollTop / (docHeight - winHeight);

      // If user has scrolled to 90% of the homepage, mark as completed
      if (scrollPercent >= 0.9 && !portfolioScrollCompleted) {
        setPortfolioScrollCompleted(true);
        sessionStorage.setItem('portfolioScrollCompleted', 'true');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [portfolioScrollCompleted]);

  // Enhanced discovery tracking with intersection observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.8, // 80% of section must be visible
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sectionId && !sectionsViewed.has(sectionId)) {
            const newSectionsViewed = new Set(sectionsViewed);
            newSectionsViewed.add(sectionId);
            setSectionsViewed(newSectionsViewed);
            sessionStorage.setItem('viewedSections', JSON.stringify([...newSectionsViewed]));
          }
        }
      });
    }, observerOptions);

    // Observe all main sections
    const sections = document.querySelectorAll('#home, #about, #timeline, #case-studies, #design-interests, #contact');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, [sectionsViewed]);

  // Calculate exploration percentage based on new discovery logic
  useEffect(() => {
    let discoveryPercentage = 0;
    
    // +20% for scrolling through entire portfolio homepage
    if (portfolioScrollCompleted) {
      discoveryPercentage += 20;
    }
    
    // +20% for visiting first case study (Swiggy)
    if (caseStudiesViewed.has('swiggy')) {
      discoveryPercentage += 20;
    }
    
    // +20% for visiting second case study (SkillUp)
    if (caseStudiesViewed.has('skillup')) {
      discoveryPercentage += 20;
    }
    
    // +20% for visiting third case study (Connect)
    if (caseStudiesViewed.has('connect')) {
      discoveryPercentage += 20;
    }
    
    // +15% for visiting fourth case study (OLA)
    if (caseStudiesViewed.has('ola')) {
      discoveryPercentage += 15;
    }
    
    // +5% for discovering Unknown Reality
    if (unknownRealityVisited) {
      discoveryPercentage += 5;
    }
    
    // Cap at 100%
    discoveryPercentage = Math.min(discoveryPercentage, 100);
    
    setExploredPercentage(discoveryPercentage);
  }, [portfolioScrollCompleted, caseStudiesViewed, unknownRealityVisited]);

  // Track case study completion
  useEffect(() => {
    const handleCaseStudyComplete = (event: CustomEvent) => {
      const caseStudyId = event.detail.caseStudyId;
      if (!caseStudiesViewed.has(caseStudyId)) {
        const newCaseStudiesViewed = new Set(caseStudiesViewed);
        newCaseStudiesViewed.add(caseStudyId);
        setCaseStudiesViewed(newCaseStudiesViewed);
        sessionStorage.setItem('viewedCaseStudies', JSON.stringify([...newCaseStudiesViewed]));
      }
    };

    window.addEventListener('caseStudyComplete', handleCaseStudyComplete as EventListener);
    return () => window.removeEventListener('caseStudyComplete', handleCaseStudyComplete as EventListener);
  }, [caseStudiesViewed]);

  // Enhanced loading screen logic - only show once per session
  useEffect(() => {
    if (isLoading) {
      // Ensure minimum loading time for consistent experience across all devices
      const minLoadingTime = 3000; // 3 seconds minimum
      const startTime = Date.now();
      
      // Function to complete loading
      const completeLoading = () => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
        
        setTimeout(() => {
          setIsLoading(false);
          // Mark loading screen as shown for this session
          sessionStorage.setItem('loadingScreenShown', 'true');
          
          // Start content animation slightly after loading screen fades
          setTimeout(() => {
            setShowContent(true);
            setWebsiteFullyLoaded(true); // Mark website as fully loaded
            
            // Start Easter egg hint timer after content loads (only if not shown this session)
            if (!easterEggShownThisSession) {
              const eggTimer = setTimeout(() => {
                setShowEasterEggHint(true);
              }, 15000); // 15 seconds after content loads
              
              setEasterEggTimer(eggTimer);
            }
          }, 200);
        }, remainingTime);
      };

      // Wait for DOM to be ready and any critical resources
      if (document.readyState === 'complete') {
        completeLoading();
      } else {
        const handleLoad = () => {
          completeLoading();
          window.removeEventListener('load', handleLoad);
        };
        window.addEventListener('load', handleLoad);
        
        // Fallback in case load event doesn't fire
        const fallbackTimer = setTimeout(completeLoading, 5000);
        
        return () => {
          window.removeEventListener('load', handleLoad);
          clearTimeout(fallbackTimer);
          if (easterEggTimer) {
            clearTimeout(easterEggTimer);
          }
        };
      }
    } else {
      // If loading screen is not shown, mark website as fully loaded immediately
      setShowContent(true);
      setWebsiteFullyLoaded(true);
    }
  }, [isLoading, easterEggShownThisSession]);

  const triggerRealityShift = () => {
    // Clear the hint timer if reality shift is triggered
    if (easterEggTimer) {
      clearTimeout(easterEggTimer);
      setEasterEggTimer(null);
    }
    
    // Close hint popup if open
    setShowEasterEggHint(false);
    
    // Show reality transition
    setShowRealityTransition(true);
    
    // Update reality discovered status
    setUnknownRealityDiscovered(true);
    localStorage.setItem('unknownRealityDiscovered', 'true');
    
    // Mark that user has visited the alternate reality
    setUnknownRealityVisited(true);
    sessionStorage.setItem('unknownRealityVisited', 'true');
    
    // Show discovered popup after transition
    setTimeout(() => {
      setShowEasterEggDiscovered(true);
    }, 4500); // After reality transition completes
  };

  const handleRealityTransitionComplete = () => {
    setShowRealityTransition(false);
  };

  const closeEasterEggHint = () => {
    setShowEasterEggHint(false);
    setEasterEggShownThisSession(true);
    sessionStorage.setItem('easterEggShown', 'true');
  };

  const closeEasterEggDiscovered = () => {
    setShowEasterEggDiscovered(false);
  };

  return (
    <>
      {isLoading && <LoadingScreen />}
      
      {/* Reality Transition Overlay */}
      <RealityTransition 
        isVisible={showRealityTransition} 
        onComplete={handleRealityTransitionComplete}
      />
      
      {/* Easter Egg Popups */}
      <EasterEggPopup 
        type="hint"
        isVisible={showEasterEggHint}
        onClose={closeEasterEggHint}
      />
      
      <EasterEggPopup 
        type="discovered"
        isVisible={showEasterEggDiscovered}
        onClose={closeEasterEggDiscovered}
      />
      
      {/* Navigation Bar - Always visible after loading, independent of content transitions */}
      <Navbar isVisible={!isLoading} onRealityShift={triggerRealityShift} />
      
      {/* Mobile Alert - Show only on mobile devices */}
      {!isLoading && <MobileAlert />}
      
      {/* Lite Mode Toggle - Only show on homepage */}
      {!isLoading && <LiteModeToggle />}
      
      <div className={`min-h-screen bg-gradient-to-br from-dark-950 to-dark-900 text-white transition-all duration-1500 ease-out ${
        isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <main>
            <div className={`transition-all duration-1000 ease-out delay-200 ${
              showContent ? 'transform translate-y-0 opacity-100 scale-100' : 'transform translate-y-12 opacity-0 scale-95'
            }`}>
              <Hero />
            </div>
            <div className={`transition-all duration-1000 ease-out delay-300 ${
              showContent ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
            }`}>
              <About />
            </div>
            <div className={`transition-all duration-1000 ease-out delay-400 ${
              showContent ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
            }`}>
              <Timeline />
            </div>
            <div className={`transition-all duration-1000 ease-out delay-500 ${
              showContent ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
            }`}>
              <Showcase3D />
            </div>
            <div className={`transition-all duration-1000 ease-out delay-600 ${
              showContent ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
            }`}>
              <DesignCarousel 
                exploredPercentage={exploredPercentage}
                unknownRealityDiscovered={unknownRealityDiscovered}
              />
            </div>
            <div className={`transition-all duration-1000 ease-out delay-700 ${
              showContent ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
            }`}>
              <Contact />
            </div>
          </main>
          <div className={`transition-all duration-1000 ease-out delay-800 ${
            showContent ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'
          }`}>
            <Footer />
          </div>
        </div>
      </div>

      {/* Custom Cursor - Only show after website is fully loaded */}
      {websiteFullyLoaded && <CustomCursor />}
    </>
  );
}

function App() {
  return (
    <Router>
      {/* Persistent Audio Control - Moved outside Routes to maintain state across navigation */}
      <AudioControl />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/case-study/swiggy" element={<SwiggyCaseStudy />} />
        <Route path="/case-study/skillup" element={<SkillUpCaseStudy />} />
        <Route path="/case-study/connect" element={<ConnectCaseStudy />} />
        <Route path="/case-study/ola" element={<OlaCaseStudy />} />
        <Route path="/secret-reality" element={<SecretRealityPage />} />
      </Routes>
    </Router>
  );
}

export default App;