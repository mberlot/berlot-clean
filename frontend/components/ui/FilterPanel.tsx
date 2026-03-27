'use client';

import type { Brand } from '@/types';
import { useFilters } from '@/hooks/useFilters';
import { formatPrice } from '@/lib/utils';

interface FilterPanelProps {
  brands: Brand[];
  maxProductPrice?: number;
}

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Más recientes' },
  { value: 'price:asc', label: 'Menor precio' },
  { value: 'price:desc', label: 'Mayor precio' },
  { value: 'name:asc', label: 'A–Z' },
] as const;

export function FilterPanel({ brands, maxProductPrice = 10000 }: FilterPanelProps) {
  const { currentFilters, setFilters, clearFilters } = useFilters();

  const hasActiveFilters =
    currentFilters.brand ||
    currentFilters.minPrice !== undefined ||
    currentFilters.maxPrice !== undefined;

  return (
    <aside className="w-full space-y-6">
      {/* Sort */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Ordenar por</h3>
        <select
          value={currentFilters.sort || 'createdAt:desc'}
          onChange={(e) => setFilters({ sort: e.target.value as typeof currentFilters.sort })}
          className="w-full border border-gray-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Brand filter */}
      {brands.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Marca</h3>
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            <label className="flex items-center gap-2 cursor-pointer text-sm py-0.5">
              <input
                type="radio"
                name="brand"
                value=""
                checked={!currentFilters.brand}
                onChange={() => setFilters({ brand: undefined })}
                className="accent-brand-500"
              />
              <span>Todas las marcas</span>
            </label>
            {brands.map((brand) => (
              <label key={brand.id} className="flex items-center gap-2 cursor-pointer text-sm py-0.5">
                <input
                  type="radio"
                  name="brand"
                  value={brand.slug}
                  checked={currentFilters.brand === brand.slug}
                  onChange={() => setFilters({ brand: brand.slug })}
                  className="accent-brand-500"
                />
                <span>{brand.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price range */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Precio máximo</h3>
        <input
          type="range"
          min={0}
          max={maxProductPrice}
          step={100}
          value={currentFilters.maxPrice ?? maxProductPrice}
          onChange={(e) =>
            setFilters({
              maxPrice: Number(e.target.value) < maxProductPrice ? Number(e.target.value) : undefined,
            })
          }
          className="w-full accent-brand-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Hasta {formatPrice(currentFilters.maxPrice ?? maxProductPrice)}
        </p>
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-brand-500 underline hover:text-brand-700 transition-colors"
        >
          Limpiar filtros
        </button>
      )}
    </aside>
  );
}
