import { useState } from 'react';

type Question = { q: string; options: string[]; answer: number; why: string };

const QUESTIONS: Question[] = [
  {
    q: 'A model has 7 billion parameters stored in FP16. About how much memory do the weights need?',
    options: ['7 GB', '14 GB', '28 GB', '3.5 GB'],
    answer: 1,
    why: 'FP16 uses 2 bytes per number. 7 billion × 2 bytes = 14 billion bytes, which is 14 GB.',
  },
  {
    q: 'Which part of a float mostly decides how big or small the number can be?',
    options: ['The sign', 'The mantissa', 'The exponent', 'The bias'],
    answer: 2,
    why: 'The exponent sets the scale (a power of 2). More exponent bits means a wider range.',
  },
  {
    q: 'BF16 and FP16 both use 16 bits. What is different about BF16?',
    options: [
      'It has more mantissa bits, so it is more precise',
      'It has more exponent bits, so it has a wider range',
      'It stores whole numbers only',
      'It uses only 8 bits',
    ],
    answer: 1,
    why: 'BF16 is 1 / 8 / 7 bits. FP16 is 1 / 5 / 10. BF16 gives up precision to get the same range as FP32.',
  },
  {
    q: 'Which format is the least precise (it keeps the fewest digits)?',
    options: ['FP32', 'FP16', 'BF16', 'They are all the same'],
    answer: 2,
    why: 'Precision comes from the mantissa. BF16 has only 7 mantissa bits, FP16 has 10, and FP32 has 23.',
  },
  {
    q: 'You store the number 70,000 in FP16. What happens?',
    options: ['It is stored exactly', 'It becomes zero', 'It becomes infinity', 'It becomes 65,504'],
    answer: 2,
    why: 'The biggest normal FP16 number is 65,504. Anything that rounds above it overflows to infinity.',
  },
  {
    q: 'How many different bit patterns can INT8 hold?',
    options: ['8', '128', '256', '65,536'],
    answer: 2,
    why: 'Each of the 8 bits has 2 choices, so 2 × 2 × ... (8 times) = 2^8 = 256.',
  },
];

export default function Quiz() {
  const [picked, setPicked] = useState<(number | null)[]>(() => QUESTIONS.map(() => null));
  const answered = picked.filter((p) => p !== null).length;
  const score = picked.filter((p, i) => p === QUESTIONS[i].answer).length;

  return (
    <div className="space-y-5">
      {QUESTIONS.map((item, qi) => {
        const choice = picked[qi];
        return (
          <div key={qi} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <p className="font-medium text-neutral-900">
              {qi + 1}. {item.q}
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {item.options.map((opt, oi) => {
                let style = 'border-neutral-300 bg-white hover:bg-neutral-100';
                if (choice !== null) {
                  if (oi === item.answer) style = 'border-emerald-400 bg-emerald-50';
                  else if (oi === choice) style = 'border-rose-300 bg-rose-50';
                  else style = 'border-neutral-200 bg-white opacity-60';
                }
                return (
                  <button
                    key={oi}
                    type="button"
                    disabled={choice !== null}
                    onClick={() => setPicked((p) => p.map((v, i) => (i === qi ? oi : v)))}
                    className={`rounded-lg border px-3 py-2 text-left text-sm ${style}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {choice !== null && (
              <p className="mt-3 text-sm text-neutral-600">
                <span className="font-medium">{choice === item.answer ? 'Correct. ' : 'Not quite. '}</span>
                {item.why}
              </p>
            )}
          </div>
        );
      })}

      {answered === QUESTIONS.length && (
        <div className="flex items-center justify-between rounded-xl bg-neutral-900 px-4 py-3 text-white">
          <span>
            You got {score} out of {QUESTIONS.length}.
          </span>
          <button
            type="button"
            onClick={() => setPicked(QUESTIONS.map(() => null))}
            className="rounded-lg border border-white/30 px-3 py-1 text-sm hover:bg-white/10"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
