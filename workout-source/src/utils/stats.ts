import { startOfWeek, format, subWeeks } from 'date-fns';
import type { AppData, WorkoutSession } from '../types';

export interface WeeklyCardio {
  week: string;
  minutes: number;
  calories: number;
}

export interface WeeklyVolume {
  week: string;
  exerciseName: string;
  sets: number;
  avgReps: number;
}

function weekLabel(date: Date): string {
  return format(startOfWeek(date, { weekStartsOn: 1 }), 'MMM d');
}

function sessionsInRange(sessions: WorkoutSession[], weeks: number): WorkoutSession[] {
  const cutoff = subWeeks(new Date(), weeks);
  return sessions.filter((s) => new Date(s.date) >= cutoff);
}

export function getCardioByWeek(data: AppData, weeks: number): WeeklyCardio[] {
  const map = new Map<string, WeeklyCardio>();
  for (const s of sessionsInRange(data.sessions, weeks)) {
    const label = weekLabel(new Date(s.date));
    const existing = map.get(label) ?? { week: label, minutes: 0, calories: 0 };
    existing.minutes += s.minutes;
    existing.calories += s.calories;
    map.set(label, existing);
  }
  return Array.from(map.values()).sort((a, b) => a.week.localeCompare(b.week));
}

export function getVolumeByWeek(data: AppData, weeks: number): WeeklyVolume[] {
  const exerciseMap = new Map(data.exercises.map((e) => [e.id, e.name]));
  type Acc = { sets: number; totalReps: number };
  const map = new Map<string, Acc>();

  for (const s of sessionsInRange(data.sessions, weeks)) {
    const label = weekLabel(new Date(s.date));
    for (const se of s.exercises) {
      const name = exerciseMap.get(se.exerciseId) ?? 'Unknown';
      const key = `${label}||${name}`;
      const existing = map.get(key) ?? { sets: 0, totalReps: 0 };
      existing.sets += se.sets.length;
      existing.totalReps += se.sets.reduce((acc, set) => acc + set.reps, 0);
      map.set(key, existing);
    }
  }

  return Array.from(map.entries()).map(([key, acc]) => {
    const [week, exerciseName] = key.split('||');
    return {
      week,
      exerciseName,
      sets: acc.sets,
      avgReps: acc.sets > 0 ? Math.round(acc.totalReps / acc.sets) : 0,
    };
  }).sort((a, b) => a.week.localeCompare(b.week));
}
