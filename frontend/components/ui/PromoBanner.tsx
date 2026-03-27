import Image from 'next/image';
import Link from 'next/link';
import type { PromoBannerBlock } from '@/types';
import { imageUrl } from '@/lib/utils';

interface PromoBannerProps {
  banner: PromoBannerBlock;
}

export function PromoBanner({ banner }: PromoBannerProps) {
  if (!banner.active) return null;

  return (
    <div
      className="relative rounded-2xl overflow-hidden flex flex-col justify-between p-6 min-h-[180px]"
      style={{ backgroundColor: banner.backgroundColor || '#f0f9ff' }}
    >
      {banner.image && (
        <Image
          src={imageUrl(banner.image, 'medium')}
          alt={banner.title}
          fill
          className="object-cover opacity-20"
        />
      )}
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-gray-900 leading-tight">{banner.title}</h3>
        {banner.description && (
          <p className="text-sm text-gray-600 mt-1">{banner.description}</p>
        )}
      </div>
      {banner.ctaUrl && (
        <Link
          href={banner.ctaUrl}
          className="relative z-10 mt-4 inline-block bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold py-2 px-5 rounded-xl transition-colors w-fit"
        >
          {banner.ctaLabel || 'Ver más'}
        </Link>
      )}
    </div>
  );
}
