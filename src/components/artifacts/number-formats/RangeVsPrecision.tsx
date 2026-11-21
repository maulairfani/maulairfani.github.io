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
import { FloatBits, Legend, Widget, button } from './ui';

const FORMATS = [FP32, FP16, BF16];
const PRESETS = ['0.1', '3.14159', '1000.3', '70000', '0.00001', '1e-9'];

function status(x: number, q: number) {
  if (!Number.isFinite(q) && Number.isFinite(x)) return { text: 'Too big: becomes infinity', style: 'font-bold underline' };
  if (q === 0 && x !== 0) return { text: 'Too small: becomes zero', style: 'font-bold underline' };
  if (q === x) return { text: 'Exact', style: 'font-bold' };
  return { text: 'Rounded', style: 'italic' };
}

export function FormatTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[30rem] text-left text-sm">
        <thead className="font-display text-xs uppercase tracking-wide">
          <tr className="border-b border-black">
            <th className="py-2 pr-3 font-bold">Format</th>
            <th className="py-2 pr-3 font-bold">Bits (S/E/M)</th>
            <th className="py-2 pr-3 font-bold">Biggest</th>
            <th className="py-2 pr-3 font-bold">Smallest</th>
            <th className="py-2 font-bold">Digits kept</th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {FORMATS.map((f: Format) => (
            <tr key={f.name} className="border-b border-neutral-400">
              <td className="py-2 pr-3 font-bold">{f.name}</td>
              <td className="py-2 pr-3 font-label">
                1 / {f.exp} / {f.man}
              </td>
              <td className="py-2 pr-3 font-label">{fmtNum(maxValue(f))}</td>
              <td className="py-2 pr-3 font-label">{fmtNum(minNormal(f))}</td>
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
          className="w-40 border border-neutral-500 bg-white px-3 py-1.5 font-label text-sm"
        />
        {PRESETS.map((p) => (
          <button key={p} type="button" onClick={() => setText(p)} className={button}>
            {p}
          </button>
        ))}
      </div>

      {!valid ? (
        <p className="text-sm text-neutral-600">Type a number, like 0.1 or 1e-9.</p>
      ) : (
        <div className="space-y-4">
          {FORMATS.map((f) => {
            const parts = encode(x, f);
            const q = decode(parts, f);
            const s = status(x, q);
            const finite = Number.isFinite(q);
            return (
              <div key={f.name} className="border border-neutral-400 bg-white p-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-display font-bold">{f.name}</span>
                  <span className={`text-sm ${s.style}`}>{s.text}</span>
                </div>
                <p className="mt-1 font-label text-lg tabular-nums">{fmtNum(q)}</p>
                {finite && q !== 0 && (
                  <p className="text-xs text-neutral-600">
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
