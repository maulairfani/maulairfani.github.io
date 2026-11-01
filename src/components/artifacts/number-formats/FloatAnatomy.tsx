import { useState } from 'react';
import { BF16, FP16, FP32, bias, bitString, decode, encode, fmtNum, maxExpField } from '../../../lib/floats';
import type { Format, Parts } from '../../../lib/floats';
import { FloatBits, Legend, Widget } from './ui';

const FORMATS = [FP32, FP16, BF16];
const PRESETS = [0.15625, 1, 6.5, 100];

export default function FloatAnatomy() {
  const [fmt, setFmt] = useState<Format>(FP32);
  const [parts, setParts] = useState<Parts>(() => encode(0.15625, FP32));

  const value = decode(parts, fmt);
  const b = bias(fmt);
  const special = parts.exp === maxExpField(fmt);
  const subnormal = parts.exp === 0;
  const frac = parts.man / 2 ** fmt.man;
  const e = parts.exp - b;

  const switchFormat = (f: Format) => {
    setParts(encode(decode(parts, fmt), f));
    setFmt(f);
  };

  const flip = (field: 'sign' | 'exp' | 'man', pos: number) => {
    setParts((p) => {
      if (field === 'sign') return { ...p, sign: p.sign ? 0 : 1 };
      const width = field === 'exp' ? fmt.exp : fmt.man;
      return { ...p, [field]: p[field] ^ (1 << (width - 1 - pos)) };
    });
  };

  return (
    <Widget>
      <div className="flex flex-wrap items-center gap-2">
        {FORMATS.map((f) => (
          <button
            key={f.name}
            type="button"
            onClick={() => switchFormat(f)}
            className={`rounded-lg border px-3 py-1 text-sm ${
              f.name === fmt.name
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-300 bg-white hover:bg-neutral-100'
            }`}
          >
            {f.name}
          </button>
        ))}
        <span className="text-xs text-neutral-500">
          1 + {fmt.exp} + {fmt.man} = {1 + fmt.exp + fmt.man} bits
        </span>
      </div>

      <FloatBits
        sign={parts.sign}
        exp={bitString(parts.exp, fmt.exp)}
        man={bitString(parts.man, fmt.man)}
        onFlip={flip}
      />
      <Legend />

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        <dt className="font-medium text-rose-700">Sign</dt>
        <dd>
          {parts.sign} means {parts.sign ? 'negative (-1)' : 'positive (+1)'}
        </dd>

        {special ? (
          <>
            <dt className="font-medium text-amber-700">Exponent</dt>
            <dd>
              All ones ({parts.exp}). This is a special code: {parts.man === 0 ? 'infinity.' : 'NaN (not a number).'}
            </dd>
          </>
        ) : subnormal ? (
          <>
            <dt className="font-medium text-amber-700">Exponent</dt>
            <dd>
              All zeros. Special case for tiny numbers: there is no hidden 1, so the number is{' '}
              {fmtNum(frac)} × 2<sup>{1 - b}</sup>.
            </dd>
          </>
        ) : (
          <>
            <dt className="font-medium text-amber-700">Exponent</dt>
            <dd>
              Stored as {parts.exp}. Subtract the bias {b}: {parts.exp} - {b} = {e}. So the scale is 2<sup>{e}</sup> ={' '}
              {fmtNum(2 ** e)}.
            </dd>
            <dt className="font-medium text-sky-700">Mantissa</dt>
            <dd>
              The bits give {fmtNum(frac)}. Add the hidden 1: 1 + {fmtNum(frac)} = {fmtNum(1 + frac)}.
            </dd>
          </>
        )}
      </dl>

      <div className="rounded-lg bg-white px-4 py-3 text-center">
        {!special && !subnormal && (
          <p className="font-mono text-sm text-neutral-600">
            {parts.sign ? '-1' : '+1'} × {fmtNum(1 + frac)} × {fmtNum(2 ** e)}
          </p>
        )}
        <p className="text-2xl font-semibold tabular-nums">{fmtNum(value)}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-neutral-600">Load a number:</span>
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setParts(encode(p, fmt))}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-1 hover:bg-neutral-100"
          >
            {p}
          </button>
        ))}
      </div>
    </Widget>
  );
}
