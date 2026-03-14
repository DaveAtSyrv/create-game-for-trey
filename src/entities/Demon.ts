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
    if (demonData.id === 'gwi-ma') {
      this.drawGwiMa();
    } else {
      this.drawSajaBoy();
    }
    this.container.add(this.body);

    this.healthBar = new HealthBar(scene, x - 40, y - 90 * demonData.size, 80, 10, demonData.hp);
    this.startIdle();
  }

  private drawSajaBoy(): void {
    const g = this.body;
    g.clear();

    // Shadow
    g.fillStyle(0x000000, 0.3);
    g.fillEllipse(0, 60, 70, 20);

    // Body — stylish boy band outfit (dark with purple accents)
    g.fillStyle(0x1a1a2e, 1);
    g.fillRoundedRect(-28, -15, 56, 75, 12);
    // Jacket lapels
    g.fillStyle(this.data.color, 0.6);
    g.fillTriangle(-28, -15, -10, -15, -28, 20);
    g.fillTriangle(28, -15, 10, -15, 28, 20);
    // Belt
    g.fillStyle(0xc0c0c0, 1);
    g.fillRect(-26, 25, 52, 3);

    // Head — purple-blue demon skin
    g.fillStyle(this.data.color, 1);
    g.fillCircle(0, -35, 28);

    // Stylish demon hair (swooped)
    g.fillStyle(0x1a1a3e, 1);
    g.fillRoundedRect(-24, -60, 48, 22, 10);
    g.fillTriangle(-10, -58, 15, -68, 25, -52);

    // Glowing eyes
    g.fillStyle(0xff0000, 0.6);
    g.fillEllipse(-10, -38, 12, 14);
    g.fillEllipse(10, -38, 12, 14);
    g.fillStyle(0xffff00, 1);
    g.fillCircle(-10, -38, 4);
    g.fillCircle(10, -38, 4);
    g.fillStyle(0x000000, 1);
    g.fillCircle(-10, -38, 2);
    g.fillCircle(10, -38, 2);

    // Demonic marks on face
    g.lineStyle(1.5, 0x4400aa, 0.6);
    g.beginPath();
    g.moveTo(-20, -30);
    g.lineTo(-25, -22);
    g.strokePath();
    g.beginPath();
    g.moveTo(20, -30);
    g.lineTo(25, -22);
    g.strokePath();

    // Fangs
    g.fillStyle(0xffffff, 1);
    g.fillTriangle(-8, -20, -4, -14, 0, -20);
    g.fillTriangle(8, -20, 4, -14, 0, -20);

    // Claws on hands
    g.fillStyle(this.data.color, 1);
    g.fillCircle(-32, 20, 8);
    g.fillCircle(32, 20, 8);
    g.fillStyle(0x330066, 1);
    g.fillTriangle(-38, 16, -36, 10, -34, 16);
    g.fillTriangle(-34, 14, -32, 8, -30, 14);
    g.fillTriangle(38, 16, 36, 10, 34, 16);
    g.fillTriangle(34, 14, 32, 8, 30, 14);

    // Name label
    const nameText = this.scene.add.text(0, -70, this.data.name, {
      fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
      fontSize: '14px',
      color: '#aaaadd',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.container.add(nameText);
  }

  private drawGwiMa(): void {
    const g = this.body;
    g.clear();

    // Gwi-Ma — massive violet flame mouth monster
    // Violet flame aura
    g.fillStyle(0x8b00ff, 0.15);
    g.fillCircle(0, -10, 65);
    g.fillStyle(0x6a00cc, 0.1);
    g.fillCircle(0, -10, 80);

    // Main body — amorphous violet flame shape
    g.fillStyle(0x4b0082, 1);
    g.fillEllipse(0, 0, 90, 70);

    // Flame tendrils on top
    g.fillStyle(0x8b00ff, 0.9);
    g.fillTriangle(-30, -25, -15, -65, 0, -20);
    g.fillTriangle(-10, -30, 5, -75, 15, -25);
    g.fillTriangle(10, -25, 25, -60, 35, -15);
    // Side flames
    g.fillTriangle(-45, -5, -55, -30, -35, -20);
    g.fillTriangle(45, -5, 55, -30, 35, -20);

    // Giant mouth — the defining feature
    g.fillStyle(0x1a0020, 1);
    g.fillEllipse(0, 5, 60, 35);

    // Jagged teeth — top row
    g.fillStyle(0xeeeeff, 1);
    for (let i = -25; i <= 25; i += 10) {
      g.fillTriangle(i - 4, -8, i, 5, i + 4, -8);
    }
    // Bottom teeth
    for (let i = -20; i <= 20; i += 10) {
      g.fillTriangle(i - 4, 18, i, 8, i + 4, 18);
    }

    // Glowing inner mouth
    g.fillStyle(0x9b00ff, 0.5);
    g.fillCircle(0, 5, 12);

    // Violet flame particles around body
    g.fillStyle(0xcc44ff, 0.4);
    g.fillCircle(-35, -35, 6);
    g.fillCircle(30, -40, 5);
    g.fillCircle(-40, 15, 4);
    g.fillCircle(38, 10, 5);
    g.fillCircle(0, -50, 4);
    g.fillCircle(-20, -55, 3);
    g.fillCircle(25, -48, 3);

    // Name label
    const nameText = this.scene.add.text(0, -85, 'GWI-MA', {
      fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
      fontSize: '18px',
      color: '#cc44ff',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5);
    this.container.add(nameText);
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
