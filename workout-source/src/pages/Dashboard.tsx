import { Link} from 'react-router-dom';
import { format } from 'date-fns';
import { useAppData } from '../context/DataContext';
import { Button } from '../components/ui/Button';

export function Dashboard() {
  const { data } = useAppData();

  const sortedSessions = [...data.sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const recent = sortedSessions.slice(0, 5);

  const totalMinutes = data.sessions.reduce((acc, s) => acc + s.minutes, 0);
  const totalCalories = data.sessions.reduce((acc, s) => acc + s.calories, 0);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Dashboard</h1>

      {/* Stat chips */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Chip value={data.sessions.length} label="Sessions" color="indigo" />
        <Chip value={totalMinutes} label="Minutes" color="green" />
        <Chip value={totalCalories} label="Calories" color="orange" />
      </div>

      {/* Quick links */}
      <div className="flex gap-3 mb-6">
        <Link to="/workout/new" className="flex-1">
          <Button className="w-full">+ New Workout</Button>
        </Link>
        <Link to="/stats" className="flex-1">
          <Button variant="secondary" className="w-full">View Stats</Button>
        </Link>
      </div>

      {/* Recent sessions */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Recent sessions</h2>
      {recent.length === 0 && (
        <p className="text-center text-gray-400 py-8">No sessions yet. Start your first workout!</p>
      )}
      <ul className="flex flex-col gap-2">
        {recent.map((s) => (
          <li key={s.id}>
            <Link
              to={`/workout/${s.id}`}
              className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm hover:bg-indigo-50 transition-colors"
            >
              <div>
                <p className="font-medium text-gray-900">{format(new Date(s.date), 'EEE, MMM d')}</p>
                <p className="text-xs text-gray-500">{s.exercises.length} exercises</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-indigo-600">{s.minutes} min</p>
                <p className="text-xs text-gray-400">{s.calories} kcal</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Chip({ value, label, color }: { value: number; label: string; color: string }) {
  const colors: Record<string, string> = {
    indigo: 'text-indigo-600',
    green: 'text-green-600',
    orange: 'text-orange-500',
  };
  return (
    <div className="bg-white rounded-xl shadow-sm p-3 text-center">
      <p className={`text-2xl font-bold ${colors[color] ?? 'text-gray-900'}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}
