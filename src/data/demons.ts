export interface DemonData {
  id: string;
  name: string;
  color: number;
  hp: number;
  size: number; // scale multiplier
}

export const DEMON_TYPES: DemonData[] = [
  { id: 'imp', name: 'Imp', color: 0x88cc44, hp: 1, size: 0.8 },
  { id: 'goblin', name: 'Goblin', color: 0xcc8844, hp: 2, size: 1.0 },
  { id: 'ogre', name: 'Ogre', color: 0xcc4488, hp: 3, size: 1.3 },
  { id: 'boss', name: 'Shadow King', color: 0x8844cc, hp: 4, size: 1.6 },
];
