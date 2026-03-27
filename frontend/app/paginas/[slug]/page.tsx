import Link from 'next/link';
import type { Metadata } from 'next';

interface PageProps {
  params: { slug: string };
}

const PAGE_TITLES: Record<string, string> = {
  'como-comprar': 'Cómo comprar',
  'privacidad': 'Política de privacidad',
  'terminos': 'Términos y condiciones',
  'envios': 'Información de envíos',
  'devoluciones': 'Devoluciones',
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const title = PAGE_TITLES[params.slug] ?? 'Información';
  return { title: `${title} — Berlot Clean` };
}

export default function PaginaPage({ params }: PageProps) {
  const title = PAGE_TITLES[params.slug] ?? 'Información';

  return (
    <div className="w-full bg-ivory min-h-screen">
      {/* Breadcrumb */}
      <div className="w-full border-b border-warm-border px-4 lg:px-[48px] py-3">
        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className="font-mono text-[10px] font-medium tracking-[1px] uppercase text-[#666666] hover:text-text-ink transition-colors"
          >
            Inicio
          </Link>
          <span className="font-mono text-[10px] text-[#666666]">/</span>
          <span className="font-mono text-[10px] font-medium tracking-[1px] uppercase text-text-ink">
            {title}
          </span>
        </nav>
      </div>

      {/* Placeholder content */}
      <div className="flex flex-col items-center justify-center py-[120px] px-4 text-center gap-6">
        <span className="font-mono text-[11px] font-medium tracking-[2px] uppercase text-text-muted border border-warm-border px-4 py-2">
          EN DESARROLLO
        </span>
        <h1 className="font-serif font-normal text-[32px] lg:text-[48px] text-text-ink">
          {title}
        </h1>
        <p className="font-sans text-base text-text-dim max-w-md leading-[1.6]">
          Estamos trabajando en esta sección. Volvé pronto para más información.
        </p>
        <Link
          href="/"
          className="inline-block bg-ink text-ivory font-mono text-[12px] font-medium tracking-[2px] uppercase px-8 py-4 hover:bg-ink/85 transition-colors mt-2"
        >
          VOLVER AL INICIO
        </Link>
      </div>
    </div>
  );
}
