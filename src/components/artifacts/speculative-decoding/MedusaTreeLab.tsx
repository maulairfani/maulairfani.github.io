import { useState } from 'react';
import { Widget, button, chip } from '../number-formats/ui';

type NodeId = 'on' | 'near' | 'on/the' | 'on/a' | 'near/the' | 'near/a';

const NODES: { id: NodeId; label: string }[] = [
  { id: 'on', label: 'on' },
  { id: 'near', label: 'near' },
  { id: 'on/the', label: 'on → the' },
  { id: 'on/a', label: 'on → a' },
  { id: 'near/the', label: 'near → the' },
  { id: 'near/a', label: 'near → a' },
];

const PARENTS = ['on', 'near'] as const;
const CHILDREN = ['the', 'a'] as const;

export default function MedusaTreeLab() {
  const [selected, setSelected] = useState<NodeId>('on/the');
  const [verified, setVerified] = useState(false);

  const parts = selected.split('/');
  const prefix = `The cat sat${parts.length > 1 ? ` ${parts[0]}` : ''}`;
  const candidate = parts[parts.length - 1];

  const reset = () => {
    setVerified(false);
    setSelected('on/the');
  };

  return (
    <Widget>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-neutral-700">Candidate node:</span>
        {NODES.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => setSelected(n.id)}
            className={`${chip(selected === n.id)} cursor-pointer`}
            aria-pressed={selected === n.id}
          >
            {n.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setVerified(true)}
          className={`${button} cursor-pointer`}
        >
          Verify greedy path
        </button>
        <button type="button" onClick={reset} className={`${button} cursor-pointer`}>
          Reset
        </button>
      </div>

      <div className="space-y-3 border border-neutral-400 bg-white p-4">
        <p className="text-sm">
          <strong className="font-display">Shared hidden representation:</strong> h after “The cat”
        </p>

        <div className="grid gap-2 font-display text-xs sm:grid-cols-3">
          <div className="border border-neutral-400 bg-neutral-100 px-3 py-2">LM head: sat</div>
          <div className="border border-neutral-400 bg-neutral-100 px-3 py-2">Extra head 1: on / near</div>
          <div className="border border-neutral-400 bg-neutral-100 px-3 py-2">Extra head 2: the / a</div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {PARENTS.map((parent) => {
            const parentKept = verified && parent === 'on';
            const parentSelected = selected === parent;
            return (
              <div key={parent} className="space-y-2 border-l-[3px] border-neutral-500 pl-3">
                <button
                  type="button"
                  onClick={() => setSelected(parent)}
                  className={`block w-full cursor-pointer border px-2.5 py-1.5 text-left font-display text-sm font-bold ${
                    parentKept
                      ? 'border-black bg-black text-white'
                      : 'border-neutral-400 bg-white text-neutral-900 hover:bg-neutral-200'
                  } ${parentSelected ? 'border-2 border-black underline underline-offset-4' : ''}`}
                >
                  sat / {parent}
                </button>
                <div className="flex flex-wrap gap-2">
                  {CHILDREN.map((child) => {
                    const nodeId = `${parent}/${child}` as NodeId;
                    const childKept = verified && parent === 'on' && child === 'a';
                    const childSelected = selected === nodeId;
                    return (
                      <button
                        key={nodeId}
                        type="button"
                        onClick={() => setSelected(nodeId)}
                        className={`cursor-pointer border px-2.5 py-1 font-label text-xs ${
                          childKept
                            ? 'border-black bg-black text-white'
                            : 'border-neutral-400 bg-white text-neutral-900 hover:bg-neutral-200'
                        } ${childSelected ? 'border-2 border-black underline underline-offset-4' : ''}`}
                      >
                        {parent} / {child}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <p className="border-t border-neutral-300 pt-2.5 text-sm leading-relaxed text-neutral-800">
          To predict candidate “{candidate}”, the target uses: <strong>{prefix}</strong>. When processing the node, it
          may attend to itself and ancestors, never siblings or descendants.
        </p>
      </div>

      <p aria-live="polite" className="min-h-[3rem] text-sm leading-relaxed text-neutral-900">
        {verified
          ? 'Scripted target continuation: sat on a. Keep that path; discard other branches. Highlighted labels mark the kept path.'
          : 'Select a node to inspect its causal prefix. Extra heads proposed alternatives; target verification has not committed them.'}
      </p>
    </Widget>
  );
}
