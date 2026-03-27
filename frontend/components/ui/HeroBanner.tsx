'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { HeroBannerBlock } from '@/types';
import { imageUrl, cn } from '@/lib/utils';

interface HeroBannerProps {
  banners: HeroBannerBlock[];
  autoPlayInterval?: number;
}

export function HeroBanner({ banners, autoPlayInterval = 5000 }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const active = banners.filter((b) => b.active !== false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % active.length), [active.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + active.length) % active.length), [active.length]);

  useEffect(() => {
    if (active.length <= 1) return;
    const id = setInterval(next, autoPlayInterval);
    return () => clearInterval(id);
  }, [next, active.length, autoPlayInterval]);

  if (active.length === 0) return null;

  const banner = active[current];
  const positionClasses = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  };

  return (
    <section className="relative w-full aspect-[21/9] md:aspect-[3/1] overflow-hidden rounded-2xl">
      {/* Images */}
      {active.map((b, i) => (
        <div
          key={i}
          className={cn(
            'absolute inset-0 transition-opacity duration-700',
            i === current ? 'opacity-100' : 'opacity-0 pointer-events-none',
          )}
        >
          <Image
            src={imageUrl(b.image)}
            alt={b.title}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
          {b.overlay && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
          )}
        </div>
      ))}

      {/* Content */}
      <div
        className={cn(
          'relative z-10 h-full flex flex-col justify-center px-8 md:px-16 gap-4',
          positionClasses[banner.textPosition ?? 'left'],
        )}
      >
        <h1 className="text-2xl md:text-5xl font-extrabold text-white drop-shadow-sm leading-tight max-w-lg">
          {banner.title}
        </h1>
        {banner.subtitle && (
          <p className="text-sm md:text-lg text-white/90 max-w-md">{banner.subtitle}</p>
        )}
        {banner.ctaUrl && banner.ctaLabel && (
          <Link
            href={banner.ctaUrl}
            className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-bold py-2.5 px-6 rounded-xl transition-colors text-sm md:text-base w-fit"
          >
            {banner.ctaLabel}
          </Link>
        )}
      </div>

      {/* Navigation arrows */}
      {active.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Banner anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Banner siguiente"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {active.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {active.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Ir al banner ${i + 1}`}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                i === current ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80',
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
