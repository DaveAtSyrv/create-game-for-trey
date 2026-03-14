import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config.ts';
import { STAGES } from '../data/stages.ts';
import { confetti } from '../effects/ParticleEffects.ts';
import { completeStage } from '../utils/storage.ts';
import type { MusicEngine } from '../audio/MusicEngine.ts';

interface StageResult {
  stageIndex: number;
  stageId: string;
  score: number;
  stars: number;
  maxStreak: number;
  totalWrong: number;
}

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VictoryScene' });
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLORS.background);

    const result: StageResult = this.registry.get('stageResult') || {
      stageIndex: 0,
      stageId: 'concert-hall',
      score: 0,
      stars: 1,
      maxStreak: 0,
      totalWrong: 0,
    };

    // Save progress
    completeStage(result.stageIndex, result.score, result.stars, result.stageId);

    // Victory music
    const music: MusicEngine = this.registry.get('musicEngine');
    if (music) music.play('victory');

    // Confetti burst
    confetti(this, GAME_WIDTH / 2, -20, ['particle-pink', 'particle-gold', 'particle-cyan', 'particle-purple']);

    // Victory title
    const title = this.add.text(GAME_WIDTH / 2, 100, 'DEMONS SEALED!', {
      fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
      fontSize: '56px',
      color: '#FFD700',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 5,
    }).setOrigin(0.5).setScale(0);

    this.tweens.add({
      targets: title,
      scaleX: 1,
      scaleY: 1,
      duration: 500,
      ease: 'Back.easeOut',
    });

    // Stage name
    const stage = STAGES[result.stageIndex];
    this.add.text(GAME_WIDTH / 2, 160, stage?.name || 'Stage', {
      fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
      fontSize: '28px',
      color: '#00E5FF',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Stars
    const starY = 230;
    for (let i = 0; i < 3; i++) {
      const earned = i < result.stars;
      const star = this.add.text(
        GAME_WIDTH / 2 - 60 + i * 60,
        starY,
        earned ? '⭐' : '☆',
        { fontSize: '48px' }
      ).setOrigin(0.5).setScale(0);

      this.tweens.add({
        targets: star,
        scaleX: 1,
        scaleY: 1,
        duration: 400,
        delay: 600 + i * 200,
        ease: 'Back.easeOut',
        onComplete: () => {
          if (earned) {
            this.tweens.add({
              targets: star,
              scaleX: 1.2,
              scaleY: 1.2,
              duration: 300,
              yoyo: true,
              ease: 'Sine.easeInOut',
            });
          }
        },
      });
    }

    // Stats
    const statsY = 320;
    const stats = [
      { label: 'Score', value: String(result.score), color: '#FFD700' },
      { label: 'Best Streak', value: `${result.maxStreak}x`, color: '#FF6B9D' },
      { label: 'Mistakes', value: String(result.totalWrong), color: result.totalWrong === 0 ? '#4CFF50' : '#ffffff' },
    ];

    stats.forEach((stat, i) => {
      const y = statsY + i * 45;
      this.add.text(GAME_WIDTH / 2 - 80, y, stat.label, {
        fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
        fontSize: '24px',
        color: '#aaaaaa',
      }).setOrigin(1, 0.5);

      const val = this.add.text(GAME_WIDTH / 2 + 80, y, stat.value, {
        fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
        fontSize: '28px',
        color: stat.color,
        fontStyle: 'bold',
      }).setOrigin(0, 0.5).setScale(0);

      this.tweens.add({
        targets: val,
        scaleX: 1,
        scaleY: 1,
        duration: 300,
        delay: 1200 + i * 150,
        ease: 'Back.easeOut',
      });
    });

    // Auto-advance button
    const btnY = 520;
    const nextStageIndex = result.stageIndex + 1;
    const allComplete = nextStageIndex >= STAGES.length;

    if (allComplete) {
      // All stages beaten — big celebration!
      this.add.text(GAME_WIDTH / 2, 470, 'ALL DEMONS SEALED!', {
        fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
        fontSize: '32px',
        color: '#FFD700',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 3,
      }).setOrigin(0.5);

      this.createButton(GAME_WIDTH / 2, btnY, 'Play Again!', COLORS.primary, () => {
        this.registry.set('currentStage', 0);
        this.cameras.main.fadeOut(300);
        this.time.delayedCall(300, () => this.scene.start('BattleScene'));
      });
    } else {
      this.createButton(GAME_WIDTH / 2, btnY, 'Next Stage!', COLORS.primary, () => {
        this.registry.set('currentStage', nextStageIndex);
        this.cameras.main.fadeOut(300);
        this.time.delayedCall(300, () => this.scene.start('BattleScene'));
      });
    }

    this.cameras.main.fadeIn(400);
  }

  private createButton(x: number, y: number, label: string, color: number, onClick: () => void): void {
    const container = this.add.container(x, y);

    const bg = this.add.graphics();
    bg.fillStyle(color, 1);
    bg.fillRoundedRect(-90, -30, 180, 60, 16);
    bg.lineStyle(2, COLORS.white, 0.4);
    bg.strokeRoundedRect(-90, -30, 180, 60, 16);

    const txt = this.add.text(0, 0, label, {
      fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const hitArea = this.add.rectangle(0, 0, 180, 60, 0xffffff, 0)
      .setInteractive({ useHandCursor: true });

    container.add([bg, txt, hitArea]);

    hitArea.on('pointerover', () => {
      this.tweens.add({ targets: container, scaleX: 1.08, scaleY: 1.08, duration: 100 });
    });
    hitArea.on('pointerout', () => {
      this.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 100 });
    });
    hitArea.on('pointerdown', () => {
      this.tweens.add({
        targets: container,
        scaleX: 0.9,
        scaleY: 0.9,
        duration: 80,
        yoyo: true,
        onComplete: onClick,
      });
    });

    // Entrance
    container.setScale(0);
    this.tweens.add({
      targets: container,
      scaleX: 1,
      scaleY: 1,
      duration: 400,
      delay: 1800,
      ease: 'Back.easeOut',
    });
  }
}
