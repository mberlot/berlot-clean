import { apiFetch, buildQuery } from './api';
import type {
  Product,
  StrapiListResponse,
  ProductFilters,
} from '@/types';

const IMG_FIELDS =
  'populate[images][fields][0]=url&populate[images][fields][1]=alternativeText&populate[images][fields][2]=width&populate[images][fields][3]=height&populate[images][fields][4]=formats';
const POPULATE =
  `${IMG_FIELDS}&populate[category][fields][0]=name&populate[category][fields][1]=slug&populate[brand][fields][0]=name&populate[brand][fields][1]=slug&populate[specifications]=*`;

// v5: data is flat — no attributes wrapper
function normalizeProduct(raw: Product & { documentId: string }): Product {
  return raw;
}

export async function getProducts(filters: ProductFilters = {}): Promise<{
  products: Product[];
  total: number;
  pageCount: number;
}> {
  const {
    search,
    category,
    brand,
    offer,
    featured,
    minPrice,
    maxPrice,
    page = 1,
    pageSize = 24,
    sort = 'createdAt:desc',
  } = filters;

  const params: Record<string, unknown> = {
    'pagination[page]': page,
    'pagination[pageSize]': pageSize,
    sort,
    'status': 'published',
  };

  if (search) params['filters[name][$containsi]'] = search;
  if (category) params['filters[category][slug][$eq]'] = category;
  if (brand) params['filters[brand][slug][$eq]'] = brand;
  if (offer !== undefined) params['filters[offer][$eq]'] = offer;
  if (featured !== undefined) params['filters[featured][$eq]'] = featured;
  if (minPrice !== undefined) params['filters[price][$gte]'] = minPrice;
  if (maxPrice !== undefined) params['filters[price][$lte]'] = maxPrice;

  const qs = buildQuery(params);
  const res = await apiFetch<StrapiListResponse<Product>>(
    `/products${qs}&${POPULATE}`,
    { tags: ['products'] },
  );

  return {
    products: res?.data.map(normalizeProduct) ?? [],
    total: res?.meta.pagination.total ?? 0,
    pageCount: res?.meta.pagination.pageCount ?? 0,
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const qs = buildQuery({
    'filters[slug][$eq]': slug,
    'status': 'published',
  });
  const res = await apiFetch<StrapiListResponse<Product>>(
    `/products${qs}&${POPULATE}`,
    { tags: [`product-${slug}`] },
  );

  if (!res?.data.length) return null;
  return normalizeProduct(res.data[0]);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const qs = buildQuery({
    'filters[featured][$eq]': true,
    'pagination[pageSize]': limit,
    sort: 'createdAt:desc',
    'status': 'published',
  });
  const res = await apiFetch<StrapiListResponse<Product>>(
    `/products${qs}&${POPULATE}`,
    { tags: ['products', 'featured-products'], revalidate: 300 },
  );
  return res?.data.map(normalizeProduct) ?? [];
}

export async function getOfferProducts(limit = 12): Promise<Product[]> {
  const qs = buildQuery({
    'filters[offer][$eq]': true,
    'pagination[pageSize]': limit,
    sort: 'createdAt:desc',
    'status': 'published',
  });
  const res = await apiFetch<StrapiListResponse<Product>>(
    `/products${qs}&${POPULATE}`,
    { tags: ['products', 'offer-products'], revalidate: 120 },
  );
  return res?.data.map(normalizeProduct) ?? [];
}

export async function getAllProductSlugs(): Promise<string[]> {
  const res = await apiFetch<StrapiListResponse<{ slug: string }>>(
    '/products?fields[0]=slug&pagination[pageSize]=500&status=published',
    { revalidate: 3600, tags: ['product-slugs'] },
  );
  return res?.data.map((d) => d.slug) ?? [];
}
