import Phaser from 'phaser';
import { GAME_WIDTH } from '../config.ts';
import type { MathProblem } from '../math/types.ts';

export class ProblemDisplay {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private questionText: Phaser.GameObjects.Text;
  private countingObjects: Phaser.GameObjects.Container;
  private compareDisplay: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(GAME_WIDTH / 2, 80).setDepth(70);

    // Background panel
    const panel = scene.add.graphics();
    panel.fillStyle(0x000000, 0.5);
    panel.fillRoundedRect(-250, -35, 500, 70, 16);
    this.container.add(panel);

    this.questionText = scene.add.text(0, 0, '', {
      fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
      fontSize: '40px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5);
    this.container.add(this.questionText);

    this.countingObjects = scene.add.container(0, 0).setDepth(70);
    this.compareDisplay = scene.add.container(0, 0).setDepth(70);
  }

  show(problem: MathProblem): void {
    this.clearVisuals();
    this.questionText.setText(problem.question);

    // Entrance animation
    this.container.setScale(0);
    this.scene.tweens.add({
      targets: this.container,
      scaleX: 1,
      scaleY: 1,
      duration: 300,
      ease: 'Back.easeOut',
    });

    if (problem.type === 'counting' && problem.countObjects) {
      this.showCountingObjects(problem.countObjects);
    }

    if (problem.type === 'comparison' && problem.compareNums) {
      this.showCompareDisplay(problem.compareNums);
    }
  }

  private showCountingObjects(count: number): void {
    this.countingObjects.removeAll(true);
    const cols = Math.min(count, 5);
    const rows = Math.ceil(count / 5);
    const startX = GAME_WIDTH / 2 - (cols * 40) / 2 + 20;
    const startY = 130;

    for (let i = 0; i < count; i++) {
      const col = i % 5;
      const row = Math.floor(i / 5);
      const x = startX + col * 40;
      const y = startY + row * 45;

      const star = this.scene.add.text(x, y, '⭐', {
        fontSize: '32px',
      }).setOrigin(0.5);

      // Bounce entrance
      star.setScale(0);
      this.scene.tweens.add({
        targets: star,
        scaleX: 1,
        scaleY: 1,
        duration: 300,
        delay: i * 60,
        ease: 'Back.easeOut',
      });

      // Gentle idle bounce
      this.scene.tweens.add({
        targets: star,
        y: y - 5,
        duration: 400 + Math.random() * 200,
        delay: i * 60 + 300,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      this.countingObjects.add(star);
    }
  }

  private showCompareDisplay(nums: [number, number]): void {
    this.compareDisplay.removeAll(true);
    const y = 160;

    // Left number
    const left = this.scene.add.text(GAME_WIDTH / 2 - 100, y, String(nums[0]), {
      fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
      fontSize: '72px',
      color: '#00E5FF',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    // "or" text
    const orText = this.scene.add.text(GAME_WIDTH / 2, y, 'or', {
      fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Right number
    const right = this.scene.add.text(GAME_WIDTH / 2 + 100, y, String(nums[1]), {
      fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
      fontSize: '72px',
      color: '#FF6B9D',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    [left, orText, right].forEach((obj, i) => {
      obj.setScale(0);
      this.scene.tweens.add({
        targets: obj,
        scaleX: 1,
        scaleY: 1,
        duration: 300,
        delay: i * 100,
        ease: 'Back.easeOut',
      });
    });

    this.compareDisplay.add([left, orText, right]);
  }

  private clearVisuals(): void {
    this.countingObjects.removeAll(true);
    this.compareDisplay.removeAll(true);
  }

  destroy(): void {
    this.container.destroy();
    this.countingObjects.destroy();
    this.compareDisplay.destroy();
  }
}
