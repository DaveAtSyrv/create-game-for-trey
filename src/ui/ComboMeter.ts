import Phaser from 'phaser';
import { GAME_WIDTH, COLORS } from '../config.ts';

export class ComboMeter {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private streakText: Phaser.GameObjects.Text;
  private scoreText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0).setDepth(80);

    this.streakText = scene.add.text(GAME_WIDTH - 20, 20, '', {
      fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
      fontSize: '28px',
      color: '#FFD700',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(1, 0);

    this.scoreText = scene.add.text(20, 20, 'Score: 0', {
      fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0, 0);

    this.container.add([this.streakText, this.scoreText]);
  }

  update(streak: number, score: number): void {
    this.scoreText.setText(`Score: ${score}`);

    if (streak >= 2) {
      this.streakText.setText(`🔥 x${streak}`);
      // Pulse animation
      this.scene.tweens.add({
        targets: this.streakText,
        scaleX: 1.3,
        scaleY: 1.3,
        duration: 150,
        yoyo: true,
        ease: 'Power2',
      });
    } else {
      this.streakText.setText('');
    }
  }

  animateScore(scene: Phaser.Scene, points: number): void {
    const x = 100;
    const y = 50;
    const txt = scene.add.text(x, y, `+${points}`, {
      fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
      fontSize: '24px',
      color: '#4CFF50',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(90);

    scene.tweens.add({
      targets: txt,
      y: y - 40,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => txt.destroy(),
    });
  }

  destroy(): void {
    this.container.destroy();
  }
}
