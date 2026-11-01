import type { ReactNode } from 'react';

/** Turn "2^N" into 2<sup>N</sup>. Plain strings can then carry powers. */
function withSuperscripts(text: string): ReactNode[] {
  return text.split(/\^(\w+)/).map((part, i) => (i % 2 === 1 ? <sup key={i}>{part}</sup> : part));
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
    <section className="border-t border-neutral-200 py-10">
      <p className="text-xs font-medium uppercase tracking-widest text-neutral-400">Bite {n}</p>
      <h2 className="mt-1 text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-4 space-y-4 leading-relaxed text-neutral-700">
        {children}
        {remember && (
          <fieldset className="rounded-sm border border-neutral-300 px-4 pb-3 pt-0">
            <legend className="px-2 text-xs font-medium uppercase tracking-widest text-neutral-500">Remember</legend>
            <p className="text-sm text-neutral-900">{withSuperscripts(remember)}</p>
          </fieldset>
        )}
        {question && (
          <p className="pt-2 font-medium text-neutral-900">
            <span aria-hidden="true">↓ </span>
            {question}
          </p>
        )}
      </div>
    </section>
  );
}

export function Widget({ children }: { children: ReactNode }) {
  return <div className="space-y-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5">{children}</div>;
}

export type BitKind = 'sign' | 'exp' | 'man' | 'plain';

const kindStyles: Record<BitKind, string> = {
  sign: 'border-rose-200 bg-rose-100 text-rose-800',
  exp: 'border-amber-200 bg-amber-100 text-amber-800',
  man: 'border-sky-200 bg-sky-100 text-sky-800',
  plain: 'border-neutral-300 bg-white text-neutral-800',
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
  const cls = `inline-grid place-items-center rounded border font-mono tabular-nums ${size} ${kindStyles[kind]} ${
    value === 1 ? 'font-bold' : 'opacity-60'
  }`;
  if (!onClick) return <span className={cls}>{value}</span>;
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={value === 1}
      onClick={onClick}
      className={`${cls} cursor-pointer hover:brightness-95`}
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
    <div className="flex flex-wrap gap-3 text-xs text-neutral-600">
      {items.map((i) => (
        <span key={i.text} className="inline-flex items-center gap-1.5">
          <span className={`h-3 w-3 rounded border ${kindStyles[i.kind]}`} />
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
