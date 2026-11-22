import { useState } from 'react';
import { Widget, button, chip } from '../number-formats/ui';

type Branch = 'am' | 'always';

const BRANCHES: Branch[] = ['am', 'always'];
const STAGES = ['Target feature', 'Shifted token', 'Predict feature', 'Draft token', 'Verify'] as const;

export default function EagleFeatureLab() {
  const [branch, setBranch] = useState<Branch>('am');
  const [step, setStep] = useState(0);

  const next = branch === 'am' ? 'ready' : 'prepared';
  const boxes = [
    'Target feature f(I)',
    `Selected token: ${branch}`,
    `Predicted feature f_hat(I ${branch})`,
    `LM head proposes: ${next}`,
    'Target verifies candidates',
  ];

  const messages = [
    'The target has produced a feature after I. This vector is not a token and is not a future feature.',
    `The selected token is ${branch}. Providing it tells the drafter which continuation branch to model.`,
    `A trained component predicts the feature after I ${branch}. This is an approximation, not a verified target feature.`,
    `The shared target LM head maps the predicted feature to a draft distribution; ${next} is a scripted candidate.`,
    'The full target checks the proposed tokens. Acceptance/correction determines output; accepted actual target features seed later drafting.',
  ];

  const selectBranch = (b: Branch) => {
    setBranch(b);
    setStep(0);
  };

  return (
    <Widget>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-neutral-700">Next token selected by target:</span>
        {BRANCHES.map((b) => (
          <button
            key={b}
            type="button"
            onClick={() => selectBranch(b)}
            className={`${chip(branch === b)} cursor-pointer`}
            aria-pressed={branch === b}
          >
            {b}
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
          onClick={() => setStep((s) => Math.min(4, s + 1))}
          disabled={step === 4}
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
          <strong className="font-display">Committed context:</strong> I
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
          {boxes.slice(0, step + 1).map((text, i) => (
            <div
              key={text}
              className={`flex-1 basis-[150px] border px-3 py-2 font-display text-xs ${
                i === step
                  ? 'border-black bg-black text-white'
                  : 'border-neutral-400 bg-white text-neutral-900'
              }`}
            >
              {text}
            </div>
          ))}
        </div>
      </div>

      <p aria-live="polite" className="min-h-[3rem] text-sm leading-relaxed text-neutral-900">
        {messages[step]}
      </p>
    </Widget>
  );
}
