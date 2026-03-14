const STORAGE_KEY = 'kpop-demon-hunters-save';

export interface SaveData {
  stagesCompleted: number[];
  highScores: Record<string, number>;
  starsEarned: Record<string, number>;
}

function defaultSave(): SaveData {
  return { stagesCompleted: [], highScores: {}, starsEarned: {} };
}

export function loadProgress(): SaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSave();
    return { ...defaultSave(), ...JSON.parse(raw) };
  } catch {
    return defaultSave();
  }
}

export function saveProgress(data: SaveData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

export function completeStage(stageIndex: number, score: number, stars: number, stageId: string): void {
  const data = loadProgress();
  if (!data.stagesCompleted.includes(stageIndex)) {
    data.stagesCompleted.push(stageIndex);
  }
  if (!data.highScores[stageId] || score > data.highScores[stageId]) {
    data.highScores[stageId] = score;
  }
  if (!data.starsEarned[stageId] || stars > data.starsEarned[stageId]) {
    data.starsEarned[stageId] = stars;
  }
  saveProgress(data);
}
