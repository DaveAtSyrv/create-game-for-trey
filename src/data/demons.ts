export interface DemonData {
  id: string;
  name: string;
  color: number;
  hp: number;
  size: number; // scale multiplier
  isSajaBoy?: boolean;
}

export const DEMON_TYPES: DemonData[] = [
  { id: 'baby', name: 'Baby', color: 0x7b68ee, hp: 1, size: 0.85, isSajaBoy: true },
  { id: 'romance', name: 'Romance', color: 0x8a6bbf, hp: 2, size: 1.0, isSajaBoy: true },
  { id: 'mystery', name: 'Mystery', color: 0x6a5acd, hp: 2, size: 1.0, isSajaBoy: true },
  { id: 'abby', name: 'Abby', color: 0x9370db, hp: 3, size: 1.1, isSajaBoy: true },
  { id: 'jinu', name: 'Jinu', color: 0x5b3daa, hp: 3, size: 1.2, isSajaBoy: true },
  { id: 'gwi-ma', name: 'Gwi-Ma', color: 0x8b00ff, hp: 5, size: 1.7 },
];
