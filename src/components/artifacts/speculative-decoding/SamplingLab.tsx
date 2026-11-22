import { useState } from 'react';
import { Widget, button } from '../number-formats/ui';

export default function SamplingLab() {
  const [pPct, setPPct] = useState(60);
  const [qPct, setQPct] = useState(80);

  const p = pPct / 100;
  const q = qPct / 100;
  const acceptA = Math.min(1, p / q);
  const acceptB = Math.min(1, (1 - p) / (1 - q));
  const reject = q * (1 - acceptA) + (1 - q) * (1 - acceptB);
  const residualA = reject > 1e-10 ? Math.max(0, p - q) / reject : 0;
  const finalA = q * acceptA + reject * residualA;

  const rows: { name: string; value: number }[] = [
    { name: 'Target', value: p },
    { name: 'Draft', value: q },
    { name: 'Final output', value: finalA },
  ];

  const reset = () => {
    setPPct(60);
    setQPct(80);
  };

  const summary =
    reject < 1e-10
      ? 'The distributions match. Every proposal is accepted; no residual correction is needed.'
      : `On rejection, correction goes to ${p > q ? 'A' : 'B'}. The corrected final distribution matches the target, not the draft.`;

  return (
    <Widget>
      <div className="space-y-4">
        <label className="block text-sm">
          <div className="flex justify-between">
            <span>Target probability of A: </span>
            <span className="font-label tabular-nums">{pPct}%</span>
          </div>
          <input
            type="range"
            min={5}
            max={95}
            step={1}
            value={pPct}
            onChange={(e) => setPPct(Number(e.target.value))}
            className="w-full accent-black dark:accent-neutral-100"
          />
        </label>

        <label className="block text-sm">
          <div className="flex justify-between">
            <span>Draft probability of A: </span>
            <span className="font-label tabular-nums">{qPct}%</span>
          </div>
          <input
            type="range"
            min={5}
            max={95}
            step={1}
            value={qPct}
            onChange={(e) => setQPct(Number(e.target.value))}
            className="w-full accent-black dark:accent-neutral-100"
          />
        </label>
      </div>

      <div className="space-y-3 border border-neutral-400 bg-white p-4">
        <div className="space-y-2.5">
          {rows.map((row) => (
            <div key={row.name} className="space-y-1 text-sm">
              <div className="flex justify-between font-display text-xs">
                <span className="font-bold">{row.name}: </span>
                <span className="font-label tabular-nums">
                  A {(row.value * 100).toFixed(1)}% / B {((1 - row.value) * 100).toFixed(1)}%
                </span>
              </div>
              <div
                aria-hidden="true"
                className="flex h-5 w-full overflow-hidden border border-black bg-white"
              >
                <span className="h-full bg-black" style={{ width: `${row.value * 100}%` }} />
                <span className="h-full bg-neutral-300" style={{ width: `${(1 - row.value) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>

        <p className="border-t border-neutral-300 pt-2.5 font-label text-xs tabular-nums text-neutral-800">
          Accept draft A: {(acceptA * 100).toFixed(1)}%. Accept draft B: {(acceptB * 100).toFixed(1)}%. Rejection
          probability: {(reject * 100).toFixed(1)}%.
        </p>
      </div>

      <p aria-live="polite" className="min-h-[3rem] text-sm leading-relaxed text-neutral-900">
        {summary}
      </p>

      <button type="button" onClick={reset} className={`${button} cursor-pointer`}>
        Reset
      </button>
    </Widget>
  );
}
