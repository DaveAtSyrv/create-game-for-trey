export interface HeroData {
  id: string;
  name: string;
  color: number;
  accentColor: number;
  attackName: string;
  weapon: string;
  hairStyle: 'braid' | 'pigtails' | 'spacebuns';
}

export const HEROES: HeroData[] = [
  {
    id: 'rumi',
    name: 'Rumi',
    color: 0x9b59b6,      // purple
    accentColor: 0xff6b9d, // pink demon marks
    attackName: 'Saingeom Strike',
    weapon: 'sword',
    hairStyle: 'braid',
  },
  {
    id: 'mira',
    name: 'Mira',
    color: 0xff1493,       // hot pink
    accentColor: 0xff69b4, // lighter pink
    attackName: 'Gokdo Sweep',
    weapon: 'polearm',
    hairStyle: 'pigtails',
  },
  {
    id: 'zoey',
    name: 'Zoey',
    color: 0x2d2d2d,       // black
    accentColor: 0xffd700, // gold
    attackName: 'Shinkal Barrage',
    weapon: 'knives',
    hairStyle: 'spacebuns',
  },
];
