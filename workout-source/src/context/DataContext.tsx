import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AppData, Exercise, WorkoutSession } from '../types';
import { loadData, saveData } from '../utils/storage';
import { generateId } from '../utils/uuid';

type Action =
  | { type: 'ADD_EXERCISE'; payload: Omit<Exercise, 'id'> }
  | { type: 'UPDATE_EXERCISE'; payload: Exercise }
  | { type: 'DELETE_EXERCISE'; payload: string }
  | { type: 'ADD_SESSION'; payload: Omit<WorkoutSession, 'id'> }
  | { type: 'UPDATE_SESSION'; payload: WorkoutSession }
  | { type: 'DELETE_SESSION'; payload: string }
  | { type: 'DUPLICATE_SESSION'; payload: WorkoutSession }
  | { type: 'REPLACE_ALL'; payload: AppData };

function reducer(state: AppData, action: Action): AppData {
  switch (action.type) {
    case 'ADD_EXERCISE':
      return { ...state, exercises: [...state.exercises, { ...action.payload, id: generateId() }] };
    case 'UPDATE_EXERCISE':
      return { ...state, exercises: state.exercises.map((e) => (e.id === action.payload.id ? action.payload : e)) };
    case 'DELETE_EXERCISE':
      return { ...state, exercises: state.exercises.filter((e) => e.id !== action.payload) };
    case 'ADD_SESSION':
      return { ...state, sessions: [...state.sessions, { ...action.payload, id: generateId() }] };
    case 'UPDATE_SESSION':
      return { ...state, sessions: state.sessions.map((s) => (s.id === action.payload.id ? action.payload : s)) };
    case 'DELETE_SESSION':
      return { ...state, sessions: state.sessions.filter((s) => s.id !== action.payload) };
    case 'DUPLICATE_SESSION':
      return { ...state, sessions: [...state.sessions, action.payload] };
    case 'REPLACE_ALL':
      return action.payload;
    default:
      return state;
  }
}

interface DataContextValue {
  data: AppData;
  dispatch: React.Dispatch<Action>;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, dispatch] = useReducer(reducer, undefined, loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  return <DataContext.Provider value={{ data, dispatch }}>{children}</DataContext.Provider>;
}

export function useAppData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useAppData must be used inside DataProvider');
  return ctx;
}
