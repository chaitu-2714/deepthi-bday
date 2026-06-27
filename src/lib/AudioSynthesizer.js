// Luxury Procedural Ambient Synthesizer using Web Audio API
// Perfect fallback that plays a beautiful, relaxing, cinematic arpeggio loop

class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.delayNode = null;
    this.feedbackGain = null;
    this.isPlaying = false;
    this.timeoutId = null;
    this.currentChordIndex = 0;
    this.currentNoteIndex = 0;

    // Beautiful cinematic chord progression (notes in Hz)
    // Cmaj7 -> Am9 -> Fmaj7 -> G9sus4
    this.chords = [
      // Cmaj7 (C3, G3, B3, E4, G4)
      [130.81, 196.00, 246.94, 329.63, 392.00],
      // Am9 (A2, E3, G3, C4, B4)
      [110.00, 164.81, 196.00, 261.63, 493.88],
      // Fmaj9 (F2, C3, E3, A3, G4)
      [87.31, 130.81, 164.81, 220.00, 392.00],
      // G6/9 (G2, D3, G3, B3, E4)
      [98.00, 146.83, 196.00, 246.94, 329.63]
    ];
  }

  init() {
    if (this.ctx) return;

    // Setup audio context
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();

    // Master volume gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime); // start silent

    // Feedback Delay effect for spatial ambient sound
    this.delayNode = this.ctx.createDelay(1.0);
    this.delayNode.delayTime.setValueAtTime(0.4, this.ctx.currentTime);

    this.feedbackGain = this.ctx.createGain();
    this.feedbackGain.gain.setValueAtTime(0.35, this.ctx.currentTime); // 35% echo repeat

    // Connect nodes: Synth -> masterGain -> destination
    // Connect Synth -> delayNode -> feedbackGain -> delayNode (loop) -> masterGain
    this.delayNode.connect(this.feedbackGain);
    this.feedbackGain.connect(this.delayNode);
    
    this.masterGain.connect(this.ctx.destination);
    this.delayNode.connect(this.masterGain);
  }

  playNote(frequency, startTime, duration) {
    if (!this.ctx) return;

    // Create Oscillator
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();

    // Mellow flute/piano-like waveform: triangle oscillator
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, startTime);

    // Apply soft keyboard sound envelope: fast attack, slow exponential decay
    oscGain.gain.setValueAtTime(0, startTime);
    oscGain.gain.linearRampToValueAtTime(0.18, startTime + 0.08); // soft note velocity
    oscGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    // Connect note oscillator to master out and delay echo
    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    oscGain.connect(this.delayNode);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  }

  tick() {
    if (!this.isPlaying) return;

    const now = this.ctx.currentTime;
    const chord = this.chords[this.currentChordIndex];
    const noteFreq = chord[this.currentNoteIndex];

    // Play note with gentle overlapping (duration 2.5s)
    this.playNote(noteFreq, now, 2.5);

    // Increment index
    this.currentNoteIndex++;
    if (this.currentNoteIndex >= chord.length) {
      this.currentNoteIndex = 0;
      // Change chord
      this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;
    }

    // Schedule next note in 0.95 seconds (soothing slow tempo)
    this.timeoutId = setTimeout(() => {
      this.tick();
    }, 950);
  }

  start() {
    this.init();
    if (this.isPlaying) return;

    // Resume context if suspended (browser security)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = true;
    this.currentChordIndex = 0;
    this.currentNoteIndex = 0;

    // Fade-in volume
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0.7, this.ctx.currentTime + 2.0); // fade in to 70% in 2s

    this.tick();
  }

  stop() {
    if (!this.isPlaying) return;

    // Fade-out volume
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.5); // fade out in 1.5s
    }

    setTimeout(() => {
      this.isPlaying = false;
      if (this.timeoutId) clearTimeout(this.timeoutId);
    }, 1500);
  }

  setVolume(vol) {
    if (!this.ctx || !this.masterGain) return;
    this.masterGain.gain.setValueAtTime(vol * 0.7, this.ctx.currentTime);
  }
}

export const ambientSynth = new AudioSynthesizer();
export default AudioSynthesizer;
