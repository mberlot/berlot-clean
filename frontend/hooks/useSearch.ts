'use client';

import { useState, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export function useSearch(initialQuery = '') {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      if (value.trim().length >= 2) {
        startTransition(() => {
          router.push(`/buscar?q=${encodeURIComponent(value.trim())}`);
        });
      }
    },
    [router],
  );

  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);

  return { query, setQuery, handleSearch, clearSearch, isPending };
}
