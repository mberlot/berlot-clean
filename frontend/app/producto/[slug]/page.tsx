import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getProductBySlug, getAllProductSlugs, getProducts } from '@/services/products';
import { ProductGallery } from '@/components/ui/ProductGallery';
import { ProductTabs } from '@/components/ui/ProductTabs';
import { ProductGrid } from '@/components/ui/ProductGrid';
import { StickyAddToCart } from '@/components/ui/StickyAddToCart';
import { AddToCartSection } from '@/components/ui/AddToCartSection';
import { productMetadata, productJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { formatPrice, discountPercent } from '@/lib/utils';

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  return productMetadata(product);
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const relatedData = product.category
    ? await getProducts({ category: product.category.slug, pageSize: 5 })
    : { products: [] };
  const related = relatedData.products.filter((p) => p.id !== product.id).slice(0, 4);

  const discount = product.compareAtPrice
    ? discountPercent(product.price, product.compareAtPrice)
    : 0;
  const inStock = (product.stock ?? 0) > 0;

  const jsonLd = productJsonLd(product);
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Inicio', url: process.env.NEXT_PUBLIC_SITE_URL || '' },
    ...(product.category
      ? [{ name: product.category.name, url: `${process.env.NEXT_PUBLIC_SITE_URL}/categoria/${product.category.slug}` }]
      : []),
    { name: product.name, url: `${process.env.NEXT_PUBLIC_SITE_URL}/producto/${product.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* ── Breadcrumb ─────────────────────────────────────────── */}
      <div className="w-full border-b border-warm-border bg-ivory px-4 lg:px-[48px] py-3">
        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className="font-mono text-[10px] font-medium tracking-[1px] uppercase text-[#666666] hover:text-text-ink transition-colors"
          >
            Inicio
          </Link>
          {product.category && (
            <>
              <span className="font-mono text-[10px] text-[#666666]">/</span>
              <Link
                href={`/categoria/${product.category.slug}`}
                className="font-mono text-[10px] font-medium tracking-[1px] uppercase text-[#666666] hover:text-text-ink transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span className="font-mono text-[10px] text-[#666666]">/</span>
          <span className="font-mono text-[10px] font-medium tracking-[1px] uppercase text-text-ink line-clamp-1">
            {product.name}
          </span>
        </nav>
      </div>

      <div className="bg-ivory min-h-screen">
        {/* ── Main product section ──────────────────────────────── */}
        <div className="flex flex-col lg:flex-row w-full border-b border-warm-border">
          {/* Gallery — left column */}
          <div className="w-full lg:w-[55%] lg:border-r lg:border-warm-border p-4 lg:p-[48px]">
            <ProductGallery images={product.images || []} productName={product.name} />
          </div>

          {/* Product info — right column */}
          <div className="w-full lg:w-[45%] p-4 lg:p-[48px] flex flex-col gap-6">
            {/* Brand + badges */}
            <div className="flex items-center gap-3 flex-wrap">
              {product.brand && (
                <span className="font-mono text-[11px] font-medium tracking-[2px] uppercase text-navy">
                  {product.brand.name}
                </span>
              )}
              {product.offer && (
                <span className="font-mono text-[9px] font-medium tracking-[2px] uppercase bg-ink text-ivory px-2 py-1">
                  OFERTA
                </span>
              )}
              {product.featured && !product.offer && (
                <span className="font-mono text-[9px] font-medium tracking-[2px] uppercase bg-navy text-ivory px-2 py-1">
                  DESTACADO
                </span>
              )}
            </div>

            {/* Product name */}
            <h1 className="font-serif font-normal text-[28px] lg:text-[36px] text-text-ink leading-[1.1]">
              {product.name}
            </h1>

            {/* Short description */}
            {product.shortDescription && (
              <p className="font-sans text-sm text-text-dim leading-[1.6]">
                {product.shortDescription}
              </p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-4 border-t border-b border-warm-border py-5">
              <span className="font-serif italic font-normal text-[40px] leading-none text-gold">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <>
                  <span className="font-serif font-normal text-[22px] leading-none text-text-muted line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                  <span className="font-mono text-[11px] font-medium tracking-[1px] uppercase text-navy">
                    -{discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Unit + SKU */}
            <div className="flex flex-wrap gap-4">
              {product.unit && (
                <div>
                  <span className="font-mono text-[10px] font-medium tracking-[1.5px] uppercase text-text-muted">
                    Presentación
                  </span>
                  <p className="font-mono text-[12px] font-medium tracking-[0.5px] text-text-ink mt-0.5">
                    {product.unit}
                  </p>
                </div>
              )}
              {product.sku && (
                <div>
                  <span className="font-mono text-[10px] font-medium tracking-[1.5px] uppercase text-text-muted">
                    SKU
                  </span>
                  <p className="font-mono text-[12px] font-medium tracking-[0.5px] text-text-ink mt-0.5">
                    {product.sku}
                  </p>
                </div>
              )}
            </div>

            {/* Stock indicator */}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 flex-shrink-0 ${inStock ? 'bg-[#4CAF50]' : 'bg-[#E53935]'}`} />
              <span className="font-mono text-[11px] font-medium tracking-[1px] uppercase text-text-dim">
                {inStock ? 'En stock' : 'Sin stock'}
              </span>
            </div>

            {/* Min order qty */}
            {product.minOrderQuantity && product.minOrderQuantity > 1 && (
              <p className="font-mono text-[10px] tracking-[0.5px] text-text-muted">
                Pedido mínimo: {product.minOrderQuantity} {product.unit || 'unidades'}
              </p>
            )}

            {/* Add to cart — desktop only (mobile uses sticky bar) */}
            <div className="hidden lg:block">
              <AddToCartSection product={product} />
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] font-medium tracking-[1px] uppercase border border-warm-border text-text-muted px-3 py-1 hover:border-ink hover:text-text-ink transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Trust badges ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-warm-border">
          {[
            { icon: '🌿', label: 'Eco-Certificado', sub: 'Fórmulas sostenibles' },
            { icon: '🚚', label: 'Envío gratis', sub: 'En pedidos sobre $ 5.000' },
            { icon: '↩', label: 'Devolución 30 días', sub: 'Sin complicaciones' },
            { icon: '✓', label: 'Garantía de calidad', sub: 'Ingredientes premium' },
          ].map((badge, i) => (
            <div
              key={badge.label}
              className={`flex flex-col items-center justify-center gap-2 py-8 px-4 text-center ${
                i < 3 ? 'border-r border-warm-border' : ''
              } ${i >= 2 ? 'border-t lg:border-t-0 border-warm-border' : ''}`}
            >
              <span className="text-2xl">{badge.icon}</span>
              <span className="font-mono text-[11px] font-medium tracking-[1.5px] uppercase text-text-ink">
                {badge.label}
              </span>
              <span className="font-sans text-[12px] text-text-muted">
                {badge.sub}
              </span>
            </div>
          ))}
        </div>

        {/* ── Product tabs ─────────────────────────────────────── */}
        <div className="px-4 lg:px-[48px] py-0 border-b border-warm-border">
          <ProductTabs
            description={product.description}
            specifications={product.specifications}
          />
        </div>

        {/* ── Related products ─────────────────────────────────── */}
        {related.length > 0 && (
          <section className="border-b border-warm-border">
            {/* Section header */}
            <div className="flex items-end justify-between px-4 lg:px-[48px] pt-[48px] pb-5 border-b border-warm-border">
              <h2 className="font-serif font-normal text-[28px] lg:text-[32px] text-text-ink">
                También te puede gustar
              </h2>
              {product.category && (
                <Link
                  href={`/categoria/${product.category.slug}`}
                  className="font-mono text-[12px] font-medium tracking-[1.5px] uppercase text-text-dim hover:text-text-ink transition-colors"
                >
                  VER TODO →
                </Link>
              )}
            </div>
            {/* Grid */}
            <div className="px-4 lg:px-[48px] py-[40px] lg:py-[48px]">
              <ProductGrid products={related} />
            </div>
          </section>
        )}
      </div>

      {/* ── Sticky add-to-cart (mobile only) ─────────────────── */}
      <StickyAddToCart product={product} />
    </>
  );
}
