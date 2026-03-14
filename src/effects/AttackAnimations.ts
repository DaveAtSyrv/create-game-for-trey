import Phaser from 'phaser';
import { burstAt, sparkleTrail } from './ParticleEffects.ts';
import { screenShake, screenFlash, floatingText } from './ScreenEffects.ts';

const HIT_WORDS = ['GA-JA!', 'DONE!', 'POW!', 'BOOM!'];

function randomHitWord(): string {
  return HIT_WORDS[Math.floor(Math.random() * HIT_WORDS.length)];
}

/** Rumi: Saingeom sword slash — quick lunge, wide arc slash effect */
function playSwordAttack(
  scene: Phaser.Scene,
  hero: Phaser.GameObjects.Container,
  demon: Phaser.GameObjects.Container,
  particleKey: string,
  onComplete: () => void
): void {
  const heroX = hero.x, heroY = hero.y;
  const demonX = demon.x, demonY = demon.y;

  // Wind up with rotation
  scene.tweens.add({
    targets: hero, scaleX: 1.15, scaleY: 1.15, angle: -15, duration: 180, ease: 'Power2',
    onComplete: () => {
      // Fast lunge
      scene.tweens.add({
        targets: hero, x: demonX - 60, angle: 10, duration: 120, ease: 'Power3',
        onComplete: () => {
          // Slash arc — draw a sweeping line of particles
          for (let a = -60; a <= 60; a += 15) {
            const rad = (a * Math.PI) / 180;
            const px = demonX + Math.cos(rad) * 50;
            const py = demonY + Math.sin(rad) * 50;
            scene.time.delayedCall((a + 60) * 2, () => burstAt(scene, px, py, particleKey, 5));
          }
          sparkleTrail(scene, hero.x, heroY, demonX, demonY, 'particle-purple');

          scene.time.delayedCall(150, () => {
            screenShake(scene, 180, 0.018);
            screenFlash(scene, 0x9b59b6, 120);
            burstAt(scene, demonX, demonY, particleKey, 45);
            floatingText(scene, demonX, demonY - 60, randomHitWord(), '#9B59B6', 48);
            demonKnockback(scene, demon, demonX);
            demonFlash(scene, demon);
          });

          scene.time.delayedCall(500, () => heroReturn(scene, hero, heroX, heroY, onComplete));
        },
      });
    },
  });
}

/** Mira: Gokdo polearm sweep — spinning approach, wide horizontal sweep */
function playPolearmAttack(
  scene: Phaser.Scene,
  hero: Phaser.GameObjects.Container,
  demon: Phaser.GameObjects.Container,
  particleKey: string,
  onComplete: () => void
): void {
  const heroX = hero.x, heroY = hero.y;
  const demonX = demon.x, demonY = demon.y;

  // Spinning approach
  scene.tweens.add({
    targets: hero, x: demonX - 70, angle: 360, scaleX: 1.2, scaleY: 1.2,
    duration: 350, ease: 'Power2',
    onComplete: () => {
      hero.setAngle(0);
      // Wide sweep — horizontal particle line
      for (let i = -40; i <= 40; i += 8) {
        scene.time.delayedCall((i + 40) * 3, () => {
          burstAt(scene, demonX + i, demonY + 10, 'particle-pink', 4);
        });
      }
      sparkleTrail(scene, hero.x, heroY - 20, demonX, demonY, particleKey);

      scene.time.delayedCall(200, () => {
        screenShake(scene, 200, 0.02);
        screenFlash(scene, 0xff1493, 130);
        burstAt(scene, demonX, demonY, particleKey, 50);
        floatingText(scene, demonX, demonY - 60, randomHitWord(), '#FF1493', 48);
        demonKnockback(scene, demon, demonX);
        demonFlash(scene, demon);
      });

      scene.time.delayedCall(550, () => heroReturn(scene, hero, heroX, heroY, onComplete));
    },
  });
}

/** Zoey: Shinkal throwing knives — stays back, launches 3 projectiles */
function playKnifeAttack(
  scene: Phaser.Scene,
  hero: Phaser.GameObjects.Container,
  demon: Phaser.GameObjects.Container,
  particleKey: string,
  onComplete: () => void
): void {
  const heroX = hero.x, heroY = hero.y;
  const demonX = demon.x, demonY = demon.y;

  // Quick step back then throw
  scene.tweens.add({
    targets: hero, x: heroX - 30, scaleX: 1.1, scaleY: 1.1, duration: 150, ease: 'Power2',
    onComplete: () => {
      // Three knife trails at different angles
      const offsets = [-30, 0, 30];
      offsets.forEach((offsetY, i) => {
        scene.time.delayedCall(i * 100, () => {
          sparkleTrail(scene, heroX, heroY + offsetY, demonX, demonY + offsetY * 0.5, 'particle-gold');
          // Small burst at launch point
          burstAt(scene, heroX + 40, heroY + offsetY, 'particle-gold', 5);
        });
      });

      // All three hit
      scene.time.delayedCall(450, () => {
        // Triple impact
        for (let i = 0; i < 3; i++) {
          scene.time.delayedCall(i * 60, () => {
            burstAt(scene, demonX + (i - 1) * 15, demonY + (i - 1) * 10, particleKey, 20);
            screenShake(scene, 80, 0.01);
          });
        }
        screenFlash(scene, 0xffd700, 100);
        floatingText(scene, demonX, demonY - 60, randomHitWord(), '#FFD700', 48);
        demonKnockback(scene, demon, demonX);
        demonFlash(scene, demon);
      });

      scene.time.delayedCall(700, () => heroReturn(scene, hero, heroX, heroY, onComplete));
    },
  });
}

/** Generic attack for unknown weapon types */
function playGenericAttack(
  scene: Phaser.Scene,
  hero: Phaser.GameObjects.Container,
  demon: Phaser.GameObjects.Container,
  particleKey: string,
  onComplete: () => void
): void {
  const heroX = hero.x, heroY = hero.y;
  const demonX = demon.x, demonY = demon.y;

  scene.tweens.add({
    targets: hero, scaleX: 1.2, scaleY: 1.2, x: heroX - 20, duration: 200, ease: 'Power2',
    onComplete: () => {
      scene.tweens.add({
        targets: hero, x: heroX + 80, duration: 150, ease: 'Power3',
        onComplete: () => {
          sparkleTrail(scene, heroX + 80, heroY, demonX, demonY, particleKey);
          scene.time.delayedCall(300, () => {
            screenShake(scene, 150, 0.015);
            screenFlash(scene, 0xffffff, 100);
            burstAt(scene, demonX, demonY, particleKey, 40);
            floatingText(scene, demonX, demonY - 60, randomHitWord(), '#FFD700', 48);
            demonKnockback(scene, demon, demonX);
            demonFlash(scene, demon);
          });
          scene.time.delayedCall(500, () => heroReturn(scene, hero, heroX, heroY, onComplete));
        },
      });
    },
  });
}

function demonKnockback(scene: Phaser.Scene, demon: Phaser.GameObjects.Container, origX: number): void {
  scene.tweens.add({
    targets: demon, x: origX + 30, scaleX: 0.8, scaleY: 1.2,
    duration: 100, yoyo: true, ease: 'Power2',
  });
}

function demonFlash(scene: Phaser.Scene, demon: Phaser.GameObjects.Container): void {
  const gfx = demon.getAt(0) as Phaser.GameObjects.Graphics;
  if (!gfx) return;
  scene.tweens.addCounter({
    from: 0, to: 3, duration: 300,
    onUpdate: (tween) => {
      const val = Math.floor(tween.getValue() ?? 0);
      gfx.setAlpha(val % 2 === 0 ? 1 : 0.3);
    },
    onComplete: () => gfx.setAlpha(1),
  });
}

function heroReturn(
  scene: Phaser.Scene, hero: Phaser.GameObjects.Container,
  origX: number, origY: number, onComplete: () => void
): void {
  scene.tweens.add({
    targets: hero, x: origX, scaleX: 1, scaleY: 1, angle: 0, duration: 300, ease: 'Power2',
    onComplete: () => {
      scene.tweens.add({
        targets: hero, y: origY - 20, duration: 150, yoyo: true, ease: 'Power2', onComplete,
      });
    },
  });
}

/** Main entry point — dispatches to character-specific attack */
export function playAttackSequence(
  scene: Phaser.Scene,
  heroContainer: Phaser.GameObjects.Container,
  demonContainer: Phaser.GameObjects.Container,
  particleKey: string,
  onComplete: () => void,
  weaponType?: string
): void {
  switch (weaponType) {
    case 'sword':
      playSwordAttack(scene, heroContainer, demonContainer, particleKey, onComplete);
      break;
    case 'polearm':
      playPolearmAttack(scene, heroContainer, demonContainer, particleKey, onComplete);
      break;
    case 'knives':
      playKnifeAttack(scene, heroContainer, demonContainer, particleKey, onComplete);
      break;
    default:
      playGenericAttack(scene, heroContainer, demonContainer, particleKey, onComplete);
  }
}

export function playDodgeAnimation(
  scene: Phaser.Scene,
  demonContainer: Phaser.GameObjects.Container,
  onComplete: () => void
): void {
  const origX = demonContainer.x;
  scene.tweens.add({
    targets: demonContainer, x: origX + 50, angle: 15, duration: 200, ease: 'Power2', yoyo: true,
    onComplete: () => { demonContainer.setAngle(0); onComplete(); },
  });
}

export function playDefeatAnimation(
  scene: Phaser.Scene,
  demonContainer: Phaser.GameObjects.Container,
  particleKey: string,
  onComplete: () => void
): void {
  burstAt(scene, demonContainer.x, demonContainer.y, particleKey, 60);
  screenShake(scene, 200, 0.02);
  scene.tweens.add({
    targets: demonContainer, scaleX: 0, scaleY: 0, angle: 720, alpha: 0,
    duration: 800, ease: 'Power3',
    onComplete: () => {
      floatingText(scene, demonContainer.x, demonContainer.y, 'SEALED!', '#FF6B9D', 56);
      onComplete();
    },
  });
}
