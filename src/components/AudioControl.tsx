import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const AudioControl: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Auto-start music immediately when component mounts (once per session)
  useEffect(() => {
    const sessionAutoStarted = sessionStorage.getItem('musicAutoStarted');
    
    if (!sessionAutoStarted) {
      // Try to start music immediately
      const attemptAutoPlay = () => {
        if (audioRef.current && !isPlaying) {
          audioRef.current.play().then(() => {
            setIsPlaying(true);
            sessionStorage.setItem('musicAutoStarted', 'true');
          }).catch(error => {
            console.log("Auto-play prevented by browser:", error);
            // If immediate autoplay fails, try again after a short delay
            setTimeout(() => {
              if (audioRef.current && !isPlaying) {
                audioRef.current.play().then(() => {
                  setIsPlaying(true);
                  sessionStorage.setItem('musicAutoStarted', 'true');
                }).catch(() => {
                  // Browser prevented autoplay, user will need to manually start
                });
              }
            }, 500);
          });
        }
      };

      // Try immediately
      attemptAutoPlay();
    }
  }, [isPlaying]);

  // Sync with global audio state
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'audioPlaying') {
        const newState = e.newValue === 'true';
        setIsPlaying(newState);
        if (audioRef.current) {
          if (newState && audioRef.current.paused) {
            audioRef.current.play().catch(() => {});
          } else if (!newState && !audioRef.current.paused) {
            audioRef.current.pause();
          }
        }
      }
      if (e.key === 'audioVolume') {
        const newVolume = parseFloat(e.newValue || '0.5');
        setVolume(newVolume);
        if (audioRef.current) {
          audioRef.current.volume = newVolume;
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Initialize from localStorage
    const savedPlaying = localStorage.getItem('audioPlaying');
    const savedVolume = localStorage.getItem('audioVolume');
    
    if (savedPlaying !== null) {
      setIsPlaying(savedPlaying === 'true');
    }
    if (savedVolume !== null) {
      setVolume(parseFloat(savedVolume));
    }

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      const newPlayingState = !isPlaying;
      
      if (newPlayingState) {
        audioRef.current.play().catch(error => {
          console.error("Audio playback failed:", error);
        });
        setShowVolumeSlider(false);
      } else {
        audioRef.current.pause();
        setShowVolumeSlider(false);
      }
      
      setIsPlaying(newPlayingState);
      localStorage.setItem('audioPlaying', newPlayingState.toString());
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    localStorage.setItem('audioVolume', newVolume.toString());
  };

  const handleMouseEnter = () => {
    if (isPlaying) {
      setShowVolumeSlider(true);
    }
  };

  const handleMouseLeave = () => {
    setShowVolumeSlider(false);
  };

  return (
    <>
      {/* Background Audio */}
      <audio 
        ref={audioRef} 
        loop
        preload="auto"
      >
        <source 
          src="https://res.cloudinary.com/dvrfzlgsg/video/upload/v1748341883/AudioCutter_Space_Ambient_Music___INTERSTELLAR_SPACE_JOURNEY___1_1_tc3pkt.mp3" 
          type="audio/mpeg" 
        />
        <source 
          src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" 
          type="audio/wav" 
        />
        Your browser does not support the audio element.
      </audio>

      {/* Fixed Audio Control Button and Volume Slider */}
      <div 
        className="fixed bottom-6 right-6 z-50 flex flex-col items-center space-y-3"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Vertical Volume Slider - Positioned above the button */}
        <div className={`bg-dark-800/90 backdrop-blur-sm p-3 rounded-full shadow-lg border border-dark-600/50 transform transition-all duration-300 ease-in-out ${
          showVolumeSlider && isPlaying ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        }`}>
          <div className="flex flex-col items-center h-24">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="h-20 w-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-primary-500 slider-vertical"
              style={{
                writingMode: 'bt-lr',
                WebkitAppearance: 'slider-vertical',
                background: `linear-gradient(to top, #ff0000 0%, #ff0000 ${volume * 100}%, #262626 ${volume * 100}%, #262626 100%)`
              }}
              orient="vertical"
            />
          </div>
        </div>

        {/* Audio Toggle Button */}
        <button
          onClick={toggleAudio}
          className="bg-dark-800/90 hover:bg-dark-700 backdrop-blur-sm text-white p-3 rounded-full shadow-lg transition-all duration-300 border border-dark-600/50 group relative hover:scale-110"
          aria-label={isPlaying ? 'Mute audio' : 'Play audio'}
        >
          {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
          
          {/* Subtle glow effect when playing */}
          <div className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
            isPlaying ? 'bg-primary-500/20 opacity-100' : 'opacity-0'
          } blur-md -z-10`}></div>
          
          {/* Pulse animation when playing */}
          {isPlaying && (
            <div className="absolute inset-0 rounded-full bg-primary-500/30 animate-ping opacity-75"></div>
          )}
        </button>
      </div>

      {/* Custom CSS for vertical slider */}
      <style jsx>{`
        .slider-vertical {
          writing-mode: bt-lr; /* IE */
          -webkit-appearance: slider-vertical; /* WebKit */
          width: 8px;
          height: 80px;
          outline: none;
        }
        
        .slider-vertical::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ff0000;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(255, 0, 0, 0.3);
        }
        
        .slider-vertical::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ff0000;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(255, 0, 0, 0.3);
        }
      `}</style>
    </>
  );
};

export default AudioControl;