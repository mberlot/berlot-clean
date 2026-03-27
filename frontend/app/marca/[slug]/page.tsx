import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { apiFetch, buildQuery } from '@/services/api';
import { getProducts } from '@/services/products';
import { ProductGrid } from '@/components/ui/ProductGrid';
import { brandMetadata } from '@/lib/seo';
import Image from 'next/image';
import type { Brand, StrapiListResponse } from '@/types';
import { imageUrl } from '@/lib/utils';

export const revalidate = 3600;

interface PageProps {
  params: { slug: string };
  searchParams: { page?: string };
}

async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const qs = buildQuery({ 'filters[slug][$eq]': slug });
  const res = await apiFetch<StrapiListResponse<Brand>>(
    `/brands${qs}&populate[logo]=*`,
    { tags: [`brand-${slug}`], revalidate: 3600 },
  );
  if (!res.data.length) return null;
  // v5: data is flat — no attributes wrapper
  return res.data[0] as Brand;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const brand = await getBrandBySlug(params.slug);
  if (!brand) return {};
  return brandMetadata(brand);
}

export default async function BrandPage({ params, searchParams }: PageProps) {
  const [brand, { products, total }] = await Promise.all([
    getBrandBySlug(params.slug),
    getProducts({ brand: params.slug, page: Number(searchParams.page || '1'), pageSize: 24 }),
  ]);

  if (!brand) notFound();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Brand header */}
      <div className="flex items-center gap-6">
        {brand.logo && (
          <Image
            src={imageUrl(brand.logo)}
            alt={brand.name}
            width={96}
            height={96}
            className="object-contain"
          />
        )}
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">{brand.name}</h1>
          {brand.description && (
            <p className="text-gray-600 mt-1 max-w-xl">{brand.description}</p>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-500">{total} producto{total !== 1 ? 's' : ''}</p>

      <ProductGrid products={products} />
    </div>
  );
}
