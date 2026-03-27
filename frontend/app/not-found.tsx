import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="w-full bg-ivory min-h-[80vh] flex flex-col items-center justify-center px-4">
      {/* Large 404 */}
      <p className="font-serif font-normal text-[120px] lg:text-[180px] text-warm-border leading-none select-none">
        404
      </p>

      {/* Message */}
      <div className="flex flex-col items-center gap-4 mt-2 text-center">
        <h1 className="font-serif font-normal text-[28px] lg:text-[36px] text-text-ink">
          Página no encontrada
        </h1>
        <p className="font-sans text-base text-text-dim max-w-md leading-[1.6]">
          La página que estás buscando no existe o fue movida. Verificá el enlace o volvé al inicio.
        </p>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
        <Link
          href="/"
          className="inline-block bg-ink text-ivory font-mono text-[12px] font-medium tracking-[2px] uppercase px-8 py-4 hover:bg-ink/85 transition-colors"
        >
          VOLVER AL INICIO
        </Link>
        <Link
          href="/categorias"
          className="inline-block border border-warm-border text-text-ink font-mono text-[12px] font-medium tracking-[2px] uppercase px-8 py-4 hover:border-ink transition-colors"
        >
          VER CATÁLOGO
        </Link>
      </div>
    </div>
  );
}
