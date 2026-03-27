'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { Product } from '@/types';
import { imageUrl, formatPrice, PLACEHOLDER_IMAGE } from '@/lib/utils';
import { useCart } from '@/features/cart/CartContext';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const inStock = (product.stock ?? 0) > 0;

  function handleAdd() {
    if (!inStock) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: imageUrl(product.images?.[0], 'thumbnail'),
      quantity: product.minOrderQuantity ?? 1,
      unit: product.unit,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <article className={`flex flex-row sm:flex-col bg-ivory ${className ?? ''}`}>
      {/* ── Image ───────────────────────────────────────── */}
      <Link
        href={`/producto/${product.slug}`}
        className="relative flex-shrink-0 w-[120px] h-[160px] sm:w-auto sm:h-[280px] overflow-hidden bg-warm-border/40 block"
      >
        <Image
          src={product.images?.[0] ? imageUrl(product.images[0], 'small') : PLACEHOLDER_IMAGE}
          alt={product.images?.[0]?.alternativeText || product.name}
          fill
          className="object-contain p-3 sm:p-4 hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 120px, (max-width: 1024px) 33vw, 25vw"
          loading="lazy"
        />

        {product.offer && (
          <span className="absolute top-2 left-2 bg-ink text-ivory font-mono text-[9px] sm:text-[10px] tracking-widest uppercase px-2 py-0.5">
            OFERTA
          </span>
        )}
        {product.featured && !product.offer && (
          <span className="absolute top-2 left-2 bg-navy text-ivory font-mono text-[9px] sm:text-[10px] tracking-widest uppercase px-2 py-0.5">
            DESTACADO
          </span>
        )}
      </Link>

      {/* ── Content ─────────────────────────────────────── */}
      <div className="flex flex-col gap-2 p-4 flex-1 sm:gap-2.5 sm:p-5">
        {/* Name */}
        <Link href={`/producto/${product.slug}`}>
          <h3 className="font-serif font-normal text-[15px] sm:text-lg text-text-ink leading-snug hover:text-navy transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="font-mono text-[10px] sm:text-[11px] font-medium tracking-[1px] uppercase text-[#666666] line-clamp-1">
          {product.shortDescription ?? product.unit ?? '\u00A0'}
        </p>

        {/* Price + Add button */}
        <div className="flex items-center justify-between mt-auto pt-1 gap-2 flex-wrap">
          <span className="font-serif italic font-normal text-[18px] sm:text-[22px] leading-none text-gold whitespace-nowrap">
            {formatPrice(product.price)}
          </span>

          <button
            onClick={handleAdd}
            disabled={!inStock}
            aria-label={`Agregar ${product.name} al carrito`}
            className={`font-mono text-[10px] sm:text-[11px] font-medium tracking-[2px] uppercase py-2 sm:py-2.5 px-3 sm:px-5 transition-colors flex-shrink-0 ${
              !inStock
                ? 'bg-warm-border text-text-muted cursor-not-allowed'
                : added
                ? 'bg-navy text-ivory'
                : 'bg-ink text-ivory hover:bg-ink/80'
            }`}
          >
            <span className="sm:hidden">{!inStock ? 'AGOT.' : added ? '✓' : 'AGRE.'}</span>
            <span className="hidden sm:inline">{!inStock ? 'SIN STOCK' : added ? 'AGREGADO ✓' : 'AGREGAR'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
