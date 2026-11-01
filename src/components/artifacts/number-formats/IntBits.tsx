import { useState } from 'react';
import { BitCell, Widget } from './ui';

export default function IntBits() {
  const [bits, setBits] = useState([0, 1, 0, 0, 1, 0, 1, 0]); // 74
  const [signed, setSigned] = useState(false);

  const weights = [128, 64, 32, 16, 8, 4, 2, 1].map((w, i) => (signed && i === 0 ? -128 : w));
  const total = bits.reduce((sum, b, i) => sum + b * weights[i], 0);
  const terms = bits.flatMap((b, i) => (b ? [weights[i]] : []));
  const sum = terms.length ? terms.join(' + ').replace(/\+ -/g, '- ') : '0';

  const flip = (i: number) => setBits((prev) => prev.map((b, j) => (j === i ? 1 - b : b)));

  return (
    <Widget>
      <div className="flex justify-center gap-1">
        {bits.map((b, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <BitCell big value={b} kind="plain" label={`Bit worth ${weights[i]}`} onClick={() => flip(i)} />
            <span className="font-mono text-xs text-neutral-500">{weights[i]}</span>
          </div>
        ))}
      </div>

      <div className="text-center">
        <p className="font-mono text-sm text-neutral-600">{sum}</p>
        <p className="mt-1 text-4xl font-semibold tabular-nums">{total}</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={signed} onChange={(e) => setSigned(e.target.checked)} />
          Signed (the left bit counts as -128)
        </label>
        <button
          type="button"
          onClick={() => setBits([0, 0, 0, 0, 0, 0, 0, 0])}
          className="rounded-lg border border-neutral-300 bg-white px-3 py-1 hover:bg-neutral-100"
        >
          Reset
        </button>
      </div>
      <p className="text-xs text-neutral-500">
        Range here: {signed ? '-128 to 127' : '0 to 255'}. Try switching every bit on.
      </p>
    </Widget>
  );
}
