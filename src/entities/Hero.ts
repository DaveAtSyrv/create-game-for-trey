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

    // Outfit body — each character has a distinct outfit color
    const outfitColor = this.data.id === 'zoey' ? 0xffd700 : this.data.color;
    g.fillStyle(outfitColor, 1);
    g.fillRoundedRect(-30, -20, 60, 80, 12);

    // Outfit details — belt/sash
    g.fillStyle(this.data.accentColor, 1);
    g.fillRect(-28, 10, 56, 8);

    // Head — fair skin
    g.fillStyle(0xfce4c8, 1);
    g.fillCircle(0, -40, 32);

    // Hair based on character
    this.drawHair(g);

    // Eyes — large anime-style
    g.fillStyle(0xffffff, 1);
    g.fillEllipse(-12, -44, 14, 16);
    g.fillEllipse(12, -44, 14, 16);

    // Irises — character-specific color
    const irisColor = this.data.id === 'rumi' ? 0xcc8844 : 0x4a3728;
    g.fillStyle(irisColor, 1);
    g.fillCircle(-10, -43, 5);
    g.fillCircle(14, -43, 5);

    // Rumi heterochromia (one amber, one brown)
    if (this.data.id === 'rumi') {
      g.fillStyle(0x4a3728, 1);
      g.fillCircle(14, -43, 5);
    }

    // Pupils
    g.fillStyle(0x111111, 1);
    g.fillCircle(-10, -43, 2.5);
    g.fillCircle(14, -43, 2.5);

    // Eye sparkle
    g.fillStyle(0xffffff, 1);
    g.fillCircle(-8, -45, 2);
    g.fillCircle(16, -45, 2);

    // Confident smile
    g.lineStyle(2, 0x222222, 1);
    g.beginPath();
    g.arc(0, -34, 8, 0.2, Math.PI - 0.2, false);
    g.strokePath();

    // Rumi's demon marks (pink patterns on arms)
    if (this.data.id === 'rumi') {
      g.lineStyle(2, 0xff6b9d, 0.7);
      g.beginPath();
      g.moveTo(-30, -5);
      g.lineTo(-35, 10);
      g.lineTo(-28, 20);
      g.strokePath();
      g.beginPath();
      g.moveTo(30, -5);
      g.lineTo(35, 10);
      g.lineTo(28, 20);
      g.strokePath();
    }

    // Zoey's ear piercings
    if (this.data.id === 'zoey') {
      g.fillStyle(0xffd700, 1);
      g.fillCircle(-30, -42, 2);
      g.fillCircle(-31, -38, 2);
      g.fillCircle(-29, -34, 2);
      g.fillCircle(30, -42, 2);
      g.fillCircle(31, -38, 2);
      g.fillCircle(29, -34, 2);
    }

    // Weapon
    this.drawWeapon(g);
  }

  private drawHair(g: Phaser.GameObjects.Graphics): void {
    switch (this.data.hairStyle) {
      case 'braid': // Rumi — long purple braid
        g.fillStyle(0x9b59b6, 1);
        // Top hair volume
        g.fillEllipse(0, -62, 40, 20);
        g.fillRoundedRect(-28, -68, 56, 30, 14);
        // Long braid going down the back
        g.fillStyle(0x8e44ad, 1);
        g.fillRoundedRect(-6, -50, 12, 100, 6);
        // Braid segments
        g.lineStyle(1, 0x7d3c98, 0.5);
        for (let i = 0; i < 6; i++) {
          g.beginPath();
          g.moveTo(-6, -40 + i * 14);
          g.lineTo(6, -40 + i * 14);
          g.strokePath();
        }
        // Braid tip
        g.fillStyle(0xff6b9d, 1);
        g.fillCircle(0, 52, 5);
        break;

      case 'pigtails': // Mira — hot pink pigtails
        g.fillStyle(0xff1493, 1);
        // Top hair
        g.fillEllipse(0, -62, 42, 22);
        g.fillRoundedRect(-30, -70, 60, 30, 14);
        // Left pigtail
        g.fillRoundedRect(-42, -55, 14, 90, 7);
        g.fillCircle(-35, 38, 7);
        // Right pigtail
        g.fillRoundedRect(28, -55, 14, 90, 7);
        g.fillCircle(35, 38, 7);
        // Middle part sidelocks
        g.fillRoundedRect(-20, -55, 8, 30, 4);
        g.fillRoundedRect(12, -55, 8, 30, 4);
        break;

      case 'spacebuns': // Zoey — black twin braided space buns
        g.fillStyle(0x1a1a1a, 1);
        // Top hair with micro-bangs
        g.fillRoundedRect(-28, -68, 56, 28, 14);
        // Micro-bangs
        g.fillRect(-18, -56, 36, 6);
        // Left space bun
        g.fillCircle(-28, -65, 14);
        g.fillStyle(0x222222, 1);
        g.fillCircle(-28, -65, 10);
        // Right space bun
        g.fillStyle(0x1a1a1a, 1);
        g.fillCircle(28, -65, 14);
        g.fillStyle(0x222222, 1);
        g.fillCircle(28, -65, 10);
        // Small braids from buns
        g.fillStyle(0x1a1a1a, 1);
        g.fillRoundedRect(-32, -55, 6, 25, 3);
        g.fillRoundedRect(26, -55, 6, 25, 3);
        break;
    }
  }

  private drawWeapon(g: Phaser.GameObjects.Graphics): void {
    switch (this.data.weapon) {
      case 'sword': // Rumi's Saingeom
        // Blade
        g.fillStyle(0xc0c0c0, 1);
        g.fillRect(32, -15, 4, 45);
        g.fillTriangle(30, -15, 38, -15, 34, -25);
        // Guard (tiger motif — gold)
        g.fillStyle(0xffd700, 1);
        g.fillRect(28, 28, 14, 4);
        // Handle
        g.fillStyle(0x8b4513, 1);
        g.fillRect(31, 32, 8, 15);
        break;

      case 'polearm': // Mira's Gokdo
        // Long pole
        g.fillStyle(0x8b4513, 1);
        g.fillRect(34, -40, 4, 100);
        // Curved blade at top
        g.fillStyle(0xc0c0c0, 1);
        g.beginPath();
        g.moveTo(36, -40);
        g.lineTo(50, -55);
        g.lineTo(45, -60);
        g.lineTo(34, -42);
        g.closePath();
        g.fillPath();
        break;

      case 'knives': // Zoey's Shinkal throwing knives
        g.fillStyle(0xc0c0c0, 1);
        // Three small knives
        g.fillTriangle(32, 5, 38, 5, 35, -10);
        g.fillTriangle(40, 10, 46, 10, 43, -5);
        g.fillTriangle(26, 12, 32, 12, 29, -3);
        // Gold accents on handles
        g.fillStyle(0xffd700, 1);
        g.fillRect(33, 5, 4, 4);
        g.fillRect(41, 10, 4, 4);
        g.fillRect(27, 12, 4, 4);
        break;
    }
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
