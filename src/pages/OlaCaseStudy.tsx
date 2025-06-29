import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Target, Lightbulb, Wrench, CheckCircle, Users, Smartphone, Zap, Battery, Award, TrendingUp } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { useNavigate } from 'react-router-dom';
import CustomCursor from '../components/CustomCursor';
import AudioControl from '../components/AudioControl';

const OlaCaseStudy: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isEntering, setIsEntering] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Enhanced loading animation with 3D effects
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsEntering(true);
      // Reset entering state after animation completes
      setTimeout(() => setIsEntering(false), 2000);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Track case study completion
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = window.pageYOffset;
      const progressPercentage = (currentProgress / totalScroll) * 100;
      setScrollProgress(progressPercentage);
      
      // If user has scrolled to 90% of the case study, mark as complete
      if (progressPercentage >= 90) {
        const event = new CustomEvent('caseStudyComplete', {
          detail: { caseStudyId: 'ola' }
        });
        window.dispatchEvent(event);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse tracking for 3D effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const goBack = () => {
    navigate('/');
  };

  const openFullscreen = (imageSrc: string) => {
    setFullscreenImage(imageSrc);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-dark-950 z-50 flex items-center justify-center">
        <div className="text-center">
          {/* Enhanced 3D loading animation with energy theme */}
          <div className="relative mb-12">
            <div className="w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-yellow-400/30 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="absolute inset-2 w-16 h-16 border-2 border-green-300/20 border-r-transparent rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
            <Battery className="absolute inset-0 m-auto w-8 h-8 text-green-400 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-400 animate-pulse mb-4">
            Loading Energy Experience
          </h2>
          <div className="w-64 h-2 bg-dark-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-600 to-yellow-400 rounded-full animate-pulse"></div>
          </div>
          <p className="text-gray-400 mt-4 text-sm">Preparing hackathon project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-dark-950 via-green-950/20 to-yellow-950/20 text-white overflow-hidden transition-all duration-2000 ${
      isEntering ? 'animate-cinematic-zoom' : ''
    }`}>
      {/* Persistent Controls */}
      <CustomCursor />
      <AudioControl />

      {/* Enhanced Progress Bar with energy theme colors */}
      <div className="fixed top-0 left-0 w-full h-1 bg-dark-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-green-600 to-yellow-400 transition-all duration-300 shadow-lg shadow-green-500/50"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Enhanced Back Button */}
      <button
        onClick={goBack}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-dark-800/90 hover:bg-dark-700 backdrop-blur-sm rounded-lg border border-dark-600/50 transition-all duration-300 group hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 lite-mode:hover:scale-100 lite-mode:hover:shadow-none"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300 lite-mode:group-hover:translate-x-0" />
        <span>Back to Portfolio</span>
      </button>

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 cursor-pointer"
          onClick={closeFullscreen}
        >
          <div className="relative max-w-7xl max-h-full">
            <img 
              src={fullscreenImage} 
              alt="Fullscreen view"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 w-10 h-10 bg-dark-800/80 hover:bg-dark-700 rounded-full flex items-center justify-center text-white transition-all duration-300"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <HeroSection mousePosition={mousePosition} isEntering={isEntering} />

      {/* Main Content with enhanced transitions */}
      <div className={`relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 transition-all duration-1500 ${
        isEntering ? 'opacity-0 translate-y-20' : 'opacity-100 translate-y-0'
      }`} style={{ transitionDelay: '1s' }}>
        <ProjectOverview />
        <ProblemStatement />
        <MyApproach />
        <UIComparison openFullscreen={openFullscreen} />
        <TechnicalImplementation />
        <HackathonResults />
        <WhyItWorks />
        <KeyLearnings />
        <ToolsUsed />
        <MoralInsight />
      </div>

      {/* Enhanced Background Effects with energy theme */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse lite-mode:animate-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse lite-mode:animate-none" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-500/3 rounded-full blur-2xl animate-pulse lite-mode:animate-none" style={{ animationDelay: '4s' }}></div>
      </div>
    </div>
  );
};

const HeroSection: React.FC<{ 
  mousePosition: { x: number; y: number }, 
  isEntering: boolean
}> = ({ mousePosition, isEntering }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col items-center justify-center perspective-1000 overflow-hidden py-20">
      {/* Enhanced 3D Background Elements with energy theme */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-20 left-20 w-32 h-32 bg-green-500/10 rounded-full blur-xl"
          style={{
            transform: `translate3d(${mousePosition.x * 20}px, ${mousePosition.y * 20}px, 0) rotateX(${mousePosition.y * 10}deg) rotateY(${mousePosition.x * 10}deg)`
          }}
        ></div>
        <div 
          className="absolute bottom-20 right-20 w-48 h-48 bg-yellow-500/5 rounded-full blur-2xl"
          style={{
            transform: `translate3d(${mousePosition.x * -30}px, ${mousePosition.y * -30}px, 0) rotateX(${mousePosition.y * -15}deg) rotateY(${mousePosition.x * -15}deg)`
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-10 w-24 h-24 bg-green-500/8 rounded-full blur-lg"
          style={{
            transform: `translate3d(${mousePosition.x * 15}px, ${mousePosition.y * -25}px, 0) rotateZ(${mousePosition.x * 20}deg)`
          }}
        ></div>
      </div>

      <div className={`text-center space-y-8 transform transition-all duration-2000 max-w-4xl mx-auto ${
        isInView && !isEntering ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'
      }`}>
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-500 to-yellow-400 animate-gradient-x">
            OLA – Smart Energy Backup System for E-Scooters
          </h1>
          <div className="inline-block px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full text-lg font-medium border border-yellow-500/30 mb-4">
            Hackathon Project
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            We designed an intelligent energy conservation system for electric scooters that captures unused power during rides and stores it for emergency situations. The device seamlessly integrates with a mobile app that displays real-time energy stats and ensures the rider is always informed and in control.
          </p>
          <div className="bg-gradient-to-r from-yellow-500/20 to-green-500/20 rounded-xl p-6 border border-yellow-500/30 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award className="w-6 h-6 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Achievement</span>
            </div>
            <p className="text-gray-300">
              This project was specially designed for a district-level hackathon, where it earned us <span className="text-yellow-400 font-bold">2nd place</span> and a cash prize of <span className="text-green-400 font-bold">₹14,000</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProjectOverview: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });

  return (
    <section ref={sectionRef} className="py-20">
      <div className={`transform transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="bg-dark-800/60 backdrop-blur-xl rounded-2xl p-8 border border-dark-600/50 shadow-2xl hover:shadow-green-500/10 transition-all duration-300 lite-mode:hover:shadow-none">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-8 h-8 text-green-500" />
            <h2 className="text-3xl font-bold">PROJECT OVERVIEW</h2>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            The OLA Smart Energy Backup System represents an innovative approach to electric vehicle energy management. 
            Our solution addresses the critical challenge of range anxiety in electric scooters by implementing an intelligent 
            energy recovery and storage system that captures kinetic energy during braking and downhill rides.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            The system integrates seamlessly with a comprehensive mobile application that provides real-time monitoring, 
            predictive analytics, and user-friendly controls, ensuring riders have complete visibility and control over 
            their vehicle's energy consumption and backup reserves.
          </p>
        </div>
      </div>
    </section>
  );
};

const ProblemStatement: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });

  const problems = [
    "Range anxiety remains a significant barrier to electric scooter adoption",
    "Existing energy recovery systems are inefficient and poorly integrated", 
    "Riders lack real-time visibility into their vehicle's energy consumption patterns",
    "Emergency situations leave riders stranded without backup power options",
    "Current solutions don't provide predictive insights for trip planning"
  ];

  return (
    <section ref={sectionRef} className="py-20">
      <div className={`transform transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="bg-dark-800/60 backdrop-blur-xl rounded-2xl p-8 border border-dark-600/50 shadow-2xl hover:shadow-green-500/10 transition-all duration-300 lite-mode:hover:shadow-none">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-8 h-8 text-yellow-500" />
            <h2 className="text-3xl font-bold">THE CHALLENGE</h2>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Electric scooter users face several critical challenges:
          </p>
          <div className="space-y-4">
            {problems.map((problem, index) => (
              <div 
                key={index}
                className={`flex items-start gap-3 p-4 bg-dark-700/50 rounded-lg border border-dark-600/30 transform transition-all duration-500 hover:scale-[1.02] hover:border-yellow-500/30 lite-mode:hover:scale-100 ${
                  isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-300">{problem}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const MyApproach: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });

  const approaches = [
    {
      icon: Battery,
      title: "Intelligent Energy Recovery",
      description: "Implemented advanced regenerative braking and kinetic energy capture systems that automatically store unused power during rides"
    },
    {
      icon: Smartphone,
      title: "Real-time Monitoring App", 
      description: "Developed a comprehensive mobile interface that displays live energy stats, consumption patterns, and backup power levels"
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description: "Integrated machine learning algorithms to predict energy needs and optimize backup power usage based on riding patterns"
    },
    {
      icon: Users,
      title: "User-Centric Design",
      description: "Focused on intuitive controls and clear visual feedback to ensure riders can easily understand and manage their energy systems"
    }
  ];

  return (
    <section ref={sectionRef} className="py-20">
      <div className={`transform transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="bg-dark-800/60 backdrop-blur-xl rounded-2xl p-8 border border-dark-600/50 shadow-2xl hover:shadow-green-500/10 transition-all duration-300 lite-mode:hover:shadow-none">
          <div className="flex items-center gap-3 mb-6">
            <Wrench className="w-8 h-8 text-green-500" />
            <h2 className="text-3xl font-bold">OUR SOLUTION</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {approaches.map((approach, index) => (
              <div 
                key={index}
                className={`p-6 bg-dark-700/50 rounded-xl border border-dark-600/30 transform transition-all duration-500 hover:scale-105 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/10 lite-mode:hover:scale-100 lite-mode:hover:shadow-none ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                  <approach.icon className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-green-400 mb-3">{approach.title}</h3>
                <p className="text-gray-300">{approach.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const UIComparison: React.FC<{ openFullscreen: (src: string) => void }> = ({ openFullscreen }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });

  return (
    <section ref={sectionRef} className="py-20">
      <div className={`transform transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">UI Design Evolution</h2>
          <p className="text-gray-400">From concept to refined user experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Old UI */}
          <div className="space-y-4">
            <div className="text-center">
              <span className="inline-block px-4 py-2 bg-red-500/20 text-red-400 rounded-full text-sm font-medium border border-red-500/30">
                OLD UI
              </span>
            </div>
            <div className="bg-dark-800/60 backdrop-blur-xl rounded-2xl p-6 border border-dark-600/50 hover:scale-[1.02] transition-all duration-300 cursor-pointer group relative lite-mode:hover:scale-100"
                 onClick={() => openFullscreen('/images/old version (1) copy.png')}>
              <img 
                src="/images/old version (1) copy.png" 
                alt="Old UI Design"
                className="w-full h-auto rounded-lg shadow-lg group-hover:scale-[1.02] transition-all duration-300 lite-mode:group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-dark-800/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-red-500/30">
                  <span className="text-red-400 text-sm font-medium">Click to view fullscreen</span>
                </div>
              </div>
            </div>
          </div>

          {/* New UI */}
          <div className="space-y-4">
            <div className="text-center">
              <span className="inline-block px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30">
                NEW UI
              </span>
            </div>
            <div className="bg-dark-800/60 backdrop-blur-xl rounded-2xl p-6 border border-dark-600/50 hover:scale-[1.02] transition-all duration-300 cursor-pointer group relative lite-mode:hover:scale-100"
                 onClick={() => openFullscreen('/images/Twitter header - 3 copy copy.png')}>
              <img 
                src="/images/Twitter header - 3 copy copy.png" 
                alt="New UI Design"
                className="w-full h-auto rounded-lg shadow-lg group-hover:scale-[1.02] transition-all duration-300 lite-mode:group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-dark-800/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-green-500/30">
                  <span className="text-green-400 text-sm font-medium">Click to view fullscreen</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Insights */}
        <div className="mt-12 bg-dark-800/60 backdrop-blur-xl rounded-2xl p-8 border border-dark-600/50">
          <h3 className="text-2xl font-bold mb-6 text-center">Design Improvements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-green-500" />
              </div>
              <h4 className="text-lg font-semibold text-green-400 mb-2">Enhanced Visibility</h4>
              <p className="text-gray-400 text-sm">Improved data visualization with clearer energy metrics and intuitive progress indicators</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-6 h-6 text-yellow-500" />
              </div>
              <h4 className="text-lg font-semibold text-yellow-400 mb-2">Better UX Flow</h4>
              <p className="text-gray-400 text-sm">Streamlined navigation and more logical information hierarchy for better user experience</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
              <h4 className="text-lg font-semibold text-blue-400 mb-2">Modern Aesthetics</h4>
              <p className="text-gray-400 text-sm">Contemporary design language with improved color schemes and visual consistency</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TechnicalImplementation: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });

  const features = [
    "Regenerative braking system with 85% energy recovery efficiency",
    "Real-time battery monitoring with predictive range calculations",
    "Smart charging algorithms that optimize backup power distribution",
    "Emergency power mode that extends range by up to 15km",
    "Mobile app integration with cloud-based analytics and insights"
  ];

  return (
    <section ref={sectionRef} className="py-20">
      <div className={`transform transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="bg-dark-800/60 backdrop-blur-xl rounded-2xl p-8 border border-dark-600/50 shadow-2xl hover:shadow-green-500/10 transition-all duration-300 lite-mode:hover:shadow-none">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-8 h-8 text-green-500" />
            <h2 className="text-3xl font-bold">TECHNICAL IMPLEMENTATION</h2>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Our solution combines hardware innovation with intelligent software to create a comprehensive energy management ecosystem:
          </p>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`flex items-start gap-3 p-4 bg-dark-700/50 rounded-lg border border-dark-600/30 transform transition-all duration-500 hover:scale-[1.02] hover:border-green-500/30 lite-mode:hover:scale-100 ${
                  isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const HackathonResults: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });

  return (
    <section ref={sectionRef} className="py-20">
      <div className={`transform transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="bg-gradient-to-r from-yellow-500/10 to-green-500/10 backdrop-blur-xl rounded-2xl p-8 border border-yellow-500/30 shadow-2xl">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Award className="w-8 h-8 text-yellow-500" />
              <h2 className="text-3xl font-bold">HACKATHON ACHIEVEMENT</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">2nd</div>
                <div className="text-gray-300">Place</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">₹14,000</div>
                <div className="text-gray-300">Prize Money</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">District</div>
                <div className="text-gray-300">Level Competition</div>
              </div>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
              Our innovative approach to electric vehicle energy management impressed the judges with its practical 
              implementation, user-centered design, and potential for real-world impact. The project demonstrated 
              both technical excellence and commercial viability in the growing electric mobility sector.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const WhyItWorks: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });

  const reasons = [
    {
      icon: Battery,
      title: "Practical Innovation",
      description: "Addresses real-world range anxiety with a technically feasible and cost-effective solution"
    },
    {
      icon: Smartphone,
      title: "User-Centric Design",
      description: "Intuitive mobile interface makes complex energy management accessible to everyday users"
    },
    {
      icon: TrendingUp,
      title: "Scalable Technology",
      description: "Modular design allows for easy integration with existing electric scooter platforms"
    },
    {
      icon: CheckCircle,
      title: "Proven Results",
      description: "Hackathon success demonstrates both technical merit and market potential"
    }
  ];

  return (
    <section ref={sectionRef} className="py-20">
      <div className={`transform transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="bg-dark-800/60 backdrop-blur-xl rounded-2xl p-8 border border-dark-600/50 shadow-2xl hover:shadow-green-500/10 transition-all duration-300 lite-mode:hover:shadow-none">
          <h2 className="text-3xl font-bold mb-8 text-center">WHY THIS SOLUTION WORKS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reasons.map((reason, index) => (
              <div 
                key={index}
                className={`flex items-start gap-4 p-6 bg-dark-700/50 rounded-xl border border-dark-600/30 transform transition-all duration-500 hover:scale-105 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/10 lite-mode:hover:scale-100 lite-mode:hover:shadow-none ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <reason.icon className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{reason.title}</h3>
                  <p className="text-gray-400">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const KeyLearnings: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });

  const learnings = [
    "Hackathon environments demand rapid prototyping skills and the ability to validate concepts quickly under pressure",
    "User experience design is crucial even in technical projects—complex systems need intuitive interfaces to succeed",
    "Collaborative problem-solving accelerates innovation when team members bring diverse skills and perspectives",
    "Real-world constraints often drive the most creative solutions—limitations can spark breakthrough thinking"
  ];

  return (
    <section ref={sectionRef} className="py-20">
      <div className={`transform transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="bg-dark-800/60 backdrop-blur-xl rounded-2xl p-8 border border-dark-600/50 shadow-2xl hover:shadow-green-500/10 transition-all duration-300 lite-mode:hover:shadow-none">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-8 h-8 text-yellow-500" />
            <h2 className="text-3xl font-bold">KEY LEARNINGS</h2>
          </div>
          <div className="space-y-4">
            {learnings.map((learning, index) => (
              <div 
                key={index}
                className={`flex items-start gap-3 p-4 bg-dark-700/50 rounded-lg border border-dark-600/30 transform transition-all duration-500 hover:scale-[1.02] hover:border-yellow-500/30 lite-mode:hover:scale-100 ${
                  isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-300">{learning}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ToolsUsed: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });

  const tools = [
    { name: "Figma", description: "UI/UX design and prototyping" },
    { name: "Arduino IDE", description: "Hardware programming and testing" },
    { name: "React Native", description: "Mobile app development" },
    { name: "Node.js", description: "Backend API development" }
  ];

  return (
    <section ref={sectionRef} className="py-20">
      <div className={`transform transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="bg-dark-800/60 backdrop-blur-xl rounded-2xl p-8 border border-dark-600/50 shadow-2xl hover:shadow-green-500/10 transition-all duration-300 lite-mode:hover:shadow-none">
          <div className="flex items-center gap-3 mb-6">
            <Wrench className="w-8 h-8 text-green-500" />
            <h2 className="text-3xl font-bold">TOOLS & TECHNOLOGIES</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool, index) => (
              <div 
                key={index}
                className="px-6 py-4 bg-gradient-to-r from-green-500/20 to-yellow-400/20 rounded-xl border border-green-500/30 hover:scale-105 transition-all duration-300 lite-mode:hover:scale-100"
              >
                <span className="text-xl font-bold text-green-400 block">{tool.name}</span>
                <p className="text-gray-400 text-sm mt-1">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const MoralInsight: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });

  return (
    <section ref={sectionRef} className="py-20">
      <div className={`transform transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="text-center max-w-3xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-yellow-500/10 to-green-500/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-dark-800/40 backdrop-blur-xl rounded-2xl p-8 border border-green-500/20 shadow-2xl">
              <h3 className="text-xl font-semibold text-green-400 mb-4 italic">Moral Insight</h3>
              <p className="text-lg text-gray-300 leading-relaxed italic font-light">
                "Innovation thrives under pressure. Sometimes the best solutions emerge when you have just enough time to think clearly and just enough constraints to think creatively."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OlaCaseStudy;