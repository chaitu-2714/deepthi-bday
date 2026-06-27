import React from 'react';
import '../styles/Surprise.css';

export default function AudioController({ isMuted, onToggleMute }) {
  return (
    <button 
      className="music-control-btn"
      onClick={onToggleMute}
      aria-label={isMuted ? "Unmute Background Music" : "Mute Background Music"}
      title={isMuted ? "Play Music" : "Mute Music"}
    >
      {isMuted ? (
        // Mute Icon
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/>
        </svg>
      ) : (
        // Volume High / Playing Soundwave Icon
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path d="M11.536 14.01A8.473 8.473 0 0 0 14 8c0-2.29-.91-4.37-2.383-5.88-.285-.29-.75-.29-1.034 0a.728.728 0 0 0 0 1.03C12.012 4.54 12.8 6.18 12.8 8s-.788 3.46-2.298 4.85a.728.728 0 0 0 0 1.03c.285.29.75.29 1.034 0zm-3-3a5.466 5.466 0 0 0 1.637-3.25c0-1.42-.533-2.73-1.4-3.74-.282-.3-.76-.3-1.045 0a.724.724 0 0 0 0 1.01c.64.75.98 1.72.98 2.73s-.34 1.98-.98 2.73a.724.724 0 0 0 0 1.01c.285.3.763.3 1.045 0zM7 4a.5.5 0 0 0-.812-.39L3.825 5.5H1.5A.5.5 0 0 0 1 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 7 12V4z"/>
        </svg>
      )}
    </button>
  );
}
