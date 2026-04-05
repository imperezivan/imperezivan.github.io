import { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useAppData } from '../../context/DataContext';
import { getCardioByWeek } from '../../utils/stats';

interface Props { weeks: number }

export function CardioChart({ weeks }: Props) {
  const { data } = useAppData();
  const chartData = useMemo(() => getCardioByWeek(data, weeks), [data, weeks]);

  if (chartData.length === 0) {
    return <p className="text-center text-gray-400 py-8 text-sm">No data for this period.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" tick={{ fontSize: 11 }} />
        <YAxis yAxisId="left" tick={{ fontSize: 11 }} label={{ value: 'Min', angle: -90, position: 'insideLeft', fontSize: 11 }} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} label={{ value: 'kcal', angle: 90, position: 'insideRight', fontSize: 11 }} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Line yAxisId="left" type="monotone" dataKey="minutes" stroke="#6366f1" strokeWidth={2} dot={false} name="Minutes" />
        <Line yAxisId="right" type="monotone" dataKey="calories" stroke="#f59e0b" strokeWidth={2} dot={false} name="Calories" />
      </LineChart>
    </ResponsiveContainer>
  );
}
