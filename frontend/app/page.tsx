import Link from 'next/link';
import { Hero } from '@/components/ui/Hero';
import { CategoryStrip } from '@/components/ui/CategoryStrip';
import { ProductGrid } from '@/components/ui/ProductGrid';
import { OfferBanners } from '@/components/ui/OfferBanners';
import { getFeaturedProducts } from '@/services/products';
import { getCategories, getFeaturedCategories } from '@/services/categories';
import { getHomepage } from '@/services/home';

export const revalidate = 120;

export default async function HomePage() {
  const [featuredProducts, allCategories, featuredCategories, homepage] =
    await Promise.all([
      getFeaturedProducts(8).catch(() => []),
      getCategories().catch(() => []),
      getFeaturedCategories().catch(() => []),
      getHomepage().catch(() => null),
    ]);

  // Prefer leaf categories for the strip — show up to 6
  const stripCategories = (featuredCategories.length ? featuredCategories : allCategories)
    .filter((c) => !c.subCategories?.length)
    .slice(0, 6);

  const displayCategories = stripCategories.length
    ? stripCategories
    : allCategories.slice(0, 6);

  return (
    <div className="w-full bg-ivory">
      {/* ── Hero ───────────────────────────────────────────── */}
      <Hero {...(homepage?.hero ?? {})} />

      {/* ── Category Strip ──────────────────────────────────── */}
      <CategoryStrip categories={displayCategories} />

      {/* ── Bestsellers ─────────────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="w-full border-b border-warm-border bg-ivory">
          {/* Section header */}
          <div className="flex items-end justify-between px-8 sm:px-12 lg:px-[60px] pt-[60px] pb-5 border-b border-warm-border">
            <h2 className="font-serif font-normal text-2xl lg:text-[36px] text-text-ink">
              Lo más vendido
            </h2>
            <Link
              href="/categorias"
              className="font-mono text-[13px] font-medium tracking-[1px] uppercase text-text-dim hover:text-text-ink transition-colors"
            >
              VER TODO →
            </Link>
          </div>
          {/* Product grid */}
          <div className="px-8 sm:px-12 lg:px-[60px] py-[40px] lg:py-[60px]">
            <ProductGrid products={featuredProducts} />
          </div>
        </section>
      )}

      {/* ── Offer Banners + Shipping ─────────────────────────── */}
      <OfferBanners />
    </div>
  );
}
