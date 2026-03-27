'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/features/cart/CartContext';
import { SearchBar } from '@/components/ui/SearchBar';
import type { Category } from '@/types';
import { cn } from '@/lib/utils';

interface NavbarProps {
  categories: Category[];
}

export function Navbar({ categories }: NavbarProps) {
  const { totalItems, totalPrice } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      {/* Top bar */}
      <div className="container mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt={process.env.NEXT_PUBLIC_SITE_NAME || 'Logo'}
            width={40}
            height={40}
            className="h-8 w-auto"
            priority
          />
          <span className="font-extrabold text-xl text-brand-600 hidden sm:block">
            {process.env.NEXT_PUBLIC_SITE_NAME || 'Berlot Clean'}
          </span>
        </Link>

        {/* Search — desktop */}
        <div className="hidden md:flex flex-1 max-w-lg">
          <SearchBar />
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-3">
          {/* Cart button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            aria-label={`Pedido: ${totalItems} items`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6H19M7 13L5.4 5M10 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
              />
            </svg>
            <span className="hidden sm:inline">Pedido</span>
            {totalItems > 0 && (
              <span className="bg-white text-brand-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* Hamburger — mobile */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-brand-600 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Search — mobile */}
      <div className="md:hidden px-4 pb-3">
        <SearchBar />
      </div>

      {/* Category nav — desktop */}
      <nav className="hidden md:block border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-1 overflow-x-auto">
            {categories.slice(0, 14).map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/categoria/${cat.slug}`}
                  className="block px-3 py-2 text-xs font-medium text-gray-600 hover:text-brand-600 hover:bg-white rounded-lg transition-colors whitespace-nowrap"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/categorias"
                className="block px-3 py-2 text-xs font-semibold text-brand-500 hover:text-brand-700 whitespace-nowrap"
              >
                Ver todas →
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <ul className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/categoria/${cat.slug}`}
                  className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-600 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Cart sidebar (minimal) */}
      {cartOpen && (
        <CartSidebar totalItems={totalItems} totalPrice={totalPrice} onClose={() => setCartOpen(false)} />
      )}
    </header>
  );
}

// ─── Inline cart sidebar ──────────────────────────────────────
import { useCart as useCartHook } from '@/features/cart/CartContext';
import { formatPrice } from '@/lib/utils';

function CartSidebar({
  totalItems,
  totalPrice,
  onClose,
}: {
  totalItems: number;
  totalPrice: number;
  onClose: () => void;
}) {
  const { items, removeItem, updateQuantity } = useCartHook();

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-lg text-gray-800">Mi Pedido</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-gray-400 py-12">Tu pedido está vacío.</p>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3">
                {item.image && (
                  <Image src={item.image} alt={item.name} width={50} height={50} className="rounded-lg object-contain bg-gray-50" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm"
                  >−</button>
                  <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm"
                  >+</button>
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-gray-300 hover:text-red-400 transition-colors ml-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-gray-100 space-y-3">
            <div className="flex justify-between text-sm font-semibold text-gray-800">
              <span>{totalItems} producto{totalItems !== 1 ? 's' : ''}</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(buildWhatsAppMessage(items))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-500 hover:bg-green-600 text-white text-center font-bold py-3 rounded-xl transition-colors"
            >
              Consultar por WhatsApp
            </a>
          </div>
        )}
      </aside>
    </>
  );
}

function buildWhatsAppMessage(items: ReturnType<typeof useCartHook>['items']): string {
  const lines = items.map(
    (i) => `• ${i.quantity}x ${i.name} — ${formatPrice(i.price * i.quantity)}`,
  );
  return `¡Hola! Quisiera consultar sobre el siguiente pedido:\n\n${lines.join('\n')}\n\nTotal estimado: ${formatPrice(items.reduce((s, i) => s + i.price * i.quantity, 0))}`;
}
