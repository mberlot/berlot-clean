import type { Metadata } from 'next';
import type { Product, Category, Brand } from '@/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Berlot Clean';
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export function getImageUrl(url: string | undefined): string {
  if (!url) return `${SITE_URL}/og-default.jpg`;
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
}

// ─── Default site metadata ────────────────────────────────────
export function defaultMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: `Distribuidora de productos de limpieza. Catálogo completo de productos para el hogar, industria y gastronomía.`,
    openGraph: {
      siteName: SITE_NAME,
      type: 'website',
      locale: 'es_AR',
    },
    twitter: {
      card: 'summary_large_image',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// ─── Product page metadata ────────────────────────────────────
export function productMetadata(product: Product): Metadata {
  const title = product.seoTitle || product.name;
  const description =
    product.seoDescription || product.shortDescription || `Comprá ${product.name} online.`;
  const imageUrl = getImageUrl(product.images?.[0]?.url);
  const url = `${SITE_URL}/producto/${product.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: [{ url: imageUrl, width: 800, height: 600, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

// ─── Category page metadata ───────────────────────────────────
export function categoryMetadata(category: Category): Metadata {
  const title = `${category.name} — Productos de Limpieza`;
  const description =
    category.description ||
    `Explorá nuestra línea de ${category.name}. Precios mayoristas y envíos a todo el país.`;
  const imageUrl = getImageUrl(category.image?.url);
  const url = `${SITE_URL}/categoria/${category.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: imageUrl, width: 800, height: 600, alt: category.name }],
    },
  };
}

// ─── Brand page metadata ──────────────────────────────────────
export function brandMetadata(brand: Brand): Metadata {
  const title = `${brand.name} — Productos disponibles`;
  const description =
    brand.description ||
    `Catálogo completo de productos ${brand.name}. Comprá online.`;
  return { title, description };
}

// ─── JSON-LD Product structured data ─────────────────────────
export function productJsonLd(product: Product) {
  const imageUrl = getImageUrl(product.images?.[0]?.url);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.description || '',
    sku: product.sku,
    image: imageUrl,
    brand: product.brand
      ? { '@type': 'Brand', name: product.brand.name }
      : undefined,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'ARS',
      price: product.price,
      availability:
        (product.stock ?? 0) > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: `${SITE_URL}/producto/${product.slug}`,
    },
  };
}

// ─── JSON-LD BreadcrumbList ───────────────────────────────────
export function breadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
