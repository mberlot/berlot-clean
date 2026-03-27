import Link from 'next/link';
import type { Category } from '@/types';

interface FooterProps {
  categories?: Category[];
}

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Berlot Clean';

export function Footer({ categories = [] }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink border-t border-warm-border/20">
      <div className="px-8 sm:px-12 lg:px-[60px] pt-[60px] pb-[60px] flex flex-col gap-[48px]">

        {/* ── Top row ───────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4 md:w-[320px]">
            <span className="font-serif font-bold text-[22px] tracking-[1px] text-white">
              {SITE_NAME}
            </span>
            <p className="font-sans text-[14px] text-[#777777] leading-[1.6] max-w-xs">
              Productos de limpieza premium para el hogar moderno. Fórmulas
              pensadas, diseño refinado.
            </p>
          </div>

          {/* Columns */}
          <div className="flex flex-wrap gap-12 lg:gap-[48px]">
            {/* Shop */}
            <div className="flex flex-col gap-[14px]">
              <span className="font-mono text-[11px] font-medium tracking-[2px] uppercase text-[#777777]">
                TIENDA
              </span>
              {[
                ['Todos los productos', '/categorias'],
                ['Lo más vendido', '/categorias'],
                ['Kits', '/categorias'],
                ['Sets de regalo', '/categorias'],
                ['Novedades', '/novedades'],
              ].map(([label, href]) => (
                <Link key={label} href={href} className="font-sans text-[14px] text-[#777777] hover:text-white transition-colors">
                  {label}
                </Link>
              ))}
            </div>

            {/* Company */}
            <div className="flex flex-col gap-[14px]">
              <span className="font-mono text-[11px] font-medium tracking-[2px] uppercase text-[#777777]">
                EMPRESA
              </span>
              {[
                ['Quiénes somos', '/about'],
                ['Sustentabilidad', '/about'],
                ['Ingredientes', '/about'],
                ['Prensa', '/about'],
                ['Empleos', '/about'],
              ].map(([label, href]) => (
                <Link key={label} href={href} className="font-sans text-[14px] text-[#777777] hover:text-white transition-colors">
                  {label}
                </Link>
              ))}
            </div>

            {/* Support */}
            <div className="flex flex-col gap-[14px]">
              <span className="font-mono text-[11px] font-medium tracking-[2px] uppercase text-[#777777]">
                AYUDA
              </span>
              {[
                ['Contacto', '/contacto'],
                ['Preguntas frecuentes', '/paginas/como-comprar'],
                ['Info de envíos', '/paginas/como-comprar'],
                ['Devoluciones', '/paginas/como-comprar'],
                ['Política de privacidad', '/paginas/privacidad'],
              ].map(([label, href]) => (
                <Link key={label} href={href} className="font-sans text-[14px] text-[#777777] hover:text-white transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Divider ───────────────────────────────────── */}
        <div className="border-t border-[#E5E0D8]/20" />

        {/* ── Bottom row ────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="font-mono text-[11px] font-medium tracking-[1px] text-[#777777]">
            © {year} {SITE_NAME}. Todos los derechos reservados.
          </span>
          <div className="flex items-center gap-6">
            {['INSTAGRAM', 'PINTEREST', 'TIKTOK'].map((name) => (
              <a
                key={name}
                href="#"
                className="font-mono text-[11px] font-medium tracking-[1px] text-[#777777] hover:text-white transition-colors"
              >
                {name}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
