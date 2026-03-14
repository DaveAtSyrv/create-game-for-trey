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
    demonIds: ['baby', 'mystery', 'romance', 'baby', 'mystery'],
  },
  {
    id: 'haunted-school',
    name: 'Haunted School',
    bgColor: 0x0a1a2e,
    bgAccent: 0x00e5ff,
    difficulty: 'easy',
    demonIds: ['romance', 'baby', 'abby', 'mystery', 'romance'],
  },
  {
    id: 'saja-hideout',
    name: 'Saja Boys Hideout',
    bgColor: 0x0a0a2e,
    bgAccent: 0x7b68ee,
    difficulty: 'medium',
    demonIds: ['mystery', 'abby', 'jinu', 'romance', 'mystery'],
  },
  {
    id: 'neon-seoul',
    name: 'Neon Seoul',
    bgColor: 0x120a2e,
    bgAccent: 0xff1493,
    difficulty: 'medium',
    demonIds: ['abby', 'jinu', 'mystery', 'abby', 'jinu'],
  },
  {
    id: 'demons-lair',
    name: "Demon's Lair",
    bgColor: 0x0a0a1e,
    bgAccent: 0x8b00ff,
    difficulty: 'hard',
    demonIds: ['jinu', 'abby', 'jinu', 'abby', 'jinu'],
  },
  {
    id: 'golden-honmoon',
    name: 'The Golden Honmoon',
    bgColor: 0x1a0a1e,
    bgAccent: 0xffd700,
    difficulty: 'hard',
    demonIds: ['abby', 'jinu', 'abby', 'jinu', 'gwi-ma'],
  },
];
