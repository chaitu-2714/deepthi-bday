import React, { useState, useEffect, useRef } from 'react';
import '../styles/Surprise.css';

export default function TypingScene({ isActive, onComplete }) {
  const canvasRef = useRef(null);
  const scrollerRef = useRef(null);

  // Typewriter state variables
  const [typedLines, setTypedLines] = useState([]);
  const [currentLineText, setCurrentLineText] = useState('');
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const lines = [
    "Happy Birthday, Deepthi Sirisha... ❤️",
    "Kaalam eppudu aagaledu...",
    "Manam adagaledu...",
    "Adhi tana pani chesukuntu mundhuku vellipoyindi.",
    "Aa prayanam lo...",
    "Oka chinna papa...",
    "Navvadam nerchukundi...",
    "Nadavadam nerchukundi...",
    "Kalalu kanadam nerchukundi...",
    "Chivariki...",
    "Evari manasulo aina oka manchi gnapakamga migile manishiga edigindi.",
    "21 samvatsaralu...",
    "Oka number kaadhu...",
    "21 samvatsarala navvulu...",
    "21 samvatsarala kannillu...",
    "21 samvatsarala nerchukovadam...",
    "21 samvatsarala prayanam.",
    "Chinnappudu...",
    "Ninnu etthukuni nadipinchina chethulu...",
    "Ippudu dooram nunchi...",
    "Nee santosham chusthu navvuthunnayi.",
    "Appudu ninnu nadipinchina adugulu...",
    "Ippudu nee sontha kalala vaipu nadusthunnayi.",
    "Jeevitham lo andariki anni rojulu gurthundavu...",
    "Kaani...",
    "Konni rojulu matram...",
    "Manasu eppatiki vadulukodu.",
    "Ee roju...",
    "Alanti oka roju.",
    "Nee gurinchi prapancham em gurthupettukuntundo naaku teliyadhu...",
    "Kaani...",
    "Oka manchi navvu...",
    "Oka manchi manasu...",
    "Oka manchi gnapakam...",
    "Ivi eppatiki chaalu.",
    "Kabatti...",
    "Ee puttina roju nundi...",
    "Nee kalalu evarikosam kaadhu...",
    "Neekosam poorthi avvali.",
    "Nee santosham evari meedha aadharapadakudadhu...",
    "Nee manasu eppudu veluguga undali.",
    "Oka roju...",
    "Ee cake undakapovachu...",
    "Ee balloons undakapovachu...",
    "Ee decorations kuda undakapovachu...",
    "Kaani...",
    "Ee roju...",
    "Nee kosam manaspoorthiga navvina vallani...",
    "Nee kosam manaspoorthiga korukunna vallani...",
    "Jeevitham eppatiki marchiponivvaku.",
    "Prathi puttina roju...",
    "Vayassu peragadam kaadhu...",
    "Manalni preminche vallaki...",
    "Manam inko samvatsaram dorikamaney santhosham.",
    "Adhi...",
    "Birthday yokka nijamaina andham.",
    "Eppudu navvuthu undu...",
    "Endhukante...",
    "Konni navvulu...",
    "Oka photo ni andamga cheyyavu...",
    "Oka jeevithanni andamga chesthayi... ❤️"
  ];

  // Typewriter Loop Logic
  useEffect(() => {
    if (!isActive) return;

    if (currentLineIndex === 0 && typedLines.length === 0 && currentLineText === '') {
      setIsTypingComplete(false);
    }

    if (currentLineIndex >= lines.length) {
      setIsTypingComplete(true);
      
      // Pause with full text for 8 seconds, then transition to MagicalEnding
      const completedTimer = setTimeout(() => {
        onComplete();
      }, 8000);
      
      return () => clearTimeout(completedTimer);
    }

    const currentLine = lines[currentLineIndex];
    let charIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (charIndex < currentLine.length) {
        setCurrentLineText((prev) => prev + currentLine.charAt(charIndex));
        charIndex++;
        
        if (scrollerRef.current) {
          scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
        }
      } else {
        clearInterval(typingInterval);
        
        // Pause 1.7 seconds between lines
        setTimeout(() => {
          setTypedLines((prev) => [...prev, currentLine]);
          setCurrentLineText('');
          setCurrentLineIndex((prev) => prev + 1);
          
          if (scrollerRef.current) {
            scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
          }
        }, 1700);
      }
    }, 40);

    return () => {
      clearInterval(typingInterval);
    };
  }, [isActive, currentLineIndex]);

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
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.3,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        phase: Math.random() * Math.PI
      });
    }

    // Butterflies simulation
    const butterflies = [];
    const butterflyCount = 4;
    for (let i = 0; i < butterflyCount; i++) {
      butterflies.push({
        x: Math.random() * width,
        y: height * 0.25 + Math.random() * height * 0.5,
        targetX: Math.random() * width,
        targetY: height * 0.25 + Math.random() * height * 0.5,
        speed: 1.2 + Math.random() * 1.0,
        size: 8 + Math.random() * 5,
        color: `hsl(${35 + Math.random() * 15}, 80%, 60%)`,
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
        pulseSpeed: 0.035 + Math.random() * 0.035
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
          b.targetY = height * 0.25 + Math.random() * height * 0.65;
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
      {/* Background visual elements canvas */}
      <canvas ref={canvasRef} className="fairy-lights-canvas" />

      {/* Centered Glassmorphic Letter Box */}
      <div 
        ref={scrollerRef} 
        className="wishes-scroller"
        style={{
          width: '90%',
          maxWidth: '800px',
          height: '75%',
          maxHeight: '600px',
          zIndex: 10,
          margin: '0 auto',
          boxShadow: '0 25px 55px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.02)'
        }}
      >
        {/* Render already typed lines */}
        {typedLines.map((line, idx) => (
          <div 
            key={idx} 
            className={`typed-line ${idx === 0 ? 'heading' : ''}`}
          >
            {line}
          </div>
        ))}

        {/* Render active line with blinking cursor */}
        {currentLineIndex < lines.length && (
          <div className={`typed-line ${currentLineIndex === 0 ? 'heading' : ''}`}>
            {currentLineText}
            {!isTypingComplete && <span className="typing-cursor" />}
          </div>
        )}
      </div>

      <button 
        className="premium-btn" 
        onClick={handleSkip}
        style={{ marginTop: '2rem', padding: '0.8rem 1.8rem', fontSize: '0.85rem', zIndex: 35 }}
      >
        Magical Ending
      </button>
    </div>
  );
}
