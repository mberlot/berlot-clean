'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Category, Brand, ProductFilters } from '@/types';
import { useFilters } from '@/hooks/useFilters';
import { formatPrice } from '@/lib/utils';

interface PLPFiltersProps {
  categories: Category[];
  brands: Brand[];
  currentSlug: string;
}

const SORT_OPTIONS: { value: ProductFilters['sort']; label: string }[] = [
  { value: 'createdAt:desc', label: 'DESTACADOS' },
  { value: 'price:asc',      label: 'PRECIO: MENOR A MAYOR' },
  { value: 'price:desc',     label: 'PRECIO: MAYOR A MENOR' },
  { value: 'name:asc',       label: 'NOMBRE: A–Z' },
];

// ─── Checkbox ────────────────────────────────────────────────
function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      className={`w-4 h-4 flex-shrink-0 flex items-center justify-center border transition-colors ${
        checked ? 'bg-ink border-ink' : 'border-warm-border group-hover:border-ink'
      }`}
    >
      {checked && (
        <svg className="w-2.5 h-2.5 text-ivory" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M1.5 5.5L3.8 8l4.7-5.5" />
        </svg>
      )}
    </span>
  );
}

// ─── Filter sections (shared content) ────────────────────────
function FilterSections({
  categories,
  brands,
  currentSlug,
  currentFilters,
  setFilters,
}: {
  categories: Category[];
  brands: Brand[];
  currentSlug: string;
  currentFilters: ProductFilters;
  setFilters: (f: Partial<ProductFilters>) => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-7">
      {/* Search */}
      <div className="flex items-center gap-2 h-10 border border-warm-border px-3 focus-within:border-ink transition-colors">
        <svg className="w-4 h-4 text-text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="BUSCAR PRODUCTOS..."
          defaultValue={currentFilters.search ?? ''}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const val = (e.currentTarget as HTMLInputElement).value.trim();
              setFilters({ search: val || undefined });
            }
          }}
          className="flex-1 bg-transparent font-mono text-[11px] tracking-[0.5px] uppercase text-text-ink placeholder-text-muted focus:outline-none"
        />
      </div>

      {/* ── Category ───────────────────────── */}
      <div className="border-t border-warm-border" />
      <div className="flex flex-col gap-[14px]">
        <span className="font-mono text-[11px] font-medium tracking-[2px] uppercase text-text-ink">
          Categoría
        </span>
        <div className="flex flex-col gap-[10px]">
          {categories.slice(0, 12).map((cat) => {
            const isActive = cat.slug === currentSlug;
            return (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className="flex items-center gap-2.5 group"
              >
                <Checkbox checked={isActive} />
                <span className={`font-mono text-[11px] font-medium tracking-[1px] uppercase transition-colors ${
                  isActive ? 'text-text-ink' : 'text-text-dim group-hover:text-text-ink'
                }`}>
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Price range ────────────────────── */}
      <div className="border-t border-warm-border" />
      <div className="flex flex-col gap-[14px]">
        <span className="font-mono text-[11px] font-medium tracking-[2px] uppercase text-text-ink">
          Rango de precio
        </span>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-10 flex items-center border border-warm-border px-3 focus-within:border-ink transition-colors">
            <input
              type="number"
              min={0}
              placeholder="$ 0"
              value={currentFilters.minPrice ?? ''}
              onChange={(e) =>
                setFilters({ minPrice: e.target.value ? Number(e.target.value) : undefined })
              }
              className="w-full bg-transparent font-mono text-[11px] font-medium tracking-[1px] text-text-ink placeholder-text-muted focus:outline-none"
            />
          </div>
          <span className="font-mono text-[11px] text-text-muted">—</span>
          <div className="flex-1 h-10 flex items-center border border-warm-border px-3 focus-within:border-ink transition-colors">
            <input
              type="number"
              min={0}
              placeholder="$ ∞"
              value={currentFilters.maxPrice ?? ''}
              onChange={(e) =>
                setFilters({ maxPrice: e.target.value ? Number(e.target.value) : undefined })
              }
              className="w-full bg-transparent font-mono text-[11px] font-medium tracking-[1px] text-text-ink placeholder-text-muted focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ── Brand ──────────────────────────── */}
      {brands.length > 0 && (
        <>
          <div className="border-t border-warm-border" />
          <div className="flex flex-col gap-[14px]">
            <span className="font-mono text-[11px] font-medium tracking-[2px] uppercase text-text-ink">
              Marca
            </span>
            <div className="flex flex-col gap-[10px]">
              {brands.map((brand) => {
                const isActive = currentFilters.brand === brand.slug;
                return (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() =>
                      setFilters({ brand: isActive ? undefined : brand.slug })
                    }
                    className="flex items-center gap-2.5 group text-left"
                  >
                    <Checkbox checked={isActive} />
                    <span className={`font-mono text-[11px] font-medium tracking-[1px] uppercase transition-colors ${
                      isActive ? 'text-text-ink' : 'text-text-dim group-hover:text-text-ink'
                    }`}>
                      {brand.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────
export function PLPFilters({ categories, brands, currentSlug }: PLPFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentFilters, setFilters, clearFilters } = useFilters();

  const hasActive = !!(
    currentFilters.brand ||
    currentFilters.minPrice !== undefined ||
    currentFilters.maxPrice !== undefined ||
    currentFilters.search
  );

  // Active pills data
  const pills = [
    ...(currentFilters.search
      ? [{ label: `"${currentFilters.search}"`, clear: () => setFilters({ search: undefined }) }]
      : []),
    ...(currentFilters.brand
      ? [{ label: currentFilters.brand.toUpperCase(), clear: () => setFilters({ brand: undefined }) }]
      : []),
    ...(currentFilters.maxPrice !== undefined
      ? [{ label: `HASTA ${formatPrice(currentFilters.maxPrice)}`, clear: () => setFilters({ maxPrice: undefined }) }]
      : []),
    ...(currentFilters.minPrice !== undefined
      ? [{ label: `DESDE ${formatPrice(currentFilters.minPrice)}`, clear: () => setFilters({ minPrice: undefined }) }]
      : []),
  ];

  const sharedProps = { categories, brands, currentSlug, currentFilters, setFilters };

  return (
    <>
      {/* ══ Desktop sidebar ════════════════════════════════ */}
      <aside className="hidden lg:flex flex-col w-[300px] flex-shrink-0 border-r border-warm-border py-8 px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <span className="font-mono text-[13px] font-medium tracking-[2px] uppercase text-text-ink">
            Filtros
          </span>
          {hasActive && (
            <button
              type="button"
              onClick={clearFilters}
              className="font-mono text-[11px] font-medium tracking-[1px] uppercase text-navy hover:text-ink transition-colors"
            >
              Limpiar todo
            </button>
          )}
        </div>
        <FilterSections {...sharedProps} />
      </aside>

      {/* ══ Mobile toolbar (FILTER + SORT) ═════════════════ */}
      <div className="lg:hidden flex items-center justify-between h-12 border-b border-warm-border px-4 bg-ivory flex-shrink-0">
        {/* FILTER button */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2"
        >
          <svg className="w-4 h-4 text-text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M7 12h10M11 18h2" />
          </svg>
          <span className="font-mono text-[11px] font-medium tracking-[1.5px] uppercase text-text-ink">
            Filtrar
          </span>
        </button>

        {/* SORT BY */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-medium tracking-[1.5px] uppercase text-text-ink">
            Ordenar por
          </span>
          <select
            value={currentFilters.sort ?? 'createdAt:desc'}
            onChange={(e) =>
              setFilters({ sort: e.target.value as ProductFilters['sort'] })
            }
            className="bg-transparent font-mono text-[11px] font-medium tracking-[0.5px] uppercase text-text-ink focus:outline-none cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <svg className="w-3.5 h-3.5 text-text-ink pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* ══ Active filter pills (both breakpoints) ══════════ */}
      {pills.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-warm-border lg:px-0 lg:pt-0 lg:pb-5 lg:border-b-0 bg-ivory lg:bg-transparent">
          <span className="font-mono text-[10px] font-medium tracking-[1px] uppercase text-text-muted">
            Activos:
          </span>
          {pills.map((pill) => (
            <button
              key={pill.label}
              type="button"
              onClick={pill.clear}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-ink font-mono text-[10px] font-medium tracking-[1px] uppercase text-text-ink hover:bg-ink hover:text-ivory transition-colors"
            >
              {pill.label}
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ))}
        </div>
      )}

      {/* ══ Mobile filter modal ════════════════════════════ */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />

          {/* Slide-up panel */}
          <div
            className="fixed inset-x-0 bottom-0 z-50 lg:hidden bg-ivory flex flex-col"
            style={{ maxHeight: '90dvh' }}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between h-14 px-4 border-b border-warm-border flex-shrink-0">
              <span className="font-mono text-[13px] font-medium tracking-[2px] uppercase text-text-ink">
                Filtros
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar filtros"
              >
                <svg className="w-5 h-5 text-text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable filter content */}
            <div className="overflow-y-auto flex-1 px-4 py-5">
              <FilterSections {...sharedProps} />
            </div>

            {/* Footer actions */}
            <div className="flex flex-col gap-3 px-4 py-4 border-t border-warm-border flex-shrink-0">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="h-[52px] flex items-center justify-center bg-ink text-ivory font-mono text-[12px] font-medium tracking-[2px] uppercase hover:bg-ink/85 transition-colors"
              >
                Aplicar filtros
              </button>
              {hasActive && (
                <button
                  type="button"
                  onClick={() => { clearFilters(); setMobileOpen(false); }}
                  className="font-mono text-[11px] font-medium tracking-[1.5px] uppercase text-text-muted hover:text-text-ink transition-colors text-center py-1"
                >
                  Limpiar todo
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
