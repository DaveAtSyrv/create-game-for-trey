import Phaser from 'phaser';
import { COLORS } from '../config.ts';

export function screenShake(scene: Phaser.Scene, duration = 100, intensity = 0.01): void {
  scene.cameras.main.shake(duration, intensity);
}

export function screenFlash(scene: Phaser.Scene, color = COLORS.white, duration = 150): void {
  scene.cameras.main.flash(duration, (color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff);
}

export function floatingText(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  color: string,
  size = 32
): void {
  const txt = scene.add.text(x, y, text, {
    fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
    fontSize: `${size}px`,
    color,
    stroke: '#000',
    strokeThickness: 4,
    fontStyle: 'bold',
  }).setOrigin(0.5).setDepth(90);

  scene.tweens.add({
    targets: txt,
    y: y - 80,
    alpha: 0,
    scale: 1.5,
    duration: 1000,
    ease: 'Power2',
    onComplete: () => txt.destroy(),
  });
}

export function comboText(scene: Phaser.Scene, text: string, color = '#FFD700'): void {
  const txt = scene.add.text(480, 200, text, {
    fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
    fontSize: '64px',
    color,
    stroke: '#000',
    strokeThickness: 6,
    fontStyle: 'bold',
  }).setOrigin(0.5).setDepth(100).setScale(0);

  scene.tweens.add({
    targets: txt,
    scale: 1.5,
    duration: 300,
    ease: 'Back.easeOut',
    yoyo: true,
    hold: 400,
    onComplete: () => {
      scene.tweens.add({
        targets: txt,
        alpha: 0,
        y: 150,
        duration: 300,
        onComplete: () => txt.destroy(),
      });
    },
  });
}
