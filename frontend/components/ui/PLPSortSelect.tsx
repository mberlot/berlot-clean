'use client';

import type { ProductFilters } from '@/types';
import { useFilters } from '@/hooks/useFilters';

const SORT_OPTIONS: { value: ProductFilters['sort']; label: string }[] = [
  { value: 'createdAt:desc', label: 'DESTACADOS' },
  { value: 'price:asc',      label: 'PRECIO: MENOR A MAYOR' },
  { value: 'price:desc',     label: 'PRECIO: MAYOR A MENOR' },
  { value: 'name:asc',       label: 'NOMBRE: A–Z' },
];

export function PLPSortSelect() {
  const { currentFilters, setFilters } = useFilters();
  const current = currentFilters.sort ?? 'createdAt:desc';

  return (
    <div className="relative flex items-center gap-2 border border-warm-border px-4 py-2.5 hover:border-ink transition-colors">
      <span className="font-mono text-[11px] font-medium tracking-[1px] uppercase text-text-ink whitespace-nowrap">
        Ordenar por:&nbsp;
        <span className="text-text-dim">
          {SORT_OPTIONS.find((o) => o.value === current)?.label ?? 'DESTACADOS'}
        </span>
      </span>
      <svg className="w-3.5 h-3.5 text-text-ink flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
      {/* Invisible native select for accessibility + browser default behavior */}
      <select
        value={current}
        onChange={(e) =>
          setFilters({ sort: e.target.value as ProductFilters['sort'] })
        }
        aria-label="Ordenar productos"
        className="absolute inset-0 opacity-0 cursor-pointer w-full"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
