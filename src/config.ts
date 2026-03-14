export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 640;

export const COLORS = {
  background: 0x1a0a2e,
  primary: 0xff6b9d,
  secondary: 0xc44dff,
  accent: 0x00e5ff,
  gold: 0xffd700,
  white: 0xffffff,
  dark: 0x2d1b4e,
  success: 0x4cff50,
  danger: 0xff4444,
  buttonBg: 0x6c3ce0,
  buttonHover: 0x8b5cf6,
  healthGreen: 0x4cff50,
  healthRed: 0xff4444,
};

export const FONTS = {
  title: 'Bubblegum Sans, Comic Sans MS, cursive',
  body: 'Bubblegum Sans, Comic Sans MS, cursive',
};

export const DIFFICULTY = {
  easy: { minNum: 1, maxNum: 5, choices: 3 },
  medium: { minNum: 1, maxNum: 10, choices: 3 },
  hard: { minNum: 1, maxNum: 20, choices: 4 },
} as const;

export const COMBO_THRESHOLDS = {
  combo: 3,
  superCombo: 5,
  megaCombo: 10,
} as const;

export const STAGE_DEMONS = 5;
export const HINT_AFTER_WRONG = 3;
export const RUMI_MAX_HEARTS = 5;
