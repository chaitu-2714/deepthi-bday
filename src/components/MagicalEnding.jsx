import React, { useEffect, useRef, useState } from 'react';
import '../styles/Surprise.css';
import gsap from 'gsap';

export default function MagicalEnding({ isActive, onComplete, onFadeAudio }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  // Credit Refs
  const titleRef = useRef(null);
  const creditsGroupRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const nameRef = useRef(null);
  
  const [showCredits, setShowCredits] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    // Start credit roll sequence
    setTimeout(() => {
      setShowCredits(true);
    }, 1500);

    // Fade out audio gradually near the end
    setTimeout(() => {
      onFadeAudio();
    }, 14500);

    // Complete ending and proceed to Replay button after 19.5 seconds
    const endTimer = setTimeout(() => {
      // Fade container to absolute black
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 2.0,
        onComplete: () => {
          onComplete();
        }
      });
    }, 20500);

    return () => {
      clearTimeout(endTimer);
    };
  }, [isActive, onComplete, onFadeAudio]);

  // GSAP timeline animation for cinematic credit progression
  useEffect(() => {
    if (!showCredits) return;

    const tl = gsap.timeline();
    
    // Phase 1: Reveal Birthday Title
    tl.to(titleRef.current, { opacity: 1, y: 0, duration: 2.2, ease: 'power2.out' })
      .to(titleRef.current, { duration: 4.2 }) // Hold on screen
      .to(titleRef.current, { opacity: 0, y: -20, duration: 1.8, ease: 'power2.inOut' }) // Fade out
      
      // Phase 2: Reveal Creator Credits
      .set(creditsGroupRef.current, { display: 'flex' })
      .to(creditsGroupRef.current, { opacity: 1, duration: 0.1 })
      .to(line1Ref.current, { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' })
      .to(line2Ref.current, { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' }, '-=0.5')
      .to(nameRef.current, { opacity: 1, y: 0, duration: 2.5, ease: 'power2.out' }, '-=0.5');

  }, [showCredits]);

  // Canvas details: Sky Lanterns, Fireworks, Fireflies & Butterflies
  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // 1. Sky Lanterns
    const lanterns = [];
    const maxLanterns = 14;

    class Lantern {
      constructor(isInitial = false) {
        this.x = Math.random() * width;
        this.y = isInitial ? Math.random() * height : height + 50;
        this.vy = -0.35 - Math.random() * 0.45;
        this.vx = (Math.random() - 0.5) * 0.18;
        this.size = 11 + Math.random() * 9;
        this.phase = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.01 + Math.random() * 0.02;
        this.glow = 0.65 + Math.random() * 0.35;
      }

      update() {
        this.y += this.vy;
        this.phase += this.pulseSpeed;
        this.x += this.vx + Math.sin(this.phase) * 0.12;

        if (this.y < -50) {
          this.y = height + 50;
          this.x = Math.random() * width;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        const flicker = this.glow * (0.85 + 0.15 * Math.sin(this.phase * 5));
        
        ctx.shadowBlur = this.size * 1.4;
        ctx.shadowColor = 'rgba(235, 140, 30, 0.55)';
        ctx.fillStyle = `rgba(235, 140, 30, ${0.75 * flicker})`;
        
        ctx.beginPath();
        ctx.moveTo(-this.size * 0.5, this.size * 0.7);
        ctx.lineTo(-this.size * 0.6, -this.size * 0.7);
        ctx.quadraticCurveTo(0, -this.size * 0.9, this.size * 0.6, -this.size * 0.7);
        ctx.lineTo(this.size * 0.5, this.size * 0.7);
        ctx.closePath();
        ctx.fill();

        ctx.shadowBlur = this.size * 1.8;
        ctx.shadowColor = '#ff9900';
        ctx.fillStyle = `rgba(255, 230, 170, ${flicker})`;
        ctx.beginPath();
        ctx.arc(0, this.size * 0.6, this.size * 0.18, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < maxLanterns; i++) {
      lanterns.push(new Lantern(true));
    }

    // 2. Fireflies
    const fireflies = [];
    const fireflyCount = 25;
    for (let i = 0; i < fireflyCount; i++) {
      fireflies.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.3,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        phase: Math.random() * Math.PI
      });
    }

    // 3. Butterflies
    const butterflies = [];
    const butterflyCount = 4;
    for (let i = 0; i < butterflyCount; i++) {
      butterflies.push({
        x: Math.random() * width,
        y: height * 0.2 + Math.random() * height * 0.6,
        targetX: Math.random() * width,
        targetY: height * 0.2 + Math.random() * height * 0.6,
        speed: 1.1 + Math.random() * 0.8,
        size: 9 + Math.random() * 4,
        color: `hsl(${35 + Math.random() * 15}, 80%, 60%)`,
        wingFlapSpeed: 0.15 + Math.random() * 0.08,
        wingPhase: Math.random() * Math.PI * 2
      });
    }

    // 4. Fireworks Simulation
    const fireworks = [];
    const sparks = [];
    let fireworkIntensity = 0.015;

    class Firework {
      constructor() {
        this.startX = width * 0.15 + Math.random() * width * 0.7;
        this.startY = height;
        this.x = this.startX;
        this.y = this.startY;
        this.targetY = height * 0.15 + Math.random() * height * 0.4;
        this.speed = 5.0 + Math.random() * 3.0;
        this.angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.1;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.color = `hsl(${Math.random() * 360}, 100%, 65%)`;
        this.isDead = false;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.02;

        if (this.vy >= 0 || this.y <= this.targetY) {
          this.explode();
          this.isDead = true;
        }
      }

      explode() {
        const numSparks = 50 + Math.floor(Math.random() * 35);
        const colors = [
          `hsl(${35 + Math.random() * 15}, 100%, 60%)`, // Gold
          `hsl(${320 + Math.random() * 30}, 100%, 65%)`, // Rose
          `hsl(${180 + Math.random() * 40}, 100%, 60%)`, // Turquoise
        ];
        const primaryColor = colors[Math.floor(Math.random() * colors.length)];

        for (let i = 0; i < numSparks; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 4.0 + 0.5;
          sparks.push({
            x: this.x,
            y: this.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: Math.random() < 0.2 ? '#ffffff' : primaryColor,
            alpha: 1.0,
            fade: 0.012 + Math.random() * 0.014,
            gravity: 0.05,
            drag: 0.975
          });
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const startTime = Date.now();

    const render = () => {
      ctx.fillStyle = 'rgba(5, 5, 15, 0.18)';
      ctx.fillRect(0, 0, width, height);

      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed > 11) {
        fireworkIntensity = 0.09; // Grand finale explosions
      } else if (elapsed > 5.5) {
        fireworkIntensity = 0.045;
      }

      if (Math.random() < fireworkIntensity) {
        fireworks.push(new Firework());
      }

      // Update rising sparks
      for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i];
        fw.update();
        fw.draw();
        if (fw.isDead) {
          fireworks.splice(i, 1);
        }
      }

      // Update exploding sparkles
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.fade;

        if (p.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = p.alpha * 6;
        ctx.shadowColor = p.color;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.alpha * 1.8), 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      }

      // Draw & Update Fireflies
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

        ff.x += ff.vx + Math.sin(ff.phase) * 0.15;
        ff.y += ff.vy + Math.cos(ff.phase) * 0.15;

        if (ff.x < 0) ff.x = width;
        if (ff.x > width) ff.x = 0;
        if (ff.y < 0) ff.y = height;
        if (ff.y > height) ff.y = 0;
      });

      // Draw & Update Butterflies
      butterflies.forEach((b) => {
        const dx = b.targetX - b.x;
        const dy = b.targetY - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 30) {
          b.targetX = Math.random() * width;
          b.targetY = height * 0.15 + Math.random() * height * 0.6;
        } else {
          b.x += (dx / dist) * b.speed;
          b.y += (dy / dist) * b.speed;
        }

        b.wingPhase += b.wingFlapSpeed;
        const flap = Math.sin(b.wingPhase);
        const wingW = b.size * (0.3 + 0.7 * Math.abs(flap));
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

      // Draw Lanterns
      lanterns.forEach((l) => {
        l.update();
        l.draw();
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

  if (!isActive) return null;

  return (
    <div 
      ref={containerRef} 
      className={`ending-scene-container active`}
      style={{ opacity: 1 }}
    >
      <canvas ref={canvasRef} className="fireworks-canvas" />

      {/* Credit Roll container */}
      <div className="credits-container" style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Phase 1 Title: Happy 21st Birthday */}
        <div ref={titleRef} className="credits-name" style={{ transform: 'translateY(20px)', opacity: 0, fontSize: '2.4rem', letterSpacing: '0.15em', position: 'absolute', width: '90%', textAlign: 'center', lineHeight: '1.5' }}>
          Happy 21st Birthday,<br/>Deepthi Sirisha ❤️🎂
        </div>

        {/* Phase 2 Sub-credits: Made with Love */}
        <div ref={creditsGroupRef} style={{ display: 'none', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'absolute' }}>
          <div ref={line1Ref} className="credits-line1" style={{ transform: 'translateY(15px)', opacity: 0 }}>
            Made with ❤️
          </div>
          <div ref={line2Ref} className="credits-line2" style={{ transform: 'translateY(15px)', opacity: 0, margin: '0.8rem 0' }}>
            Especially for
          </div>
          <div ref={nameRef} className="credits-name" style={{ transform: 'translateY(25px)', opacity: 0, margin: 0, fontSize: '2.6rem', letterSpacing: '0.25em' }}>
            Deepthi Sirisha
          </div>
        </div>
      </div>
    </div>
  );
}
