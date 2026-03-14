import Phaser from 'phaser';
import { COLORS } from '../config.ts';

export class HealthBar {
  private bar: Phaser.GameObjects.Graphics;
  private x: number;
  private y: number;
  private width: number;
  private height: number;
  private maxHp: number;
  private currentHp: number;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, maxHp: number) {
    this.bar = scene.add.graphics();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.maxHp = maxHp;
    this.currentHp = maxHp;
    this.draw();
  }

  setHp(hp: number): void {
    this.currentHp = Math.max(0, hp);
    this.draw();
  }

  animateHp(scene: Phaser.Scene, targetHp: number, duration = 400): void {
    const startHp = this.currentHp;
    const diff = targetHp - startHp;
    scene.tweens.addCounter({
      from: 0,
      to: 1,
      duration,
      ease: 'Power2',
      onUpdate: (tween) => {
        this.currentHp = startHp + diff * (tween.getValue() ?? 0);
        this.draw();
      },
    });
  }

  private draw(): void {
    this.bar.clear();
    // Background
    this.bar.fillStyle(0x333333, 0.8);
    this.bar.fillRoundedRect(this.x, this.y, this.width, this.height, 4);
    // Health fill
    const pct = this.currentHp / this.maxHp;
    const fillColor = pct > 0.5 ? COLORS.healthGreen : pct > 0.25 ? COLORS.gold : COLORS.healthRed;
    this.bar.fillStyle(fillColor, 1);
    this.bar.fillRoundedRect(this.x + 2, this.y + 2, (this.width - 4) * pct, this.height - 4, 3);
    // Border
    this.bar.lineStyle(2, COLORS.white, 0.5);
    this.bar.strokeRoundedRect(this.x, this.y, this.width, this.height, 4);
  }

  destroy(): void {
    this.bar.destroy();
  }

  setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.draw();
  }

  setDepth(depth: number): void {
    this.bar.setDepth(depth);
  }
}
