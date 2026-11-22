import { useState } from 'react';
import { Widget, button } from '../number-formats/ui';

type Phase = 0 | 1 | 2;

const LAYERS = Array.from({ length: 12 }, (_, i) => i + 1);

export default function LayerSkipLab() {
  const [exitLayer, setExitLayer] = useState(4);
  const [phase, setPhase] = useState<Phase>(0);

  const reset = () => {
    setExitLayer(4);
    setPhase(0);
  };

  const messages: Record<Phase, string> = {
    0: 'Choose the split. Shaded layers are the early draft path. No accuracy or speed is inferred from the slider.',
    1: 'Early layers draft a candidate chain. Their boundary activations and cache are retained; these are not yet full-depth predictions.',
    2: 'Remaining layers verify the candidate positions together using retained early-layer activations. Accept/correct and repair rejected cache entries.',
  };

  return (
    <Widget>
      <label className="block text-sm">
        <div className="flex justify-between">
          <span>Exit after layer: </span>
          <span className="font-label tabular-nums">{exitLayer} of 12</span>
        </div>
        <input
          type="range"
          min={2}
          max={10}
          step={1}
          value={exitLayer}
          onChange={(e) => {
            setExitLayer(Number(e.target.value));
            setPhase(0);
          }}
          className="w-full accent-black dark:accent-neutral-100"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setPhase(1)}
          className={`${button} cursor-pointer`}
        >
          Draft with early layers
        </button>
        <button
          type="button"
          onClick={() => setPhase(2)}
          disabled={phase === 0}
          className={`${button} cursor-pointer disabled:cursor-default disabled:opacity-40`}
        >
          Verify with remaining layers
        </button>
        <button type="button" onClick={reset} className={`${button} cursor-pointer`}>
          Reset
        </button>
      </div>

      <div className="space-y-3 border border-neutral-400 bg-white p-4">
        <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6" aria-hidden="true">
          {LAYERS.map((n) => {
            const isEarly = n <= exitLayer;
            const isExecuted = (phase === 1 && isEarly) || (phase === 2 && !isEarly);
            const cls = isExecuted
              ? 'border-black bg-black font-bold text-white'
              : isEarly
                ? 'border-neutral-500 bg-neutral-200 text-neutral-900'
                : 'border-neutral-400 bg-white text-neutral-700';
            return (
              <span key={n} className={`border py-2 text-center font-label text-xs tabular-nums ${cls}`}>
                L{n}
              </span>
            );
          })}
        </div>

        <p className="text-sm text-neutral-800">
          Draft path: layers 1–{exitLayer}. Verification continuation: layers {exitLayer + 1}–12. One shared LM head
          reads predictions.
        </p>
      </div>

      <p aria-live="polite" className="min-h-[3rem] text-sm leading-relaxed text-neutral-900">
        {messages[phase]}
      </p>
    </Widget>
  );
}
