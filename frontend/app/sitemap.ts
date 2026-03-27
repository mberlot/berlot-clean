import type { MetadataRoute } from 'next';
import { getAllProductSlugs } from '@/services/products';
import { getAllCategorySlugs } from '@/services/categories';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productSlugs, categorySlugs] = await Promise.all([
    getAllProductSlugs(),
    getAllCategorySlugs(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), priority: 1.0, changeFrequency: 'daily' },
    { url: `${SITE_URL}/ofertas`, lastModified: new Date(), priority: 0.9, changeFrequency: 'daily' },
    { url: `${SITE_URL}/categorias`, lastModified: new Date(), priority: 0.8, changeFrequency: 'weekly' },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${SITE_URL}/categoria/${slug}`,
    lastModified: new Date(),
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  }));

  const productRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${SITE_URL}/producto/${slug}`,
    lastModified: new Date(),
    priority: 0.7,
    changeFrequency: 'weekly' as const,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
