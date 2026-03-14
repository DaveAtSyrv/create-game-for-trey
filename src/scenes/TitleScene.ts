import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config.ts';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create(): void {
    // Background
    this.cameras.main.setBackgroundColor(COLORS.background);

    // Ambient particles
    const emitter = this.add.particles(GAME_WIDTH / 2, GAME_HEIGHT, 'particle-pink', {
      x: { min: -GAME_WIDTH / 2, max: GAME_WIDTH / 2 },
      speed: { min: 20, max: 60 },
      angle: { min: 250, max: 290 },
      scale: { start: 0.8, end: 0 },
      alpha: { start: 0.6, end: 0 },
      lifespan: 3000,
      frequency: 200,
    });
    emitter.setDepth(0);

    // Title text
    const title = this.add.text(GAME_WIDTH / 2, 180, 'K-POP\nDEMON HUNTERS!', {
      fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
      fontSize: '72px',
      color: '#FF6B9D',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#000',
      strokeThickness: 6,
      lineSpacing: 10,
    }).setOrigin(0.5);

    // Title pulse
    this.tweens.add({
      targets: title,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Subtitle
    this.add.text(GAME_WIDTH / 2, 310, 'Math Battle Arena', {
      fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
      fontSize: '32px',
      color: '#00E5FF',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    // Start button
    const btnContainer = this.add.container(GAME_WIDTH / 2, 440);

    const btnBg = this.add.graphics();
    btnBg.fillStyle(COLORS.primary, 1);
    btnBg.fillRoundedRect(-120, -35, 240, 70, 20);
    btnBg.lineStyle(3, COLORS.white, 0.5);
    btnBg.strokeRoundedRect(-120, -35, 240, 70, 20);

    const btnText = this.add.text(0, 0, 'PLAY!', {
      fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
      fontSize: '42px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const hitArea = this.add.rectangle(0, 0, 240, 70, 0xffffff, 0)
      .setInteractive({ useHandCursor: true });

    btnContainer.add([btnBg, btnText, hitArea]);

    // Button hover
    hitArea.on('pointerover', () => {
      this.tweens.add({
        targets: btnContainer,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 100,
      });
    });
    hitArea.on('pointerout', () => {
      this.tweens.add({
        targets: btnContainer,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      });
    });

    // Button bounce
    this.tweens.add({
      targets: btnContainer,
      y: 445,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    hitArea.on('pointerdown', () => {
      this.tweens.add({
        targets: btnContainer,
        scaleX: 0.9,
        scaleY: 0.9,
        duration: 80,
        yoyo: true,
        onComplete: () => {
          this.cameras.main.fadeOut(400, 0, 0, 0);
          this.time.delayedCall(400, () => {
            this.scene.start('CharacterSelectScene');
          });
        },
      });
    });

    // Mute button
    const muteBtn = this.add.text(GAME_WIDTH - 50, GAME_HEIGHT - 40, '🔊', {
      fontSize: '32px',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    muteBtn.on('pointerdown', () => {
      const audioMgr = this.registry.get('audioManager');
      if (audioMgr) {
        const muted = audioMgr.toggleMute();
        muteBtn.setText(muted ? '🔇' : '🔊');
      }
    });

    this.cameras.main.fadeIn(400);
  }
}
