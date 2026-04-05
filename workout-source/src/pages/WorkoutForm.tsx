import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { useAppData } from '../context/DataContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { RepCounter } from '../components/RepCounter';
import { Modal } from '../components/ui/Modal';
import type { SessionExercise } from '../types';

function todayISO() {
  return format(new Date(), 'yyyy-MM-dd');
}

export function WorkoutForm() {
  const { id } = useParams<{ id?: string }>();
  const { data, dispatch } = useAppData();
  const navigate = useNavigate();
  const isEditing = !!id;

  const existing = isEditing ? data.sessions.find((s) => s.id === id) : undefined;

  const [date, setDate] = useState(existing?.date.slice(0, 10) ?? todayISO());
  const [minutes, setMinutes] = useState(existing?.minutes.toString() ?? '');
  const [calories, setCalories] = useState(existing?.calories.toString() ?? '');
  const [exercises, setExercises] = useState<SessionExercise[]>(existing?.exercises ?? []);
  const [showExPicker, setShowExPicker] = useState(false);
  const [counterFor, setCounterFor] = useState<{ exIdx: number } | null>(null);

  function addExercise(exerciseId: string) {
    if (!exercises.find((e) => e.exerciseId === exerciseId)) {
      setExercises((prev) => [...prev, { exerciseId, sets: [] }]);
    }
    setShowExPicker(false);
  }

  function removeExercise(idx: number) {
    setExercises((prev) => prev.filter((_, i) => i !== idx));
  }

  function addSet(exIdx: number, reps: number) {
    setExercises((prev) =>
      prev.map((ex, i) => i === exIdx ? { ...ex, sets: [...ex.sets, { reps }] } : ex)
    );
    setCounterFor(null);
  }

  function removeSet(exIdx: number, setIdx: number) {
    setExercises((prev) =>
      prev.map((ex, i) => i === exIdx ? { ...ex, sets: ex.sets.filter((_, j) => j !== setIdx) } : ex)
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      date: new Date(date).toISOString(),
      minutes: Number(minutes) || 0,
      calories: Number(calories) || 0,
      exercises,
    };
    if (isEditing && existing) {
      dispatch({ type: 'UPDATE_SESSION', payload: { ...existing, ...payload } });
    } else {
      dispatch({ type: 'ADD_SESSION', payload });
    }
    navigate('/');
  }

  const exerciseMap = new Map(data.exercises.map((e) => [e.id, e]));
  const availableExercises = data.exercises.filter(
    (e) => !exercises.find((se) => se.exerciseId === e.id)
  );

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-4">{isEditing ? 'Edit Workout' : 'New Workout'}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Date / minutes / calories */}
        <div className="grid grid-cols-1 gap-3 bg-white rounded-xl p-4 shadow-sm">
          <Input id="date" label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Input id="minutes" label="Minutes" type="number" min="0" placeholder="0" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
            <Input id="calories" label="Calories burned" type="number" min="0" placeholder="0" value={calories} onChange={(e) => setCalories(e.target.value)} />
          </div>
        </div>

        {/* Exercises */}
        <div className="flex flex-col gap-3">
          {exercises.map((se, exIdx) => {
            const ex = exerciseMap.get(se.exerciseId);
            return (
              <div key={se.exerciseId} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div>
                    <p className="font-semibold text-gray-900">{ex?.name ?? 'Unknown'}</p>
                    {ex?.muscleGroup && (
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{ex.muscleGroup}</span>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeExercise(exIdx)}>Remove</Button>
                </div>

                {/* Sets */}
                <div className="px-4 py-2 flex flex-col gap-1">
                  {se.sets.length === 0 && (
                    <p className="text-xs text-gray-400">No sets yet</p>
                  )}
                  {se.sets.map((set, setIdx) => (
                    <div key={setIdx} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Set {setIdx + 1}: <strong>{set.reps}</strong> reps</span>
                      <button type="button" onClick={() => removeSet(exIdx, setIdx)} className="text-xs text-red-400 hover:text-red-600">✕</button>
                    </div>
                  ))}
                </div>

                {/* Counter for this exercise */}
                {counterFor?.exIdx === exIdx ? (
                  <div className="px-4 pb-4">
                    <RepCounter onApply={(reps) => addSet(exIdx, reps)} />
                    <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={() => setCounterFor(null)}>Cancel</Button>
                  </div>
                ) : (
                  <div className="px-4 pb-3">
                    <Button variant="secondary" size="sm" onClick={() => setCounterFor({ exIdx })}>+ Add Set</Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={() => setShowExPicker(true)}
          disabled={availableExercises.length === 0 && data.exercises.length > 0}
        >
          + Add Exercise
        </Button>

        {data.exercises.length === 0 && (
          <p className="text-sm text-amber-600 text-center">
            No exercises defined yet. Go to Exercises to add some.
          </p>
        )}

        <Button type="submit" size="lg" className="w-full">Save Workout</Button>
      </form>

      {/* Exercise picker modal */}
      {showExPicker && (
        <Modal title="Pick Exercise" onClose={() => setShowExPicker(false)}>
          {availableExercises.length === 0 ? (
            <p className="text-gray-400 text-center py-6">All exercises already added</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {availableExercises.map((ex) => (
                <li key={ex.id}>
                  <button
                    type="button"
                    onClick={() => addExercise(ex.id)}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
                  >
                    <p className="font-medium text-gray-900">{ex.name}</p>
                    {ex.muscleGroup && (
                      <span className="text-xs text-indigo-600">{ex.muscleGroup}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Modal>
      )}
    </div>
  );
}
