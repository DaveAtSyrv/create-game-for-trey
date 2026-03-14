import Phaser from 'phaser';

/**
 * Generates simple sound effects using Web Audio API.
 * No external audio files needed!
 */
export class AudioManager {
  private scene: Phaser.Scene;
  private muted = false;
  private audioContext: AudioContext | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    try {
      this.audioContext = new AudioContext();
    } catch {
      // Web Audio not available
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3): void {
    if (this.muted || !this.audioContext) return;
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
    // Escalating chime based on streak
    const baseFreq = 523 + (streak * 50); // C5 + streak bonus
    this.playTone(baseFreq, 0.15, 'sine', 0.3);
    setTimeout(() => this.playTone(baseFreq * 1.25, 0.15, 'sine', 0.3), 80);
    setTimeout(() => this.playTone(baseFreq * 1.5, 0.2, 'sine', 0.25), 160);
  }

  wrong(): void {
    // Gentle low boop
    this.playTone(220, 0.2, 'sine', 0.15);
    setTimeout(() => this.playTone(196, 0.25, 'sine', 0.1), 100);
  }

  attack(): void {
    // Whoosh + impact
    this.playTone(200, 0.1, 'sawtooth', 0.15);
    setTimeout(() => this.playTone(100, 0.15, 'square', 0.2), 80);
  }

  combo(): void {
    // Rising arpeggio
    [523, 659, 784, 1047].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'sine', 0.25), i * 60);
    });
  }

  superCombo(): void {
    // Fanfare
    [523, 659, 784, 1047, 1319].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.3), i * 80);
    });
    setTimeout(() => this.playTone(1568, 0.4, 'sine', 0.3), 500);
  }

  defeated(): void {
    // Victory jingle
    [784, 988, 1175, 1568].forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.25, 'sine', 0.25);
        this.playTone(freq * 0.5, 0.25, 'triangle', 0.15);
      }, i * 120);
    });
  }

  stageComplete(): void {
    // Full fanfare
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

  toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }

  isMuted(): boolean {
    return this.muted;
  }
}
