import { useState } from 'react';
import { Widget, button, chip } from '../number-formats/ui';

const GIB = 2 ** 30;

type Inputs = {
  concurrency: number;
  prompt: number;
  output: number;
  vram: number;
  params: number;
  wbits: number;
  actual: number | null;
  layers: number;
  heads: number;
  dim: number;
  cbits: number;
  reserve: number;
};

const BASE: Inputs = {
  concurrency: 3,
  prompt: 4096,
  output: 4096,
  vram: 24,
  params: 8,
  wbits: 16,
  actual: null,
  layers: 32,
  heads: 8,
  dim: 128,
  cbits: 16,
  reserve: 2,
};

const CASES = [
  { id: 'base', label: 'Baseline', change: {} },
  { id: 'double', label: 'Double requests', change: { concurrency: 6 } },
  { id: 'long', label: 'Longer context', change: { prompt: 16384 } },
] as const;

const f = (x: number) => x.toLocaleString('en-US', { maximumFractionDigits: 2 });

export default function MemoryLab() {
  const [v, setV] = useState<Inputs>(BASE);
  const [active, setActive] = useState<string>('base');

  const set = (key: keyof Inputs, value: number | null) => {
    setV({ ...v, [key]: value });
    setActive('');
  };

  const weights = v.actual ?? (v.params * 1e9 * v.wbits) / 8 / GIB;
  const perToken = (2 * v.layers * v.heads * v.dim * v.cbits) / 8;
  const perRequest = (perToken * (v.prompt + v.output)) / GIB;
  const cache = perRequest * v.concurrency;
  const total = weights + cache + v.reserve;
  const left = v.vram - total;
  const scale = Math.max(v.vram, total);

  const pick = (id: (typeof CASES)[number]['id']) => {
    const c = CASES.find((x) => x.id === id)!;
    setV({ ...BASE, ...c.change });
    setActive(id);
  };

  const reset = () => {
    setV(BASE);
    setActive('base');
  };

  const slider = (key: keyof Inputs, label: string, min: number, max: number, step: number) => (
    <label className="block text-sm">
      <span className="flex justify-between">
        <span>{label}</span>
        <span className="font-label tabular-nums">{f(v[key] as number)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={v[key] as number}
        onChange={(e) => set(key, Number(e.target.value))}
        className="w-full accent-black"
      />
    </label>
  );

  const field = (key: keyof Inputs, label: string, step = 1) => (
    <label className="block text-sm">
      <span>{label}</span>
      <input
        type="number"
        step={step}
        min={0}
        value={v[key] ?? ''}
        onChange={(e) => {
          const raw = e.target.value;
          if (key === 'actual') set(key, raw.trim() === '' ? null : Number(raw));
          else set(key, Number(raw));
        }}
        className="mt-1 w-full border border-neutral-500 bg-white px-2 py-1 font-label tabular-nums"
      />
    </label>
  );

  const insight =
    left < 0
      ? 'This scenario exceeds the assumed memory budget.'
      : v.concurrency > 3
        ? 'More requests add cache; the shared weights stay fixed.'
        : v.prompt + v.output > 8192
          ? 'Longer contexts add cache for every active request.'
          : 'Change workload and watch cache grow independently of weights.';

  return (
    <Widget>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-neutral-700">Scenario:</span>
        {CASES.map((c) => (
          <button key={c.id} type="button" onClick={() => pick(c.id)} className={chip(active === c.id)} aria-pressed={active === c.id}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {slider('concurrency', 'Active requests', 1, 12, 1)}
        {slider('prompt', 'Prompt tokens per request', 0, 32768, 1024)}
        {slider('output', 'Output allowance per request', 0, 16384, 512)}
      </div>

      <div aria-live="polite" className="space-y-3">
        <h4 className="font-display text-lg font-bold">
          {f(total)} / {f(v.vram)} GiB budgeted
        </h4>
        <div
          role="img"
          aria-label={`Weights ${f(weights)}, cache ${f(cache)}, reserve ${f(v.reserve)} GiB. ${
            left >= 0 ? `Headroom ${f(left)}` : `Exceeds budget by ${f(-left)}`
          } GiB.`}
          className="flex h-6 w-full overflow-hidden border border-black bg-white"
        >
          <span className="h-full bg-black" style={{ width: `${(100 * weights) / scale}%` }} />
          <span className="h-full bg-neutral-500" style={{ width: `${(100 * cache) / scale}%` }} />
          <span className="h-full bg-neutral-300" style={{ width: `${(100 * v.reserve) / scale}%` }} />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 font-label text-xs">
          <span>Weights {f(weights)} GiB</span>
          <span>Cache {f(cache)} GiB</span>
          <span>Reserve {f(v.reserve)} GiB</span>
        </div>
        <p className="text-sm">{insight}</p>
        <p className="text-sm">
          {f(perToken / 1024)} KiB/token; {f(perRequest)} GiB cache/request; {f(cache)} GiB cache total.{' '}
          {left >= 0 ? `Estimated headroom ${f(left)} GiB.` : `Budget exceeded by ${f(-left)} GiB.`} Not a fit or
          performance guarantee.
        </p>
      </div>

      <details>
        <summary className="cursor-pointer font-display text-sm font-bold">Change hardware and model assumptions</summary>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {field('vram', 'Available VRAM (GiB)', 0.1)}
          {field('params', 'Parameters (billions)', 0.1)}
          {field('wbits', 'Weight bits/value')}
          {field('actual', 'Resident weights (GiB; optional)', 0.1)}
          {field('layers', 'Attention layers')}
          {field('heads', 'KV heads')}
          {field('dim', 'Head dimension')}
          {field('cbits', 'Cache bits/element')}
          {field('reserve', 'Working memory + reserve (GiB)', 0.1)}
        </div>
      </details>

      <button type="button" onClick={reset} className={button}>
        Reset example
      </button>
    </Widget>
  );
}
