import type { AppData } from '../types';

const KEY = 'workout_data';

const EMPTY: AppData = { exercises: [], sessions: [] };

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as AppData;
    return {
      exercises: parsed.exercises ?? [],
      sessions: parsed.sessions ?? [],
    };
  } catch {
    return EMPTY;
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(KEY, JSON.stringify(data));
}
