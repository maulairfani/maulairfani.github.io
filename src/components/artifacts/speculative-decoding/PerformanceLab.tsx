import { useState } from 'react';
import { Widget, button } from '../number-formats/ui';

type RawInputs = {
  base: string;
  draft: string;
  verify: string;
  other: string;
  count: string;
};

type ValidInputs = {
  base: number;
  draft: number;
  verify: number;
  other: number;
  count: number;
};

const DEFAULTS: ValidInputs = {
  base: 10,
  draft: 4,
  verify: 12,
  other: 2,
  count: 4,
};

const DEFAULT_RAW: RawInputs = {
  base: '10',
  draft: '4',
  verify: '12',
  other: '2',
  count: '4',
};

const LIMITS: Record<keyof ValidInputs, { label: string; min: number; max: number; step: number; integer?: boolean }> = {
  base: { label: 'Ordinary target step (ms)', min: 0.1, max: 10000, step: 0.1 },
  draft: { label: 'Draft time per round (ms)', min: 0, max: 10000, step: 0.1 },
  verify: { label: 'Verification time (ms)', min: 0.1, max: 10000, step: 0.1 },
  other: { label: 'State and other work (ms)', min: 0, max: 10000, step: 0.1 },
  count: { label: 'Committed tokens per round', min: 1, max: 64, step: 1, integer: true },
};

function parseAll(raw: RawInputs): ValidInputs | null {
  const out = {} as ValidInputs;
  for (const key of Object.keys(LIMITS) as (keyof ValidInputs)[]) {
    const str = raw[key];
    const num = Number(str);
    const { min, max, integer } = LIMITS[key];
    if (str.trim() === '' || !Number.isFinite(num) || num < min || num > max || (integer && !Number.isInteger(num))) {
      return null;
    }
    out[key] = num;
  }
  return out;
}

export default function PerformanceLab() {
  const [raw, setRaw] = useState<RawInputs>(DEFAULT_RAW);
  const [valid, setValid] = useState<ValidInputs>(DEFAULTS);
  const [invalid, setInvalid] = useState(false);

  const onChange = (key: keyof RawInputs, value: string) => {
    const nextRaw = { ...raw, [key]: value };
    setRaw(nextRaw);
    const parsed = parseAll(nextRaw);
    if (parsed) {
      setValid(parsed);
      setInvalid(false);
    } else {
      setInvalid(true);
    }
  };

  const reset = () => {
    setRaw(DEFAULT_RAW);
    setValid(DEFAULTS);
    setInvalid(false);
  };

  const total = valid.draft + valid.verify + valid.other;
  const per = total / valid.count;
  const ratio = valid.base / per;

  const message = invalid
    ? 'Enter values within the shown input limits; committed tokens must be a whole number. The previous calculation remains visible.'
    : ratio > 1
      ? 'The assumed saved target steps outweigh the assumed extra work. This is a hypothetical calculation, not a measured speedup.'
      : ratio < 1
        ? 'The assumed extra work costs more than the saved target steps. A valid speculative round can still be slower.'
        : 'Break-even under these assumptions. Real round costs and acceptance vary.';

  return (
    <Widget>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {(Object.keys(LIMITS) as (keyof ValidInputs)[]).map((key) => {
          const { label, min, max, step } = LIMITS[key];
          return (
            <label key={key} className="block text-sm">
              <div>{label}</div>
              <input
                type="number"
                min={min}
                max={max}
                step={step}
                value={raw[key]}
                onChange={(e) => onChange(key, e.target.value)}
                className="mt-1 w-full border border-neutral-500 bg-white px-2.5 py-1.5 font-label text-sm tabular-nums"
              />
            </label>
          );
        })}
      </div>

      <div className="space-y-1.5 border border-neutral-400 bg-white p-4 text-sm tabular-nums">
        <p>
          <strong className="font-display">Ordinary:</strong> {valid.base.toFixed(2)} ms/token
        </p>
        <p>
          <strong className="font-display">Speculative round:</strong> {total.toFixed(2)} ms for {valid.count}{' '}
          committed tokens = {per.toFixed(2)} ms/token
        </p>
        <p>
          <strong className="font-display">Illustrative speed ratio:</strong> {ratio.toFixed(2)}×
        </p>
      </div>

      <p aria-live="polite" className="min-h-[3rem] text-sm leading-relaxed text-neutral-900">
        {message}
      </p>

      <button type="button" onClick={reset} className={`${button} cursor-pointer`}>
        Reset
      </button>
    </Widget>
  );
}
