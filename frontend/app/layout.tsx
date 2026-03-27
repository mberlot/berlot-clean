import type { Metadata } from 'next';
import { Inter, Playfair_Display, IBM_Plex_Mono } from 'next/font/google';
import { CartProvider } from '@/features/cart/CartContext';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getCategories } from '@/services/categories';
import { defaultMetadata } from '@/lib/seo';
import '@/styles/globals.css';

const inter      = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair   = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const ibmPlexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-ibm-mono' });

export const metadata: Metadata = defaultMetadata();

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = (await getCategories()) ?? [];

  return (
    <html lang="es">
      <body className={`${inter.variable} ${playfair.variable} ${ibmPlexMono.variable} font-sans`}>
        <CartProvider>
          <Navbar categories={categories} />
          <main className="min-h-screen">{children}</main>
          <Footer categories={categories} />
        </CartProvider>
      </body>
    </html>
  );
}
