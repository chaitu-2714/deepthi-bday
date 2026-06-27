import React, { useEffect, useRef } from 'react';
import '../styles/Surprise.css';

export default function AmbientEffects() {
  const canvasRef = useRef(null);
  const cursorCanvasRef = useRef(null);

  useEffect(() => {
    // ----------------------------------------------------
    // Canvas 1: Twinkling Stars & Shooting Stars Background
    // ----------------------------------------------------
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Stars data
    const stars = [];
    const starCount = Math.min(250, Math.floor((width * height) / 6000));
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.85, // mostly upper parts
        size: Math.random() * 1.5 + 0.5,
        twinkleSpeed: 0.01 + Math.random() * 0.03,
        phase: Math.random() * Math.PI * 2,
        brightness: 0.2 + Math.random() * 0.8,
      });
    }

    // Shooting stars data
    const shootingStars = [];

    function spawnShootingStar() {
      if (shootingStars.length > 2) return; // limit active
      
      const startX = Math.random() * width * 0.6;
      const startY = Math.random() * height * 0.4;
      const angle = (Math.PI / 6) + Math.random() * (Math.PI / 6); // 30 to 60 deg
      const speed = 12 + Math.random() * 8;
      
      shootingStars.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: 80 + Math.random() * 120,
        opacity: 1,
        fadeSpeed: 0.015 + Math.random() * 0.015,
      });
    }

    // Spawn loop
    let spawnTimer = setInterval(() => {
      if (Math.random() < 0.4) {
        spawnShootingStar();
      }
    }, 4000);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Twinkling Stars
      stars.forEach((star) => {
        star.phase += star.twinkleSpeed;
        const currentAlpha = Math.max(0.1, star.brightness * (0.3 + 0.7 * Math.sin(star.phase)));
        
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle glow for larger stars
        if (star.size > 1.4 && currentAlpha > 0.7) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
          ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.4})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      });

      // 2. Draw & Update Shooting Stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        
        ctx.strokeStyle = `rgba(212, 175, 55, ${ss.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * 3, ss.y - ss.vy * 3); // trail
        ctx.stroke();

        // Update positions
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.opacity -= ss.fadeSpeed;

        if (ss.opacity <= 0 || ss.x > width || ss.y > height) {
          shootingStars.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Resize handler
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(spawnTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // ----------------------------------------------------
    // Canvas 2: Cursor Trail Golden Glow Particles
    // ----------------------------------------------------
    const canvas = cursorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        // Float outwards slightly
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 0.5; // slight upward drift
        
        this.size = Math.random() * 4 + 2;
        this.maxLife = 40 + Math.random() * 30;
        this.life = this.maxLife;
        this.color = `rgba(212, 175, 55, ${1})`;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
      }

      draw() {
        const ratio = this.life / this.maxLife;
        ctx.fillStyle = `rgba(212, 175, 55, ${ratio * 0.8})`;
        ctx.shadowBlur = 12 * ratio;
        ctx.shadowColor = '#ffd700';
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0, this.size * ratio), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }
    }

    const handleMouseMove = (e) => {
      // Spawn 2 particles per mousemove
      for (let i = 0; i < 2; i++) {
        particles.push(new Particle(e.clientX, e.clientY));
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        for (let i = 0; i < 2; i++) {
          particles.push(new Particle(e.touches[0].clientX, e.touches[0].clientY));
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();

        if (p.life <= 0) {
          particles.splice(i, 1);
        }
      }

      // Limit max particles to prevent lag
      if (particles.length > 250) {
        particles.splice(0, particles.length - 250);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Stars and Shooting Stars */}
      <canvas ref={canvasRef} className="stars-background" />

      {/* Glowing Moon and clouds */}
      <div className="moon-container">
        <div className="moon" />
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
      </div>

      {/* Cursor golden trailing particles */}
      <canvas ref={cursorCanvasRef} className="stars-background" style={{ zIndex: 99, mixBlendMode: 'screen' }} />
    </>
  );
}
