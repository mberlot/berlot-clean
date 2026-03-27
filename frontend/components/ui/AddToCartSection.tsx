'use client';

import { useState } from 'react';
import { useCart } from '@/features/cart/CartContext';
import type { Product } from '@/types';
import { imageUrl, formatPrice } from '@/lib/utils';

interface AddToCartSectionProps {
  product: Product;
}

export function AddToCartSection({ product }: AddToCartSectionProps) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(product.minOrderQuantity ?? 1);
  const [added, setAdded] = useState(false);
  const inStock = (product.stock ?? 0) > 0;
  const min = product.minOrderQuantity ?? 1;

  function handleAdd() {
    if (!inStock) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: imageUrl(product.images?.[0], 'thumbnail'),
      quantity: qty,
      unit: product.unit,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Quantity selector */}
      <div className="flex items-center gap-0 border border-warm-border w-fit">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(min, q - 1))}
          disabled={qty <= min}
          aria-label="Reducir cantidad"
          className="w-11 h-11 flex items-center justify-center font-mono text-lg text-text-ink hover:bg-warm-border/40 transition-colors disabled:opacity-30 border-r border-warm-border"
        >
          −
        </button>
        <span className="w-12 h-11 flex items-center justify-center font-mono text-[13px] font-medium text-text-ink select-none">
          {qty}
        </span>
        <button
          type="button"
          onClick={() => setQty((q) => q + 1)}
          aria-label="Aumentar cantidad"
          className="w-11 h-11 flex items-center justify-center font-mono text-lg text-text-ink hover:bg-warm-border/40 transition-colors border-l border-warm-border"
        >
          +
        </button>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAdd}
        disabled={!inStock}
        className={`w-full h-14 font-mono text-[12px] font-medium tracking-[2px] uppercase transition-colors ${
          !inStock
            ? 'bg-warm-border text-text-muted cursor-not-allowed'
            : added
            ? 'bg-navy text-ivory'
            : 'bg-ink text-ivory hover:bg-ink/85'
        }`}
      >
        {!inStock ? 'SIN STOCK' : added ? 'AGREGADO ✓' : 'AGREGAR AL CARRITO'}
      </button>

      {/* Total for qty */}
      {inStock && qty > 1 && (
        <p className="font-mono text-[11px] text-text-muted tracking-[0.5px]">
          Subtotal: <span className="text-text-ink">{formatPrice(product.price * qty)}</span>
        </p>
      )}
    </div>
  );
}
