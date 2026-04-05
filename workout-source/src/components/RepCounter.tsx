import { useState } from 'react';
import { Button } from './ui/Button';

interface RepCounterProps {
  onApply: (reps: number) => void;
}

export function RepCounter({ onApply }: RepCounterProps) {
  const [count, setCount] = useState(0);

  function handleApply() {
    if (count > 0) {
      onApply(count);
      setCount(0);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <input
        type="number"
        min="0"
        value={count}
        onChange={(e) => setCount(Math.max(0, Number(e.target.value)))}
        className="border border-indigo-300 rounded px-2 py-1 text-center w-20 text-2xl font-bold text-indigo-600 tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-400"
        aria-label="Rep count"
      />
      <button
        type="button"
        onPointerDown={() => setCount((c) => c + 1)}
        className="w-24 h-24 rounded-full bg-indigo-600 text-white text-4xl font-bold shadow-lg active:scale-95 transition-transform select-none"
        aria-label="Increment rep count"
      >
        +
      </button>
      <div className="flex gap-2 mt-1">
        <Button variant="secondary" size="sm" onClick={() => setCount(0)}>Reset</Button>
        <Button size="sm" onClick={handleApply} disabled={count === 0}>Apply to set</Button>
      </div>
    </div>
  );
}
