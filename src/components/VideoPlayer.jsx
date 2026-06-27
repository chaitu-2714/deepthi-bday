import React, { useRef, useState, useEffect } from 'react';
import '../styles/Surprise.css';

export default function VideoPlayer({ isActive, onComplete }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(15); // Default duration for fallback canvas
  const [useCanvasFallback, setUseCanvasFallback] = useState(false);
  const [opacity, setOpacity] = useState(0);

  // Fade-in on mount
  useEffect(() => {
    if (isActive) {
      setOpacity(1);
      setIsPlaying(true);
    } else {
      setOpacity(0);
      setIsPlaying(false);
    }
  }, [isActive]);

  // Video Autoplay and triggers
  useEffect(() => {
    if (!isActive) return;

    if (!useCanvasFallback && videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.warn("Autoplay blocked or file missing: falling back to canvas simulation.", error);
            setUseCanvasFallback(true);
          });
      }
    }
  }, [isActive, useCanvasFallback]);

  // ----------------------------------------------------
  // Fallback Canvas Video Player Simulation
  // ----------------------------------------------------
  useEffect(() => {
    if (!isActive || !useCanvasFallback) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particles for cinematic display
    const particles = [];
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.0,
        vy: -0.5 - Math.random() * 1.0, // float upwards
        radius: Math.random() * 4 + 1,
        life: Math.random() * 200 + 100,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    const startTime = Date.now();
    const durationMs = 15000; // 15 seconds video length
    setDuration(15);

    const render = () => {
      if (!isPlaying) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Calculate timeline progress
      const elapsed = Date.now() - startTime;
      const currentSec = Math.min(15, elapsed / 1000);
      setCurrentTime(currentSec);

      if (elapsed >= durationMs) {
        handleVideoEnd();
        return;
      }

      // Draw canvas background
      ctx.fillStyle = '#050512';
      ctx.fillRect(0, 0, width, height);

      // Draw floating golden particles
      particles.forEach((p) => {
        ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffd700';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Update positions
        p.x += p.vx;
        p.y += p.vy;
        
        // Wrap edges
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10 || p.x > width + 10) {
          p.vx *= -1;
        }
      });

      // Draw luxury text presentation
      ctx.font = '300 2rem Cinzel, serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '0.3em';
      ctx.fillText('DEEPTHI SIRISHA', width / 2, height / 2 - 30);

      ctx.font = 'italic 1.2rem Playfair Display, serif';
      ctx.fillStyle = '#d4af37';
      ctx.fillText('A magical chapter unfolds...', width / 2, height / 2 + 20);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isActive, useCanvasFallback, isPlaying]);

  // Video events
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    // Fade out and trigger next scene
    setOpacity(0);
    setTimeout(() => {
      onComplete();
    }, 1200);
  };

  const handlePlayPause = () => {
    if (useCanvasFallback) {
      setIsPlaying(!isPlaying);
      return;
    }

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimelineClick = (e) => {
    const timeline = e.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;

    setCurrentTime(newTime);
    
    if (!useCanvasFallback && videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleSkip = () => {
    handleVideoEnd();
  };

  if (!isActive) return null;

  return (
    <div 
      ref={containerRef}
      className={`video-scene-container active`}
      style={{ opacity: opacity, transition: 'opacity 1.2s ease-in-out' }}
    >
      <button className="skip-video-btn" onClick={handleSkip}>
        Skip Surprise Video
      </button>

      <div className="video-wrapper">
        {useCanvasFallback ? (
          <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
        ) : (
          <video
            ref={videoRef}
            src="/assets/cinematic_particles.mp4"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleVideoEnd}
            onError={() => setUseCanvasFallback(true)}
            playsInline
            muted
          />
        )}

        {/* Custom Glassmorphic Player Controls */}
        <div className="video-controls">
          <button className="video-btn" onClick={handlePlayPause}>
            {isPlaying ? (
              // Pause Icon
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
              </svg>
            ) : (
              // Play Icon
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
              </svg>
            )}
          </button>

          <div className="video-timeline" onClick={handleTimelineClick}>
            <div 
              className="video-progress" 
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          <div style={{ fontSize: '0.8rem', fontVariantNumeric: 'tabular-nums', width: '70px', textAlign: 'right' }}>
            {Math.floor(currentTime)}s / {Math.floor(duration)}s
          </div>
        </div>
      </div>
    </div>
  );
}
