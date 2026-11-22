import { useState } from 'react';
import { Widget, button, chip } from '../number-formats/ui';

type ScenarioId = 'all' | 'middle' | 'first';

const SCENARIOS: {
  id: ScenarioId;
  label: string;
  acceptedCount: number;
  correction: string;
  target: [string, string, string];
}[] = [
  {
    id: 'all',
    label: 'All candidates match',
    acceptedCount: 3,
    correction: '.',
    target: ['on', 'the', 'mat'],
  },
  {
    id: 'middle',
    label: 'Mismatch in the middle',
    acceptedCount: 1,
    correction: 'a',
    target: ['on', 'a', 'mat'],
  },
  {
    id: 'first',
    label: 'First candidate fails',
    acceptedCount: 0,
    correction: 'near',
    target: ['near', 'the', 'mat'],
  },
];

const DRAFT = ['on', 'the', 'mat'] as const;
const PREFIXES = ['The cat sat', 'The cat sat on', 'The cat sat on the'] as const;
const STAGES = ['Draft', 'Verify together', 'Commit', 'Continue'] as const;

export default function OriginalRoundLab() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>('middle');
  const [step, setStep] = useState(0);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!;
  const k = scenario.acceptedCount;
  const continuation = [...DRAFT.slice(0, k), scenario.correction].join(' ');

  const messages = [
    'Draft: the smaller model proposes on / the / mat. Nothing has been committed yet.',
    'Verify: the target evaluates the candidate positions together. Each prediction uses only its causal prefix.',
    `Commit: keep ${k} draft token(s), then emit ${scenario.correction}. ${
      k === 3 ? 'All candidates match; this is a bonus token.' : 'Discard the rejected tail.'
    }`,
    `Next round starts from: The cat sat ${continuation}. Keep only state consistent with this continuation.`,
  ];

  const selectScenario = (id: ScenarioId) => {
    setScenarioId(id);
    setStep(0);
  };

  return (
    <Widget>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-neutral-700">Scenario:</span>
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => selectScenario(s.id)}
            className={`${chip(scenarioId === s.id)} cursor-pointer`}
            aria-pressed={scenarioId === s.id}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className={`${button} cursor-pointer disabled:cursor-default disabled:opacity-40`}
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(3, s + 1))}
          disabled={step === 3}
          className={`${button} cursor-pointer disabled:cursor-default disabled:opacity-40`}
        >
          Next step
        </button>
        <button
          type="button"
          onClick={() => setStep(0)}
          className={`${button} cursor-pointer`}
        >
          Reset
        </button>
      </div>

      <div className="space-y-3 border border-neutral-400 bg-white p-4">
        <p className="text-sm">
          <strong className="font-display">Committed context:</strong> The cat sat
        </p>

        <ol className="flex flex-wrap gap-2 font-display text-xs">
          {STAGES.map((label, i) => (
            <li
              key={label}
              className={`border-b-2 px-1.5 py-1 ${
                step === i
                  ? 'border-black font-bold text-black'
                  : 'border-neutral-300 text-neutral-500'
              }`}
            >
              <span aria-hidden="true">{i + 1}. </span>
              {label}
            </li>
          ))}
        </ol>

        <div className="flex flex-wrap gap-2">
          {DRAFT.map((tok, i) => {
            const cls =
              step >= 2
                ? i < k
                  ? 'border-black bg-black text-white'
                  : 'border-dashed border-neutral-500 text-neutral-600 line-through'
                : 'border-neutral-500 bg-white text-neutral-700';
            return (
              <div key={tok} className={`border px-3 py-1.5 font-label text-sm ${cls}`}>
                {tok}
              </div>
            );
          })}
          {step >= 2 && (
            <div className="border border-black bg-black px-3 py-1.5 font-label text-sm text-white">
              {scenario.correction} ({k === 3 ? 'bonus' : 'correction'})
            </div>
          )}
        </div>

        {step >= 1 && (
          <div className="divide-y divide-neutral-300 border-t border-neutral-300 text-sm">
            {PREFIXES.map((prefix, i) => (
              <div key={prefix} className="py-2 font-display">
                After <strong>{prefix}</strong>: target predicts <strong>{scenario.target[i]}</strong>
                {i > k && k < 3 && (
                  <span className="text-neutral-600"> (computed under a rejected prefix; unusable)</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <p aria-live="polite" className="min-h-[3rem] text-sm leading-relaxed text-neutral-900">
        {messages[step]}
      </p>
    </Widget>
  );
}
