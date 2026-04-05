import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useAppData } from '../../context/DataContext';
import { getVolumeByWeek } from '../../utils/stats';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

interface Props { weeks: number }

export function VolumeChart({ weeks }: Props) {
  const { data } = useAppData();

  const { chartData, exerciseNames } = useMemo(() => {
    const raw = getVolumeByWeek(data, weeks);
    const nameSet = Array.from(new Set(raw.map((r) => r.exerciseName)));
    const weekSet = Array.from(new Set(raw.map((r) => r.week)));

    const byWeek: Record<string, Record<string, number>> = {};
    for (const week of weekSet) byWeek[week] = {};
    for (const item of raw) byWeek[item.week][item.exerciseName] = item.sets;

    const rows = weekSet.map((week) => ({ week, ...byWeek[week] }));
    return { chartData: rows, exerciseNames: nameSet };
  }, [data, weeks]);

  if (chartData.length === 0) {
    return <p className="text-center text-gray-400 py-8 text-sm">No data for this period.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} label={{ value: 'Sets', angle: -90, position: 'insideLeft', fontSize: 11 }} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {exerciseNames.map((name, i) => (
          <Bar key={name} dataKey={name} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
