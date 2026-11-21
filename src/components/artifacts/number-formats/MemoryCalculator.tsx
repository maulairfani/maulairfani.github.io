import { useState } from 'react';
import { Widget, button, chip } from './ui';

const SIZES = [1, 7, 13, 70]; // billions of parameters
const FORMATS = [
  { name: 'FP32', bytes: 4 },
  { name: 'FP16 / BF16', bytes: 2 },
  { name: 'INT8', bytes: 1 },
  { name: 'INT4', bytes: 0.5 },
];

export default function MemoryCalculator() {
  const [billions, setBillions] = useState(70);
  const fp32 = billions * 4;

  return (
    <Widget>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-neutral-700">Model size:</span>
        {SIZES.map((s) => (
          <button key={s} type="button" onClick={() => setBillions(s)} className={chip(s === billions)}>
            {s}B
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {FORMATS.map((f) => {
          const gb = billions * f.bytes;
          return (
            <li key={f.name}>
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-display font-bold">
                  {f.name} <span className="font-normal text-neutral-600">· {f.bytes} byte{f.bytes === 1 ? '' : 's'} each</span>
                </span>
                <span className="font-label tabular-nums">
                  <span className="text-neutral-600">
                    {billions}B × {f.bytes} ={' '}
                  </span>
                  {gb} GB
                </span>
              </div>
              <div className="mt-1 h-3 border border-black bg-white">
                <div className="h-full bg-black transition-all" style={{ width: `${(gb / fp32) * 100}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-neutral-600">
        Weights only. Real use needs extra memory for activations and the KV cache. INT4 is a preview of what comes
        later in this series.
      </p>
    </Widget>
  );
}
