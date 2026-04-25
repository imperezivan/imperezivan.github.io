import { useState } from 'react';
import { Button } from './ui/Button';

interface RepCounterProps {
  onApply: (reps: number) => void;
}

function playBeep(frequency: number, duration: number) {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = frequency;
  osc.type = 'sine';
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
  osc.onended = () => ctx.close();
}

export function RepCounter({ onApply }: RepCounterProps) {
  const [count, setCount] = useState(0);

  function handleApply() {
    if (count > 0) {
      onApply(count);
      setCount(0);
    }
  }

  function handleIncrement() {
    setCount((c) => {
      const next = c + 1;
      if (next % 5 === 0) {
        playBeep(880, 0.35);
      } else {
        playBeep(440, 0.12);
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          value={count}
          onChange={(e) => setCount(Math.max(0, Number(e.target.value)))}
          className="border border-indigo-300 rounded px-2 py-1 text-center w-20 text-2xl font-bold text-indigo-600 tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label="Rep count"
        />
        <div className="flex flex-col gap-1">
          <Button variant="secondary" size="sm" onClick={() => setCount(0)}>Reset</Button>
          <Button size="sm" onClick={handleApply} disabled={count === 0}>Apply to set</Button>
        </div>
      </div>
      <button
        type="button"
        onPointerDown={handleIncrement}
        className="w-full h-24 rounded-[15px] bg-indigo-600 text-white text-4xl font-bold shadow-lg active:scale-95 transition-transform select-none"
        aria-label="Increment rep count"
      >
        +
      </button>
    </div>
  );
}
