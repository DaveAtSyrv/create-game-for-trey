import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from './config.ts';
import { BootScene } from './scenes/BootScene.ts';
import { TitleScene } from './scenes/TitleScene.ts';
import { CharacterSelectScene } from './scenes/CharacterSelectScene.ts';
import { StageSelectScene } from './scenes/StageSelectScene.ts';
import { BattleScene } from './scenes/BattleScene.ts';
import { VictoryScene } from './scenes/VictoryScene.ts';
import { MusicEngine } from './audio/MusicEngine.ts';
import { AudioManager } from './audio/AudioManager.ts';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game-container',
  backgroundColor: COLORS.background,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    BootScene,
    TitleScene,
    CharacterSelectScene,
    StageSelectScene,
    BattleScene,
    VictoryScene,
  ],
  callbacks: {
    postBoot: (game) => {
      // Register shared audio systems
      game.registry.set('musicEngine', new MusicEngine());
      game.registry.set('audioManager', new AudioManager());
    },
  },
};

// Load Google Fonts
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);

// Wait for font to load, then start game
document.fonts.ready.then(() => {
  new Phaser.Game(config);
});
