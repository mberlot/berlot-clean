'use client';

import { useState } from 'react';
import { useCart } from '@/features/cart/CartContext';
import type { Product } from '@/types';
import { imageUrl, cn } from '@/lib/utils';

interface AddToCartButtonProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AddToCartButton({ product, size = 'md', className }: AddToCartButtonProps) {
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

  const sizeClasses = {
    sm: 'text-xs py-1.5 px-3',
    md: 'text-sm py-2 px-4',
    lg: 'text-base py-3 px-6',
  };

  return (
    <button
      onClick={handleAdd}
      disabled={!inStock}
      className={cn(
        'w-full font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        sizeClasses[size],
        inStock
          ? added
            ? 'bg-green-500 text-white scale-95'
            : 'bg-brand-500 hover:bg-brand-600 text-white active:scale-95'
          : 'bg-gray-100 text-gray-400 cursor-not-allowed',
        className,
      )}
    >
      {!inStock ? 'Sin stock' : added ? '✓ Agregado' : 'Agregar al carrito'}
    </button>
  );
}
