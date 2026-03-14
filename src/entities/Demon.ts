import Phaser from 'phaser';
import type { DemonData } from '../data/demons.ts';
import { HealthBar } from './HealthBar.ts';

export class Demon {
  scene: Phaser.Scene;
  data: DemonData;
  container: Phaser.GameObjects.Container;
  body: Phaser.GameObjects.Graphics;
  healthBar: HealthBar;
  currentHp: number;
  private idleTween?: Phaser.Tweens.Tween;

  constructor(scene: Phaser.Scene, x: number, y: number, demonData: DemonData) {
    this.scene = scene;
    this.data = demonData;
    this.currentHp = demonData.hp;
    this.container = scene.add.container(x, y);
    this.container.setScale(demonData.size);

    this.body = scene.add.graphics();
    this.drawCharacter();
    this.container.add(this.body);

    this.healthBar = new HealthBar(scene, x - 40, y - 90 * demonData.size, 80, 10, demonData.hp);
    this.startIdle();
  }

  private drawCharacter(): void {
    const g = this.body;
    g.clear();

    // Shadow
    g.fillStyle(0x000000, 0.3);
    g.fillEllipse(0, 60, 70, 20);

    // Body
    g.fillStyle(this.data.color, 1);
    g.fillRoundedRect(-30, -10, 60, 70, 12);

    // Head
    g.fillStyle(this.data.color, 1);
    g.fillCircle(0, -30, 30);

    // Horns
    g.fillStyle(0x660000, 1);
    g.fillTriangle(-25, -40, -15, -70, -10, -35);
    g.fillTriangle(25, -40, 15, -70, 10, -35);

    // Eyes (angry)
    g.fillStyle(0xff0000, 1);
    g.fillCircle(-12, -32, 8);
    g.fillCircle(12, -32, 8);
    g.fillStyle(0xffff00, 1);
    g.fillCircle(-12, -32, 4);
    g.fillCircle(12, -32, 4);
    g.fillStyle(0x000000, 1);
    g.fillCircle(-12, -32, 2);
    g.fillCircle(12, -32, 2);

    // Angry eyebrows
    g.lineStyle(3, 0x440000, 1);
    g.beginPath();
    g.moveTo(-20, -42);
    g.lineTo(-6, -38);
    g.strokePath();
    g.beginPath();
    g.moveTo(20, -42);
    g.lineTo(6, -38);
    g.strokePath();

    // Teeth
    g.fillStyle(0xffffff, 1);
    g.fillTriangle(-10, -16, -5, -10, 0, -16);
    g.fillTriangle(0, -16, 5, -10, 10, -16);
  }

  startIdle(): void {
    this.idleTween = this.scene.tweens.add({
      targets: this.container,
      y: this.container.y - 4,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  takeDamage(): void {
    this.currentHp = Math.max(0, this.currentHp - 1);
    this.healthBar.animateHp(this.scene, this.currentHp);
  }

  isDefeated(): boolean {
    return this.currentHp <= 0;
  }

  setDepth(depth: number): void {
    this.container.setDepth(depth);
    this.healthBar.setDepth(depth);
  }

  destroy(): void {
    this.idleTween?.stop();
    this.container.destroy();
    this.healthBar.destroy();
  }
}
