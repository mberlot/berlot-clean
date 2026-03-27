import Link from 'next/link';

export function OfferBanners() {
  return (
    <section className="w-full border-t border-warm-border bg-ivory">
      {/* ── Section header ─────────────────────────────────── */}
      <div className="flex items-end justify-between px-8 sm:px-12 lg:px-[60px] pt-[60px] pb-5 border-b border-warm-border">
        <h2 className="font-serif font-normal text-2xl lg:text-[36px] text-text-ink">
          Ofertas Especiales
        </h2>
        <Link
          href="/categoria/ofertas"
          className="font-mono text-[13px] font-medium tracking-[1px] uppercase text-text-dim hover:text-text-ink transition-colors"
        >
          VER TODAS LAS OFERTAS →
        </Link>
      </div>

      {/* ── Two offer banners ──────────────────────────────── */}
      <div className="flex flex-col lg:flex-row">
        {/* Banner 1 — dark */}
        <div
          className="flex-1 flex flex-col justify-end gap-4 bg-ink px-8 sm:px-10 py-10 sm:py-12 border-b border-r border-warm-border"
          style={{ minHeight: 360 }}
        >
          <span className="font-mono text-[11px] font-medium tracking-[2px] uppercase text-[#666666]">
            TIEMPO LIMITADO
          </span>
          <h3 className="font-serif font-normal text-3xl lg:text-[32px] text-white leading-tight">
            Kit Limpieza de Temporada
          </h3>
          <p className="font-sans text-[14px] text-[#777777] leading-[1.6] max-w-sm">
            Ahorrá 30% en nuestro set de 5 productos esenciales de limpieza.
            Todo lo que necesitás para empezar de cero.
          </p>
          <Link
            href="/categoria/esenciales"
            className="inline-block bg-ivory text-ink font-mono text-[12px] font-medium tracking-[2px] uppercase px-7 py-[14px] hover:bg-white transition-colors w-fit"
          >
            VER KIT — $ 89.000
          </Link>
        </div>

        {/* Banner 2 — image with overlay */}
        <div
          className="flex-1 relative flex flex-col justify-end gap-4 px-8 sm:px-10 py-10 sm:py-12 border-b border-warm-border overflow-hidden"
          style={{ minHeight: 360, backgroundColor: '#1a2744' }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-ink/70" />

          <span className="relative font-mono text-[11px] font-medium tracking-[2px] uppercase text-[#666666]">
            NUEVO
          </span>
          <h3 className="relative font-serif font-normal text-3xl lg:text-[32px] text-white leading-tight">
            Kit Esenciales de Cocina
          </h3>
          <p className="relative font-sans text-[14px] text-[#777777] leading-[1.6] max-w-sm">
            Nuestro trío más vendido para la cocina — limpiavidrios, lavaplatos y jabón de manos.
            Diseñado para tu mesada.
          </p>
          <Link
            href="/categoria/cocina"
            className="relative inline-block bg-ivory text-ink font-mono text-[12px] font-medium tracking-[2px] uppercase px-7 py-[14px] hover:bg-white transition-colors w-fit"
          >
            VER KIT — $ 54.000
          </Link>
        </div>
      </div>

      {/* ── Full-width shipping banner ─────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-8 sm:px-12 lg:px-[48px] py-0 mx-[60px] my-[40px] border border-warm-border" style={{ minHeight: 200 }}>
        <div className="flex flex-col gap-2 py-8 sm:py-0">
          <span className="font-mono text-[11px] font-medium tracking-[2px] uppercase text-[#666666]">
            ENVÍO GRATIS
          </span>
          <p className="font-serif font-normal text-xl lg:text-[28px] text-text-ink leading-snug">
            Envío sin cargo en pedidos superiores a $ 5.000
          </p>
          <p className="font-sans text-[14px] text-text-dim">
            Más devoluciones gratis dentro de los 30 días. Sin preguntas.
          </p>
        </div>
        <Link
          href="/categorias"
          className="flex-shrink-0 inline-block bg-ink text-ivory font-mono text-[12px] font-medium tracking-[2px] uppercase px-7 py-[14px] hover:bg-ink/85 transition-colors w-full sm:w-auto text-center"
        >
          EMPEZAR A COMPRAR
        </Link>
      </div>

      {/* bottom spacer to match section padding */}
      <div className="h-[20px]" />
    </section>
  );
}
