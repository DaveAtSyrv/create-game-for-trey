/**
 * Procedural K-pop-inspired music engine using Web Audio API.
 * Generates actual beat patterns with kick, snare, hihat, bass, and synth melodies.
 * Each scene gets a distinct mood.
 */

type SceneMusic = 'title' | 'select' | 'battle' | 'victory';

interface ScheduledSound {
  source: AudioBufferSourceNode | OscillatorNode;
  gain: GainNode;
}

export class MusicEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private scheduledSounds: ScheduledSound[] = [];
  private loopTimer: number | null = null;
  private currentScene: SceneMusic | null = null;
  private muted = false;

  constructor() {
    try {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.4;
      this.masterGain.connect(this.ctx.destination);
    } catch {
      // Web Audio not available
    }
  }

  private ensureContext(): void {
    if (this.ctx?.state === 'suspended') this.ctx.resume();
  }

  // ─── Drum synthesis ───────────────────────────────────────

  private createKick(time: number, volume = 0.5): void {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(30, time + 0.12);
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.15);
  }

  private createSnare(time: number, volume = 0.3): void {
    if (!this.ctx || !this.masterGain) return;
    // Noise burst for snare
    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(volume, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
    // Bandpass filter for snare tone
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3000;
    filter.Q.value = 1.5;
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(time);
    noise.stop(time + 0.1);

    // Body tone
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, time);
    osc.frequency.exponentialRampToValueAtTime(80, time + 0.06);
    oscGain.gain.setValueAtTime(volume * 0.5, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.08);
  }

  private createHihat(time: number, open = false, volume = 0.12): void {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * (open ? 0.15 : 0.04);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = this.ctx.createGain();
    const decay = open ? 0.15 : 0.04;
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + decay);
    const hp = this.ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 7000;
    noise.connect(hp);
    hp.connect(gain);
    gain.connect(this.masterGain);
    noise.start(time);
    noise.stop(time + decay);
  }

  // ─── Synth notes ──────────────────────────────────────────

  private createSynthNote(time: number, freq: number, duration: number, type: OscillatorType = 'square', volume = 0.1): void {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, time);
    gain.gain.setValueAtTime(volume, time + duration * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + duration);
  }

  private createBassNote(time: number, freq: number, duration: number, volume = 0.2): void {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = freq;
    // Low-pass filter for warm bass
    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 400;
    lp.Q.value = 2;
    gain.gain.setValueAtTime(volume, time);
    gain.gain.setValueAtTime(volume, time + duration * 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    osc.connect(lp);
    lp.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + duration);
  }

  // ─── Scene-specific patterns ──────────────────────────────

  /** Schedule one bar of music and loop it */
  private scheduleBar(scene: SceneMusic): void {
    if (!this.ctx || this.muted) return;
    this.ensureContext();
    const now = this.ctx.currentTime + 0.05;
    const bpm = scene === 'battle' ? 140 : scene === 'victory' ? 130 : 110;
    const beat = 60 / bpm;
    const bar = beat * 8; // 2 measures of 4/4

    switch (scene) {
      case 'title':
        this.scheduleTitleBar(now, beat);
        break;
      case 'select':
        this.scheduleSelectBar(now, beat);
        break;
      case 'battle':
        this.scheduleBattleBar(now, beat);
        break;
      case 'victory':
        this.scheduleVictoryBar(now, beat);
        break;
    }

    // Loop
    this.loopTimer = window.setTimeout(() => {
      if (this.currentScene === scene && !this.muted) {
        this.scheduleBar(scene);
      }
    }, bar * 1000 - 50);
  }

  /** Title: chill, sparkly, anticipation — soft beat with bright arpeggios */
  private scheduleTitleBar(t: number, beat: number): void {
    // Light kick on 1 and 5
    this.createKick(t, 0.3);
    this.createKick(t + beat * 4, 0.3);

    // Hihats on every beat
    for (let i = 0; i < 8; i++) {
      this.createHihat(t + beat * i, i % 4 === 2, 0.06);
    }

    // Sparkly arpeggio: C E G C E G C E (ascending)
    const titleNotes = [523, 659, 784, 1047, 659, 784, 1047, 1319];
    titleNotes.forEach((freq, i) => {
      this.createSynthNote(t + beat * i, freq, beat * 0.8, 'sine', 0.06);
    });

    // Gentle pad
    this.createSynthNote(t, 261, beat * 8, 'sine', 0.03);
    this.createSynthNote(t, 329, beat * 8, 'sine', 0.02);
  }

  /** Select: bouncy, fun — syncopated beat with plucky melody */
  private scheduleSelectBar(t: number, beat: number): void {
    // Kick: 1, 3, 5, 7
    [0, 2, 4, 6].forEach((i) => this.createKick(t + beat * i, 0.3));
    // Snare: 2, 6
    this.createSnare(t + beat * 1.5, 0.2);
    this.createSnare(t + beat * 5.5, 0.2);

    // Hihats — 16th note feel
    for (let i = 0; i < 16; i++) {
      this.createHihat(t + (beat / 2) * i, false, 0.04);
    }

    // Plucky bass: Em pattern
    const bassNotes = [165, 165, 196, 220, 165, 165, 247, 220];
    bassNotes.forEach((freq, i) => {
      this.createBassNote(t + beat * i, freq, beat * 0.6, 0.15);
    });

    // Little melody riff
    const melody = [659, 784, 659, 0, 523, 659, 784, 1047];
    melody.forEach((freq, i) => {
      if (freq > 0) this.createSynthNote(t + beat * i, freq, beat * 0.5, 'square', 0.05);
    });
  }

  /** Battle: high energy K-pop beat — driving four-on-the-floor, punchy snares, busy hihats */
  private scheduleBattleBar(t: number, beat: number): void {
    // Four-on-the-floor kick
    for (let i = 0; i < 8; i++) this.createKick(t + beat * i, 0.4);

    // Snare on 2 and 4 (and 6 and 8)
    [1, 3, 5, 7].forEach((i) => this.createSnare(t + beat * i, 0.25));

    // Busy hihats — 16th notes with accents
    for (let i = 0; i < 32; i++) {
      const isAccent = i % 4 === 0;
      const isOpen = i % 8 === 6;
      this.createHihat(t + (beat / 4) * i, isOpen, isAccent ? 0.1 : 0.04);
    }

    // Driving bass line — E minor pentatonic
    const bassPattern = [82, 82, 98, 110, 82, 82, 123, 110];
    bassPattern.forEach((freq, i) => {
      this.createBassNote(t + beat * i, freq, beat * 0.7, 0.18);
    });

    // Catchy synth hook — K-pop style repeating riff
    const hookA = [659, 784, 880, 784, 659, 0, 587, 659];
    const hookVariant = Math.random() > 0.5;
    const hook = hookVariant
      ? [784, 880, 1047, 880, 784, 0, 659, 784]
      : hookA;
    hook.forEach((freq, i) => {
      if (freq > 0) {
        this.createSynthNote(t + beat * i, freq, beat * 0.4, 'square', 0.07);
        // Octave doubling for brightness
        this.createSynthNote(t + beat * i, freq * 2, beat * 0.3, 'sine', 0.02);
      }
    });

    // Extra energy: off-beat stabs
    [0.5, 2.5, 4.5, 6.5].forEach((b) => {
      this.createSynthNote(t + beat * b, 330, beat * 0.15, 'square', 0.04);
      this.createSynthNote(t + beat * b, 415, beat * 0.15, 'square', 0.04);
    });
  }

  /** Victory: triumphant, celebratory — major key, big chords, marching rhythm */
  private scheduleVictoryBar(t: number, beat: number): void {
    // Celebratory kick pattern
    [0, 1, 2, 3, 4, 5, 6, 7].forEach((i) => {
      this.createKick(t + beat * i, i % 2 === 0 ? 0.35 : 0.2);
    });

    // Snare rolls
    [1, 3, 5, 7].forEach((i) => this.createSnare(t + beat * i, 0.2));
    // Extra snare fills
    this.createSnare(t + beat * 3.5, 0.15);
    this.createSnare(t + beat * 7.5, 0.15);

    // Open hihats for energy
    for (let i = 0; i < 16; i++) {
      this.createHihat(t + (beat / 2) * i, i % 4 === 2, 0.07);
    }

    // Major key bass: C major
    const bass = [131, 165, 196, 165, 131, 165, 196, 262];
    bass.forEach((freq, i) => {
      this.createBassNote(t + beat * i, freq, beat * 0.6, 0.15);
    });

    // Triumphant chord stabs: C major, F major
    [0, 2, 4, 6].forEach((i) => {
      const isF = i >= 4;
      const root = isF ? 349 : 523;
      const third = isF ? 440 : 659;
      const fifth = isF ? 523 : 784;
      this.createSynthNote(t + beat * i, root, beat * 1.5, 'square', 0.05);
      this.createSynthNote(t + beat * i, third, beat * 1.5, 'square', 0.04);
      this.createSynthNote(t + beat * i, fifth, beat * 1.5, 'sine', 0.04);
    });

    // Ascending celebratory melody
    const melody = [523, 659, 784, 1047, 1175, 1319, 1568, 2093];
    melody.forEach((freq, i) => {
      this.createSynthNote(t + beat * i, freq, beat * 0.5, 'sine', 0.06);
    });
  }

  // ─── Public API ───────────────────────────────────────────

  play(scene: SceneMusic): void {
    if (this.currentScene === scene) return;
    this.stop();
    this.currentScene = scene;
    if (!this.muted) this.scheduleBar(scene);
  }

  stop(): void {
    this.currentScene = null;
    if (this.loopTimer !== null) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    if (this.muted) {
      this.stop();
    }
    return this.muted;
  }

  isMuted(): boolean {
    return this.muted;
  }

  setVolume(vol: number): void {
    if (this.masterGain) this.masterGain.gain.value = Math.max(0, Math.min(1, vol));
  }
}
