import type { ReactNode } from 'react';

/** Turn "2^N" into 2<sup>N</sup>. Plain strings can then carry powers. */
function withSuperscripts(text: string): ReactNode[] {
  return text.split(/\^(\w+)/).map((part, i) => (i % 2 === 1 ? <sup key={i}>{part}</sup> : part));
}

export const button = 'border border-neutral-500 bg-white px-3 py-1 font-label text-sm hover:bg-neutral-200';

export function chip(on: boolean) {
  return `border px-3 py-1 font-label text-sm ${
    on ? 'border-black bg-black text-white' : 'border-neutral-500 bg-white hover:bg-neutral-200'
  }`;
}

export function Bite({
  n,
  title,
  remember,
  question,
  children,
}: {
  n: number;
  title: string;
  /** One-line takeaway, shown at the end of the bite. */
  remember?: string;
  /** A question that the next bite answers. Links this bite to the next one. */
  question?: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-12 border-t-[3px] border-black pt-4">
      <p className="font-label text-[11px] font-bold uppercase tracking-[0.12em]">Bite {n}</p>
      <h2 className="mt-2 font-display text-2xl font-bold leading-tight">{title}</h2>
      <div className="mt-5 space-y-4 leading-relaxed text-neutral-800">
        {children}
        {remember && (
          <div className="border border-l-[7px] border-black bg-white px-4 py-3">
            <p className="font-display text-xs font-bold uppercase tracking-[0.12em]">Remember</p>
            <p className="mt-1 text-[15px] text-neutral-900">{withSuperscripts(remember)}</p>
          </div>
        )}
        {question && (
          <p className="border border-dashed border-neutral-600 px-4 py-3 font-medium text-neutral-900">
            <span aria-hidden="true">↓ </span>
            {question}
          </p>
        )}
      </div>
    </section>
  );
}

export function Widget({ children }: { children: ReactNode }) {
  return <div className="space-y-4 border border-neutral-400 bg-neutral-100 p-4 sm:p-5">{children}</div>;
}

export type BitKind = 'sign' | 'exp' | 'man' | 'plain';

const kindStyles: Record<BitKind, string> = {
  sign: 'border-black bg-black text-white',
  exp: 'border-neutral-600 bg-neutral-300 text-black',
  man: 'border-neutral-600 bg-white text-black',
  plain: 'border-neutral-500 bg-white text-black',
};

export function BitCell({
  value,
  kind,
  onClick,
  label,
  big,
}: {
  value: number;
  kind: BitKind;
  onClick?: () => void;
  label?: string;
  big?: boolean;
}) {
  const size = big ? 'h-12 w-10 text-base' : 'h-8 w-5 text-xs sm:w-6';
  const cls = `inline-grid place-items-center border font-label tabular-nums ${size} ${kindStyles[kind]} ${
    value === 1 ? 'font-bold' : 'opacity-60'
  }`;
  if (!onClick) return <span className={cls}>{value}</span>;
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={value === 1}
      onClick={onClick}
      className={`${cls} cursor-pointer hover:opacity-80`}
    >
      {value}
    </button>
  );
}

export function Legend() {
  const items: { kind: BitKind; text: string }[] = [
    { kind: 'sign', text: 'Sign' },
    { kind: 'exp', text: 'Exponent' },
    { kind: 'man', text: 'Mantissa' },
  ];
  return (
    <div className="flex flex-wrap gap-3 text-xs text-neutral-700">
      {items.map((i) => (
        <span key={i.text} className="inline-flex items-center gap-1.5">
          <span className={`h-3 w-3 border ${kindStyles[i.kind]}`} />
          {i.text}
        </span>
      ))}
    </div>
  );
}

/** A float's bits, grouped as sign | exponent | mantissa. */
export function FloatBits({
  sign,
  exp,
  man,
  onFlip,
}: {
  sign: number;
  exp: string;
  man: string;
  onFlip?: (field: 'sign' | 'exp' | 'man', pos: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <div className="flex gap-0.5">
        <BitCell value={sign} kind="sign" label="Sign bit" onClick={onFlip && (() => onFlip('sign', 0))} />
      </div>
      <div className="flex flex-wrap gap-0.5">
        {exp.split('').map((b, i) => (
          <BitCell
            key={i}
            value={Number(b)}
            kind="exp"
            label={`Exponent bit ${i + 1}`}
            onClick={onFlip && (() => onFlip('exp', i))}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-0.5">
        {man.split('').map((b, i) => (
          <BitCell
            key={i}
            value={Number(b)}
            kind="man"
            label={`Mantissa bit ${i + 1}`}
            onClick={onFlip && (() => onFlip('man', i))}
          />
        ))}
      </div>
    </div>
  );
}
