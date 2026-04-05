import { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useAppData } from '../../context/DataContext';
import { getVolumeByWeek } from '../../utils/stats';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

interface Props { weeks: number }

export function VolumeChart({ weeks }: Props) {
  const { data } = useAppData();
  const [exerciseId, setExerciseId] = useState('');

  const { chartData, exerciseNames } = useMemo(() => {
    const raw = getVolumeByWeek(data, weeks);
    const filtered = exerciseId
      ? raw.filter((r) => data.exercises.find((e) => e.id === exerciseId)?.name === r.exerciseName)
      : raw;
    const nameSet = Array.from(new Set(filtered.map((r) => r.exerciseName)));
    const weekSet = Array.from(new Set(filtered.map((r) => r.week)));

    const byWeek: Record<string, Record<string, number>> = {};
    for (const week of weekSet) byWeek[week] = {};
    for (const item of filtered) byWeek[item.week][item.exerciseName] = item.reps;

    const rows = weekSet.map((week) => ({ week, ...byWeek[week] }));
    return { chartData: rows, exerciseNames: nameSet };
  }, [data, weeks, exerciseId]);

  return (
    <div className="flex flex-col gap-3">
      <select
        value={exerciseId}
        onChange={(e) => setExerciseId(e.target.value)}
        className="self-start border border-gray-200 rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value="">All exercises</option>
        {data.exercises.map((ex) => (
          <option key={ex.id} value={ex.id}>{ex.name}</option>
        ))}
      </select>

      {chartData.length === 0 ? (
        <p className="text-center text-gray-400 py-8 text-sm">No data for this period.</p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} interval={Math.ceil(weeks * 7 / 6) - 1} />
            <YAxis tick={{ fontSize: 11 }} label={{ value: 'Sets', angle: -90, position: 'insideLeft', fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {exerciseNames.map((name, i) => (
              <Bar key={name} dataKey={name} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
