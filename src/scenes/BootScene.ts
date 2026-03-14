import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config.ts';
import { createParticleTexture, createStarTexture } from '../effects/ParticleEffects.ts';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create(): void {
    // Generate particle textures programmatically
    createParticleTexture(this, 'particle-pink', COLORS.primary);
    createParticleTexture(this, 'particle-cyan', COLORS.accent);
    createParticleTexture(this, 'particle-purple', COLORS.secondary);
    createParticleTexture(this, 'particle-gold', COLORS.gold);
    createParticleTexture(this, 'particle-white', COLORS.white);
    createParticleTexture(this, 'particle-green', COLORS.success);
    createStarTexture(this, 'star-gold', COLORS.gold);
    createStarTexture(this, 'star-pink', COLORS.primary);

    // Loading text
    const loadText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'Loading...', {
      fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
      fontSize: '36px',
      color: '#ffffff',
    }).setOrigin(0.5);

    // Simulate short load then transition
    this.tweens.add({
      targets: loadText,
      alpha: 0,
      duration: 500,
      delay: 300,
      onComplete: () => {
        this.scene.start('TitleScene');
      },
    });
  }
}
