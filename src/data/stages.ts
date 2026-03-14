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
    id: 'concert-hall',
    name: 'Concert Hall',
    bgColor: 0x1a0a3e,
    bgAccent: 0xff6b9d,
    difficulty: 'easy',
    demonIds: ['imp', 'imp', 'imp', 'goblin', 'goblin'],
  },
  {
    id: 'haunted-school',
    name: 'Haunted School',
    bgColor: 0x0a1a2e,
    bgAccent: 0x00e5ff,
    difficulty: 'easy',
    demonIds: ['imp', 'goblin', 'goblin', 'goblin', 'ogre'],
  },
  {
    id: 'neon-city',
    name: 'Neon City',
    bgColor: 0x1a0a2e,
    bgAccent: 0xc44dff,
    difficulty: 'medium',
    demonIds: ['goblin', 'goblin', 'ogre', 'ogre', 'boss'],
  },
];
