'use client';

import { useState } from 'react';
import { useCart } from '@/features/cart/CartContext';
import type { Product } from '@/types';
import { imageUrl, formatPrice } from '@/lib/utils';

interface StickyAddToCartProps {
  product: Product;
}

export function StickyAddToCart({ product }: StickyAddToCartProps) {
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
    <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-ivory border-t border-warm-border px-4 py-3 flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <p className="font-serif font-normal text-base text-text-ink truncate">{product.name}</p>
        <p className="font-serif italic text-[20px] leading-none text-gold">{formatPrice(product.price)}</p>
      </div>
      <button
        onClick={handleAdd}
        disabled={!inStock}
        className={`flex-shrink-0 h-12 px-6 font-mono text-[11px] font-medium tracking-[2px] uppercase transition-colors ${
          !inStock
            ? 'bg-warm-border text-text-muted cursor-not-allowed'
            : added
            ? 'bg-navy text-ivory'
            : 'bg-ink text-ivory hover:bg-ink/85'
        }`}
      >
        {!inStock ? 'SIN STOCK' : added ? 'AGREGADO ✓' : 'AGREGAR'}
      </button>
    </div>
  );
}
