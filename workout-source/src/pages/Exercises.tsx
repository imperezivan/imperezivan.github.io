import { useState } from 'react';
import { useAppData } from '../context/DataContext';
import { ExerciseModal } from '../components/ExerciseModal';
import { Button } from '../components/ui/Button';
import type { Exercise } from '../types';

export function Exercises() {
  const { data, dispatch } = useAppData();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Exercise | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function handleSave(payload: Omit<Exercise, 'id'>) {
    if (editing) {
      dispatch({ type: 'UPDATE_EXERCISE', payload: { ...editing, ...payload } });
    } else {
      dispatch({ type: 'ADD_EXERCISE', payload });
    }
  }

  function handleDelete(id: string) {
    const usedInSessions = data.sessions.some((s) => s.exercises.some((e) => e.exerciseId === id));
    if (usedInSessions) {
      setConfirmDelete(id);
    } else {
      dispatch({ type: 'DELETE_EXERCISE', payload: id });
    }
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">Exercises</h1>
        <Button size="sm" onClick={() => { setEditing(null); setShowModal(true); }}>+ Add</Button>
      </div>

      {data.exercises.length === 0 && (
        <p className="text-center text-gray-400 py-12">No exercises yet. Add one!</p>
      )}

      <ul className="flex flex-col gap-2">
        {data.exercises.map((ex) => (
          <li key={ex.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
            <div>
              <p className="font-medium text-gray-900">{ex.name}</p>
              {ex.muscleGroup && (
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{ex.muscleGroup}</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => { setEditing(ex); setShowModal(true); }}>Edit</Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(ex.id)}>Delete</Button>
            </div>
          </li>
        ))}
      </ul>

      {showModal && (
        <ExerciseModal
          initial={editing ?? undefined}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditing(null); }}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmDelete(null)} />
          <div className="relative z-10 bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4">
            <h3 className="font-semibold text-gray-900 mb-2">Delete exercise?</h3>
            <p className="text-sm text-gray-600 mb-4">
              This exercise is used in past sessions. Deleting it will remove it from the exercise list,
              but session data will be kept (exercise will show as "Unknown").
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setConfirmDelete(null)}>Cancel</Button>
              <Button variant="danger" onClick={() => { dispatch({ type: 'DELETE_EXERCISE', payload: confirmDelete }); setConfirmDelete(null); }}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
