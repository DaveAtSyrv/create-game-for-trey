import Phaser from 'phaser';

/** Create a simple circle texture for particles */
export function createParticleTexture(scene: Phaser.Scene, key: string, color: number, radius = 6): void {
  if (scene.textures.exists(key)) return;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  g.fillStyle(color, 1);
  g.fillCircle(radius, radius, radius);
  g.generateTexture(key, radius * 2, radius * 2);
  g.destroy();
}

export function createStarTexture(scene: Phaser.Scene, key: string, color: number, size = 12): void {
  if (scene.textures.exists(key)) return;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  g.fillStyle(color, 1);
  // Draw a 5-point star
  const cx = size, cy = size;
  const outerR = size;
  const innerR = size * 0.4;
  g.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI * 2 * i) / 10 - Math.PI / 2;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) g.moveTo(x, y);
    else g.lineTo(x, y);
  }
  g.closePath();
  g.fillPath();
  g.generateTexture(key, size * 2, size * 2);
  g.destroy();
}

export function burstAt(scene: Phaser.Scene, x: number, y: number, textureKey: string, count = 30): Phaser.GameObjects.Particles.ParticleEmitter {
  const emitter = scene.add.particles(x, y, textureKey, {
    speed: { min: 100, max: 300 },
    angle: { min: 0, max: 360 },
    scale: { start: 1, end: 0 },
    alpha: { start: 1, end: 0 },
    lifespan: 800,
    gravityY: 200,
    quantity: count,
    emitting: false,
  });
  emitter.explode(count);
  scene.time.delayedCall(1200, () => emitter.destroy());
  return emitter;
}

export function sparkleTrail(scene: Phaser.Scene, fromX: number, fromY: number, toX: number, toY: number, textureKey: string): void {
  const steps = 15;
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const x = fromX + (toX - fromX) * t;
    const y = fromY + (toY - fromY) * t - Math.sin(t * Math.PI) * 60;
    scene.time.delayedCall(i * 30, () => {
      const emitter = scene.add.particles(x, y, textureKey, {
        speed: { min: 20, max: 60 },
        scale: { start: 0.8, end: 0 },
        alpha: { start: 1, end: 0 },
        lifespan: 400,
        quantity: 3,
        emitting: false,
      });
      emitter.explode(3);
      scene.time.delayedCall(600, () => emitter.destroy());
    });
  }
}

export function confetti(scene: Phaser.Scene, x: number, y: number, keys: string[]): void {
  keys.forEach((key) => {
    const emitter = scene.add.particles(x, y, key, {
      speed: { min: 150, max: 400 },
      angle: { min: 220, max: 320 },
      scale: { start: 1, end: 0.3 },
      alpha: { start: 1, end: 0 },
      lifespan: 2000,
      gravityY: 300,
      quantity: 20,
      emitting: false,
    });
    emitter.setDepth(100);
    emitter.explode(20);
    scene.time.delayedCall(2500, () => emitter.destroy());
  });
}
