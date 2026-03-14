import type { DifficultyLevel } from '../math/types.ts';

export interface StageData {
  id: string;
  name: string;
  bgColor: number;
  bgAccent: number;
  difficulty: DifficultyLevel;
  demonIds: string[];
}

export const STAGES: StageData[] = [
  {
    id: 'huntrx-concert',
    name: 'HUNTR/X Concert',
    bgColor: 0x1a0a3e,
    bgAccent: 0xff6b9d,
    difficulty: 'easy',
    demonIds: ['baby', 'mystery', 'romance', 'abby', 'baby'],
  },
  {
    id: 'saja-hideout',
    name: 'Saja Boys Hideout',
    bgColor: 0x0a0a2e,
    bgAccent: 0x7b68ee,
    difficulty: 'easy',
    demonIds: ['romance', 'jinu', 'mystery', 'abby', 'romance'],
  },
  {
    id: 'golden-honmoon',
    name: 'The Golden Honmoon',
    bgColor: 0x1a0a1e,
    bgAccent: 0xffd700,
    difficulty: 'medium',
    demonIds: ['mystery', 'abby', 'jinu', 'abby', 'gwi-ma'],
  },
];
