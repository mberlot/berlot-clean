import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getCategoryBySlug, getAllCategorySlugs, getCategories } from '@/services/categories';
import { getProducts } from '@/services/products';
import { apiFetch } from '@/services/api';
import { PLPFilters } from '@/components/ui/PLPFilters';
import { PLPSortSelect } from '@/components/ui/PLPSortSelect';
import { ProductGrid } from '@/components/ui/ProductGrid';
import { categoryMetadata, breadcrumbJsonLd } from '@/lib/seo';
import type { Brand, StrapiListResponse, ProductFilters } from '@/types';

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return {};
  return categoryMetadata(category);
}

async function getBrands(): Promise<Brand[]> {
  const res = await apiFetch<StrapiListResponse<Brand>>(
    '/brands?fields[0]=name&fields[1]=slug&pagination[pageSize]=100',
    { revalidate: 3600, tags: ['brands'] },
  );
  return res.data as Brand[];
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const [category, allCategories, brands] = await Promise.all([
    getCategoryBySlug(params.slug),
    getCategories(),
    getBrands(),
  ]);

  if (!category) notFound();

  const filters: ProductFilters = {
    category: params.slug,
    brand:     typeof searchParams.brand === 'string' ? searchParams.brand : undefined,
    search:    typeof searchParams.search === 'string' ? searchParams.search : undefined,
    sort:      (searchParams.sort as ProductFilters['sort']) || 'createdAt:desc',
    minPrice:  searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice:  searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    page:      Number(searchParams.page || '1'),
    pageSize:  24,
  };

  const { products, total, pageCount } = await getProducts(filters);

  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', url: process.env.NEXT_PUBLIC_SITE_URL || '' },
    { name: category.name, url: `${process.env.NEXT_PUBLIC_SITE_URL}/categoria/${category.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* ── Title bar ─────────────────────────────────────── */}
      <div className="w-full border-b border-warm-border bg-ivory">
        {/* Desktop: breadcrumb + title + count + sort */}
        <div className="hidden lg:flex items-end justify-between px-[48px] py-6">
          <div className="flex flex-col gap-1.5">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2">
              <Link
                href="/"
                className="font-mono text-[10px] font-medium tracking-[1px] uppercase text-[#666666] hover:text-text-ink transition-colors"
              >
                Inicio
              </Link>
              <span className="font-mono text-[10px] text-[#666666]">/</span>
              <span className="font-mono text-[10px] font-medium tracking-[1px] uppercase text-text-ink">
                {category.name}
              </span>
            </nav>
            {/* Title */}
            <h1 className="font-serif font-normal text-[36px] text-text-ink leading-tight">
              {category.name}
            </h1>
          </div>
          {/* Right: count + sort */}
          <div className="flex items-center gap-6">
            <span className="font-mono text-[11px] font-medium tracking-[1.5px] uppercase text-[#666666]">
              {total} Producto{total !== 1 ? 's' : ''}
            </span>
            <Suspense>
              <PLPSortSelect />
            </Suspense>
          </div>
        </div>

        {/* Mobile: title + count only */}
        <div className="lg:hidden px-4 py-4">
          <h1 className="font-serif font-normal text-[28px] text-text-ink">
            {category.name}
          </h1>
          <p className="font-mono text-[11px] font-medium tracking-[1.5px] uppercase text-[#666666] mt-1">
            {total} Producto{total !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* ── Body: sidebar + main ───────────────────────────── */}
      <div className="flex flex-col lg:flex-row w-full bg-ivory min-h-screen">

        {/* Filter sidebar (desktop) / toolbar + modal (mobile) */}
        <Suspense>
          <PLPFilters
            categories={allCategories}
            brands={brands}
            currentSlug={params.slug}
          />
        </Suspense>

        {/* ── Main content ──────────────────────────────────── */}
        <main className="flex-1 min-w-0 flex flex-col">

          {/* Category description */}
          {category.description && (
            <p className="font-sans text-sm text-text-dim px-4 lg:px-8 pt-4 pb-0">
              {category.description}
            </p>
          )}

          {/* Product grid */}
          <div className="px-0 lg:px-8 pt-4 lg:pt-8 pb-8 lg:pb-[60px] flex-1">
            <ProductGrid products={products} />
          </div>

          {/* Load more + pagination */}
          {pageCount > 1 && (
            <div className="flex flex-col items-center gap-4 px-4 lg:px-8 pb-[60px]">
              <PLPPagination
                currentPage={filters.page ?? 1}
                pageCount={pageCount}
                slug={params.slug}
              />
              <span className="font-mono text-[10px] font-medium tracking-[1px] uppercase text-[#666666]">
                Mostrando {Math.min((filters.page ?? 1) * 24, total)} de {total} productos
              </span>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

// ─── Pagination ───────────────────────────────────────────────
function PLPPagination({
  currentPage,
  pageCount,
  slug,
}: {
  currentPage: number;
  pageCount: number;
  slug: string;
}) {
  // Show load-more style button when there are more pages
  const nextPage = currentPage + 1;
  const hasMore = currentPage < pageCount;

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Load more button */}
      {hasMore && (
        <Link
          href={`/categoria/${slug}?page=${nextPage}`}
          className="w-full flex items-center justify-center h-12 border border-warm-border hover:border-ink font-mono text-[12px] font-medium tracking-[2px] uppercase text-text-ink hover:text-ink transition-colors"
        >
          Cargar más productos
        </Link>
      )}

      {/* Page numbers */}
      {pageCount > 1 && (
        <nav className="flex items-center gap-1" aria-label="Pagination">
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/categoria/${slug}?page=${p}`}
              className={`w-9 h-9 flex items-center justify-center font-mono text-[11px] font-medium tracking-[0.5px] transition-colors ${
                p === currentPage
                  ? 'bg-ink text-ivory'
                  : 'border border-warm-border text-text-dim hover:border-ink hover:text-text-ink'
              }`}
            >
              {p}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
