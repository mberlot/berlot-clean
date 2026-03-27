import Link from 'next/link';
import Image from 'next/image';
import type { Category } from '@/types';
import { imageUrl, PLACEHOLDER_IMAGE } from '@/lib/utils';

interface CategoryStripProps {
  categories: Category[];
}

export function CategoryStrip({ categories }: CategoryStripProps) {
  if (!categories.length) return null;

  const displayed = categories.slice(0, 6);

  return (
    <section className="w-full border-b border-warm-border bg-ivory">
      {/* Title row */}
      <div className="px-8 sm:px-12 lg:px-[48px] py-6 border-b border-warm-border">
        <h2 className="font-serif font-normal text-2xl lg:text-[32px] text-text-ink">
          Comprá por Categoría
        </h2>
      </div>

      {/* Category row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:flex border-t border-warm-border">
        {displayed.map((cat) => (
          <Link
            key={cat.id}
            href={`/categoria/${cat.slug}`}
            className="group flex flex-col flex-1 min-w-0 hover:bg-warm-border/20 transition-colors border-b border-r border-warm-border lg:border-b-0 last:border-r-0"
          >
            {/* Image */}
            <div className="relative overflow-hidden bg-warm-border/30" style={{ height: 180 }}>
              {cat.image ? (
                <Image
                  src={imageUrl(cat.image, 'small')}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
                />
              ) : (
                <Image
                  src={PLACEHOLDER_IMAGE}
                  alt={cat.name}
                  fill
                  className="object-contain p-6"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
                />
              )}
            </div>

            {/* Label */}
            <div className="flex items-center justify-center bg-ivory py-4 px-2">
              <span className="font-mono text-[13px] font-medium tracking-[1.5px] uppercase text-text-ink group-hover:text-navy transition-colors text-center">
                {cat.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
