'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type { ProductFilters } from '@/types';

export function useFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentFilters: ProductFilters = {
    sort: (searchParams.get('sort') as ProductFilters['sort']) || 'createdAt:desc',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    brand: searchParams.get('brand') || undefined,
    search: searchParams.get('search') || undefined,
    page: Number(searchParams.get('page') || '1'),
  };

  const setFilters = useCallback(
    (updates: Partial<ProductFilters>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      // Reset to page 1 when filters change (unless page is explicitly set)
      if (!('page' in updates)) params.set('page', '1');

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const clearFilters = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  return { currentFilters, setFilters, clearFilters };
}
