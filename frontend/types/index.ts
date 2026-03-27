// ─────────────────────────────────────────────────────────────
// Core CMS types — mirrors Strapi content type schemas
// ─────────────────────────────────────────────────────────────

export interface StrapiImage {
  id: number;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
  mime?: string;
  formats: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
}

export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
}

export interface Specification {
  label: string;
  value: string;
}

// ─── Category ────────────────────────────────────────────────
export interface Category {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  description?: string;
  image?: StrapiImage;
  parentCategory?: Category;
  subCategories?: Category[];
  sortOrder?: number;
  featured?: boolean;
  productCount?: number;
}

// ─── Brand ───────────────────────────────────────────────────
export interface Brand {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  description?: string;
  logo?: StrapiImage;
  website?: string;
  featured?: boolean;
}

// ─── Product ─────────────────────────────────────────────────
export interface Product {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  sku?: string;
  images?: StrapiImage[];
  brand?: Brand;
  category?: Category;
  tags?: string[];
  stock?: number;
  featured?: boolean;
  offer?: boolean;
  specifications?: Specification[];
  seoTitle?: string;
  seoDescription?: string;
  unit?: string;
  minOrderQuantity?: number;
  publishedAt?: string;
  createdAt?: string;
}

// ─── Promotion ───────────────────────────────────────────────
export interface Promotion {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  banner?: StrapiImage;
  mobileBanner?: StrapiImage;
  active: boolean;
  startDate?: string;
  endDate?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  type: 'hero' | 'banner' | 'popup' | 'ribbon';
  sortOrder?: number;
  backgroundColor?: string;
  textColor?: string;
}

// ─── CMS-driven Homepage Hero ────────────────────────────────
export interface HeroData {
  titlePrimary: string;
  titleHighlight?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  heroMedia?: StrapiImage;
  heroMediaAlt?: string;
  layout?: 'image-right' | 'image-left';
}

export interface Homepage {
  hero?: HeroData;
}

// ─── Hero / Promo banner components ──────────────────────────
export interface HeroBannerBlock {
  title: string;
  subtitle?: string;
  image: StrapiImage;
  mobileImage?: StrapiImage;
  ctaLabel?: string;
  ctaUrl?: string;
  textPosition?: 'left' | 'center' | 'right';
  overlay?: boolean;
  active?: boolean;
}

export interface PromoBannerBlock {
  title: string;
  description?: string;
  image?: StrapiImage;
  ctaLabel?: string;
  ctaUrl?: string;
  backgroundColor?: string;
  active?: boolean;
}

// ─── Home Sections ───────────────────────────────────────────
export interface HomeSection {
  heroBanners: HeroBannerBlock[];
  featuredProductsTitle: string;
  featuredProducts: Product[];
  promotionalBanners: PromoBannerBlock[];
  categoryHighlights: Category[];
  categoryHighlightsTitle: string;
  offersTitle: string;
  showOffers: boolean;
  offersLimit: number;
}

// ─── Page ────────────────────────────────────────────────────
export interface Page {
  id: number;
  title: string;
  slug: string;
  content?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: StrapiImage;
  showInNav?: boolean;
  navLabel?: string;
  sortOrder?: number;
}

// ─────────────────────────────────────────────────────────────
// API response wrappers — Strapi v5 (flat format, no attributes)
// ─────────────────────────────────────────────────────────────

export interface StrapiListResponse<T> {
  data: Array<T & { documentId: string }>;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: T & { documentId: string };
  meta: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────────────
// Cart
// ─────────────────────────────────────────────────────────────

export interface CartItem {
  productId: number;
  slug: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  unit?: string;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// ─────────────────────────────────────────────────────────────
// Filters
// ─────────────────────────────────────────────────────────────

export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  offer?: boolean;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
  sort?: 'price:asc' | 'price:desc' | 'name:asc' | 'createdAt:desc';
}
