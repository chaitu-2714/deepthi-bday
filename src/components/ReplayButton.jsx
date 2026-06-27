import React from 'react';
import '../styles/Surprise.css';

export default function ReplayButton({ isActive, onReplay }) {
  return (
    <div className={`replay-overlay ${isActive ? 'active' : ''}`}>
      <button className="replay-btn" onClick={onReplay}>
        ❤️ Replay Surprise ❤️
      </button>
    </div>
  );
}
