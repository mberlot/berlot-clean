import type { StrapiImage } from '@/types';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export const PLACEHOLDER_IMAGE = '/images/placeholder.png';

/** Resolve a Strapi image URL to absolute. */
export function imageUrl(img: StrapiImage | undefined, format?: keyof StrapiImage['formats']): string {
  if (!img) return PLACEHOLDER_IMAGE;
  const src = format && img.formats?.[format]?.url
    ? img.formats[format]!.url
    : img.url;
  return src.startsWith('http') ? src : `${STRAPI_URL}${src}`;
}

/** Format a price to Argentine Peso string. */
export function formatPrice(price: number): string {
  return '$ ' + new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/** Calculate discount percentage. */
export function discountPercent(price: number, compareAtPrice: number): number {
  if (compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

/** Clamp a string to a max length with ellipsis. */
export function truncate(str: string, max = 120): string {
  if (str.length <= max) return str;
  return str.slice(0, max).trimEnd() + '…';
}

/** Generate a URL-safe slug (client-side fallback). */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Build CSS class string conditionally (tiny cn helper). */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
