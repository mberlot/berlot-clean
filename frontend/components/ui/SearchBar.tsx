'use client';

import { useRef, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  defaultValue = '',
  placeholder = 'Buscar productos...',
  className,
}: SearchBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = inputRef.current?.value?.trim();
    if (q && q.length >= 2) {
      router.push(`/buscar?q=${encodeURIComponent(q)}`);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex items-stretch w-full', className)}
      role="search"
    >
      <div className="relative flex-1">
        <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg
            className="w-4 h-4 text-text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
        </span>
        <input
          ref={inputRef}
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder={placeholder}
          aria-label="Buscar productos"
          className="w-full h-full pl-11 pr-4 py-3 bg-ivory border border-warm-border text-text-ink text-sm font-sans placeholder-text-muted focus:outline-none focus:border-ink transition-colors"
        />
      </div>
      <button
        type="submit"
        className="flex-shrink-0 bg-ink text-ivory font-mono text-xs tracking-widest uppercase px-6 hover:bg-ink/85 transition-colors"
      >
        Buscar
      </button>
    </form>
  );
}
