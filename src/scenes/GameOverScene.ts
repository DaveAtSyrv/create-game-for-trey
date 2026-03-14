import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config.ts';
import type { MusicEngine } from '../audio/MusicEngine.ts';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLORS.background);

    // Stop battle music
    const music: MusicEngine = this.registry.get('musicEngine');
    if (music) music.stop();

    // Encouraging message — not scary!
    const title = this.add.text(GAME_WIDTH / 2, 140, 'The demons got away!', {
      fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
      fontSize: '48px',
      color: '#FF9900',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 5,
    }).setOrigin(0.5).setScale(0);

    this.tweens.add({
      targets: title,
      scaleX: 1,
      scaleY: 1,
      duration: 500,
      ease: 'Back.easeOut',
    });

    // Rumi dusting herself off (simple character drawing)
    const rumiGfx = this.add.graphics();
    const cx = GAME_WIDTH / 2;
    const cy = 310;

    // Shadow
    rumiGfx.fillStyle(0x000000, 0.3);
    rumiGfx.fillEllipse(cx, cy + 60, 70, 20);
    // Body
    rumiGfx.fillStyle(0x9b59b6, 1);
    rumiGfx.fillRoundedRect(cx - 30, cy - 20, 60, 80, 12);
    // Belt
    rumiGfx.fillStyle(0xff6b9d, 1);
    rumiGfx.fillRect(cx - 28, cy + 10, 56, 8);
    // Head
    rumiGfx.fillStyle(0xfce4c8, 1);
    rumiGfx.fillCircle(cx, cy - 40, 32);
    // Hair (purple braid)
    rumiGfx.fillStyle(0x9b59b6, 1);
    rumiGfx.fillEllipse(cx, cy - 62, 40, 20);
    rumiGfx.fillRoundedRect(cx - 28, cy - 68, 56, 30, 14);
    rumiGfx.fillStyle(0x8e44ad, 1);
    rumiGfx.fillRoundedRect(cx - 6, cy - 50, 12, 100, 6);
    // Eyes (determined, not sad)
    rumiGfx.fillStyle(0xffffff, 1);
    rumiGfx.fillEllipse(cx - 12, cy - 44, 14, 16);
    rumiGfx.fillEllipse(cx + 12, cy - 44, 14, 16);
    rumiGfx.fillStyle(0xcc8844, 1);
    rumiGfx.fillCircle(cx - 10, cy - 43, 5);
    rumiGfx.fillStyle(0x4a3728, 1);
    rumiGfx.fillCircle(cx + 14, cy - 43, 5);
    rumiGfx.fillStyle(0x111111, 1);
    rumiGfx.fillCircle(cx - 10, cy - 43, 2.5);
    rumiGfx.fillCircle(cx + 14, cy - 43, 2.5);
    // Determined mouth (straight line, not sad)
    rumiGfx.lineStyle(2, 0x222222, 1);
    rumiGfx.beginPath();
    rumiGfx.moveTo(cx - 6, cy - 32);
    rumiGfx.lineTo(cx + 6, cy - 32);
    rumiGfx.strokePath();

    // Dust puff particles around Rumi
    rumiGfx.setAlpha(0);
    this.tweens.add({
      targets: rumiGfx,
      alpha: 1,
      duration: 400,
      delay: 300,
    });

    // Small dust clouds
    for (let i = 0; i < 6; i++) {
      const dustX = cx - 40 + Math.random() * 80;
      const dustY = cy + 30 + Math.random() * 30;
      const dust = this.add.text(dustX, dustY, '💨', {
        fontSize: '20px',
      }).setAlpha(0);

      this.tweens.add({
        targets: dust,
        alpha: 0.7,
        y: dustY - 20,
        duration: 600,
        delay: 500 + i * 100,
        onComplete: () => {
          this.tweens.add({
            targets: dust,
            alpha: 0,
            y: dustY - 40,
            duration: 400,
          });
        },
      });
    }

    // Encouraging subtitle
    const subtitle = this.add.text(GAME_WIDTH / 2, 420, "Rumi's not giving up!", {
      fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
      fontSize: '28px',
      color: '#9B59B6',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: subtitle,
      alpha: 1,
      duration: 400,
      delay: 800,
    });

    // Try Again button
    const btnContainer = this.add.container(GAME_WIDTH / 2, 520);

    const bg = this.add.graphics();
    bg.fillStyle(COLORS.primary, 1);
    bg.fillRoundedRect(-120, -35, 240, 70, 20);
    bg.lineStyle(3, COLORS.white, 0.5);
    bg.strokeRoundedRect(-120, -35, 240, 70, 20);

    const btnText = this.add.text(0, 0, 'TRY AGAIN!', {
      fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
      fontSize: '38px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const hitArea = this.add.rectangle(0, 0, 240, 70, 0xffffff, 0)
      .setInteractive({ useHandCursor: true });

    btnContainer.add([bg, btnText, hitArea]);

    hitArea.on('pointerover', () => {
      this.tweens.add({ targets: btnContainer, scaleX: 1.1, scaleY: 1.1, duration: 100 });
    });
    hitArea.on('pointerout', () => {
      this.tweens.add({ targets: btnContainer, scaleX: 1, scaleY: 1, duration: 100 });
    });
    hitArea.on('pointerdown', () => {
      this.tweens.add({
        targets: btnContainer,
        scaleX: 0.9,
        scaleY: 0.9,
        duration: 80,
        yoyo: true,
        onComplete: () => {
          this.cameras.main.fadeOut(300, 0, 0, 0);
          this.time.delayedCall(300, () => {
            this.scene.start('BattleScene');
          });
        },
      });
    });

    // Button entrance
    btnContainer.setScale(0);
    this.tweens.add({
      targets: btnContainer,
      scaleX: 1,
      scaleY: 1,
      duration: 400,
      delay: 1200,
      ease: 'Back.easeOut',
    });

    // Button bounce
    this.tweens.add({
      targets: btnContainer,
      y: 525,
      duration: 600,
      delay: 1600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.cameras.main.fadeIn(400);
  }
}
