import { useState } from 'react';
import {
  BF16,
  FP16,
  FP32,
  bitString,
  decimalDigits,
  decode,
  encode,
  fmtNum,
  maxValue,
  minNormal,
  spacing,
} from '../../../lib/floats';
import type { Format } from '../../../lib/floats';
import { FloatBits, Legend, Widget } from './ui';

const FORMATS = [FP32, FP16, BF16];
const PRESETS = ['0.1', '3.14159', '1000.3', '70000', '0.00001', '1e-9'];

function status(x: number, q: number) {
  if (!Number.isFinite(q) && Number.isFinite(x)) return { text: 'Too big: becomes infinity', tone: 'text-rose-600' };
  if (q === 0 && x !== 0) return { text: 'Too small: becomes zero', tone: 'text-rose-600' };
  if (q === x) return { text: 'Exact', tone: 'text-emerald-600' };
  return { text: 'Rounded', tone: 'text-amber-600' };
}

export function FormatTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[30rem] text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-neutral-400">
          <tr>
            <th className="py-2 pr-3 font-medium">Format</th>
            <th className="py-2 pr-3 font-medium">Bits (S/E/M)</th>
            <th className="py-2 pr-3 font-medium">Biggest</th>
            <th className="py-2 pr-3 font-medium">Smallest</th>
            <th className="py-2 font-medium">Digits kept</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 tabular-nums">
          {FORMATS.map((f: Format) => (
            <tr key={f.name}>
              <td className="py-2 pr-3 font-medium">{f.name}</td>
              <td className="py-2 pr-3">
                1 / {f.exp} / {f.man}
              </td>
              <td className="py-2 pr-3">{fmtNum(maxValue(f))}</td>
              <td className="py-2 pr-3">{fmtNum(minNormal(f))}</td>
              <td className="py-2">about {Math.round(decimalDigits(f))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function RangeVsPrecision() {
  const [text, setText] = useState('1000.3');
  const x = Number(text);
  const valid = text.trim() !== '' && Number.isFinite(x);

  return (
    <Widget>
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          inputMode="decimal"
          aria-label="Number to store"
          className="w-40 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 font-mono text-sm"
        />
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setText(p)}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-1 text-sm hover:bg-neutral-100"
          >
            {p}
          </button>
        ))}
      </div>

      {!valid ? (
        <p className="text-sm text-neutral-500">Type a number, like 0.1 or 1e-9.</p>
      ) : (
        <div className="space-y-4">
          {FORMATS.map((f) => {
            const parts = encode(x, f);
            const q = decode(parts, f);
            const s = status(x, q);
            const finite = Number.isFinite(q);
            return (
              <div key={f.name} className="rounded-lg bg-white p-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-medium">{f.name}</span>
                  <span className={`text-sm ${s.tone}`}>{s.text}</span>
                </div>
                <p className="mt-1 font-mono text-lg tabular-nums">{fmtNum(q)}</p>
                {finite && q !== 0 && (
                  <p className="text-xs text-neutral-500">
                    Error: {fmtNum(Math.abs(q - x), 4)} · Numbers near here are {fmtNum(spacing(x, f), 4)} apart
                  </p>
                )}
                <div className="mt-2">
                  <FloatBits sign={parts.sign} exp={bitString(parts.exp, f.exp)} man={bitString(parts.man, f.man)} />
                </div>
              </div>
            );
          })}
          <Legend />
        </div>
      )}
    </Widget>
  );
}
