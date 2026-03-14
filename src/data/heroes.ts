export interface HeroData {
  id: string;
  name: string;
  color: number;
  accentColor: number;
  attackName: string;
}

export const HEROES: HeroData[] = [
  {
    id: 'star',
    name: 'Star',
    color: 0xff6b9d,
    accentColor: 0xffd700,
    attackName: 'Starlight Blast',
  },
  {
    id: 'flash',
    name: 'Flash',
    color: 0x00e5ff,
    accentColor: 0x6c3ce0,
    attackName: 'Thunder Beat',
  },
  {
    id: 'beat',
    name: 'Beat',
    color: 0xc44dff,
    accentColor: 0xff6b9d,
    attackName: 'Sonic Wave',
  },
];
