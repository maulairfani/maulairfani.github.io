import { useState } from 'react';

export default function Sample() {
  const [count, setCount] = useState(0);

  return (
    <div className="mx-auto max-w-sm rounded-2xl border border-neutral-300 p-8 text-center shadow-sm">
      <p className="text-sm uppercase tracking-widest text-neutral-500">Sample artifact</p>
      <p className="my-6 text-6xl font-semibold tabular-nums">{count}</p>
      <div className="flex justify-center gap-3">
        <button
          className="rounded-lg border border-neutral-300 px-4 py-2 hover:bg-neutral-100"
          onClick={() => setCount((c) => c - 1)}
        >
          −
        </button>
        <button
          className="rounded-lg bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-700"
          onClick={() => setCount((c) => c + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}
