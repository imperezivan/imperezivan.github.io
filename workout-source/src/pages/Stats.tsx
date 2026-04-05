import { useState } from 'react';
import { VolumeChart } from '../components/charts/VolumeChart';
import { CardioChart } from '../components/charts/CardioChart';

const WEEK_OPTIONS = [4, 8, 12] as const;

export function Stats() {
  const [weeks, setWeeks] = useState<4 | 8 | 12>(4);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">Stats</h1>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
          {WEEK_OPTIONS.map((w) => (
            <button
              key={w}
              onClick={() => setWeeks(w)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                weeks === w ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {w}w
            </button>
          ))}
        </div>
      </div>

      <section className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Volume — Reps per Exercise</h2>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <VolumeChart weeks={weeks} />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Cardio — Minutes &amp; Calories</h2>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <CardioChart weeks={weeks} />
        </div>
      </section>
    </div>
  );
}
