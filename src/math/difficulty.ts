import type { DifficultyLevel } from './types.ts';

export interface DifficultyConfig {
  minNum: number;
  maxNum: number;
  choices: number;
}

const DIFFICULTY_MAP: Record<DifficultyLevel, DifficultyConfig> = {
  easy: { minNum: 1, maxNum: 5, choices: 3 },
  medium: { minNum: 1, maxNum: 10, choices: 3 },
  hard: { minNum: 1, maxNum: 20, choices: 4 },
};

export function getDifficultyConfig(level: DifficultyLevel): DifficultyConfig {
  return DIFFICULTY_MAP[level];
}

export function getDifficultyForStage(stageIndex: number): DifficultyLevel {
  if (stageIndex <= 1) return 'easy';
  if (stageIndex <= 3) return 'medium';
  return 'hard';
}
