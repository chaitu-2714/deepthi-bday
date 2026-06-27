import React, { useState, useEffect, useRef } from 'react';
import '../styles/Surprise.css';

export default function PhotoScene({ isActive, onComplete }) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const canvasRef = useRef(null);
  const photoTimerRef = useRef(null);

  const photos = ['/assets/photo1.jpg', '/assets/photo2.jpg'];

  // Slideshow transition: change photo every 4 seconds
  useEffect(() => {
    if (!isActive) return;

    photoTimerRef.current = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % photos.length);
    }, 4000);

    // After 8.5 seconds of displaying the photos, automatically transition to typing letter
    const transitionTimer = setTimeout(() => {
      onComplete();
    }, 8500);

    return () => {
      if (photoTimerRef.current) clearInterval(photoTimerRef.current);
      clearTimeout(transitionTimer);
    };
  }, [isActive, onComplete]);

  // Canvas details: Fairy lights, Fireflies & Butterflies
  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Fireflies simulation
    const fireflies = [];
    const fireflyCount = 35;
    for (let i = 0; i < fireflyCount; i++) {
      fireflies.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.0,
        vy: (Math.random() - 0.5) * 1.0,
        radius: Math.random() * 2.5 + 1.2,
        alpha: Math.random() * 0.45 + 0.25,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        phase: Math.random() * Math.PI
      });
    }

    // Butterflies simulation
    const butterflies = [];
    const butterflyCount = 5;
    for (let i = 0; i < butterflyCount; i++) {
      butterflies.push({
        x: Math.random() * width,
        y: height * 0.2 + Math.random() * height * 0.55,
        targetX: Math.random() * width,
        targetY: height * 0.2 + Math.random() * height * 0.55,
        speed: 1.3 + Math.random() * 1.2,
        size: 9 + Math.random() * 5,
        color: `hsl(${35 + Math.random() * 15}, 85%, 60%)`,
        wingFlapSpeed: 0.16 + Math.random() * 0.08,
        wingPhase: Math.random() * Math.PI * 2
      });
    }

    // Fairy lights
    const lights = [];
    const lightCount = 16;
    const wireSpacing = width / (lightCount + 1);
    for (let i = 0; i < lightCount; i++) {
      const x = (i + 1) * wireSpacing;
      const angle = (i / (lightCount - 1)) * Math.PI;
      const hangY = 25 + Math.sin(angle) * 30;
      lights.push({
        x: x,
        y: hangY,
        color: 'rgba(212, 175, 55, ',
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.03 + Math.random() * 0.04
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Hanging Wire
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 25);
      for (let i = 0; i <= width; i += 20) {
        const angle = (i / width) * Math.PI;
        const curveY = 25 + Math.sin(angle) * 30;
        ctx.lineTo(i, curveY);
      }
      ctx.stroke();

      // Fairy Lights
      lights.forEach((light) => {
        light.phase += light.pulseSpeed;
        const alpha = 0.55 + 0.45 * Math.sin(light.phase);
        ctx.fillStyle = '#222';
        ctx.fillRect(light.x - 3, light.y - 6, 6, 6);

        ctx.shadowBlur = 15 * alpha;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.85)';
        ctx.fillStyle = `${light.color}${0.3 + 0.7 * alpha})`;
        ctx.beginPath();
        ctx.arc(light.x, light.y, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Fireflies
      fireflies.forEach((ff) => {
        ff.phase += ff.pulseSpeed;
        const glow = Math.max(0.1, ff.alpha * (0.35 + 0.65 * Math.sin(ff.phase)));
        ctx.fillStyle = `rgba(212, 175, 55, ${glow})`;
        ctx.shadowBlur = 6 * glow;
        ctx.shadowColor = '#ffd700';
        ctx.beginPath();
        ctx.arc(ff.x, ff.y, ff.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ff.x += ff.vx + Math.sin(ff.phase) * 0.1;
        ff.y += ff.vy + Math.cos(ff.phase) * 0.1;

        if (ff.x < 0) ff.x = width;
        if (ff.x > width) ff.x = 0;
        if (ff.y < 0) ff.y = height;
        if (ff.y > height) ff.y = 0;
      });

      // Butterflies
      butterflies.forEach((b) => {
        const dx = b.targetX - b.x;
        const dy = b.targetY - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 30) {
          b.targetX = Math.random() * width;
          b.targetY = height * 0.2 + Math.random() * height * 0.6;
        } else {
          b.x += (dx / dist) * b.speed;
          b.y += (dy / dist) * b.speed;
        }

        b.wingPhase += b.wingFlapSpeed;
        const flap = Math.sin(b.wingPhase);
        const wingW = b.size * (0.35 + 0.65 * Math.abs(flap));
        const wingH = b.size * 1.25;

        ctx.save();
        ctx.translate(b.x, b.y);
        const angle = Math.atan2(dy, dx);
        ctx.rotate(angle + Math.PI / 2);

        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.ellipse(-wingW/2 - 2, 0, wingW/2, wingH/2, -Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(wingW/2 + 2, 0, wingW/2, wingH/2, Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0a0a0a';
        ctx.beginPath();
        ctx.ellipse(0, 0, 1.8, b.size * 0.65, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

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
  }, [isActive]);

  const handleSkip = () => {
    onComplete();
  };

  if (!isActive) return null;

  return (
    <div className={`photo-scene-container active`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* Background canvas */}
      <canvas ref={canvasRef} className="fairy-lights-canvas" />

      {/* Fullscreen Photo Frame with Ken Burns */}
      <div 
        className="photo-frame-container"
        style={{
          width: '380px',
          height: '560px',
          margin: '0 auto',
          maxWidth: '90%',
          maxHeight: '75%',
          boxShadow: '0 30px 70px rgba(0,0,0,0.6), 0 0 50px rgba(212,175,55,0.08)'
        }}
      >
        <div className="photo-inner">
          {photos.map((src, i) => (
            <img
              key={src}
              src={src}
              alt="Deepthi Sirisha Photo"
              className={`photo-img ${i === photoIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>

      <button 
        className="premium-btn" 
        onClick={handleSkip}
        style={{ marginTop: '2.5rem', padding: '0.8rem 1.8rem', fontSize: '0.85rem', zIndex: 35 }}
      >
        Read Letter
      </button>
    </div>
  );
}
