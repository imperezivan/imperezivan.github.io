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
      sessions: parsed.sessions.map(it => {
        it.date = it.date.replace('00:00:00','07:00:00')
        return it;
      }) ?? [],
    };
  } catch {
    return EMPTY;
  }
}

export function saveData(data: AppData): void {
  data.sessions  = data.sessions.map(s => ({ ...s, date: s.date.replace('T00:00:00','T07:00:00') }));
  localStorage.setItem(KEY, JSON.stringify(data));
}
