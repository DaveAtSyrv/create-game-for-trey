import Phaser from 'phaser';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '../config.ts';

export interface AnswerButtonConfig {
  choices: number[];
  correctAnswer: number;
  onCorrect: () => void;
  onWrong: () => void;
}

export class AnswerButtons {
  private scene: Phaser.Scene;
  private buttons: Phaser.GameObjects.Container[] = [];
  private enabled = true;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  show(config: AnswerButtonConfig): void {
    this.clear();
    this.enabled = true;

    const { choices, correctAnswer, onCorrect, onWrong } = config;
    const btnWidth = 140;
    const btnHeight = 80;
    const gap = 20;
    const totalWidth = choices.length * btnWidth + (choices.length - 1) * gap;
    const startX = (GAME_WIDTH - totalWidth) / 2 + btnWidth / 2;
    const y = GAME_HEIGHT - 80;

    choices.forEach((choice, i) => {
      const x = startX + i * (btnWidth + gap);
      const container = this.scene.add.container(x, y).setDepth(80);

      // Button background
      const bg = this.scene.add.graphics();
      bg.fillStyle(COLORS.buttonBg, 1);
      bg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 16);
      bg.lineStyle(3, COLORS.white, 0.4);
      bg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 16);

      // Button text
      const txt = this.scene.add.text(0, 0, String(choice), {
        fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
        fontSize: '42px',
        color: '#ffffff',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      container.add([bg, txt]);

      // Interactive zone
      const hitArea = this.scene.add.rectangle(0, 0, btnWidth, btnHeight, 0xffffff, 0)
        .setInteractive({ useHandCursor: true });
      container.add(hitArea);

      // Hover effect
      hitArea.on('pointerover', () => {
        if (!this.enabled) return;
        this.scene.tweens.add({
          targets: container,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 100,
          ease: 'Power2',
        });
      });

      hitArea.on('pointerout', () => {
        if (!this.enabled) return;
        this.scene.tweens.add({
          targets: container,
          scaleX: 1,
          scaleY: 1,
          duration: 100,
          ease: 'Power2',
        });
      });

      // Click handler
      hitArea.on('pointerdown', () => {
        if (!this.enabled) return;
        this.enabled = false;

        // Press animation
        this.scene.tweens.add({
          targets: container,
          scaleX: 0.9,
          scaleY: 0.9,
          duration: 80,
          yoyo: true,
          ease: 'Power2',
        });

        if (choice === correctAnswer) {
          // Flash green
          bg.clear();
          bg.fillStyle(COLORS.success, 1);
          bg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 16);
          this.scene.time.delayedCall(200, onCorrect);
        } else {
          // Flash red
          bg.clear();
          bg.fillStyle(COLORS.danger, 1);
          bg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 16);
          this.scene.time.delayedCall(400, () => {
            // Restore color
            bg.clear();
            bg.fillStyle(COLORS.buttonBg, 1);
            bg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 16);
            bg.lineStyle(3, COLORS.white, 0.4);
            bg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 16);
            this.enabled = true;
            onWrong();
          });
        }
      });

      // Entrance animation
      container.setScale(0);
      this.scene.tweens.add({
        targets: container,
        scaleX: 1,
        scaleY: 1,
        duration: 300,
        delay: i * 80,
        ease: 'Back.easeOut',
      });

      this.buttons.push(container);
    });
  }

  highlightCorrect(correctAnswer: number): void {
    this.buttons.forEach((btn) => {
      const txt = btn.getAt(1) as Phaser.GameObjects.Text;
      if (parseInt(txt.text) === correctAnswer) {
        this.scene.tweens.add({
          targets: btn,
          scaleX: 1.15,
          scaleY: 1.15,
          duration: 500,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
        const bg = btn.getAt(0) as Phaser.GameObjects.Graphics;
        bg.clear();
        bg.fillStyle(COLORS.success, 0.7);
        bg.fillRoundedRect(-70, -40, 140, 80, 16);
        bg.lineStyle(4, COLORS.gold, 1);
        bg.strokeRoundedRect(-70, -40, 140, 80, 16);
      }
    });
  }

  clear(): void {
    this.buttons.forEach((btn) => btn.destroy());
    this.buttons = [];
  }

  destroy(): void {
    this.clear();
  }
}
