export interface Exercise {
  id: string;
  name: string;
  muscleGroup?: string;
}

export interface SetRecord {
  reps: number;
}

export interface SessionExercise {
  exerciseId: string;
  sets: SetRecord[];
}

export interface WorkoutSession {
  id: string;
  date: string; // ISO 8601
  minutes: number;
  calories: number;
  exercises: SessionExercise[];
}

export interface AppData {
  exercises: Exercise[];
  sessions: WorkoutSession[];
}
