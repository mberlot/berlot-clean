import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getProducts } from '@/services/products';
import { ProductGrid } from '@/components/ui/ProductGrid';
import { SearchBar } from '@/components/ui/SearchBar';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: { q?: string; page?: string };
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const q = searchParams.q || '';
  return {
    title: q ? `Resultados para "${q}"` : 'Buscar productos',
    description: `Resultados de búsqueda para "${q}" en nuestra tienda de productos de limpieza.`,
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const q = (searchParams.q || '').trim();
  const page = Number(searchParams.page || '1');

  const { products, total } = q.length >= 2
    ? await getProducts({ search: q, page, pageSize: 24 })
    : { products: [], total: 0 };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="max-w-xl">
        <SearchBar defaultValue={q} />
      </div>

      {q ? (
        <>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-800">
              Resultados para <span className="text-brand-600">"{q}"</span>
            </h1>
            <span className="text-sm text-gray-500">({total} productos)</span>
          </div>

          <ProductGrid
            products={products}
            emptyMessage={`No encontramos productos para "${q}". Probá con otras palabras.`}
          />
        </>
      ) : (
        <p className="text-gray-500 text-center py-12">Escribí al menos 2 letras para buscar.</p>
      )}
    </div>
  );
}
