import type { MathProblem, MathType, DifficultyLevel } from './types.ts';
import { getDifficultyConfig } from './difficulty.ts';

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateWrongAnswers(correct: number, count: number, min: number, max: number): number[] {
  const wrongs = new Set<number>();
  // Try nearby values first
  const candidates = [correct - 2, correct - 1, correct + 1, correct + 2, correct + 3];
  for (const c of shuffle(candidates)) {
    if (c !== correct && c >= min && c <= max) wrongs.add(c);
    if (wrongs.size >= count) break;
  }
  // Fill remaining with random
  let attempts = 0;
  while (wrongs.size < count && attempts < 50) {
    const v = randInt(min, max);
    if (v !== correct) wrongs.add(v);
    attempts++;
  }
  return [...wrongs].slice(0, count);
}

function generateCounting(level: DifficultyLevel): MathProblem {
  const config = getDifficultyConfig(level);
  const count = randInt(config.minNum, config.maxNum);
  const wrongs = generateWrongAnswers(count, config.choices - 1, 1, Math.max(config.maxNum, count + 3));
  return {
    question: `How many stars?`,
    correctAnswer: count,
    choices: shuffle([count, ...wrongs]),
    type: 'counting',
    countObjects: count,
  };
}

function generateAddition(level: DifficultyLevel): MathProblem {
  const config = getDifficultyConfig(level);
  const a = randInt(config.minNum, Math.floor(config.maxNum / 2));
  const b = randInt(config.minNum, Math.floor(config.maxNum / 2));
  const answer = a + b;
  const wrongs = generateWrongAnswers(answer, config.choices - 1, 1, answer + 5);
  return {
    question: `${a} + ${b} = ?`,
    correctAnswer: answer,
    choices: shuffle([answer, ...wrongs]),
    type: 'addition',
    operands: [a, b],
  };
}

function generateSubtraction(level: DifficultyLevel): MathProblem {
  const config = getDifficultyConfig(level);
  const b = randInt(config.minNum, Math.floor(config.maxNum / 2));
  const a = randInt(b, config.maxNum);
  const answer = a - b;
  const wrongs = generateWrongAnswers(answer, config.choices - 1, 0, a);
  return {
    question: `${a} - ${b} = ?`,
    correctAnswer: answer,
    choices: shuffle([answer, ...wrongs]),
    type: 'subtraction',
    operands: [a, b],
  };
}

function generateComparison(level: DifficultyLevel): MathProblem {
  const config = getDifficultyConfig(level);
  let a = randInt(config.minNum, config.maxNum);
  let b = randInt(config.minNum, config.maxNum);
  while (a === b) b = randInt(config.minNum, config.maxNum);
  const answer = Math.max(a, b);
  const wrongs = [Math.min(a, b)];
  // Add one more distractor
  if (config.choices > 2) {
    const extra = generateWrongAnswers(answer, config.choices - 2, config.minNum, config.maxNum);
    wrongs.push(...extra);
  }
  return {
    question: `Which is bigger?`,
    correctAnswer: answer,
    choices: shuffle([answer, ...wrongs.slice(0, config.choices - 1)]),
    type: 'comparison',
    compareNums: [a, b],
  };
}

const GENERATORS: Record<MathType, (level: DifficultyLevel) => MathProblem> = {
  counting: generateCounting,
  addition: generateAddition,
  subtraction: generateSubtraction,
  comparison: generateComparison,
};

const MATH_TYPES: MathType[] = ['counting', 'addition', 'subtraction', 'comparison'];

export function generateProblem(level: DifficultyLevel, type?: MathType): MathProblem {
  const t = type ?? MATH_TYPES[Math.floor(Math.random() * MATH_TYPES.length)];
  return GENERATORS[t](level);
}
