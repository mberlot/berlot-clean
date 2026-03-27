import type { Metadata } from 'next';
import { getOfferProducts } from '@/services/products';
import { ProductGrid } from '@/components/ui/ProductGrid';

export const revalidate = 120;

export const metadata: Metadata = {
  title: 'Ofertas y Liquidaciones',
  description: 'Los mejores precios en productos de limpieza. Aprovechá nuestras ofertas por tiempo limitado.',
};

export default async function OffersPage() {
  const products = await getOfferProducts(48);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-400 rounded-2xl p-8 text-white text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Ofertas del Mes</h1>
        <p className="opacity-90">Precios especiales por tiempo limitado. ¡No te los pierdas!</p>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{products.length} producto{products.length !== 1 ? 's' : ''} en oferta</p>
      </div>

      <ProductGrid
        products={products}
        emptyMessage="No hay ofertas disponibles en este momento. Volvé pronto."
      />
    </div>
  );
}
