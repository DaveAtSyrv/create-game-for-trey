import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config.ts';
import { HEROES } from '../data/heroes.ts';

export class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CharacterSelectScene' });
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLORS.background);

    // Title
    this.add.text(GAME_WIDTH / 2, 60, 'Choose Your Hero!', {
      fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
      fontSize: '48px',
      color: '#FFD700',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    // Character cards
    const cardWidth = 200;
    const gap = 40;
    const totalWidth = HEROES.length * cardWidth + (HEROES.length - 1) * gap;
    const startX = (GAME_WIDTH - totalWidth) / 2 + cardWidth / 2;

    HEROES.forEach((hero, i) => {
      const x = startX + i * (cardWidth + gap);
      const y = 300;
      const card = this.add.container(x, y);

      // Card background
      const bg = this.add.graphics();
      bg.fillStyle(COLORS.dark, 0.8);
      bg.fillRoundedRect(-cardWidth / 2, -120, cardWidth, 280, 16);
      bg.lineStyle(3, hero.color, 0.8);
      bg.strokeRoundedRect(-cardWidth / 2, -120, cardWidth, 280, 16);

      // Character preview (mini version)
      const charGfx = this.add.graphics();
      // Body
      charGfx.fillStyle(hero.color, 1);
      charGfx.fillRoundedRect(-20, -40, 40, 60, 8);
      // Head
      charGfx.fillCircle(0, -60, 22);
      // Eyes
      charGfx.fillStyle(0xffffff, 1);
      charGfx.fillCircle(-8, -64, 7);
      charGfx.fillCircle(8, -64, 7);
      charGfx.fillStyle(0x222222, 1);
      charGfx.fillCircle(-6, -63, 4);
      charGfx.fillCircle(10, -63, 4);
      // Hair
      charGfx.fillStyle(hero.accentColor, 1);
      charGfx.fillTriangle(-18, -72, -4, -92, 2, -68);
      charGfx.fillTriangle(-6, -76, 8, -95, 14, -70);
      charGfx.fillTriangle(4, -72, 18, -90, 20, -65);

      charGfx.setPosition(0, -10);

      // Name
      const nameText = this.add.text(0, 90, hero.name, {
        fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
        fontSize: '32px',
        color: '#ffffff',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      // Attack name
      const attackText = this.add.text(0, 120, hero.attackName, {
        fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
        fontSize: '16px',
        color: '#aaaaaa',
      }).setOrigin(0.5);

      card.add([bg, charGfx, nameText, attackText]);

      // Interactive
      const hitArea = this.add.rectangle(0, 20, cardWidth, 280, 0xffffff, 0)
        .setInteractive({ useHandCursor: true });
      card.add(hitArea);

      hitArea.on('pointerover', () => {
        this.tweens.add({
          targets: card,
          scaleX: 1.08,
          scaleY: 1.08,
          y: y - 10,
          duration: 150,
          ease: 'Power2',
        });
      });

      hitArea.on('pointerout', () => {
        this.tweens.add({
          targets: card,
          scaleX: 1,
          scaleY: 1,
          y,
          duration: 150,
          ease: 'Power2',
        });
      });

      hitArea.on('pointerdown', () => {
        this.registry.set('selectedHero', hero.id);

        // Selection flash
        this.tweens.add({
          targets: card,
          scaleX: 1.2,
          scaleY: 1.2,
          duration: 150,
          yoyo: true,
          onComplete: () => {
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
              this.scene.start('StageSelectScene');
            });
          },
        });
      });

      // Entrance animation
      card.setScale(0);
      card.setAlpha(0);
      this.tweens.add({
        targets: card,
        scaleX: 1,
        scaleY: 1,
        alpha: 1,
        duration: 400,
        delay: i * 150,
        ease: 'Back.easeOut',
      });

      // Idle hover
      this.tweens.add({
        targets: charGfx,
        y: charGfx.y - 5,
        duration: 700 + i * 100,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });

    this.cameras.main.fadeIn(300);
  }
}
