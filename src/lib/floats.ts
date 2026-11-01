// Tiny helpers to encode and decode floating point numbers with any
// exponent/mantissa size (FP32, FP16, BF16). Plain math, no libraries.

export type Format = { name: string; exp: number; man: number };

export const FP32: Format = { name: 'FP32', exp: 8, man: 23 };
export const FP16: Format = { name: 'FP16', exp: 5, man: 10 };
export const BF16: Format = { name: 'BF16', exp: 8, man: 7 };

/** The three pieces of a float, as plain integers. */
export type Parts = { sign: 0 | 1; exp: number; man: number };

export const bias = (f: Format) => 2 ** (f.exp - 1) - 1;
export const maxExpField = (f: Format) => 2 ** f.exp - 1;
export const maxValue = (f: Format) => (2 - 2 ** -f.man) * 2 ** bias(f);
export const minNormal = (f: Format) => 2 ** (1 - bias(f));
export const minSubnormal = (f: Format) => 2 ** (1 - bias(f) - f.man);
/** Roughly how many decimal digits the mantissa can keep. */
export const decimalDigits = (f: Format) => (f.man + 1) * Math.log10(2);

export const bitString = (n: number, width: number) => n.toString(2).padStart(width, '0');

export function decode(p: Parts, f: Format): number {
  const s = p.sign ? -1 : 1;
  if (p.exp === maxExpField(f)) return p.man === 0 ? s * Infinity : NaN;
  if (p.exp === 0) return s * (p.man / 2 ** f.man) * 2 ** (1 - bias(f));
  return s * (1 + p.man / 2 ** f.man) * 2 ** (p.exp - bias(f));
}

function exponentOf(v: number): number {
  let e = Math.floor(Math.log2(v));
  if (2 ** e > v) e--;
  else if (2 ** (e + 1) <= v) e++;
  return e;
}

// Round to the nearest whole number. Exact ties go to the even number.
function roundHalfEven(x: number): number {
  if (Math.abs(x % 1) === 0.5) return 2 * Math.round(x / 2);
  return Math.round(x);
}

/** The gap between two neighbouring numbers near x, in format f. */
export function spacing(x: number, f: Format): number {
  const ax = Math.abs(x);
  if (ax === 0 || !Number.isFinite(ax)) return minSubnormal(f);
  return 2 ** (Math.max(exponentOf(ax), 1 - bias(f)) - f.man);
}

/** Round x to the nearest number that format f can store, and return its bits. */
export function encode(x: number, f: Format): Parts {
  const maxExp = maxExpField(f);
  if (Number.isNaN(x)) return { sign: 0, exp: maxExp, man: 2 ** (f.man - 1) };

  const sign: 0 | 1 = x < 0 || Object.is(x, -0) ? 1 : 0;
  const ax = Math.abs(x);
  if (ax === Infinity) return { sign, exp: maxExp, man: 0 };
  if (ax === 0) return { sign, exp: 0, man: 0 };

  const b = bias(f);
  const q = roundHalfEven(ax / spacing(ax, f)) * spacing(ax, f);

  if (q === 0) return { sign, exp: 0, man: 0 }; // too small: becomes zero
  if (q >= 2 ** (b + 1)) return { sign, exp: maxExp, man: 0 }; // too big: becomes infinity
  if (q < 2 ** (1 - b)) {
    return { sign, exp: 0, man: Math.round(q / 2 ** (1 - b - f.man)) }; // subnormal
  }
  const e = exponentOf(q);
  return { sign, exp: e + b, man: Math.round((q / 2 ** e - 1) * 2 ** f.man) };
}

/** Show a number without scary long tails. */
export function fmtNum(v: number, digits = 10): string {
  if (Number.isNaN(v)) return 'NaN';
  if (!Number.isFinite(v)) return v < 0 ? '-∞' : '∞';
  if (v === 0) return Object.is(v, -0) ? '-0' : '0';
  const a = Math.abs(v);
  if (a >= 1e7 || a < 1e-4) return v.toExponential(6);
  return String(Number(v.toPrecision(digits)));
}
