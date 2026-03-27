import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getCategories } from '@/services/categories';
import { imageUrl, PLACEHOLDER_IMAGE } from '@/lib/utils';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Categorías — Berlot Clean',
  description: 'Explorá todas las categorías de productos de limpieza. Catálogo completo para el hogar, cocina, industria y más.',
};

export default async function CategoriasPage() {
  const categories = await getCategories();

  return (
    <div className="w-full bg-ivory min-h-screen">
      {/* ── Title bar ─────────────────────────────────── */}
      <div className="w-full border-b border-warm-border bg-ivory px-4 lg:px-[48px] py-6">
        <nav className="flex items-center gap-2 mb-3">
          <Link
            href="/"
            className="font-mono text-[10px] font-medium tracking-[1px] uppercase text-[#666666] hover:text-text-ink transition-colors"
          >
            Inicio
          </Link>
          <span className="font-mono text-[10px] text-[#666666]">/</span>
          <span className="font-mono text-[10px] font-medium tracking-[1px] uppercase text-text-ink">
            Categorías
          </span>
        </nav>
        <h1 className="font-serif font-normal text-[28px] lg:text-[36px] text-text-ink">
          Todas las categorías
        </h1>
      </div>

      {/* ── Category grid ─────────────────────────────── */}
      <div className="px-4 lg:px-[48px] py-[40px] lg:py-[60px]">
        {categories.length === 0 ? (
          <p className="font-mono text-[11px] tracking-[1px] uppercase text-text-muted text-center py-20">
            No hay categorías disponibles.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-l border-t border-warm-border">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className="group flex flex-col border-r border-b border-warm-border hover:bg-warm-border/10 transition-colors"
              >
                {/* Image */}
                <div className="relative overflow-hidden bg-warm-border/30" style={{ height: 220 }}>
                  {cat.image ? (
                    <Image
                      src={imageUrl(cat.image, 'medium')}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <Image
                      src={PLACEHOLDER_IMAGE}
                      alt={cat.name}
                      fill
                      className="object-contain p-8"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                </div>

                {/* Label */}
                <div className="flex items-center justify-between px-5 py-4">
                  <span className="font-mono text-[13px] font-medium tracking-[1.5px] uppercase text-text-ink group-hover:text-navy transition-colors">
                    {cat.name}
                  </span>
                  <svg
                    className="w-4 h-4 text-text-muted group-hover:text-navy group-hover:translate-x-0.5 transition-all"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {cat.description && (
                  <p className="font-sans text-[13px] text-text-dim px-5 pb-4 line-clamp-2">
                    {cat.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
