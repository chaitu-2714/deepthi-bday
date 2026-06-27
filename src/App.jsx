import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import './styles/Surprise.css';

// Component imports
import AmbientEffects from './components/AmbientEffects';
import AudioController from './components/AudioController';
import Countdown from './components/Countdown';
import GiftBox3D from './components/GiftBox3D';
import VideoPlayer from './components/VideoPlayer';
import PhotoScene from './components/PhotoScene';
import TypingScene from './components/TypingScene';
import MagicalEnding from './components/MagicalEnding';
import ReplayButton from './components/ReplayButton';

const SCENE_COUNTDOWN = 'COUNTDOWN';
const SCENE_GIFT = 'GIFT';
const SCENE_VIDEO = 'VIDEO';
const SCENE_PHOTOS = 'PHOTOS';
const SCENE_TYPING = 'TYPING';
const SCENE_ENDING = 'ENDING';
const SCENE_REPLAY = 'REPLAY';

export default function App() {
  const [scene, setScene] = useState(SCENE_COUNTDOWN);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);

  const audioRef = useRef(null);

  const handleAudioError = (e) => {
    console.error("Background audio file error loading custom song:", e);
  };

  // Start audio on first user interaction (sets flag for mute control activation)
  const handleFirstInteraction = () => {
    if (hasInteracted) return;
    setHasInteracted(true);
  };

  // Global mute toggle
  const handleToggleMute = () => {
    const nextMuted = !audioMuted;
    setAudioMuted(nextMuted);

    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
  };

  // Smooth audio fade out (e.g. before video starts or at the end)
  const fadeAudioOut = (duration = 1.5) => {
    if (audioRef.current) {
      gsap.to(audioRef.current, {
        volume: 0,
        duration: duration,
        onComplete: () => {
          audioRef.current.pause();
        }
      });
    }
  };

  // Smooth audio fade back in
  const fadeAudioIn = (duration = 1.5) => {
    if (audioMuted) return; // don't unmute if muted by user
    
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          gsap.to(audioRef.current, { volume: 0.7, duration: duration });
        })
        .catch((err) => {
          console.warn("Playback error fading in:", err);
        });
    }
  };

  // Clean audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // ----------------------------------------------------
  // Scene Navigation Orchestration
  // ----------------------------------------------------
  const handleCountdownComplete = () => {
    setScene(SCENE_GIFT);
  };

  const handleGiftOpen = () => {
    setTimeout(() => {
      setScene(SCENE_VIDEO);
      // Start the background song as the video opens!
      fadeAudioIn(2.0);
    }, 800);
  };

  const handleVideoComplete = () => {
    // Keep song playing continuously into the photo slideshow
    setScene(SCENE_PHOTOS);
  };

  const handlePhotosComplete = () => {
    setScene(SCENE_TYPING);
  };

  const handleTypingComplete = () => {
    setScene(SCENE_ENDING);
  };

  const handleEndingComplete = () => {
    setScene(SCENE_REPLAY);
  };

  const handleReplay = () => {
    setAudioMuted(false);
    
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.volume = 0;
      audioRef.current.pause(); // Reset to silent for the next run
    }

    setScene(SCENE_COUNTDOWN);
  };

  return (
    <>
      {/* HTML5 Audio Tag */}
      <audio
        ref={audioRef}
        src="/assets/piano bday_theme.mp3"
        loop
        onError={handleAudioError}
      />

      {/* Global Ambient Background Effects */}
      {scene !== SCENE_VIDEO && <AmbientEffects />}

      {/* Floating Music Toggle Button */}
      {hasInteracted && scene !== SCENE_VIDEO && scene !== SCENE_REPLAY && (
        <AudioController 
          isMuted={audioMuted} 
          onToggleMute={handleToggleMute} 
        />
      )}

      {/* SCENE 1: 21-second Countdown */}
      <Countdown 
        isActive={scene === SCENE_COUNTDOWN} 
        onComplete={handleCountdownComplete}
        hasInteracted={hasInteracted}
        onFirstInteraction={handleFirstInteraction}
      />

      {/* SCENE 2: Interactive 3D Gift Box */}
      <GiftBox3D 
        isActive={scene === SCENE_GIFT} 
        onOpen={handleGiftOpen} 
      />

      {/* SCENE 3: Responsive Birthday Video Player */}
      <VideoPlayer 
        isActive={scene === SCENE_VIDEO} 
        onComplete={handleVideoComplete} 
      />

      {/* SCENE 4: Cinematic Photos & Wishes Slideshow */}
      <PhotoScene 
        isActive={scene === SCENE_PHOTOS} 
        onComplete={handlePhotosComplete} 
      />

      {/* SCENE 4.5: Fullscreen Typewriter Birthday Message */}
      <TypingScene
        isActive={scene === SCENE_TYPING}
        onComplete={handleTypingComplete}
      />

      {/* SCENE 5: Sky Lanterns, Fireworks Climax & Credits */}
      <MagicalEnding 
        isActive={scene === SCENE_ENDING} 
        onComplete={handleEndingComplete}
        onFadeAudio={() => fadeAudioOut(4.0)}
      />

      {/* SCENE 6: Cinematic Black Replay Button */}
      <ReplayButton 
        isActive={scene === SCENE_REPLAY} 
        onReplay={handleReplay} 
      />
    </>
  );
}
