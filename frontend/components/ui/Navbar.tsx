'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/features/cart/CartContext';
import { formatPrice } from '@/lib/utils';
import type { Category } from '@/types';

interface NavbarProps {
  categories: Category[];
}

const NAV_LINKS = [
  { label: 'TIENDA', href: '/categorias' },
  { label: 'CATEGORÍAS', href: '/categorias' },
  { label: 'NOSOTROS', href: '/about' },
  { label: 'CONTACTO', href: '/contacto' },
];

export function Navbar({ categories }: NavbarProps) {
  const { totalItems, totalPrice, items, removeItem, updateQuantity } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-ivory border-b border-warm-border">
        <div className="flex items-stretch h-[64px] px-8 lg:px-[48px]">

          {/* ── Logo ────────────────────────────────────── */}
          <Link
            href="/"
            className="flex items-center flex-shrink-0 pr-10 border-r border-warm-border"
          >
            <span className="font-serif font-bold text-[22px] tracking-[1px] text-text-ink whitespace-nowrap">
              {process.env.NEXT_PUBLIC_SITE_NAME ?? 'Berlot Clean'}
            </span>
          </Link>

          {/* ── Nav links — desktop ─────────────────────── */}
          <nav className="hidden md:flex items-center flex-1 justify-center gap-8 px-8">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="font-mono text-[13px] font-medium tracking-[0.5px] text-text-ink hover:text-navy transition-colors whitespace-nowrap"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* ── Actions ─────────────────────────────────── */}
          <div className="flex items-stretch ml-auto">
            {/* Search icon */}
            <Link
              href="/buscar"
              aria-label="Buscar"
              className="flex items-center px-5 border-l border-warm-border text-text-ink hover:text-navy transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </Link>

            {/* Cart icon */}
            <button
              onClick={() => setCartOpen(true)}
              aria-label={`Mi pedido, ${totalItems} artículos`}
              className="relative flex items-center px-5 border-l border-warm-border text-text-ink hover:text-navy transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-3 right-3 bg-ink text-ivory font-mono text-[9px] w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* CTA button */}
            <button
              onClick={() => setCartOpen(true)}
              className="hidden md:flex items-center border-l border-warm-border bg-ink text-ivory font-mono text-[13px] font-medium tracking-[2px] uppercase px-6 hover:bg-ink/85 transition-colors"
            >
              MI PEDIDO
            </button>

            {/* Hamburger — mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menú"
              className="md:hidden flex items-center px-5 border-l border-warm-border text-text-ink"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Mobile menu ─────────────────────────────── */}
        {menuOpen && (
          <nav className="md:hidden bg-ivory border-t border-warm-border">
            <ul className="divide-y divide-warm-border">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="block px-8 py-4 font-mono text-[13px] font-medium tracking-[0.5px] text-text-ink hover:text-navy transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              {categories.slice(0, 8).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categoria/${cat.slug}`}
                    className="block px-8 py-4 font-mono text-[13px] font-medium tracking-[0.5px] text-text-dim hover:text-navy transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      {/* ── Cart sidebar ────────────────────────────────── */}
      {cartOpen && (
        <CartSidebar
          items={items}
          totalItems={totalItems}
          totalPrice={totalPrice}
          onClose={() => setCartOpen(false)}
          removeItem={removeItem}
          updateQuantity={updateQuantity}
        />
      )}
    </>
  );
}

// ─── Cart sidebar ─────────────────────────────────────────────
type CartItem = ReturnType<typeof useCart>['items'][number];

function CartSidebar({
  items,
  totalItems,
  totalPrice,
  onClose,
  removeItem,
  updateQuantity,
}: {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  onClose: () => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
}) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-full w-full max-w-sm bg-ivory z-50 flex flex-col border-l border-warm-border">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-warm-border">
          <h2 className="font-serif font-normal text-xl text-text-ink">Mi Pedido</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="text-text-muted hover:text-text-ink transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {items.length === 0 ? (
            <p className="text-center font-mono text-xs tracking-widest uppercase text-text-muted py-16">
              Tu pedido está vacío.
            </p>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="flex items-start gap-4 border-b border-warm-border pb-5">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={56}
                    height={56}
                    className="object-contain bg-warm-border/30 flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-serif font-normal text-sm text-text-ink leading-snug">{item.name}</p>
                  <p className="font-serif italic text-gold text-sm mt-0.5">{formatPrice(item.price)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center border border-warm-border text-text-ink font-mono text-sm hover:bg-warm-border transition-colors"
                    >
                      −
                    </button>
                    <span className="font-mono text-xs w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center border border-warm-border text-text-ink font-mono text-sm hover:bg-warm-border transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  aria-label="Eliminar"
                  className="text-text-muted hover:text-text-ink transition-colors mt-0.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-warm-border space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="font-mono text-[11px] tracking-widest uppercase text-text-muted">
                {totalItems} {totalItems !== 1 ? 'artículos' : 'artículo'}
              </span>
              <span className="font-serif italic text-gold text-xl">{formatPrice(totalPrice)}</span>
            </div>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(buildWhatsAppMessage(items))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-ink text-ivory text-center font-mono text-[12px] font-medium tracking-[2px] uppercase py-4 hover:bg-ink/85 transition-colors"
            >
              CONSULTAR POR WHATSAPP
            </a>
          </div>
        )}
      </aside>
    </>
  );
}

function buildWhatsAppMessage(items: CartItem[]): string {
  const lines = items.map(
    (i) => `• ${i.quantity}x ${i.name} — ${formatPrice(i.price * i.quantity)}`,
  );
  const total = formatPrice(items.reduce((s, i) => s + i.price * i.quantity, 0));
  return `¡Hola! Quisiera consultar sobre el siguiente pedido:\n\n${lines.join('\n')}\n\nTotal estimado: ${total}`;
}
