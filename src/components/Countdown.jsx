import React, { useState, useEffect, useRef } from 'react';
import '../styles/Surprise.css';

export default function Countdown({ isActive, onComplete, hasInteracted, onFirstInteraction }) {
  const [seconds, setSeconds] = useState(21);
  const [started, setStarted] = useState(false);
  const timerRef = useRef(null);

  // Sync internal state when active changes (e.g., on replay)
  useEffect(() => {
    if (isActive) {
      setSeconds(21);
      if (hasInteracted) {
        setStarted(true);
      } else {
        setStarted(false);
      }
    } else {
      setSeconds(21);
      setStarted(false);
    }
  }, [isActive, hasInteracted]);

  // Timer Countdown loop
  useEffect(() => {
    if (!isActive || !started) return;

    timerRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, started]);

  // Handle completion when seconds reaches 0
  useEffect(() => {
    if (seconds === 0 && started && isActive) {
      onComplete();
    }
  }, [seconds, started, isActive, onComplete]);

  const handleStart = () => {
    onFirstInteraction();
    setStarted(true);
  };

  if (!isActive) return null;

  return (
    <div className={`scene-container active`}>
      {!started ? (
        <div className="glass-panel" style={{ opacity: 1, transform: 'translateY(0)' }}>
          <h1 className="cinematic-title" style={{ fontSize: '2.2rem', letterSpacing: '0.25em' }}>
            A Digital Gift
          </h1>
          <p className="cinematic-subtitle">Prepared especially for a special soul</p>
          <button className="premium-btn" onClick={handleStart}>
            Tap to Open Surprise
          </button>
        </div>
      ) : (
        <div className="glass-panel" style={{ opacity: 1, transform: 'translateY(0)' }}>
          <div className="countdown-box">
            <h1 className="cinematic-title" style={{ fontSize: '1.8rem', letterSpacing: '0.2em' }}>
              Surprise Unfolding
            </h1>
            <div className="countdown-timer">
              {seconds}
            </div>
            <div className="countdown-label">
              Seconds of anticipation
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
