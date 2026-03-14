import Phaser from 'phaser';
import { comboText, screenFlash } from './ScreenEffects.ts';
import { burstAt, confetti } from './ParticleEffects.ts';
import { GAME_WIDTH, GAME_HEIGHT, COMBO_THRESHOLDS } from '../config.ts';

export function checkAndPlayCombo(
  scene: Phaser.Scene,
  streak: number,
  particleKeys: string[]
): void {
  if (streak === COMBO_THRESHOLDS.megaCombo) {
    playMegaCombo(scene, particleKeys);
  } else if (streak === COMBO_THRESHOLDS.superCombo) {
    playSuperCombo(scene, particleKeys);
  } else if (streak === COMBO_THRESHOLDS.combo) {
    playCombo(scene);
  }
}

function playCombo(scene: Phaser.Scene): void {
  comboText(scene, 'GA-JA! x3', '#FFD700');
  screenFlash(scene, 0xffd700, 100);
}

function playSuperCombo(scene: Phaser.Scene, particleKeys: string[]): void {
  comboText(scene, 'DONE DONE DONE! x5', '#FF6B9D');
  screenFlash(scene, 0xff6b9d, 200);

  // Burst particles from multiple points
  const key = particleKeys[0] || 'particle-gold';
  burstAt(scene, GAME_WIDTH * 0.25, GAME_HEIGHT * 0.5, key, 30);
  burstAt(scene, GAME_WIDTH * 0.75, GAME_HEIGHT * 0.5, key, 30);

  // Brief dramatic overlay
  const overlay = scene.add.rectangle(
    GAME_WIDTH / 2, GAME_HEIGHT / 2,
    GAME_WIDTH, GAME_HEIGHT,
    0x000000, 0
  ).setDepth(95);

  scene.tweens.add({
    targets: overlay,
    alpha: 0.4,
    duration: 200,
    yoyo: true,
    hold: 300,
    onComplete: () => overlay.destroy(),
  });
}

function playMegaCombo(scene: Phaser.Scene, particleKeys: string[]): void {
  comboText(scene, 'GOLDEN HONMOON! x10', '#FFD700');
  screenFlash(scene, 0xc44dff, 300);
  confetti(scene, GAME_WIDTH / 2, 0, particleKeys);

  // Rainbow flash sequence
  const colors = [0xff0000, 0xff8800, 0xffff00, 0x00ff00, 0x00ffff, 0xff00ff];
  colors.forEach((color, i) => {
    scene.time.delayedCall(i * 100, () => {
      screenFlash(scene, color, 80);
    });
  });
}
