import Link from 'next/link';
import type { HeroData } from '@/types';

// Fallback content shown when the CMS has no homepage entry yet
const DEFAULTS: Required<HeroData> = {
  titlePrimary:   'Limpieza de calidad,',
  titleHighlight: 'al mejor precio.',
  description:    'Productos de limpieza premium para quienes valoran la belleza de un hogar impecable. Fórmulas cuidadas, diseño refinado.',
  ctaText:        'EXPLORAR CATÁLOGO',
  ctaLink:        '/categorias',
  heroMedia:      undefined as never,
  heroMediaAlt:   '',
  layout:         'image-right',
};

interface HeroProps extends Partial<HeroData> {}

export function Hero({
  titlePrimary   = DEFAULTS.titlePrimary,
  titleHighlight = DEFAULTS.titleHighlight,
  description    = DEFAULTS.description,
  ctaText        = DEFAULTS.ctaText,
  ctaLink        = DEFAULTS.ctaLink,
  heroMedia,
  heroMediaAlt   = DEFAULTS.heroMediaAlt,
  layout         = DEFAULTS.layout,
}: HeroProps) {
  const mediaUrl  = heroMedia?.url ?? null;
  const altText   = heroMediaAlt || heroMedia?.alternativeText || titlePrimary;
  const reversed  = layout === 'image-left';

  return (
    <section
      className={`flex w-full border-b border-warm-border overflow-hidden ${reversed ? 'flex-row-reverse' : 'flex-row'}`}
      style={{ minHeight: 600 }}
    >
      {/* ── Editorial text column ───────────────────────────── */}
      <div className="flex flex-col justify-center gap-6 flex-1 px-8 sm:px-12 lg:px-[60px] py-16 lg:py-20 border-r border-warm-border bg-ivory overflow-hidden">
        <div className="flex flex-col">
          <h1 className="font-serif font-normal text-5xl sm:text-7xl lg:text-[100px] text-text-ink leading-[1.05]">
            {titlePrimary}
          </h1>
          {titleHighlight && (
            <h1 className="font-serif italic font-normal text-5xl sm:text-7xl lg:text-[100px] text-navy leading-[1.05]">
              {titleHighlight}
            </h1>
          )}
        </div>

        {description && (
          <p className="font-sans text-base lg:text-[17px] text-text-dim leading-[1.5] max-w-[600px]">
            {description}
          </p>
        )}

        {ctaText && ctaLink && (
          <Link
            href={ctaLink}
            className="inline-block bg-ink text-ivory font-mono text-xs font-medium tracking-[2px] uppercase px-9 py-[18px] hover:bg-ink/85 transition-colors w-fit"
          >
            {ctaText}
          </Link>
        )}
      </div>

      {/* ── Media column ────────────────────────────────────── */}
      <div className="hidden lg:block flex-shrink-0 w-[39%] bg-navy relative overflow-hidden">
        {mediaUrl && (
          // Use <img> (not next/image) so GIFs animate correctly
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl}
            alt={altText}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>
    </section>
  );
}
