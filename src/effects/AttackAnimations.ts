import Phaser from 'phaser';
import { burstAt, sparkleTrail } from './ParticleEffects.ts';
import { screenShake, screenFlash, floatingText } from './ScreenEffects.ts';

export function playAttackSequence(
  scene: Phaser.Scene,
  heroContainer: Phaser.GameObjects.Container,
  demonContainer: Phaser.GameObjects.Container,
  particleKey: string,
  onComplete: () => void
): void {
  const heroX = heroContainer.x;
  const heroY = heroContainer.y;
  const demonX = demonContainer.x;
  const demonY = demonContainer.y;

  // 1. Hero winds up
  scene.tweens.add({
    targets: heroContainer,
    scaleX: 1.2,
    scaleY: 1.2,
    x: heroX - 20,
    duration: 200,
    ease: 'Power2',
    onComplete: () => {
      // 2. Hero lunges forward
      scene.tweens.add({
        targets: heroContainer,
        x: heroX + 80,
        duration: 150,
        ease: 'Power3',
        onComplete: () => {
          // 3. Sparkle trail from hero to demon
          sparkleTrail(scene, heroX + 80, heroY, demonX, demonY, particleKey);

          // 4. Delay then impact
          scene.time.delayedCall(300, () => {
            // Impact effects
            screenShake(scene, 150, 0.015);
            screenFlash(scene, 0xffffff, 100);
            burstAt(scene, demonX, demonY, particleKey, 40);
            const hitWords = ['GA-JA!', 'DONE!', 'POW!', 'BOOM!'];
            const hitWord = hitWords[Math.floor(Math.random() * hitWords.length)];
            floatingText(scene, demonX, demonY - 60, hitWord, '#FFD700', 48);

            // Demon knockback
            scene.tweens.add({
              targets: demonContainer,
              x: demonX + 30,
              scaleX: 0.8,
              scaleY: 1.2,
              duration: 100,
              yoyo: true,
              ease: 'Power2',
            });

            // Demon flash red
            const demonGraphics = demonContainer.getAt(0) as Phaser.GameObjects.Graphics;
            if (demonGraphics) {
              scene.tweens.addCounter({
                from: 0,
                to: 3,
                duration: 300,
                onUpdate: (tween) => {
                  const val = Math.floor(tween.getValue() ?? 0);
                  demonGraphics.setAlpha(val % 2 === 0 ? 1 : 0.3);
                },
                onComplete: () => demonGraphics.setAlpha(1),
              });
            }
          });

          // 5. Hero returns
          scene.time.delayedCall(500, () => {
            scene.tweens.add({
              targets: heroContainer,
              x: heroX,
              scaleX: 1,
              scaleY: 1,
              duration: 300,
              ease: 'Power2',
              onComplete: () => {
                // Hero celebration bounce
                scene.tweens.add({
                  targets: heroContainer,
                  y: heroY - 20,
                  duration: 150,
                  yoyo: true,
                  ease: 'Power2',
                  onComplete,
                });
              },
            });
          });
        },
      });
    },
  });
}

export function playDodgeAnimation(
  scene: Phaser.Scene,
  demonContainer: Phaser.GameObjects.Container,
  onComplete: () => void
): void {
  const origX = demonContainer.x;

  scene.tweens.add({
    targets: demonContainer,
    x: origX + 50,
    angle: 15,
    duration: 200,
    ease: 'Power2',
    yoyo: true,
    onComplete: () => {
      demonContainer.setAngle(0);
      onComplete();
    },
  });
}

export function playDefeatAnimation(
  scene: Phaser.Scene,
  demonContainer: Phaser.GameObjects.Container,
  particleKey: string,
  onComplete: () => void
): void {
  // Big explosion
  burstAt(scene, demonContainer.x, demonContainer.y, particleKey, 60);
  screenShake(scene, 200, 0.02);

  // Demon spins and shrinks away
  scene.tweens.add({
    targets: demonContainer,
    scaleX: 0,
    scaleY: 0,
    angle: 720,
    alpha: 0,
    duration: 800,
    ease: 'Power3',
    onComplete: () => {
      floatingText(scene, demonContainer.x, demonContainer.y, 'SEALED!', '#FF6B9D', 56);
      onComplete();
    },
  });
}
