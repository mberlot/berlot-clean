'use client';

import { useState } from 'react';
import type { Specification } from '@/types';

interface ProductTabsProps {
  description?: string;
  specifications?: Specification[];
}

const TABS = ['DESCRIPCIÓN', 'DETALLES'] as const;
type Tab = typeof TABS[number];

export function ProductTabs({ description, specifications }: ProductTabsProps) {
  const [active, setActive] = useState<Tab>('DESCRIPCIÓN');

  const hasTabs = description || (specifications && specifications.length > 0);
  if (!hasTabs) return null;

  return (
    <div className="border-t border-warm-border">
      {/* Tab nav */}
      <div className="flex border-b border-warm-border">
        {TABS.map((tab) => {
          if (tab === 'DETALLES' && (!specifications || specifications.length === 0)) return null;
          if (tab === 'DESCRIPCIÓN' && !description) return null;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActive(tab)}
              className={`font-mono text-[12px] font-medium tracking-[1.5px] uppercase px-6 py-4 transition-colors border-b-2 -mb-px ${
                active === tab
                  ? 'border-ink text-text-ink'
                  : 'border-transparent text-text-muted hover:text-text-ink'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="py-8 px-0">
        {active === 'DESCRIPCIÓN' && description && (
          <div
            className="font-sans text-sm text-text-dim leading-[1.75] max-w-3xl prose prose-sm"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}

        {active === 'DETALLES' && specifications && specifications.length > 0 && (
          <table className="w-full max-w-xl text-sm border-collapse border border-warm-border">
            <tbody>
              {specifications.map((spec, i) => (
                <tr key={i} className="border-b border-warm-border last:border-b-0">
                  <td className="py-3 px-4 font-mono text-[11px] font-medium tracking-[1px] uppercase text-text-ink border-r border-warm-border w-2/5 bg-warm-border/10">
                    {spec.label}
                  </td>
                  <td className="py-3 px-4 font-sans text-sm text-text-dim">
                    {spec.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
