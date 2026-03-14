import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS, HINT_AFTER_WRONG } from '../config.ts';
import { HEROES } from '../data/heroes.ts';
import { DEMON_TYPES } from '../data/demons.ts';
import { STAGES } from '../data/stages.ts';
import { Hero } from '../entities/Hero.ts';
import { Demon } from '../entities/Demon.ts';
import { AnswerButtons } from '../ui/AnswerButtons.ts';
import { ProblemDisplay } from '../ui/ProblemDisplay.ts';
import { ComboMeter } from '../ui/ComboMeter.ts';
import { generateProblem } from '../math/ProblemGenerator.ts';
import { playAttackSequence, playDodgeAnimation, playDefeatAnimation } from '../effects/AttackAnimations.ts';
import { checkAndPlayCombo } from '../effects/ComboEffects.ts';
import { floatingText } from '../effects/ScreenEffects.ts';
import { AudioManager } from '../audio/AudioManager.ts';
import type { MathProblem } from '../math/types.ts';
import type { HeroData } from '../data/heroes.ts';
import type { StageData } from '../data/stages.ts';

export class BattleScene extends Phaser.Scene {
  private hero!: Hero;
  private demon!: Demon;
  private answerButtons!: AnswerButtons;
  private problemDisplay!: ProblemDisplay;
  private comboMeter!: ComboMeter;
  private audioManager!: AudioManager;

  private stageData!: StageData;
  private heroData!: HeroData;
  private currentDemonIndex = 0;
  private score = 0;
  private streak = 0;
  private maxStreak = 0;
  private wrongCount = 0;
  private totalWrong = 0;
  private currentProblem!: MathProblem;
  private isAnimating = false;

  private particleKeys = ['particle-pink', 'particle-cyan', 'particle-purple', 'particle-gold'];

  constructor() {
    super({ key: 'BattleScene' });
  }

  create(): void {
    // Get selections from registry
    const heroId = this.registry.get('selectedHero') || 'star';
    const stageIndex = this.registry.get('currentStage') || 0;

    this.heroData = HEROES.find((h) => h.id === heroId) || HEROES[0];
    this.stageData = STAGES[stageIndex] || STAGES[0];

    // Reset state
    this.currentDemonIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.wrongCount = 0;
    this.totalWrong = 0;
    this.isAnimating = false;

    // Setup
    this.cameras.main.setBackgroundColor(this.stageData.bgColor);
    this.setupAudio();
    this.drawBackground();
    this.setupUI();
    this.spawnHero();
    this.spawnNextDemon();

    this.cameras.main.fadeIn(400);
  }

  private setupAudio(): void {
    if (!this.registry.get('audioManager')) {
      this.registry.set('audioManager', new AudioManager(this));
    }
    this.audioManager = this.registry.get('audioManager');
  }

  private drawBackground(): void {
    // Stage background with gradient effect
    const bg = this.add.graphics();

    // Base gradient
    bg.fillStyle(this.stageData.bgColor, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Ground
    bg.fillStyle(0x000000, 0.3);
    bg.fillRect(0, GAME_HEIGHT - 120, GAME_WIDTH, 120);

    // Stage accent glow
    bg.fillStyle(this.stageData.bgAccent, 0.05);
    bg.fillCircle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 300);

    // Ambient sparkles
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * GAME_WIDTH;
      const y = Math.random() * (GAME_HEIGHT - 150);
      const star = this.add.text(x, y, '✦', {
        fontSize: `${8 + Math.random() * 8}px`,
        color: '#ffffff',
      }).setAlpha(0.2 + Math.random() * 0.3);

      this.tweens.add({
        targets: star,
        alpha: 0.1,
        duration: 1000 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    // Stage name
    const stageName = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 20, this.stageData.name, {
      fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
      fontSize: '18px',
      color: '#666666',
    }).setOrigin(0.5).setDepth(1);

    // Demon counter
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 45, `Demons: ${this.stageData.demonIds.length}`, {
      fontFamily: 'Bubblegum Sans, Comic Sans MS, cursive',
      fontSize: '16px',
      color: '#888888',
    }).setOrigin(0.5).setDepth(1);
  }

  private setupUI(): void {
    this.answerButtons = new AnswerButtons(this);
    this.problemDisplay = new ProblemDisplay(this);
    this.comboMeter = new ComboMeter(this);
  }

  private spawnHero(): void {
    this.hero = new Hero(this, 180, 380, this.heroData);
    this.hero.setDepth(10);
  }

  private spawnNextDemon(): void {
    if (this.currentDemonIndex >= this.stageData.demonIds.length) {
      this.stageComplete();
      return;
    }

    const demonId = this.stageData.demonIds[this.currentDemonIndex];
    const demonData = DEMON_TYPES.find((d) => d.id === demonId) || DEMON_TYPES[0];

    // Demon entrance from right
    this.demon = new Demon(this, GAME_WIDTH + 100, 380, demonData);
    this.demon.setDepth(10);

    // Slide in
    this.tweens.add({
      targets: this.demon.container,
      x: 700,
      duration: 600,
      ease: 'Power2',
      onComplete: () => {
        this.demon.healthBar.setPosition(660, 380 - 90 * demonData.size);
        this.wrongCount = 0;
        this.presentProblem();
      },
    });

    // Update counter text
    const counterText = `${this.currentDemonIndex + 1}/${this.stageData.demonIds.length}`;
    floatingText(this, GAME_WIDTH / 2, 50, counterText, '#888888', 20);
  }

  private presentProblem(): void {
    if (this.isAnimating) return;

    this.currentProblem = generateProblem(this.stageData.difficulty);
    this.problemDisplay.show(this.currentProblem);
    this.answerButtons.show({
      choices: this.currentProblem.choices,
      correctAnswer: this.currentProblem.correctAnswer,
      onCorrect: () => this.onCorrectAnswer(),
      onWrong: () => this.onWrongAnswer(),
    });
  }

  private onCorrectAnswer(): void {
    if (this.isAnimating) return;
    this.isAnimating = true;

    // Update state
    this.streak++;
    if (this.streak > this.maxStreak) this.maxStreak = this.streak;
    const points = 100 + this.streak * 25;
    this.score += points;

    // Audio
    this.audioManager.correct(this.streak);

    // Update UI
    this.comboMeter.update(this.streak, this.score);
    this.comboMeter.animateScore(this, points);

    // Check combo
    checkAndPlayCombo(this, this.streak, this.particleKeys);
    if (this.streak === 3) this.audioManager.combo();
    if (this.streak === 5) this.audioManager.superCombo();
    if (this.streak === 10) this.audioManager.superCombo();

    // Clear buttons
    this.answerButtons.clear();

    // Pick random particle key based on hero color
    const particleKey = this.particleKeys[Math.floor(Math.random() * this.particleKeys.length)];

    // Attack animation
    this.audioManager.attack();
    playAttackSequence(this, this.hero.container, this.demon.container, particleKey, () => {
      // Damage demon
      this.demon.takeDamage();

      if (this.demon.isDefeated()) {
        this.audioManager.defeated();
        playDefeatAnimation(this, this.demon.container, particleKey, () => {
          this.demon.destroy();
          this.currentDemonIndex++;
          this.isAnimating = false;

          // Pause before next demon
          this.time.delayedCall(800, () => {
            this.spawnNextDemon();
          });
        });
      } else {
        this.isAnimating = false;
        this.time.delayedCall(600, () => {
          this.wrongCount = 0;
          this.presentProblem();
        });
      }
    });
  }

  private onWrongAnswer(): void {
    this.streak = 0;
    this.wrongCount++;
    this.totalWrong++;
    this.comboMeter.update(0, this.score);

    // Audio
    this.audioManager.wrong();

    // Demon dodge
    playDodgeAnimation(this, this.demon.container, () => {
      floatingText(this, GAME_WIDTH / 2, 420, 'Try again!', '#FF9900', 28);
    });

    // Hint after HINT_AFTER_WRONG wrong answers
    if (this.wrongCount >= HINT_AFTER_WRONG) {
      this.time.delayedCall(500, () => {
        this.answerButtons.highlightCorrect(this.currentProblem.correctAnswer);
      });
    }
  }

  private stageComplete(): void {
    // Calculate stars
    let stars = 1; // completed
    if (this.totalWrong === 0) stars = 3; // perfect
    else if (this.totalWrong <= 2) stars = 2; // great

    this.audioManager.stageComplete();

    // Store results in registry
    this.registry.set('stageResult', {
      stageIndex: this.registry.get('currentStage') || 0,
      stageId: this.stageData.id,
      score: this.score,
      stars,
      maxStreak: this.maxStreak,
      totalWrong: this.totalWrong,
    });

    this.time.delayedCall(500, () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => {
        this.scene.start('VictoryScene');
      });
    });
  }

  shutdown(): void {
    this.answerButtons?.destroy();
    this.problemDisplay?.destroy();
    this.comboMeter?.destroy();
    this.hero?.destroy();
    this.demon?.destroy();
  }
}
