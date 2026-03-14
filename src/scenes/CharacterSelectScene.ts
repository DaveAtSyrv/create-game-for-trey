import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config.ts';
import { HEROES } from '../data/heroes.ts';
import type { MusicEngine } from '../audio/MusicEngine.ts';

export class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CharacterSelectScene' });
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLORS.background);

    // Music
    const music: MusicEngine = this.registry.get('musicEngine');
    if (music) music.play('select');

    // Title
    this.add.text(GAME_WIDTH / 2, 40, 'Choose Your HUNTR/X Member!', {
      fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
      fontSize: '42px',
      color: '#FFD700',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    // Character cards
    const cardWidth = 220;
    const gap = 30;
    const totalWidth = HEROES.length * cardWidth + (HEROES.length - 1) * gap;
    const startX = (GAME_WIDTH - totalWidth) / 2 + cardWidth / 2;

    HEROES.forEach((hero, i) => {
      const x = startX + i * (cardWidth + gap);
      const y = 310;
      const card = this.add.container(x, y);

      // Card background with character accent color border
      const bg = this.add.graphics();
      bg.fillStyle(COLORS.dark, 0.8);
      bg.fillRoundedRect(-cardWidth / 2, -140, cardWidth, 320, 16);
      bg.lineStyle(3, hero.color === 0x2d2d2d ? hero.accentColor : hero.color, 0.8);
      bg.strokeRoundedRect(-cardWidth / 2, -140, cardWidth, 320, 16);

      // Character preview
      const charGfx = this.add.graphics();
      this.drawMiniCharacter(charGfx, hero);
      charGfx.setPosition(0, -20);

      // Name
      const nameText = this.add.text(0, 80, hero.name, {
        fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
        fontSize: '34px',
        color: '#ffffff',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      // Weapon info
      const weaponNames: Record<string, string> = {
        sword: 'Saingeom (Sword)',
        polearm: 'Gokdo (Polearm)',
        knives: 'Shinkal (Knives)',
      };
      const weaponText = this.add.text(0, 112, weaponNames[hero.weapon] || hero.weapon, {
        fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
        fontSize: '15px',
        color: '#aaaadd',
      }).setOrigin(0.5);

      // Attack name
      const attackText = this.add.text(0, 136, hero.attackName, {
        fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
        fontSize: '14px',
        color: '#888888',
      }).setOrigin(0.5);

      card.add([bg, charGfx, nameText, weaponText, attackText]);

      // Interactive
      const hitArea = this.add.rectangle(0, 20, cardWidth, 320, 0xffffff, 0)
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

  private drawMiniCharacter(g: Phaser.GameObjects.Graphics, hero: typeof HEROES[0]): void {
    // Outfit — scale down version of main character
    const outfitColor = hero.id === 'zoey' ? 0xffd700 : hero.color;
    g.fillStyle(outfitColor, 1);
    g.fillRoundedRect(-18, -15, 36, 50, 8);
    // Belt accent
    g.fillStyle(hero.accentColor, 1);
    g.fillRect(-16, 8, 32, 5);

    // Head — fair skin
    g.fillStyle(0xfce4c8, 1);
    g.fillCircle(0, -32, 20);

    // Hair
    switch (hero.hairStyle) {
      case 'braid':
        g.fillStyle(0x9b59b6, 1);
        g.fillEllipse(0, -45, 28, 14);
        g.fillRoundedRect(-16, -50, 32, 18, 9);
        g.fillStyle(0x8e44ad, 1);
        g.fillRoundedRect(-3, -38, 6, 65, 3);
        break;
      case 'pigtails':
        g.fillStyle(0xff1493, 1);
        g.fillEllipse(0, -45, 30, 14);
        g.fillRoundedRect(-18, -50, 36, 18, 9);
        g.fillRoundedRect(-28, -40, 9, 60, 4);
        g.fillRoundedRect(19, -40, 9, 60, 4);
        break;
      case 'spacebuns':
        g.fillStyle(0x1a1a1a, 1);
        g.fillRoundedRect(-16, -48, 32, 16, 9);
        g.fillCircle(-18, -46, 9);
        g.fillCircle(18, -46, 9);
        g.fillRoundedRect(-20, -40, 4, 16, 2);
        g.fillRoundedRect(16, -40, 4, 16, 2);
        break;
    }

    // Eyes
    g.fillStyle(0xffffff, 1);
    g.fillEllipse(-7, -34, 9, 10);
    g.fillEllipse(7, -34, 9, 10);
    g.fillStyle(0x222222, 1);
    g.fillCircle(-6, -33, 3);
    g.fillCircle(8, -33, 3);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(-5, -35, 1.5);
    g.fillCircle(9, -35, 1.5);

    // Smile
    g.lineStyle(1.5, 0x222222, 1);
    g.beginPath();
    g.arc(0, -27, 5, 0.2, Math.PI - 0.2, false);
    g.strokePath();
  }
}
