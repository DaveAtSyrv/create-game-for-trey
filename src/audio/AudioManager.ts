/**
 * Generates sound effects and background music using Web Audio API.
 * No external audio files needed!
 */
export class AudioManager {
  private muted = false;
  private audioContext: AudioContext | null = null;
  private bgmNodes: { oscs: OscillatorNode[]; gains: GainNode[] } | null = null;
  private bgmPlaying = false;

  constructor() {
    try {
      this.audioContext = new AudioContext();
    } catch {
      // Web Audio not available
    }
  }

  private ensureContext(): void {
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3): void {
    if (this.muted || !this.audioContext) return;
    this.ensureContext();
    const ctx = this.audioContext;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  correct(streak = 1): void {
    const baseFreq = 523 + (streak * 50);
    this.playTone(baseFreq, 0.15, 'sine', 0.3);
    setTimeout(() => this.playTone(baseFreq * 1.25, 0.15, 'sine', 0.3), 80);
    setTimeout(() => this.playTone(baseFreq * 1.5, 0.2, 'sine', 0.25), 160);
  }

  wrong(): void {
    this.playTone(220, 0.2, 'sine', 0.15);
    setTimeout(() => this.playTone(196, 0.25, 'sine', 0.1), 100);
  }

  attack(): void {
    this.playTone(200, 0.1, 'sawtooth', 0.15);
    setTimeout(() => this.playTone(100, 0.15, 'square', 0.2), 80);
  }

  combo(): void {
    [523, 659, 784, 1047].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'sine', 0.25), i * 60);
    });
  }

  superCombo(): void {
    [523, 659, 784, 1047, 1319].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.3), i * 80);
    });
    setTimeout(() => this.playTone(1568, 0.4, 'sine', 0.3), 500);
  }

  defeated(): void {
    [784, 988, 1175, 1568].forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.25, 'sine', 0.25);
        this.playTone(freq * 0.5, 0.25, 'triangle', 0.15);
      }, i * 120);
    });
  }

  stageComplete(): void {
    this.stopBgm();
    const notes = [523, 659, 784, 1047, 784, 1047, 1319, 1568];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.3, 'sine', 0.3);
        this.playTone(freq * 0.5, 0.3, 'triangle', 0.15);
      }, i * 100);
    });
  }

  buttonClick(): void {
    this.playTone(880, 0.05, 'sine', 0.1);
  }

  /** Start a simple looping background beat — energetic K-pop-inspired rhythm */
  startBgm(): void {
    if (this.muted || !this.audioContext || this.bgmPlaying) return;
    this.ensureContext();
    const ctx = this.audioContext;

    // Simple beat: bass pulse + hi-hat pattern
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = 'sine';
    bassOsc.frequency.value = 80;
    bassGain.gain.value = 0.06;
    bassOsc.connect(bassGain);
    bassGain.connect(ctx.destination);
    bassOsc.start();

    // Pulse the bass with an LFO for rhythm feel
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'square';
    lfo.frequency.value = 2.5; // 150 BPM feel
    lfoGain.gain.value = 0.04;
    lfo.connect(lfoGain);
    lfoGain.connect(bassGain.gain);
    lfo.start();

    // Soft pad chord for atmosphere
    const padOsc1 = ctx.createOscillator();
    const padOsc2 = ctx.createOscillator();
    const padGain = ctx.createGain();
    padOsc1.type = 'sine';
    padOsc2.type = 'triangle';
    padOsc1.frequency.value = 261.63; // C4
    padOsc2.frequency.value = 329.63; // E4
    padGain.gain.value = 0.025;
    padOsc1.connect(padGain);
    padOsc2.connect(padGain);
    padGain.connect(ctx.destination);
    padOsc1.start();
    padOsc2.start();

    this.bgmNodes = {
      oscs: [bassOsc, lfo, padOsc1, padOsc2],
      gains: [bassGain, lfoGain, padGain],
    };
    this.bgmPlaying = true;
  }

  stopBgm(): void {
    if (!this.bgmNodes) return;
    this.bgmNodes.oscs.forEach((osc) => { try { osc.stop(); } catch { /* already stopped */ } });
    this.bgmNodes = null;
    this.bgmPlaying = false;
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopBgm();
    }
    return this.muted;
  }

  isMuted(): boolean {
    return this.muted;
  }
}
