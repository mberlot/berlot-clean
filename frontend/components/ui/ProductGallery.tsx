'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { StrapiImage } from '@/types';
import { imageUrl, PLACEHOLDER_IMAGE } from '@/lib/utils';

interface ProductGalleryProps {
  images: StrapiImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-warm-border/30 border border-warm-border relative overflow-hidden">
        <Image
          src={PLACEHOLDER_IMAGE}
          alt={productName}
          fill
          className="object-contain p-10"
          sizes="(max-width: 1024px) 100vw, 55vw"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square bg-warm-border/20 border border-warm-border overflow-hidden">
        <Image
          src={imageUrl(images[selected], 'large')}
          alt={images[selected].alternativeText || productName}
          fill
          className="object-contain p-6 hover:scale-105 transition-transform duration-500"
          priority={selected === 0}
          sizes="(max-width: 1024px) 100vw, 55vw"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setSelected((s) => Math.max(0, s - 1))}
              disabled={selected === 0}
              aria-label="Imagen anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-ivory border border-warm-border hover:border-ink transition-colors disabled:opacity-30"
            >
              <svg className="w-4 h-4 text-text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setSelected((s) => Math.min(images.length - 1, s + 1))}
              disabled={selected === images.length - 1}
              aria-label="Imagen siguiente"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-ivory border border-warm-border hover:border-ink transition-colors disabled:opacity-30"
            >
              <svg className="w-4 h-4 text-text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setSelected(i)}
              className={`flex-shrink-0 w-[72px] h-[72px] border transition-colors overflow-hidden ${
                i === selected ? 'border-ink' : 'border-warm-border hover:border-text-dim'
              }`}
            >
              <Image
                src={imageUrl(img, 'thumbnail')}
                alt={img.alternativeText || `${productName} ${i + 1}`}
                width={72}
                height={72}
                className="w-full h-full object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}

      {/* Dot indicators (mobile only, when > 1 image) */}
      {images.length > 1 && (
        <div className="flex justify-center gap-1.5 sm:hidden">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-1.5 h-1.5 transition-colors ${i === selected ? 'bg-ink' : 'bg-warm-border'}`}
              aria-label={`Ir a la imagen ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
