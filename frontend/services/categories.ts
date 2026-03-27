import { apiFetch, buildQuery } from './api';
import type { Category, StrapiListResponse } from '@/types';

// v5: data is flat — no attributes wrapper
function normalizeCategory(raw: Category & { documentId: string }): Category {
  return raw;
}

export async function getCategories(): Promise<Category[]> {
  const res = await apiFetch<StrapiListResponse<Category>>(
    '/categories?populate[image][fields][0]=url&populate[image][fields][1]=alternativeText&populate[image][fields][2]=width&populate[image][fields][3]=height&populate[subCategories][fields][0]=name&populate[subCategories][fields][1]=slug&sort=sortOrder:asc&pagination[pageSize]=100',
    { tags: ['categories'], revalidate: 3600 },
  );
  return res?.data.map(normalizeCategory) ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const qs = buildQuery({ 'filters[slug][$eq]': slug });
  const res = await apiFetch<StrapiListResponse<Category>>(
    `/categories${qs}&populate[image][fields][0]=url&populate[image][fields][1]=alternativeText&populate[image][fields][2]=width&populate[image][fields][3]=height&populate[parentCategory][fields][0]=name&populate[parentCategory][fields][1]=slug`,
    { tags: [`category-${slug}`], revalidate: 3600 },
  );
  if (!res?.data.length) return null;
  return normalizeCategory(res.data[0]);
}

export async function getFeaturedCategories(): Promise<Category[]> {
  const qs = buildQuery({ 'filters[featured][$eq]': true });
  const res = await apiFetch<StrapiListResponse<Category>>(
    `/categories${qs}&populate[image][fields][0]=url&populate[image][fields][1]=alternativeText&populate[image][fields][2]=width&populate[image][fields][3]=height&sort=sortOrder:asc&pagination[pageSize]=12`,
    { tags: ['categories', 'featured-categories'], revalidate: 3600 },
  );
  return res?.data.map(normalizeCategory) ?? [];
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const res = await apiFetch<StrapiListResponse<{ slug: string }>>(
    '/categories?fields[0]=slug&pagination[pageSize]=200',
    { revalidate: 3600, tags: ['category-slugs'] },
  );
  return res?.data.map((d) => d.slug) ?? [];
}
