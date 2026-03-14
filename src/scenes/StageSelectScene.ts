import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config.ts';
import { STAGES } from '../data/stages.ts';
import { loadProgress } from '../utils/storage.ts';

export class StageSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StageSelectScene' });
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLORS.background);
    const save = loadProgress();

    // Title
    this.add.text(GAME_WIDTH / 2, 60, 'Choose Your Battle!', {
      fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
      fontSize: '48px',
      color: '#FFD700',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    const cardWidth = 220;
    const gap = 40;
    const totalWidth = STAGES.length * cardWidth + (STAGES.length - 1) * gap;
    const startX = (GAME_WIDTH - totalWidth) / 2 + cardWidth / 2;

    STAGES.forEach((stage, i) => {
      const x = startX + i * (cardWidth + gap);
      const y = 310;
      const card = this.add.container(x, y);

      // Only first stage and completed+1 are unlocked
      const unlocked = i === 0 || save.stagesCompleted.includes(i - 1);

      // Card background
      const bg = this.add.graphics();
      bg.fillStyle(stage.bgColor, unlocked ? 0.9 : 0.3);
      bg.fillRoundedRect(-cardWidth / 2, -120, cardWidth, 280, 16);
      bg.lineStyle(3, stage.bgAccent, unlocked ? 0.8 : 0.3);
      bg.strokeRoundedRect(-cardWidth / 2, -120, cardWidth, 280, 16);

      // Stage number
      const numText = this.add.text(0, -60, `Stage ${i + 1}`, {
        fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
        fontSize: '24px',
        color: unlocked ? '#ffffff' : '#666666',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      // Stage name
      const nameText = this.add.text(0, -20, stage.name, {
        fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
        fontSize: '28px',
        color: unlocked ? '#FFD700' : '#444444',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      // Difficulty indicator
      const diffText = this.add.text(0, 20, stage.difficulty.toUpperCase(), {
        fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
        fontSize: '18px',
        color: unlocked ? '#00E5FF' : '#444444',
      }).setOrigin(0.5);

      // Stars earned
      const stars = save.starsEarned[stage.id] || 0;
      const starDisplay = this.add.text(0, 60, '⭐'.repeat(stars) + '☆'.repeat(3 - stars), {
        fontSize: '28px',
      }).setOrigin(0.5);

      // Lock icon for locked stages
      const lockText = this.add.text(0, 100, unlocked ? '' : '🔒', {
        fontSize: '40px',
      }).setOrigin(0.5);

      card.add([bg, numText, nameText, diffText, starDisplay, lockText]);

      if (unlocked) {
        const hitArea = this.add.rectangle(0, 20, cardWidth, 280, 0xffffff, 0)
          .setInteractive({ useHandCursor: true });
        card.add(hitArea);

        hitArea.on('pointerover', () => {
          this.tweens.add({ targets: card, scaleX: 1.08, scaleY: 1.08, y: y - 10, duration: 150 });
        });
        hitArea.on('pointerout', () => {
          this.tweens.add({ targets: card, scaleX: 1, scaleY: 1, y, duration: 150 });
        });
        hitArea.on('pointerdown', () => {
          this.registry.set('currentStage', i);
          this.cameras.main.fadeOut(300, 0, 0, 0);
          this.time.delayedCall(300, () => {
            this.scene.start('BattleScene');
          });
        });
      }

      // Entrance animation
      card.setScale(0);
      this.tweens.add({
        targets: card,
        scaleX: 1,
        scaleY: 1,
        duration: 400,
        delay: i * 150,
        ease: 'Back.easeOut',
      });
    });

    // Back button
    const backBtn = this.add.text(50, GAME_HEIGHT - 40, '← Back', {
      fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
      fontSize: '24px',
      color: '#ffffff',
    }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });

    backBtn.on('pointerdown', () => {
      this.scene.start('CharacterSelectScene');
    });

    this.cameras.main.fadeIn(300);
  }
}
