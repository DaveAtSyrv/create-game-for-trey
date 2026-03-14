import Phaser from 'phaser';
import type { HeroData } from '../data/heroes.ts';

export class Hero {
  scene: Phaser.Scene;
  data: HeroData;
  container: Phaser.GameObjects.Container;
  body: Phaser.GameObjects.Graphics;
  private idleTween?: Phaser.Tweens.Tween;

  constructor(scene: Phaser.Scene, x: number, y: number, heroData: HeroData) {
    this.scene = scene;
    this.data = heroData;
    this.container = scene.add.container(x, y);
    this.body = scene.add.graphics();
    this.drawCharacter();
    this.container.add(this.body);
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
    g.fillRoundedRect(-30, -20, 60, 80, 12);

    // Head
    g.fillStyle(this.data.color, 1);
    g.fillCircle(0, -40, 32);

    // Eyes
    g.fillStyle(0xffffff, 1);
    g.fillCircle(-12, -45, 10);
    g.fillCircle(12, -45, 10);
    g.fillStyle(0x222222, 1);
    g.fillCircle(-10, -44, 6);
    g.fillCircle(14, -44, 6);

    // Eye sparkle
    g.fillStyle(0xffffff, 1);
    g.fillCircle(-8, -46, 2);
    g.fillCircle(16, -46, 2);

    // Smile
    g.lineStyle(2, 0x222222, 1);
    g.beginPath();
    g.arc(0, -36, 10, 0.2, Math.PI - 0.2, false);
    g.strokePath();

    // Hair (K-pop style spiky)
    g.fillStyle(this.data.accentColor, 1);
    g.fillTriangle(-25, -55, -5, -80, 5, -50);
    g.fillTriangle(-10, -60, 10, -85, 20, -55);
    g.fillTriangle(5, -55, 25, -78, 30, -48);

    // Microphone in hand
    g.fillStyle(0x888888, 1);
    g.fillRoundedRect(30, 0, 8, 25, 3);
    g.fillStyle(0x333333, 1);
    g.fillCircle(34, -2, 8);
  }

  startIdle(): void {
    this.idleTween = this.scene.tweens.add({
      targets: this.container,
      y: this.container.y - 6,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  stopIdle(): void {
    this.idleTween?.stop();
  }

  setDepth(depth: number): void {
    this.container.setDepth(depth);
  }

  destroy(): void {
    this.idleTween?.stop();
    this.container.destroy();
  }
}
