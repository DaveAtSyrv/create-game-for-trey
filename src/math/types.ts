export type MathType = 'counting' | 'addition' | 'subtraction' | 'comparison';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface MathProblem {
  question: string;
  correctAnswer: number;
  choices: number[];
  type: MathType;
  /** For counting problems, the number of objects to display */
  countObjects?: number;
  /** For comparison, the two numbers being compared */
  compareNums?: [number, number];
  /** For addition/subtraction, the operands */
  operands?: [number, number];
}
