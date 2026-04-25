import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useAppData } from '../context/DataContext';
import { Button } from '../components/ui/Button';
import { generateId } from '../utils/uuid';

export function WorkoutDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, dispatch } = useAppData();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const session = data.sessions.find((s) => s.id === id);
  if (!session) return <p className="p-8 text-center text-gray-400">Session not found.</p>;

  const exerciseMap = new Map(data.exercises.map((e) => [e.id, e]));
  const dateLabel = format(new Date(session.date), 'EEEE, MMMM d, yyyy');

  function handleDelete() {
    if (!session) return;
    dispatch({ type: 'DELETE_SESSION', payload: session.id });
    navigate('/');
  }

  function handleDuplicate() {
    if (!session) return;
    const newId = generateId();
    const today = format(new Date(), 'yyyy-MM-dd');
    dispatch({
      type: 'DUPLICATE_SESSION',
      payload: { ...session, id: newId, date: new Date(today).toISOString() },
    });
    navigate(`/workout/${newId}`);
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{dateLabel}</h1>
          <p className="text-sm text-gray-500">{session.minutes} min · {session.calories} kcal</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/workout/${id}/edit`}>
            <Button variant="secondary" size="sm">Edit</Button>
          </Link>
          <Button variant="secondary" size="sm" onClick={handleDuplicate}>Duplicate</Button>
          <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>Delete</Button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-3xl font-bold text-indigo-600">{session.minutes}</p>
          <p className="text-xs text-gray-500 mt-1">Minutes</p>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-3xl font-bold text-orange-500">{session.calories}</p>
          <p className="text-xs text-gray-500 mt-1">Calories</p>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{session.exercises.length}</p>
          <p className="text-xs text-gray-500 mt-1">Exercises</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {session.exercises.map((se, i) => {
          const ex = exerciseMap.get(se.exerciseId);
          const totalReps = se.sets.reduce((acc, s) => acc + s.reps, 0);
          return (
            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-gray-900">{ex?.name ?? 'Unknown'}</p>
                {ex?.muscleGroup && (
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{ex.muscleGroup}</span>
                )}
              </div>
              <div className="px-4 py-2 flex flex-col gap-1">
                {se.sets.map((set, j) => (
                  <div key={j} className="text-sm text-gray-700 flex justify-between">
                    <span>Set {j + 1}</span>
                    <span className="font-medium">{set.reps} reps</span>
                  </div>
                ))}
                <div className="text-xs text-gray-400 mt-1 flex justify-between border-t border-gray-50 pt-1">
                  <span>{se.sets.length} sets</span>
                  <span>{totalReps} total reps</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmDelete(false)} />
          <div className="relative z-10 bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4">
            <h3 className="font-semibold text-gray-900 mb-2">Delete this session?</h3>
            <p className="text-sm text-gray-600 mb-4">This cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setConfirmDelete(false)}>Cancel</Button>
              <Button variant="danger" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
