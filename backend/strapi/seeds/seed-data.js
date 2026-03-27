/**
 * Seed script — Cleaning Products CMS Template
 * Demo brand: Berlot Clean
 *
 * Usage (PowerShell):
 *   $env:STRAPI_TOKEN="your-full-access-token"
 *   node seeds/seed-data.js
 *
 * Usage (bash):
 *   STRAPI_TOKEN=your-full-access-token node seeds/seed-data.js
 *
 * Requirements:
 *   - Strapi must be running (npm run develop)
 *   - Create a "Full Access" API token in Settings → API Tokens
 */

'use strict';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || '';

if (!STRAPI_TOKEN) {
  console.error('❌  STRAPI_TOKEN is required. Set it as an environment variable.');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${STRAPI_TOKEN}`,
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function post(endpoint, data) {
  const res = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`POST /${endpoint} failed ${res.status}: ${err}`);
  }
  const json = await res.json();
  return json.data;
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY HIERARCHY
// ─────────────────────────────────────────────────────────────────────────────

const PARENT_CATEGORIES = [
  { name: 'Limpieza del Hogar',       slug: 'limpieza-del-hogar',     sortOrder: 1, featured: true  },
  { name: 'Higiene y Sanitización',   slug: 'higiene-y-sanitizacion', sortOrder: 2, featured: true  },
  { name: 'Uso Profesional',          slug: 'uso-profesional',        sortOrder: 3, featured: false },
  { name: 'Especialidades',           slug: 'especialidades',         sortOrder: 4, featured: false },
  { name: 'Presentaciones',           slug: 'presentaciones',         sortOrder: 5, featured: false },
  { name: 'Marcas',                   slug: 'marcas',                 sortOrder: 6, featured: false },
  { name: 'Materias y Tecnología',    slug: 'materias-y-tecnologia',  sortOrder: 7, featured: false },
  { name: 'Destacados',               slug: 'destacados',             sortOrder: 8, featured: true  },
];

const CHILD_CATEGORIES = {
  'limpieza-del-hogar': [
    { name: 'Productos para Pisos',  slug: 'productos-para-pisos',  sortOrder: 1, featured: true  },
    { name: 'Productos para Cocina', slug: 'productos-para-cocina', sortOrder: 2, featured: false },
    { name: 'Productos para Ropa',   slug: 'productos-para-ropa',   sortOrder: 3, featured: false },
    { name: 'Casa y Jardín',         slug: 'casa-y-jardin',         sortOrder: 4, featured: false },
  ],
  'higiene-y-sanitizacion': [
    { name: 'Higiene Personal', slug: 'higiene-personal', sortOrder: 1, featured: true  },
    { name: 'Alcohol',          slug: 'alcohol',          sortOrder: 2, featured: false },
    { name: 'COVID-19',         slug: 'covid19',          sortOrder: 3, featured: false },
  ],
  'uso-profesional': [
    { name: 'Institucionales', slug: 'institucionales', sortOrder: 1, featured: false },
    { name: 'Gastronómicos',   slug: 'gastronomicos',   sortOrder: 2, featured: false },
  ],
  'especialidades': [
    { name: 'Mascotas',             slug: 'mascotas',             sortOrder: 1, featured: false },
    { name: 'Piscina',              slug: 'piscina',              sortOrder: 2, featured: false },
    { name: 'Productos para Autos', slug: 'productos-para-autos', sortOrder: 3, featured: false },
  ],
  'presentaciones': [
    { name: 'Granel',                   slug: 'granel',                   sortOrder: 1, featured: false },
    { name: 'Doy Pack',                 slug: 'doy-pack',                 sortOrder: 2, featured: false },
    { name: 'Aerosoles para Dispenser', slug: 'aerosoles-para-dispenser', sortOrder: 3, featured: false },
    { name: 'Envases',                  slug: 'envases',                  sortOrder: 4, featured: false },
    { name: 'Plásticos',                slug: 'plasticos',                sortOrder: 5, featured: false },
  ],
  'marcas': [
    { name: 'Diversey',   slug: 'diversey',   sortOrder: 1, featured: true  },
    { name: 'Fiorentina', slug: 'fiorentina', sortOrder: 2, featured: false },
    { name: 'Aliadas',    slug: 'aliadas',    sortOrder: 3, featured: false },
  ],
  'materias-y-tecnologia': [
    { name: 'Materia Prima',          slug: 'materia-prima',          sortOrder: 1, featured: false },
    { name: 'Tecnología de Limpieza', slug: 'tecnologia-de-limpieza', sortOrder: 2, featured: false },
    { name: 'Papeles',                slug: 'papeles',                sortOrder: 3, featured: false },
  ],
  'destacados': [
    { name: 'Novedades',   slug: 'novedades',   sortOrder: 1, featured: true },
    { name: 'Ofertas',     slug: 'ofertas',     sortOrder: 2, featured: true },
    { name: 'Liquidación', slug: 'liquidacion', sortOrder: 3, featured: true },
    { name: 'Esenciales',  slug: 'esenciales',  sortOrder: 4, featured: true },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// BRANDS
// ─────────────────────────────────────────────────────────────────────────────

const BRANDS = [
  { name: 'Diversey',   slug: 'diversey',   description: 'Líder mundial en higiene profesional.',         featured: true,  sortOrder: 1 },
  { name: 'Fiorentina', slug: 'fiorentina', description: 'Productos de limpieza para el hogar.',           featured: false, sortOrder: 2 },
  { name: 'Aliadas',    slug: 'aliadas',    description: 'Limpieza eficiente al mejor precio.',            featured: false, sortOrder: 3 },
  { name: 'QM',         slug: 'qm',         description: 'Línea propia de alta concentración.',            featured: true,  sortOrder: 4 },
  { name: 'Genérico',   slug: 'generico',   description: 'Productos sin marca / materia prima a granel.',  featured: false, sortOrder: 99 },
];

// ─────────────────────────────────────────────────────────────────────────────
// ATTRIBUTES
// ─────────────────────────────────────────────────────────────────────────────

const ATTRIBUTES = [
  {
    name: 'Fragancia', slug: 'fragancia', filterable: true, sortOrder: 1,
    values: ['Lavanda', 'Limón', 'Naranja', 'Menta', 'Pino', 'Floral', 'Sin fragancia', 'Neutro'],
  },
  {
    name: 'Presentación', slug: 'presentacion', filterable: true, sortOrder: 2,
    values: ['Aerosol', 'Líquido', 'Polvo', 'Pasta', 'Gel', 'Espuma', 'Pastilla', 'Doy Pack', 'Bidón', 'Granel'],
  },
  {
    name: 'Concentración', slug: 'concentracion', filterable: true, sortOrder: 3,
    values: ['Listo para usar', 'Concentrado (1:10)', 'Concentrado (1:20)', 'Super concentrado (1:100)'],
  },
  {
    name: 'Uso recomendado', slug: 'uso-recomendado', filterable: true, sortOrder: 4,
    values: ['Doméstico', 'Industrial', 'Gastronómico', 'Hospitalario', 'Automotriz', 'Textil', 'Exterior'],
  },
  {
    name: 'Volumen', slug: 'volumen', filterable: true, sortOrder: 5,
    values: ['250 ml', '500 ml', '750 ml', '1 L', '2 L', '4 L', '5 L', '10 L', '20 L', '25 L', '30 L'],
  },
  {
    name: 'Certificaciones', slug: 'certificaciones', filterable: false, sortOrder: 6,
    values: ['Biodegradable', 'Sin fosfatos', 'Apto alimentario', 'SENASA', 'ANMAT', 'NSF'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS — 5 per leaf category (135 total)
// ─────────────────────────────────────────────────────────────────────────────

const DEMO_PRODUCTS = [

  // ── PRODUCTOS PARA PISOS (5) ─────────────────────────────────────────────
  { sku: 'PIS-001', name: 'Limpiador Desodorizante Lavanda 5L',           slug: 'limpiador-desodorizante-lavanda-5l',           price: 980,  stock: 250, unit: 'litro',  featured: true,  offer: false, categorySlug: 'productos-para-pisos',     brandSlug: 'fiorentina', shortDescription: 'Limpiador desodorizante con fragancia lavanda para todo tipo de pisos.',              specifications: [{ key: 'Fragancia', value: 'Lavanda' }, { key: 'Volumen', value: '5 litros' }, { key: 'Uso', value: 'Cerámicos, porcelanatos, vinílicos' }] },
  { sku: 'PIS-002', name: 'Cera Abrillantadora para Pisos 1L',            slug: 'cera-abrillantadora-pisos-1l',                 price: 1250, stock: 120, unit: 'litro',  featured: false, offer: false, categorySlug: 'productos-para-pisos',     brandSlug: 'qm',         shortDescription: 'Cera líquida de alta durabilidad. Protege y abrillanta pisos de madera y vinílicos.', specifications: [{ key: 'Tipo', value: 'Cera líquida autoemulsionable' }, { key: 'Durabilidad', value: '30 días aprox.' }] },
  { sku: 'PIS-003', name: 'Removedor de Cera / Quitasello 1L',            slug: 'removedor-cera-quitasello-1l',                 price: 1100, stock: 90,  unit: 'litro',  featured: false, offer: false, categorySlug: 'productos-para-pisos',     brandSlug: 'qm',         shortDescription: 'Elimina ceras, sellos y polímeros antiguos sin dañar el piso.',                       specifications: [{ key: 'Uso', value: 'Antes de aplicar cera nueva' }, { key: 'Dilución', value: 'Listo para usar' }] },
  { sku: 'PIS-004', name: 'Limpiador Neutro para Porcelanato 2L',         slug: 'limpiador-neutro-porcelanato-2l',              price: 620,  stock: 200, unit: 'litro',  featured: false, offer: true,  categorySlug: 'productos-para-pisos',     brandSlug: 'aliadas',    shortDescription: 'Limpieza profunda sin dañar el porcelanato. pH neutro certificado.',                   specifications: [{ key: 'pH', value: 'Neutro 7' }, { key: 'Espuma', value: 'Baja' }] },
  { sku: 'PIS-005', name: 'Lustrador de Pisos de Madera 750ml',           slug: 'lustrador-pisos-madera-750ml',                 price: 890,  stock: 75,  unit: 'unidad', featured: false, offer: false, categorySlug: 'productos-para-pisos',     brandSlug: 'fiorentina', shortDescription: 'Nutre, hidrata y protege el parquet y la madera de pisos.',                           specifications: [{ key: 'Fórmula', value: 'Con aceites naturales' }, { key: 'Fragancia', value: 'Madera fresca' }] },

  // ── PRODUCTOS PARA COCINA (5) ────────────────────────────────────────────
  { sku: 'COC-001', name: 'Desengrasante Multiuso Concentrado 1L',        slug: 'desengrasante-multiuso-concentrado-1l',        price: 1850, stock: 150, unit: 'litro',  featured: true,  offer: true,  categorySlug: 'productos-para-cocina',    brandSlug: 'qm',         shortDescription: 'Desengrasante de alta performance para cocinas e industria. Dilución 1:20.',           specifications: [{ key: 'Dilución', value: '1:20 general / 1:5 fuerte' }, { key: 'pH', value: '12-13 alcalino' }] },
  { sku: 'COC-002', name: 'Detergente Lavavajillas Limón 1L',             slug: 'detergente-lavavajillas-limon-1l',             price: 320,  stock: 800, unit: 'litro',  featured: false, offer: false, categorySlug: 'productos-para-cocina',    brandSlug: 'fiorentina', shortDescription: 'Detergente para vajilla manual, alta espuma y fragancia limón.',                        specifications: [{ key: 'Fragancia', value: 'Limón' }, { key: 'Espuma', value: 'Alta' }] },
  { sku: 'COC-003', name: 'Limpiador para Horno y Parrilla 750ml',        slug: 'limpiador-horno-parrilla-750ml',               price: 1450, stock: 110, unit: 'unidad', featured: false, offer: false, categorySlug: 'productos-para-cocina',    brandSlug: 'qm',         shortDescription: 'Elimina carbón, grasa quemada y residuos adheridos en hornos y parrillas.',            specifications: [{ key: 'Tipo', value: 'Gel adherente' }, { key: 'Tiempo contacto', value: '15-30 min' }] },
  { sku: 'COC-004', name: 'Quitamanchas para Acero Inoxidable 500ml',     slug: 'quitamanchas-acero-inoxidable-500ml',          price: 780,  stock: 95,  unit: 'unidad', featured: false, offer: false, categorySlug: 'productos-para-cocina',    brandSlug: 'aliadas',    shortDescription: 'Limpia y pule heladeras, campanas y superficies de acero inoxidable.',                 specifications: [{ key: 'Apto', value: 'Acero inoxidable, aluminio' }, { key: 'Resultado', value: 'Sin rayas, sin marcas' }] },
  { sku: 'COC-005', name: 'Desinfectante Bactericida para Mesadas 500ml', slug: 'desinfectante-bactericida-mesadas-500ml',      price: 690,  stock: 180, unit: 'unidad', featured: false, offer: false, categorySlug: 'productos-para-cocina',    brandSlug: 'aliadas',    shortDescription: 'Limpia y desinfecta mesadas de cocina. Elimina el 99.9% de bacterias.',               specifications: [{ key: 'Espectro', value: 'Bactericida y fungicida' }, { key: 'Uso', value: 'Listo para usar' }] },

  // ── PRODUCTOS PARA ROPA (5) ──────────────────────────────────────────────
  { sku: 'ROP-001', name: 'Detergente en Polvo para Lavarropas 1kg',      slug: 'detergente-polvo-lavarropas-1kg',              price: 950,  stock: 350, unit: 'kilo',   featured: true,  offer: false, categorySlug: 'productos-para-ropa',      brandSlug: 'aliadas',    shortDescription: 'Detergente en polvo para lavarropas automático y semiautomático.',                    specifications: [{ key: 'Contenido', value: '1 kg' }, { key: 'Lavados', value: 'Aprox. 20 lavados' }] },
  { sku: 'ROP-002', name: 'Suavizante de Telas Lavanda 1L',               slug: 'suavizante-telas-lavanda-1l',                  price: 480,  stock: 420, unit: 'litro',  featured: false, offer: false, categorySlug: 'productos-para-ropa',      brandSlug: 'fiorentina', shortDescription: 'Suavizante concentrado con fragancia lavanda. Deja la ropa suave y perfumada.',       specifications: [{ key: 'Fragancia', value: 'Lavanda' }, { key: 'Dosis', value: '30 ml por lavado' }] },
  { sku: 'ROP-003', name: 'Quitamanchas Líquido Prelavado 500ml',         slug: 'quitamanchas-liquido-prelavado-500ml',         price: 560,  stock: 200, unit: 'unidad', featured: false, offer: true,  categorySlug: 'productos-para-ropa',      brandSlug: 'aliadas',    shortDescription: 'Elimina manchas difíciles de grasa, café, vino y pasto antes del lavado.',            specifications: [{ key: 'Manchas', value: 'Grasa, café, vino, pasto, sangre' }, { key: 'Aplicación', value: 'Prelavado 10 min antes' }] },
  { sku: 'ROP-004', name: 'Quitamanchas Ropa Blanca Pastillas x20',       slug: 'quitamanchas-ropa-blanca-pastillas-x20',       price: 890,  stock: 180, unit: 'pack',   featured: false, offer: false, categorySlug: 'productos-para-ropa',      brandSlug: 'aliadas',    shortDescription: 'Pastillas efervescentes para blanquear y desmanchar ropa blanca.',                    specifications: [{ key: 'Unidades', value: '20 pastillas' }, { key: 'Temperatura', value: '20°C a 60°C' }] },
  { sku: 'ROP-005', name: 'Jabón en Polvo Multiusos 500g',                slug: 'jabon-polvo-multiusos-500g',                   price: 390,  stock: 500, unit: 'kilo',   featured: false, offer: false, categorySlug: 'productos-para-ropa',      brandSlug: 'aliadas',    shortDescription: 'Jabón en polvo para lavado a mano y máquina. Fórmula activa.',                        specifications: [{ key: 'Contenido', value: '500 g' }, { key: 'Uso', value: 'Lavado a mano y automático' }] },

  // ── CASA Y JARDÍN (5) ───────────────────────────────────────────────────
  { sku: 'JAR-001', name: 'Limpiador Jardín y Terraza Antihongo 4L',      slug: 'limpiador-jardin-terraza-antihongo-4l',        price: 1200, stock: 120, unit: 'litro',  featured: false, offer: false, categorySlug: 'casa-y-jardin',            brandSlug: 'qm',         shortDescription: 'Elimina hongos, verdín y suciedad en exteriores. Listo para usar.',                   specifications: [{ key: 'Acción', value: 'Antihongo y antibacteriana' }, { key: 'Superficies', value: 'Cemento, ladrillo, piedra' }] },
  { sku: 'JAR-002', name: 'Limpiador de Vidrios y Espejos 500ml',         slug: 'limpiador-vidrios-espejos-500ml',              price: 460,  stock: 280, unit: 'unidad', featured: false, offer: false, categorySlug: 'casa-y-jardin',            brandSlug: 'aliadas',    shortDescription: 'Limpia cristales, espejos y superficies vitreas sin dejar rayas.',                    specifications: [{ key: 'Formato', value: 'Gatillo spray' }, { key: 'Resultado', value: 'Sin rayas ni manchas' }] },
  { sku: 'JAR-003', name: 'Desodorizante Ambiental Hogar 300ml',          slug: 'desodorizante-ambiental-hogar-300ml',          price: 540,  stock: 300, unit: 'unidad', featured: false, offer: false, categorySlug: 'casa-y-jardin',            brandSlug: 'fiorentina', shortDescription: 'Aerosol desodorizante para ambientes del hogar. Fragancia floral.',                  specifications: [{ key: 'Fragancia', value: 'Floral' }, { key: 'Contenido', value: '300 ml aerosol' }] },
  { sku: 'JAR-004', name: 'Limpiador para Muebles con Cera 500ml',        slug: 'limpiador-muebles-cera-500ml',                 price: 720,  stock: 140, unit: 'unidad', featured: false, offer: true,  categorySlug: 'casa-y-jardin',            brandSlug: 'fiorentina', shortDescription: 'Limpia, nutre y abrillanta muebles de madera. Deja capa protectora de cera.',          specifications: [{ key: 'Con cera', value: 'Sí' }, { key: 'Aroma', value: 'Madera' }] },
  { sku: 'JAR-005', name: 'Repelente de Insectos para Exteriores 750ml',  slug: 'repelente-insectos-exteriores-750ml',          price: 880,  stock: 95,  unit: 'unidad', featured: false, offer: false, categorySlug: 'casa-y-jardin',            brandSlug: 'qm',         shortDescription: 'Repelente en spray para jardines y terrazas. Eficaz contra mosquitos y pulgas.',      specifications: [{ key: 'Uso', value: 'Exterior' }, { key: 'Duración', value: '8 hs aprox.' }] },

  // ── HIGIENE PERSONAL (5) ─────────────────────────────────────────────────
  { sku: 'HIG-001', name: 'Jabón Líquido de Manos Neutro 500ml',          slug: 'jabon-liquido-manos-neutro-500ml',             price: 480,  stock: 400, unit: 'unidad', featured: true,  offer: false, categorySlug: 'higiene-personal',         brandSlug: 'aliadas',    shortDescription: 'Jabón líquido de pH neutro para lavado frecuente de manos.',                          specifications: [{ key: 'pH', value: 'Neutro 6.5-7' }, { key: 'Con aloe vera', value: 'Sí' }] },
  { sku: 'HIG-002', name: 'Gel Antibacterial de Manos 250ml',             slug: 'gel-antibacterial-manos-250ml',                price: 390,  stock: 550, unit: 'unidad', featured: false, offer: false, categorySlug: 'higiene-personal',         brandSlug: 'aliadas',    shortDescription: 'Gel antibacterial de bolsillo con acción rápida. Sin enjuague.',                      specifications: [{ key: 'Alcohol', value: '70% v/v' }, { key: 'Registro ANMAT', value: 'Sí' }] },
  { sku: 'HIG-003', name: 'Shampoo pH Neutro Uso Diario 500ml',           slug: 'shampoo-ph-neutro-uso-diario-500ml',           price: 720,  stock: 200, unit: 'unidad', featured: false, offer: false, categorySlug: 'higiene-personal',         brandSlug: 'fiorentina', shortDescription: 'Shampoo suave para uso diario. Limpia sin resecar.',                                  specifications: [{ key: 'pH', value: 'Balanceado' }, { key: 'Sin', value: 'Sal, parabenos' }] },
  { sku: 'HIG-004', name: 'Crema Humectante para Manos 200ml',            slug: 'crema-humectante-manos-200ml',                 price: 560,  stock: 180, unit: 'unidad', featured: false, offer: false, categorySlug: 'higiene-personal',         brandSlug: 'fiorentina', shortDescription: 'Crema hidratante para manos con manteca de karité. Absorción rápida.',                specifications: [{ key: 'Con', value: 'Manteca de karité, vitamina E' }, { key: 'Textura', value: 'No grasa' }] },
  { sku: 'HIG-005', name: 'Toallitas Húmedas Antibacteriales x50',        slug: 'toallitas-humedas-antibacteriales-x50',        price: 430,  stock: 350, unit: 'pack',   featured: false, offer: false, categorySlug: 'higiene-personal',         brandSlug: 'generico',   shortDescription: 'Toallitas húmedas antibacteriales para manos y superficies. Pack x50.',               specifications: [{ key: 'Unidades', value: '50 toallitas' }, { key: 'Alcohol', value: '75% v/v' }] },

  // ── ALCOHOL (5) ──────────────────────────────────────────────────────────
  { sku: 'ALC-001', name: 'Alcohol Etílico 96° 1L',                       slug: 'alcohol-etilico-96-1l',                        price: 780,  stock: 400, unit: 'litro',  featured: true,  offer: false, categorySlug: 'alcohol',                  brandSlug: 'generico',   shortDescription: 'Alcohol etílico 96° para uso industrial y doméstico.',                                specifications: [{ key: 'Graduación', value: '96°' }, { key: 'Pureza', value: 'Técnica' }] },
  { sku: 'ALC-002', name: 'Alcohol en Gel 70% 500ml',                     slug: 'alcohol-gel-70-500ml',                         price: 650,  stock: 300, unit: 'unidad', featured: false, offer: false, categorySlug: 'alcohol',                  brandSlug: 'generico',   shortDescription: 'Gel antiséptico de manos con alcohol al 70%. Aprobado ANMAT.',                       specifications: [{ key: 'Concentración', value: '70% v/v' }, { key: 'ANMAT', value: 'Sí' }] },
  { sku: 'ALC-003', name: 'Alcohol Isopropílico 70% 1L',                  slug: 'alcohol-isopropilico-70-1l',                   price: 920,  stock: 220, unit: 'litro',  featured: false, offer: false, categorySlug: 'alcohol',                  brandSlug: 'generico',   shortDescription: 'Alcohol isopropílico al 70% para desinfección de superficies.',                       specifications: [{ key: 'Concentración', value: '70% v/v' }, { key: 'Uso', value: 'Superficies y equipos' }] },
  { sku: 'ALC-004', name: 'Alcohol Etílico Desnaturalizado 1L',           slug: 'alcohol-etilico-desnaturalizado-1l',           price: 620,  stock: 350, unit: 'litro',  featured: false, offer: true,  categorySlug: 'alcohol',                  brandSlug: 'generico',   shortDescription: 'Alcohol desnaturalizado para limpieza general y desinfección.',                        specifications: [{ key: 'Tipo', value: 'Desnaturalizado' }, { key: 'Uso', value: 'Limpieza general' }] },
  { sku: 'ALC-005', name: 'Solución Alcohólica para Instrumental 1L',     slug: 'solucion-alcoholica-instrumental-1l',          price: 1100, stock: 130, unit: 'litro',  featured: false, offer: false, categorySlug: 'alcohol',                  brandSlug: 'qm',         shortDescription: 'Solución alcohólica al 70% formulada para desinfección de instrumental.',             specifications: [{ key: 'Nivel', value: 'Desinfección de nivel intermedio' }, { key: 'Uso', value: 'Tijeras, peines, instrumental' }] },

  // ── COVID-19 (5) ─────────────────────────────────────────────────────────
  { sku: 'COV-001', name: 'Desinfectante de Superficies COVID-19 1L',     slug: 'desinfectante-superficies-covid19-1l',         price: 850,  stock: 200, unit: 'litro',  featured: false, offer: false, categorySlug: 'covid19',                  brandSlug: 'qm',         shortDescription: 'Desinfectante virucida de amplio espectro. Efectivo contra virus con envuelta lipídica.', specifications: [{ key: 'Espectro', value: 'Virucida, bactericida, fungicida' }, { key: 'Dilución', value: '1:10' }] },
  { sku: 'COV-002', name: 'Alcohol en Gel 70% Pack x6 x500ml',            slug: 'alcohol-gel-70-pack-x6',                       price: 3500, stock: 80,  unit: 'pack',   featured: false, offer: true,  categorySlug: 'covid19',                  brandSlug: 'generico',   shortDescription: 'Pack economía x6 unidades de alcohol en gel 70%. Ideal para oficinas.',                specifications: [{ key: 'Unidades', value: '6 x 500 ml' }, { key: 'ANMAT', value: 'Sí' }] },
  { sku: 'COV-003', name: 'Solución Desinfectante para Nebulizadora 5L',  slug: 'solucion-desinfectante-nebulizadora-5l',       price: 2800, stock: 60,  unit: 'litro',  featured: false, offer: false, categorySlug: 'covid19',                  brandSlug: 'qm',         shortDescription: 'Solución para nebulización y fumigación de espacios interiores.',                     specifications: [{ key: 'Uso', value: 'Nebulizadora / atomizador' }, { key: 'Espacio', value: 'Hasta 500 m²' }] },
  { sku: 'COV-004', name: 'Kit Sanitización COVID-19 Completo',           slug: 'kit-sanitizacion-covid19-completo',            price: 4200, stock: 45,  unit: 'pack',   featured: true,  offer: false, categorySlug: 'covid19',                  brandSlug: 'qm',         shortDescription: 'Kit completo: desinfectante 1L + alcohol gel 500ml + barbijos x10 + guantes x20.',     specifications: [{ key: 'Incluye', value: 'Desinfectante, gel, barbijos, guantes' }] },
  { sku: 'COV-005', name: 'Barbijos Descartables Trifold x50',            slug: 'barbijos-descartables-trifold-x50',            price: 1900, stock: 120, unit: 'pack',   featured: false, offer: false, categorySlug: 'covid19',                  brandSlug: 'generico',   shortDescription: 'Barbijos tricapa descartables. Capa filtrante intermedia.',                            specifications: [{ key: 'Capas', value: '3 (tricapa)' }, { key: 'Unidades', value: '50 unidades' }] },

  // ── INSTITUCIONALES (5) ──────────────────────────────────────────────────
  { sku: 'INS-001', name: 'Desinfectante Hospitalario Oxivir 1L',         slug: 'desinfectante-hospitalario-oxivir-1l',         price: 4200, stock: 80,  unit: 'litro',  featured: false, offer: false, categorySlug: 'institucionales',          brandSlug: 'diversey',   shortDescription: 'Desinfectante de alto nivel con H₂O₂ acelerado. Tiempo de contacto 3 minutos.',       specifications: [{ key: 'Principio activo', value: 'H₂O₂ acelerado' }, { key: 'Nivel', value: 'Alto nivel' }] },
  { sku: 'INS-002', name: 'Limpiador Enzimático para Hospitales 1L',      slug: 'limpiador-enzimatico-hospitales-1l',           price: 3600, stock: 65,  unit: 'litro',  featured: false, offer: false, categorySlug: 'institucionales',          brandSlug: 'diversey',   shortDescription: 'Limpiador enzimático para pre-desinfección de instrumental médico.',                  specifications: [{ key: 'Enzimas', value: 'Proteasa, lipasa, amilasa' }, { key: 'Uso', value: 'Pre-desinfección' }] },
  { sku: 'INS-003', name: 'Jabón Quirúrgico Antiséptico 500ml',           slug: 'jabon-quirurgico-antiseptico-500ml',           price: 1800, stock: 110, unit: 'unidad', featured: false, offer: false, categorySlug: 'institucionales',          brandSlug: 'diversey',   shortDescription: 'Jabón antiséptico con clorhexidina al 2% para lavado quirúrgico.',                    specifications: [{ key: 'Principio activo', value: 'Clorhexidina 2%' }, { key: 'Uso', value: 'Lavado quirúrgico' }] },
  { sku: 'INS-004', name: 'Desengrasante Industrial para Pisos 5L',       slug: 'desengrasante-industrial-pisos-5l',            price: 3200, stock: 70,  unit: 'litro',  featured: false, offer: true,  categorySlug: 'institucionales',          brandSlug: 'qm',         shortDescription: 'Desengrasante alcalino para limpieza industrial de pisos y paredes.',                 specifications: [{ key: 'Dilución', value: '1:10 hasta 1:50' }, { key: 'pH', value: '12-13' }] },
  { sku: 'INS-005', name: 'Detergente Institucional Concentrado 5L',      slug: 'detergente-institucional-concentrado-5l',      price: 4500, stock: 50,  unit: 'litro',  featured: false, offer: false, categorySlug: 'institucionales',          brandSlug: 'qm',         shortDescription: 'Detergente multiuso de alta concentración para limpieza institucional.',               specifications: [{ key: 'Dilución', value: '1:20 hasta 1:100' }, { key: 'Uso', value: 'Pisos, paredes, superficies' }] },

  // ── GASTRONÓMICOS (5) ────────────────────────────────────────────────────
  { sku: 'GAS-001', name: 'Detergente Suma Lavavajillas Industrial 5L',   slug: 'detergente-suma-lavavajillas-industrial-5l',   price: 6800, stock: 45,  unit: 'litro',  featured: false, offer: false, categorySlug: 'gastronomicos',            brandSlug: 'diversey',   shortDescription: 'Detergente profesional para lavavajillas industriales. Alta concentración.',          specifications: [{ key: 'Dosificación', value: '2 ml/L' }, { key: 'Temperatura', value: '35-70°C' }] },
  { sku: 'GAS-002', name: 'Desengrasante para Freidoras y Parrillas 1L',  slug: 'desengrasante-freidoras-parrillas-1l',         price: 1950, stock: 90,  unit: 'litro',  featured: false, offer: false, categorySlug: 'gastronomicos',            brandSlug: 'qm',         shortDescription: 'Elimina grasa carbonizada en freidoras, parrillas y hornos profesionales.',           specifications: [{ key: 'Acción', value: 'Grasa carbonizada y polímeros' }, { key: 'Tiempo', value: '20-30 min' }] },
  { sku: 'GAS-003', name: 'Sanitizante para Frutas y Verduras 1L',        slug: 'sanitizante-frutas-verduras-1l',               price: 1200, stock: 130, unit: 'litro',  featured: false, offer: false, categorySlug: 'gastronomicos',            brandSlug: 'qm',         shortDescription: 'Sanitiza frutas y verduras eliminando bacterias sin alterar sabor ni olor.',           specifications: [{ key: 'Apto alimentario', value: 'Sí' }, { key: 'Dilución', value: '10 ml/L agua' }] },
  { sku: 'GAS-004', name: 'Enjuagante Abrillantador para Lavavajillas 1L', slug: 'enjuagante-abrillantador-lavavajillas-1l',   price: 2400, stock: 60,  unit: 'litro',  featured: false, offer: false, categorySlug: 'gastronomicos',            brandSlug: 'diversey',   shortDescription: 'Enjuagante que elimina manchas de agua y abrillanta vajilla en el último ciclo.',      specifications: [{ key: 'Dosificación', value: '1-3 ml/L' }, { key: 'Resultado', value: 'Sin manchas, sin marcas' }] },
  { sku: 'GAS-005', name: 'Desengrasante Campanas y Extractores 1L',      slug: 'desengrasante-campanas-extractores-1l',        price: 1700, stock: 80,  unit: 'litro',  featured: false, offer: true,  categorySlug: 'gastronomicos',            brandSlug: 'qm',         shortDescription: 'Disuelve y elimina la grasa acumulada en campanas y extractores de cocina.',          specifications: [{ key: 'Tipo', value: 'Alcalino espumante' }, { key: 'pH', value: '13-14' }] },

  // ── MASCOTAS (5) ─────────────────────────────────────────────────────────
  { sku: 'MAS-001', name: 'Shampoo para Mascotas Neutro 500ml',           slug: 'shampoo-mascotas-neutro-500ml',                price: 870,  stock: 140, unit: 'unidad', featured: false, offer: false, categorySlug: 'mascotas',                 brandSlug: 'aliadas',    shortDescription: 'Shampoo pH neutro para perros y gatos. Sin parabenos ni colorantes.',                 specifications: [{ key: 'pH', value: 'Neutro 6.5-7' }, { key: 'Apto', value: 'Perros y gatos' }] },
  { sku: 'MAS-002', name: 'Shampoo Antipulgas para Perros 500ml',         slug: 'shampoo-antipulgas-perros-500ml',              price: 1100, stock: 110, unit: 'unidad', featured: false, offer: false, categorySlug: 'mascotas',                 brandSlug: 'aliadas',    shortDescription: 'Shampoo con principio activo antipulgas para perros de todas las razas.',              specifications: [{ key: 'Principio activo', value: 'Permetrina 0.1%' }, { key: 'Apto', value: 'Perros adultos' }] },
  { sku: 'MAS-003', name: 'Desodorizante de Ambientes para Mascotas 400ml', slug: 'desodorizante-ambientes-mascotas-400ml',   price: 680,  stock: 160, unit: 'unidad', featured: false, offer: false, categorySlug: 'mascotas',                 brandSlug: 'fiorentina', shortDescription: 'Elimina olores de mascotas en ambientes cerrados. Fragancia fresca.',                specifications: [{ key: 'Fraganica', value: 'Fresca, neutrizante' }, { key: 'Uso', value: 'Aerosol ambiental' }] },
  { sku: 'MAS-004', name: 'Limpiador Enzimático Manchas de Mascotas 500ml', slug: 'limpiador-enzimatico-manchas-mascotas-500ml', price: 950, stock: 130, unit: 'unidad', featured: false, offer: true,  categorySlug: 'mascotas',                 brandSlug: 'qm',         shortDescription: 'Elimina manchas y olores de orina y heces de mascotas con enzimas.',                  specifications: [{ key: 'Enzimas', value: 'Proteasas y ureasa' }, { key: 'Superficies', value: 'Alfombras, telas, pisos' }] },
  { sku: 'MAS-005', name: 'Repelente de Pulgas y Garrapatas 300ml',       slug: 'repelente-pulgas-garrapatas-300ml',            price: 820,  stock: 90,  unit: 'unidad', featured: false, offer: false, categorySlug: 'mascotas',                 brandSlug: 'aliadas',    shortDescription: 'Spray repelente para aplicar en el ambiente. Eficaz contra pulgas y garrapatas.',     specifications: [{ key: 'Principio activo', value: 'Permetrina 0.05%' }, { key: 'Duración', value: '15 días' }] },

  // ── PISCINA (5) ──────────────────────────────────────────────────────────
  { sku: 'PIL-001', name: 'Cloro Líquido para Piletas 10L',               slug: 'cloro-liquido-piletas-10l',                    price: 2400, stock: 60,  unit: 'litro',  featured: false, offer: false, categorySlug: 'piscina',                  brandSlug: 'generico',   shortDescription: 'Cloro líquido al 10% para tratamiento y mantenimiento de piscinas.',                  specifications: [{ key: 'Concentración', value: '10% cloro activo' }, { key: 'Dosis', value: '100 ml/10.000 L' }] },
  { sku: 'PIL-002', name: 'Pastillas de Cloro Pileta x10',                slug: 'pastillas-cloro-pileta-x10',                   price: 1900, stock: 85,  unit: 'pack',   featured: false, offer: false, categorySlug: 'piscina',                  brandSlug: 'generico',   shortDescription: 'Pastillas de liberación lenta para mantenimiento continuo de piscinas.',               specifications: [{ key: 'Cloro activo', value: '90%' }, { key: 'Solubilidad', value: 'Lenta 7-10 días' }] },
  { sku: 'PIL-003', name: 'Algicida para Piscinas 1L',                    slug: 'algicida-piscinas-1l',                         price: 1650, stock: 70,  unit: 'litro',  featured: false, offer: false, categorySlug: 'piscina',                  brandSlug: 'generico',   shortDescription: 'Previene y elimina algas en piscinas. No espuma.',                                    specifications: [{ key: 'Principio', value: 'Sal de amonio cuaternario' }, { key: 'Dosis', value: '50 ml/10.000 L' }] },
  { sku: 'PIL-004', name: 'Clarificador de Agua para Piscinas 1L',        slug: 'clarificador-agua-piscinas-1l',                price: 1400, stock: 80,  unit: 'litro',  featured: false, offer: true,  categorySlug: 'piscina',                  brandSlug: 'generico',   shortDescription: 'Coagula partículas en suspensión para cristalizar el agua de la piscina.',            specifications: [{ key: 'Tipo', value: 'Floculante polimérico' }, { key: 'Dosis', value: '100 ml/10.000 L' }] },
  { sku: 'PIL-005', name: 'pH Minus para Piletas 1kg',                    slug: 'ph-minus-piletas-1kg',                         price: 1200, stock: 90,  unit: 'kilo',   featured: false, offer: false, categorySlug: 'piscina',                  brandSlug: 'generico',   shortDescription: 'Corrector de pH para reducir la alcalinidad del agua de piscina.',                    specifications: [{ key: 'Principio activo', value: 'Bisulfato de sodio' }, { key: 'pH ideal', value: '7.2 - 7.6' }] },

  // ── PRODUCTOS PARA AUTOS (5) ─────────────────────────────────────────────
  { sku: 'AUT-001', name: 'Shampoo para Autos Concentrado 1L',            slug: 'shampoo-autos-concentrado-1l',                 price: 760,  stock: 200, unit: 'litro',  featured: false, offer: false, categorySlug: 'productos-para-autos',     brandSlug: 'qm',         shortDescription: 'Shampoo neutro de alta espuma para lavado manual de vehículos.',                      specifications: [{ key: 'Dilución', value: '1:30' }, { key: 'pH', value: 'Neutro 7' }] },
  { sku: 'AUT-002', name: 'Cera Protectora para Carrocería 500ml',        slug: 'cera-protectora-carroceria-500ml',             price: 1350, stock: 130, unit: 'unidad', featured: false, offer: false, categorySlug: 'productos-para-autos',     brandSlug: 'qm',         shortDescription: 'Cera carnauba que protege la pintura del auto del sol y lluvia.',                     specifications: [{ key: 'Tipo', value: 'Cera carnauba' }, { key: 'Duración', value: '3-6 meses' }] },
  { sku: 'AUT-003', name: 'Limpiador de Tapizados y Alfombras 500ml',     slug: 'limpiador-tapizados-alfombras-500ml',          price: 870,  stock: 100, unit: 'unidad', featured: false, offer: false, categorySlug: 'productos-para-autos',     brandSlug: 'aliadas',    shortDescription: 'Espuma activa que limpia tapizados, alfombras y cielos rasos del vehículo.',           specifications: [{ key: 'Tipo', value: 'Espuma activa' }, { key: 'Apto para', value: 'Tela, cuero, plástico' }] },
  { sku: 'AUT-004', name: 'Desengrasante para Motor 500ml',               slug: 'desengrasante-motor-500ml',                    price: 950,  stock: 80,  unit: 'unidad', featured: false, offer: true,  categorySlug: 'productos-para-autos',     brandSlug: 'qm',         shortDescription: 'Desengrasante potente para limpiar el motor sin dañar componentes plásticos.',        specifications: [{ key: 'Aplicación', value: 'Spray directo' }, { key: 'Enjuague', value: 'Con agua a presión' }] },
  { sku: 'AUT-005', name: 'Abrillantador de Neumáticos 400ml',            slug: 'abrillantador-neumaticos-400ml',               price: 620,  stock: 150, unit: 'unidad', featured: false, offer: false, categorySlug: 'productos-para-autos',     brandSlug: 'aliadas',    shortDescription: 'Devuelve el color negro intenso a los neumáticos. Protege el caucho.',                specifications: [{ key: 'Formato', value: 'Spray o aplicador' }, { key: 'Duración', value: '2-4 semanas' }] },

  // ── GRANEL (5) ───────────────────────────────────────────────────────────
  { sku: 'GRA-001', name: 'Limpiador Pino Granel 30L',                    slug: 'limpiador-pino-granel-30l',                    price: 3600, stock: 30,  unit: 'litro',  featured: false, offer: false, categorySlug: 'granel',                   brandSlug: 'qm',         shortDescription: 'Limpiador desodorizante pino en bidón granel para distribuidores.',                   specifications: [{ key: 'Volumen', value: '30 litros' }, { key: 'Destinado a', value: 'Revendedores, distribuidores' }] },
  { sku: 'GRA-002', name: 'Detergente para Loza Granel 20L',              slug: 'detergente-loza-granel-20l',                   price: 2800, stock: 25,  unit: 'litro',  featured: false, offer: false, categorySlug: 'granel',                   brandSlug: 'aliadas',    shortDescription: 'Detergente lavavajillas a granel en bidón 20L para comercios y revendedores.',        specifications: [{ key: 'Volumen', value: '20 litros' }, { key: 'Rendimiento', value: 'Aprox. 400 lavadas' }] },
  { sku: 'GRA-003', name: 'Lavandina 80g/L Granel 25L',                   slug: 'lavandina-80gl-granel-25l',                    price: 3200, stock: 20,  unit: 'litro',  featured: false, offer: false, categorySlug: 'granel',                   brandSlug: 'generico',   shortDescription: 'Lavandina concentrada a 80g/L para fraccionamiento y distribución.',                  specifications: [{ key: 'Cloro activo', value: '80 g/L' }, { key: 'Volumen', value: '25 litros' }] },
  { sku: 'GRA-004', name: 'Suavizante Floral Granel 20L',                 slug: 'suavizante-floral-granel-20l',                 price: 2400, stock: 22,  unit: 'litro',  featured: false, offer: true,  categorySlug: 'granel',                   brandSlug: 'fiorentina', shortDescription: 'Suavizante de telas floral en presentación granel para reventa.',                    specifications: [{ key: 'Fragancia', value: 'Floral' }, { key: 'Volumen', value: '20 litros' }] },
  { sku: 'GRA-005', name: 'Desengrasante Industrial Granel 30L',          slug: 'desengrasante-industrial-granel-30l',          price: 5400, stock: 15,  unit: 'litro',  featured: false, offer: false, categorySlug: 'granel',                   brandSlug: 'qm',         shortDescription: 'Desengrasante alcalino concentrado a granel para industria y distribución.',          specifications: [{ key: 'Volumen', value: '30 litros' }, { key: 'Dilución', value: '1:10 hasta 1:50' }] },

  // ── DOY PACK (5) ─────────────────────────────────────────────────────────
  { sku: 'DOY-001', name: 'Doy Pack Suavizante Floral 1L',                slug: 'doy-pack-suavizante-floral-1l',                price: 420,  stock: 600, unit: 'litro',  featured: false, offer: true,  categorySlug: 'doy-pack',                 brandSlug: 'fiorentina', shortDescription: 'Suavizante de telas en Doy Pack rellenable. Fragancia floral.',                       specifications: [{ key: 'Formato', value: 'Doy Pack 1L' }, { key: 'Fragancia', value: 'Floral' }] },
  { sku: 'DOY-002', name: 'Doy Pack Detergente Lavavajillas Limón 1L',    slug: 'doy-pack-detergente-lavavajillas-limon-1l',    price: 310,  stock: 500, unit: 'litro',  featured: false, offer: false, categorySlug: 'doy-pack',                 brandSlug: 'fiorentina', shortDescription: 'Detergente para vajilla en Doy Pack. Ideal para fraccionar y rellenar.',             specifications: [{ key: 'Fragancia', value: 'Limón' }, { key: 'Formato', value: 'Doy Pack 1L' }] },
  { sku: 'DOY-003', name: 'Doy Pack Jabón Líquido de Manos 1L',           slug: 'doy-pack-jabon-liquido-manos-1l',              price: 390,  stock: 450, unit: 'litro',  featured: false, offer: false, categorySlug: 'doy-pack',                 brandSlug: 'aliadas',    shortDescription: 'Jabón líquido de manos en formato Doy Pack para rellenar dispensers.',               specifications: [{ key: 'pH', value: 'Neutro' }, { key: 'Formato', value: 'Doy Pack 1L' }] },
  { sku: 'DOY-004', name: 'Doy Pack Limpiador Pisos Lavanda 1L',          slug: 'doy-pack-limpiador-pisos-lavanda-1l',          price: 280,  stock: 550, unit: 'litro',  featured: false, offer: false, categorySlug: 'doy-pack',                 brandSlug: 'aliadas',    shortDescription: 'Limpiador de pisos lavanda en Doy Pack. Económico y práctico.',                       specifications: [{ key: 'Fragancia', value: 'Lavanda' }, { key: 'Formato', value: 'Doy Pack 1L' }] },
  { sku: 'DOY-005', name: 'Doy Pack Desengrasante Cocina 1L',             slug: 'doy-pack-desengrasante-cocina-1l',             price: 360,  stock: 400, unit: 'litro',  featured: false, offer: false, categorySlug: 'doy-pack',                 brandSlug: 'qm',         shortDescription: 'Desengrasante para cocina en Doy Pack. Para rellenar envases y dispensers.',          specifications: [{ key: 'Dilución', value: '1:20' }, { key: 'Formato', value: 'Doy Pack 1L' }] },

  // ── AEROSOLES PARA DISPENSER (5) ─────────────────────────────────────────
  { sku: 'DIS-001', name: 'Jabón Espumoso para Dispenser 1L',             slug: 'jabon-espumoso-dispenser-1l',                  price: 750,  stock: 400, unit: 'litro',  featured: false, offer: false, categorySlug: 'aerosoles-para-dispenser', brandSlug: 'aliadas',    shortDescription: 'Jabón espumoso para dispensers automáticos y manuales. Con aloe vera.',               specifications: [{ key: 'Tipo', value: 'Espuma' }, { key: 'Compatible', value: 'Dispensers automáticos' }] },
  { sku: 'DIS-002', name: 'Jabón Cremoso para Manos Rosado 1L',           slug: 'jabon-cremoso-manos-rosado-1l',                price: 620,  stock: 350, unit: 'litro',  featured: false, offer: false, categorySlug: 'aerosoles-para-dispenser', brandSlug: 'fiorentina', shortDescription: 'Jabón cremoso para dispensers. Fragancia floral suave.',                              specifications: [{ key: 'Tipo', value: 'Crema' }, { key: 'Fragancia', value: 'Floral suave' }] },
  { sku: 'DIS-003', name: 'Alcohol en Gel para Dispenser 1L',             slug: 'alcohol-gel-para-dispenser-1l',                price: 900,  stock: 300, unit: 'litro',  featured: true,  offer: false, categorySlug: 'aerosoles-para-dispenser', brandSlug: 'qm',         shortDescription: 'Gel alcohólico al 70% formulado para dispensers de pared y mesa.',                    specifications: [{ key: 'Alcohol', value: '70% v/v' }, { key: 'Compatible', value: 'Dispensers de pared' }] },
  { sku: 'DIS-004', name: 'Jabón Antibacterial para Dispenser 1L',        slug: 'jabon-antibacterial-dispenser-1l',             price: 800,  stock: 280, unit: 'litro',  featured: false, offer: false, categorySlug: 'aerosoles-para-dispenser', brandSlug: 'aliadas',    shortDescription: 'Jabón antibacterial con triclosán para dispensers institucionales.',                  specifications: [{ key: 'Principio activo', value: 'Triclosán 0.3%' }, { key: 'Tipo', value: 'Líquido' }] },
  { sku: 'DIS-005', name: 'Espuma Jabonosa para Manos 800ml',             slug: 'espuma-jabonosa-manos-800ml',                  price: 680,  stock: 250, unit: 'unidad', featured: false, offer: true,  categorySlug: 'aerosoles-para-dispenser', brandSlug: 'fiorentina', shortDescription: 'Espuma jabonosa dermatológicamente probada para dispensers de 800ml.',                 specifications: [{ key: 'Volumen', value: '800 ml' }, { key: 'Dermatológicamente', value: 'Probado' }] },

  // ── ENVASES (5) ──────────────────────────────────────────────────────────
  { sku: 'ENV-001', name: 'Envase HDPE 1L con Tapa Rosca',                slug: 'envase-hdpe-1l-tapa-rosca',                    price: 180,  stock: 1000, unit: 'unidad', featured: false, offer: false, categorySlug: 'envases',                 brandSlug: 'generico',   shortDescription: 'Envase plástico HDPE 1 litro apto para productos químicos. Con tapa rosca.',          specifications: [{ key: 'Material', value: 'HDPE' }, { key: 'Capacidad', value: '1 litro' }] },
  { sku: 'ENV-002', name: 'Envase Gatillo Spray 500ml',                   slug: 'envase-gatillo-spray-500ml',                   price: 220,  stock: 800,  unit: 'unidad', featured: false, offer: false, categorySlug: 'envases',                 brandSlug: 'generico',   shortDescription: 'Envase plástico transparente 500ml con gatillo spray ajustable.',                     specifications: [{ key: 'Capacidad', value: '500 ml' }, { key: 'Gatillo', value: 'Ajustable' }] },
  { sku: 'ENV-003', name: 'Bidón Plástico 5L con Tapa',                   slug: 'bidon-plastico-5l-tapa',                       price: 480,  stock: 500,  unit: 'unidad', featured: false, offer: false, categorySlug: 'envases',                 brandSlug: 'generico',   shortDescription: 'Bidón plástico de 5 litros para fraccionamiento de productos de limpieza.',           specifications: [{ key: 'Capacidad', value: '5 litros' }, { key: 'Material', value: 'HDPE resistente' }] },
  { sku: 'ENV-004', name: 'Envase Sachet Doy Pack 1L',                    slug: 'envase-sachet-doy-pack-1l',                    price: 95,   stock: 2000, unit: 'unidad', featured: false, offer: false, categorySlug: 'envases',                 brandSlug: 'generico',   shortDescription: 'Sachet Doy Pack de 1 litro para fraccionamiento y venta de productos líquidos.',      specifications: [{ key: 'Capacidad', value: '1 litro' }, { key: 'Tipo', value: 'Doy Pack con pico' }] },
  { sku: 'ENV-005', name: 'Botella HDPE 500ml con Dosificador',           slug: 'botella-hdpe-500ml-dosificador',               price: 280,  stock: 700,  unit: 'unidad', featured: false, offer: true,  categorySlug: 'envases',                 brandSlug: 'generico',   shortDescription: 'Botella 500ml con tapa dosificadora. Ideal para jabones y detergentes.',              specifications: [{ key: 'Capacidad', value: '500 ml' }, { key: 'Tapa', value: 'Dosificadora' }] },

  // ── PLÁSTICOS (5) ────────────────────────────────────────────────────────
  { sku: 'PLA-001', name: 'Bolsas de Residuos Negras 60L x25',            slug: 'bolsas-residuos-negras-60l-x25',               price: 650,  stock: 400, unit: 'pack',   featured: false, offer: false, categorySlug: 'plasticos',                brandSlug: 'generico',   shortDescription: 'Bolsas de residuos negras reforzadas 60 litros. Pack x25 unidades.',                  specifications: [{ key: 'Capacidad', value: '60 litros' }, { key: 'Unidades', value: '25 bolsas' }] },
  { sku: 'PLA-002', name: 'Guantes de Látex Descartables x100',           slug: 'guantes-latex-descartables-x100',              price: 1800, stock: 200, unit: 'pack',   featured: false, offer: false, categorySlug: 'plasticos',                brandSlug: 'generico',   shortDescription: 'Guantes descartables de látex sin polvo. Talla M/L. Pack x100.',                     specifications: [{ key: 'Material', value: 'Látex sin polvo' }, { key: 'Unidades', value: '100 guantes' }] },
  { sku: 'PLA-003', name: 'Delantal Plástico Descartable x10',            slug: 'delantal-plastico-descartable-x10',            price: 850,  stock: 150, unit: 'pack',   featured: false, offer: false, categorySlug: 'plasticos',                brandSlug: 'generico',   shortDescription: 'Delantales de polietileno descartables para uso industrial y gastronómico. Pack x10.', specifications: [{ key: 'Material', value: 'Polietileno' }, { key: 'Unidades', value: '10 delantales' }] },
  { sku: 'PLA-004', name: 'Balde Plástico con Tapa 20L',                  slug: 'balde-plastico-tapa-20l',                      price: 920,  stock: 180, unit: 'unidad', featured: false, offer: true,  categorySlug: 'plasticos',                brandSlug: 'generico',   shortDescription: 'Balde plástico resistente con tapa hermética. Apto para almacenamiento de químicos.',  specifications: [{ key: 'Capacidad', value: '20 litros' }, { key: 'Material', value: 'Polipropileno' }] },
  { sku: 'PLA-005', name: 'Bolsas Residuos Verdes Reciclaje 60L x25',     slug: 'bolsas-residuos-verdes-reciclaje-60l-x25',     price: 700,  stock: 300, unit: 'pack',   featured: false, offer: false, categorySlug: 'plasticos',                brandSlug: 'generico',   shortDescription: 'Bolsas verdes para reciclado. Estándares de separación de residuos.',                 specifications: [{ key: 'Capacidad', value: '60 litros' }, { key: 'Color', value: 'Verde reciclaje' }] },

  // ── DIVERSEY (5) ─────────────────────────────────────────────────────────
  { sku: 'DIV-001', name: 'Diversey Oxivir Desinfectante 1L',             slug: 'diversey-oxivir-desinfectante-1l',             price: 4200, stock: 80,  unit: 'litro',  featured: true,  offer: false, categorySlug: 'diversey',                 brandSlug: 'diversey',   shortDescription: 'Desinfectante de alto nivel con H₂O₂ acelerado. Efectivo en 3 minutos.',             specifications: [{ key: 'Principio activo', value: 'H₂O₂ acelerado' }, { key: 'Tiempo contacto', value: '3 min' }] },
  { sku: 'DIV-002', name: 'Diversey Suma Lavavajillas 5L',                slug: 'diversey-suma-lavavajillas-5l',                price: 6800, stock: 45,  unit: 'litro',  featured: false, offer: false, categorySlug: 'diversey',                 brandSlug: 'diversey',   shortDescription: 'Detergente para máquinas lavavajillas industriales. Alta concentración.',             specifications: [{ key: 'Dosis', value: '2 ml/L' }, { key: 'Temperatura', value: '35-70°C' }] },
  { sku: 'DIV-003', name: 'Diversey Soft Care Jabón de Manos 800ml',      slug: 'diversey-soft-care-jabon-manos-800ml',         price: 2200, stock: 120, unit: 'unidad', featured: false, offer: false, categorySlug: 'diversey',                 brandSlug: 'diversey',   shortDescription: 'Jabón de manos profesional con fórmula suave. Para dispensers Diversey.',             specifications: [{ key: 'Volumen', value: '800 ml' }, { key: 'Compatible', value: 'Dispensers Diversey' }] },
  { sku: 'DIV-004', name: 'Diversey Taski Limpiador de Pisos 5L',         slug: 'diversey-taski-limpiador-pisos-5l',            price: 5500, stock: 55,  unit: 'litro',  featured: false, offer: false, categorySlug: 'diversey',                 brandSlug: 'diversey',   shortDescription: 'Limpiador neutro Taski para pisos industriales y comerciales.',                       specifications: [{ key: 'pH', value: 'Neutro 7' }, { key: 'Dilución', value: '1:50 mantenimiento' }] },
  { sku: 'DIV-005', name: 'Diversey J-Fill Concentrado Multiusos 2L',     slug: 'diversey-jfill-concentrado-multiusos-2l',      price: 7200, stock: 35,  unit: 'litro',  featured: false, offer: true,  categorySlug: 'diversey',                 brandSlug: 'diversey',   shortDescription: 'Concentrado multiusos para sistema J-Fill Diversey. Rendimiento de hasta 200L.',      specifications: [{ key: 'Sistema', value: 'J-Fill Diversey' }, { key: 'Rendimiento', value: '200 litros' }] },

  // ── FIORENTINA (5) ───────────────────────────────────────────────────────
  { sku: 'FIO-001', name: 'Fiorentina Limpiador Pisos Lavanda 1L',        slug: 'fiorentina-limpiador-pisos-lavanda-1l',        price: 380,  stock: 350, unit: 'litro',  featured: false, offer: false, categorySlug: 'fiorentina',               brandSlug: 'fiorentina', shortDescription: 'Limpiador clásico de pisos Fiorentina con fragancia lavanda.',                        specifications: [{ key: 'Fragancia', value: 'Lavanda' }, { key: 'Volumen', value: '1 litro' }] },
  { sku: 'FIO-002', name: 'Fiorentina Detergente Lavavajillas Limón 500ml', slug: 'fiorentina-detergente-lavavajillas-limon-500ml', price: 220, stock: 500, unit: 'unidad', featured: false, offer: false, categorySlug: 'fiorentina',             brandSlug: 'fiorentina', shortDescription: 'Detergente lavavajillas Fiorentina limón. Alta espuma.',                              specifications: [{ key: 'Fragancia', value: 'Limón' }, { key: 'Volumen', value: '500 ml' }] },
  { sku: 'FIO-003', name: 'Fiorentina Suavizante Floral 1L',              slug: 'fiorentina-suavizante-floral-1l',              price: 460,  stock: 400, unit: 'litro',  featured: false, offer: false, categorySlug: 'fiorentina',               brandSlug: 'fiorentina', shortDescription: 'Suavizante de telas Fiorentina con fragancia floral intensa.',                        specifications: [{ key: 'Fragancia', value: 'Floral' }, { key: 'Dosis', value: '30 ml/lavado' }] },
  { sku: 'FIO-004', name: 'Fiorentina Jabón Líquido Rosado 500ml',        slug: 'fiorentina-jabon-liquido-rosado-500ml',        price: 310,  stock: 350, unit: 'unidad', featured: false, offer: true,  categorySlug: 'fiorentina',               brandSlug: 'fiorentina', shortDescription: 'Jabón líquido de manos Fiorentina con fragancia rosas.',                             specifications: [{ key: 'Fragancia', value: 'Rosas' }, { key: 'Tipo', value: 'Cremoso' }] },
  { sku: 'FIO-005', name: 'Fiorentina Desengrasante Cocina 750ml',        slug: 'fiorentina-desengrasante-cocina-750ml',        price: 480,  stock: 250, unit: 'unidad', featured: false, offer: false, categorySlug: 'fiorentina',               brandSlug: 'fiorentina', shortDescription: 'Desengrasante para cocina Fiorentina. Elimina grasa sin esfuerzo.',                  specifications: [{ key: 'Formato', value: 'Gatillo spray' }, { key: 'Uso', value: 'Listo para usar' }] },

  // ── ALIADAS (5) ──────────────────────────────────────────────────────────
  { sku: 'ALI-001', name: 'Aliadas Lavandina 55g/L 1L',                   slug: 'aliadas-lavandina-55gl-1l',                    price: 480,  stock: 500, unit: 'litro',  featured: true,  offer: false, categorySlug: 'aliadas',                  brandSlug: 'aliadas',    shortDescription: 'Lavandina Aliadas con 55g/L de cloro activo. Desinfecta y blanquea.',                 specifications: [{ key: 'Cloro activo', value: '55 g/L' }, { key: 'Dilución', value: '1:10' }] },
  { sku: 'ALI-002', name: 'Aliadas Detergente Lavavajillas 1L',           slug: 'aliadas-detergente-lavavajillas-1l',           price: 290,  stock: 600, unit: 'litro',  featured: false, offer: false, categorySlug: 'aliadas',                  brandSlug: 'aliadas',    shortDescription: 'Detergente para vajilla Aliadas. Alta espuma y gran rendimiento.',                    specifications: [{ key: 'Espuma', value: 'Alta' }, { key: 'Volumen', value: '1 litro' }] },
  { sku: 'ALI-003', name: 'Aliadas Limpiador de Pisos 5L',                slug: 'aliadas-limpiador-pisos-5l',                   price: 850,  stock: 300, unit: 'litro',  featured: false, offer: false, categorySlug: 'aliadas',                  brandSlug: 'aliadas',    shortDescription: 'Limpiador de pisos Aliadas 5L. Económico y efectivo para el hogar.',                  specifications: [{ key: 'Volumen', value: '5 litros' }, { key: 'Uso', value: 'Todo tipo de pisos' }] },
  { sku: 'ALI-004', name: 'Aliadas Jabón en Polvo 500g',                  slug: 'aliadas-jabon-polvo-500g',                     price: 380,  stock: 450, unit: 'kilo',   featured: false, offer: true,  categorySlug: 'aliadas',                  brandSlug: 'aliadas',    shortDescription: 'Jabón en polvo Aliadas. Limpieza profunda para ropa y multipropósito.',               specifications: [{ key: 'Contenido', value: '500 g' }, { key: 'Uso', value: 'Ropa y multipropósito' }] },
  { sku: 'ALI-005', name: 'Aliadas Quitamanchas Pastillas x20',           slug: 'aliadas-quitamanchas-pastillas-x20',           price: 890,  stock: 250, unit: 'pack',   featured: false, offer: false, categorySlug: 'aliadas',                  brandSlug: 'aliadas',    shortDescription: 'Pastillas quitamanchas para ropa blanca y de color.',                                 specifications: [{ key: 'Unidades', value: '20 pastillas' }, { key: 'Uso', value: 'Ropa blanca y color' }] },

  // ── MATERIA PRIMA (5) ─────────────────────────────────────────────────────
  { sku: 'MAT-001', name: 'Hipoclorito de Sodio 80g/L 25L',               slug: 'hipoclorito-sodio-80gl-25l',                   price: 7200, stock: 20,  unit: 'litro',  featured: false, offer: false, categorySlug: 'materia-prima',            brandSlug: 'generico',   shortDescription: 'Hipoclorito de sodio 80g/L en bidón para fabricación de lavandinas y desinfectantes.', specifications: [{ key: 'Cloro activo', value: '80 g/L' }, { key: 'Volumen', value: '25 litros' }] },
  { sku: 'MAT-002', name: 'Alcohol Isopropílico 99% 1L',                  slug: 'alcohol-isopropilico-99-1l',                   price: 1450, stock: 90,  unit: 'litro',  featured: false, offer: false, categorySlug: 'materia-prima',            brandSlug: 'generico',   shortDescription: 'Alcohol isopropílico grado técnico para fabricación y limpieza industrial.',           specifications: [{ key: 'Pureza', value: '99%' }, { key: 'Uso', value: 'Fabricación, electrónica' }] },
  { sku: 'MAT-003', name: 'Tensoactivo Aniónico LAS 20L',                 slug: 'tensoactivo-anionico-las-20l',                 price: 8500, stock: 15,  unit: 'litro',  featured: false, offer: false, categorySlug: 'materia-prima',            brandSlug: 'generico',   shortDescription: 'Alquilbenceno sulfonato lineal (LAS) para formulación de detergentes.',               specifications: [{ key: 'Activo', value: '60% LAS' }, { key: 'Volumen', value: '20 litros' }] },
  { sku: 'MAT-004', name: 'Glicerina Vegetal USP 1L',                     slug: 'glicerina-vegetal-usp-1l',                     price: 2200, stock: 50,  unit: 'litro',  featured: false, offer: false, categorySlug: 'materia-prima',            brandSlug: 'generico',   shortDescription: 'Glicerina vegetal grado USP para formulación de jabones y cosméticos.',               specifications: [{ key: 'Pureza', value: 'Grado USP' }, { key: 'Origen', value: 'Vegetal' }] },
  { sku: 'MAT-005', name: 'Ácido Cítrico Monohidratado 1kg',              slug: 'acido-citrico-monohidratado-1kg',              price: 1800, stock: 80,  unit: 'kilo',   featured: false, offer: true,  categorySlug: 'materia-prima',            brandSlug: 'generico',   shortDescription: 'Ácido cítrico alimentario para detartrado, limpieza y formulación.',                  specifications: [{ key: 'Pureza', value: 'Grado alimentario' }, { key: 'Presentación', value: '1 kg' }] },

  // ── TECNOLOGÍA DE LIMPIEZA (5) ────────────────────────────────────────────
  { sku: 'TEC-001', name: 'Limpiador Tecnológico CIP 1L',                 slug: 'limpiador-tecnologico-cip-1l',                 price: 5500, stock: 35,  unit: 'litro',  featured: true,  offer: false, categorySlug: 'tecnologia-de-limpieza',   brandSlug: 'diversey',   shortDescription: 'Sistema CIP para limpieza de tuberías y equipos gastronómicos e industriales.',       specifications: [{ key: 'Sistema', value: 'CIP' }, { key: 'Temperatura óptima', value: '60-80°C' }] },
  { sku: 'TEC-002', name: 'Concentrado Foam Cleaning 5L',                 slug: 'concentrado-foam-cleaning-5l',                 price: 6200, stock: 25,  unit: 'litro',  featured: false, offer: false, categorySlug: 'tecnologia-de-limpieza',   brandSlug: 'qm',         shortDescription: 'Espuma activa para limpieza vertical de equipos y superficies industriales.',          specifications: [{ key: 'Dilución', value: '1:10' }, { key: 'Tipo', value: 'Espuma adherente' }] },
  { sku: 'TEC-003', name: 'Desinfectante ULV para Nebulizadora 5L',       slug: 'desinfectante-ulv-nebulizadora-5l',            price: 4800, stock: 30,  unit: 'litro',  featured: false, offer: false, categorySlug: 'tecnologia-de-limpieza',   brandSlug: 'qm',         shortDescription: 'Solución bactericida-virucida formulada para equipos ULV y nebulizadoras.',           specifications: [{ key: 'Equipo', value: 'ULV / nebulizadora' }, { key: 'Cobertura', value: 'Hasta 500 m²' }] },
  { sku: 'TEC-004', name: 'Limpiador Enzimático Industrial 1L',           slug: 'limpiador-enzimatico-industrial-1l',           price: 3200, stock: 45,  unit: 'litro',  featured: false, offer: false, categorySlug: 'tecnologia-de-limpieza',   brandSlug: 'diversey',   shortDescription: 'Limpiador enzimático multiespectro para uso en industria alimentaria.',               specifications: [{ key: 'Enzimas', value: 'Proteasa, lipasa, amilasa, celulasa' }, { key: 'Temperatura', value: '35-55°C' }] },
  { sku: 'TEC-005', name: 'Dosificador Automático de Químicos',           slug: 'dosificador-automatico-quimicos',              price: 12000, stock: 10, unit: 'unidad', featured: false, offer: true,  categorySlug: 'tecnologia-de-limpieza',   brandSlug: 'diversey',   shortDescription: 'Sistema dosificador automático para dilución precisa de concentrados.',                specifications: [{ key: 'Diluciones', value: 'Programables 1:10 a 1:200' }, { key: 'Caudal', value: '15 L/min' }] },

  // ── PAPELES (5) ──────────────────────────────────────────────────────────
  { sku: 'PAP-001', name: 'Papel Higiénico Industrial Jumbo x4',          slug: 'papel-higienico-industrial-jumbo-x4',          price: 2100, stock: 110, unit: 'pack',   featured: false, offer: false, categorySlug: 'papeles',                  brandSlug: 'aliadas',    shortDescription: 'Papel higiénico jumbo para baños institucionales. Pack x4 rollos de 450m.',           specifications: [{ key: 'Tipo', value: 'Jumbo roll 26 cm' }, { key: 'Largo', value: '450 metros/rollo' }] },
  { sku: 'PAP-002', name: 'Toalla de Papel Interfoliada x150 hojas',      slug: 'toalla-papel-interfoliada-x150',               price: 680,  stock: 200, unit: 'pack',   featured: false, offer: false, categorySlug: 'papeles',                  brandSlug: 'aliadas',    shortDescription: 'Toallas de papel interfoliadas para dispensers. Hoja simple. Pack x150.',             specifications: [{ key: 'Hojas', value: '150 unidades' }, { key: 'Tipo', value: 'Interfoliada Z' }] },
  { sku: 'PAP-003', name: 'Papel Tissue para Dispensers x6 rollos',       slug: 'papel-tissue-dispensers-x6-rollos',            price: 1400, stock: 150, unit: 'pack',   featured: false, offer: false, categorySlug: 'papeles',                  brandSlug: 'generico',   shortDescription: 'Papel tissue hoja doble para dispensers domésticos e institucionales.',                specifications: [{ key: 'Rollos', value: '6 rollos' }, { key: 'Hojas', value: 'Doble hoja' }] },
  { sku: 'PAP-004', name: 'Toallón de Papel Rollo 300m',                  slug: 'tollon-papel-rollo-300m',                      price: 1800, stock: 90,  unit: 'rollo',  featured: false, offer: true,  categorySlug: 'papeles',                  brandSlug: 'aliadas',    shortDescription: 'Toallón en rollo de 300 metros para dispensers industriales y cocinas.',              specifications: [{ key: 'Largo', value: '300 metros' }, { key: 'Ancho', value: '22 cm' }] },
  { sku: 'PAP-005', name: 'Servilletas Descartables x500',                slug: 'servilletas-descartables-x500',                price: 750,  stock: 200, unit: 'pack',   featured: false, offer: false, categorySlug: 'papeles',                  brandSlug: 'generico',   shortDescription: 'Servilletas de papel blancas para uso gastronómico. Pack x500 unidades.',            specifications: [{ key: 'Unidades', value: '500 servilletas' }, { key: 'Tamaño', value: '33 x 33 cm' }] },

  // ── NOVEDADES (5) ────────────────────────────────────────────────────────
  { sku: 'NOV-001', name: 'Limpiador Ecológico Biodegradable 750ml',      slug: 'limpiador-ecologico-biodegradable-750ml',      price: 890,  stock: 120, unit: 'unidad', featured: true,  offer: false, categorySlug: 'novedades',                brandSlug: 'qm',         shortDescription: 'Nueva fórmula biodegradable 100%. Eficaz, sin fosfatos ni solventes agresivos.',      specifications: [{ key: 'Biodegradable', value: 'Sí' }, { key: 'Sin fosfatos', value: 'Sí' }] },
  { sku: 'NOV-002', name: 'Jabón Neutro con Aloe Vera y Avena 500ml',     slug: 'jabon-neutro-aloe-vera-avena-500ml',           price: 680,  stock: 200, unit: 'unidad', featured: false, offer: false, categorySlug: 'novedades',                brandSlug: 'fiorentina', shortDescription: 'Nueva fórmula con aloe vera y avena. Extra hidratante para piel sensible.',           specifications: [{ key: 'Con', value: 'Aloe vera + avena' }, { key: 'Piel sensible', value: 'Sí' }] },
  { sku: 'NOV-003', name: 'Concentrado Multiusos 5en1 500ml',             slug: 'concentrado-multiusos-5en1-500ml',             price: 1100, stock: 150, unit: 'unidad', featured: false, offer: false, categorySlug: 'novedades',                brandSlug: 'qm',         shortDescription: 'Nuevo concentrado que limpia, desinfecta, desodoriza, abrillanta y protege.',         specifications: [{ key: 'Funciones', value: 'Limpia, desinfecta, desodoriza, abrillanta, protege' }] },
  { sku: 'NOV-004', name: 'Desengrasante Natural de Naranja 1L',          slug: 'desengrasante-natural-naranja-1l',             price: 950,  stock: 100, unit: 'litro',  featured: false, offer: false, categorySlug: 'novedades',                brandSlug: 'qm',         shortDescription: 'Desengrasante a base de d-limoneno extraído de cáscaras de naranja. 100% natural.',   specifications: [{ key: 'Base activa', value: 'D-limoneno natural' }, { key: 'Fragancia', value: 'Naranja natural' }] },
  { sku: 'NOV-005', name: 'Desinfectante Multiusos Nueva Fórmula 1L',     slug: 'desinfectante-multiusos-nueva-formula-1l',     price: 820,  stock: 130, unit: 'litro',  featured: false, offer: false, categorySlug: 'novedades',                brandSlug: 'qm',         shortDescription: 'Nueva fórmula mejorada. Elimina el 99.99% de gérmenes en una sola aplicación.',       specifications: [{ key: 'Eficacia', value: '99.99% gérmenes' }, { key: 'Uso', value: 'Listo para usar' }] },

  // ── OFERTAS (5) ──────────────────────────────────────────────────────────
  { sku: 'OFE-001', name: 'Pack Ahorro Limpieza Hogar x5 Productos',      slug: 'pack-ahorro-limpieza-hogar-x5',                price: 3200, stock: 60,  unit: 'pack',   featured: true,  offer: true,  categorySlug: 'ofertas',                  brandSlug: 'aliadas',    shortDescription: 'Pack 5 productos esenciales del hogar con 30% de descuento. Stock limitado.',         specifications: [{ key: 'Incluye', value: 'Lavandina, deterg., limpiador, suaviz., jabón' }, { key: 'Ahorro', value: '30%' }] },
  { sku: 'OFE-002', name: 'Lavandina 55g/L Pack x3 Litros',               slug: 'lavandina-55gl-pack-x3-litros',                price: 1200, stock: 150, unit: 'pack',   featured: false, offer: true,  categorySlug: 'ofertas',                  brandSlug: 'aliadas',    shortDescription: 'Pack economía x3 litros de lavandina 55g/L. Precio mayorista.',                       specifications: [{ key: 'Contenido', value: '3 x 1 litro' }, { key: 'Cloro activo', value: '55 g/L' }] },
  { sku: 'OFE-003', name: 'Detergente Lavavajillas Oferta 3L',            slug: 'detergente-lavavajillas-oferta-3l',            price: 780,  stock: 200, unit: 'litro',  featured: false, offer: true,  categorySlug: 'ofertas',                  brandSlug: 'fiorentina', shortDescription: 'Detergente lavavajillas 3 litros al precio de 2. Oferta por tiempo limitado.',       specifications: [{ key: 'Volumen', value: '3 litros' }, { key: 'Precio', value: 'Especial oferta' }] },
  { sku: 'OFE-004', name: 'Limpiador de Pisos 10L Precio Mayorista',      slug: 'limpiador-pisos-10l-precio-mayorista',         price: 1600, stock: 80,  unit: 'litro',  featured: false, offer: true,  categorySlug: 'ofertas',                  brandSlug: 'aliadas',    shortDescription: 'Limpiador de pisos 10L al precio mayorista disponible para minoristas.',               specifications: [{ key: 'Volumen', value: '10 litros' }, { key: 'Precio', value: 'Mayorista' }] },
  { sku: 'OFE-005', name: 'Kit Higiene Personal 5 Productos',             slug: 'kit-higiene-personal-5-productos',             price: 2100, stock: 70,  unit: 'pack',   featured: false, offer: true,  categorySlug: 'ofertas',                  brandSlug: 'aliadas',    shortDescription: 'Kit de higiene: jabón, gel, shampoo, crema manos y toallitas. 25% descuento.',       specifications: [{ key: 'Incluye', value: '5 productos de higiene personal' }, { key: 'Ahorro', value: '25%' }] },

  // ── LIQUIDACIÓN (5) ──────────────────────────────────────────────────────
  { sku: 'LIQ-001', name: 'Detergente Enzimático Stock Último Lote 5L',   slug: 'detergente-enzimatico-stock-ultimo-lote-5l',   price: 2900, stock: 12,  unit: 'litro',  featured: false, offer: true,  categorySlug: 'liquidacion',              brandSlug: 'qm',         shortDescription: 'Último lote en stock. Precio de liquidación. 40% de descuento.',                     specifications: [{ key: 'Descuento', value: '40%' }, { key: 'Stock', value: 'Últimas unidades' }] },
  { sku: 'LIQ-002', name: 'Cera para Pisos Lote Liquidación 2L',          slug: 'cera-pisos-lote-liquidacion-2l',               price: 980,  stock: 18,  unit: 'litro',  featured: false, offer: true,  categorySlug: 'liquidacion',              brandSlug: 'qm',         shortDescription: 'Cera abrillantadora 2L. Liquidación de stock. 35% menos que precio normal.',         specifications: [{ key: 'Descuento', value: '35%' }, { key: 'Volumen', value: '2 litros' }] },
  { sku: 'LIQ-003', name: 'Desodorizante Ambiental Pack x6 Unidades',     slug: 'desodorizante-ambiental-pack-x6',              price: 2400, stock: 25,  unit: 'pack',   featured: false, offer: true,  categorySlug: 'liquidacion',              brandSlug: 'fiorentina', shortDescription: 'Pack x6 desodorizantes ambientales. Precio de liquidación de fin de temporada.',      specifications: [{ key: 'Unidades', value: '6 aerosoles 300 ml' }, { key: 'Descuento', value: '30%' }] },
  { sku: 'LIQ-004', name: 'Suavizante Telas Lote Cerrado 5L',             slug: 'suavizante-telas-lote-cerrado-5l',             price: 1500, stock: 15,  unit: 'litro',  featured: false, offer: true,  categorySlug: 'liquidacion',              brandSlug: 'aliadas',    shortDescription: 'Suavizante de telas 5L. Lote cerrado sin posibilidad de reposición.',                 specifications: [{ key: 'Volumen', value: '5 litros' }, { key: 'Stock', value: 'Sin reposición' }] },
  { sku: 'LIQ-005', name: 'Jabón Líquido Lote Descuento 10L',             slug: 'jabon-liquido-lote-descuento-10l',             price: 2800, stock: 10,  unit: 'litro',  featured: false, offer: true,  categorySlug: 'liquidacion',              brandSlug: 'aliadas',    shortDescription: 'Jabón líquido industrial 10L. Precio especial por liquidación de inventario.',        specifications: [{ key: 'Volumen', value: '10 litros' }, { key: 'Descuento', value: '45%' }] },

  // ── ESENCIALES (5) ───────────────────────────────────────────────────────
  { sku: 'ESE-001', name: 'Lavandina Esencial 1L',                        slug: 'lavandina-esencial-1l',                        price: 420,  stock: 600, unit: 'litro',  featured: true,  offer: false, categorySlug: 'esenciales',               brandSlug: 'aliadas',    shortDescription: 'Lavandina clásica esencial. El producto más pedido del catálogo.',                    specifications: [{ key: 'Cloro activo', value: '55 g/L' }, { key: 'Uso', value: 'Desinfección y blanqueo' }] },
  { sku: 'ESE-002', name: 'Detergente Lavavajillas Esencial 1L',          slug: 'detergente-lavavajillas-esencial-1l',          price: 280,  stock: 700, unit: 'litro',  featured: false, offer: false, categorySlug: 'esenciales',               brandSlug: 'aliadas',    shortDescription: 'Detergente para vajilla esencial. El favorito por precio y rendimiento.',             specifications: [{ key: 'Rendimiento', value: 'Hasta 100 lavadas' }, { key: 'Espuma', value: 'Alta' }] },
  { sku: 'ESE-003', name: 'Limpiador de Pisos Esencial 5L',               slug: 'limpiador-pisos-esencial-5l',                  price: 890,  stock: 400, unit: 'litro',  featured: false, offer: false, categorySlug: 'esenciales',               brandSlug: 'aliadas',    shortDescription: 'Limpiador multipisos esencial. Económico y de gran rendimiento.',                     specifications: [{ key: 'Volumen', value: '5 litros' }, { key: 'Uso', value: 'Todo tipo de pisos' }] },
  { sku: 'ESE-004', name: 'Jabón Líquido de Manos Esencial 500ml',        slug: 'jabon-liquido-manos-esencial-500ml',           price: 360,  stock: 500, unit: 'unidad', featured: false, offer: false, categorySlug: 'esenciales',               brandSlug: 'aliadas',    shortDescription: 'Jabón de manos esencial. Limpia suavemente sin resecar.',                             specifications: [{ key: 'pH', value: 'Neutro' }, { key: 'Volumen', value: '500 ml' }] },
  { sku: 'ESE-005', name: 'Desengrasante Esencial 750ml',                 slug: 'desengrasante-esencial-750ml',                 price: 480,  stock: 380, unit: 'unidad', featured: false, offer: false, categorySlug: 'esenciales',               brandSlug: 'aliadas',    shortDescription: 'Desengrasante esencial para cocina. Elimina grasa sin esfuerzo.',                    specifications: [{ key: 'Formato', value: 'Gatillo spray' }, { key: 'Uso', value: 'Cocinas domésticas' }] },

];

// ─────────────────────────────────────────────────────────────────────────────
// RUNNER
// ─────────────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('\n🌱  Starting seed for Berlot Clean...\n');
  console.log(`   Products to create: ${DEMO_PRODUCTS.length}\n`);

  const NOW = new Date().toISOString();

  // 1. Parent categories
  console.log('📂  Creating parent categories...');
  const parentMap = {};
  for (const cat of PARENT_CATEGORIES) {
    try {
      const created = await post('categories', { ...cat, publishedAt: NOW });
      parentMap[cat.slug] = created.id;
      console.log(`   ✓ ${cat.name}`);
      await sleep(80);
    } catch (e) {
      console.warn(`   ⚠ ${cat.name}: ${e.message}`);
    }
  }

  // 2. Child categories
  console.log('\n📂  Creating subcategories...');
  const categoryMap = { ...parentMap };
  for (const [parentSlug, children] of Object.entries(CHILD_CATEGORIES)) {
    const parentId = parentMap[parentSlug];
    if (!parentId) { console.warn(`   ⚠ Parent not found: ${parentSlug}`); continue; }
    for (const child of children) {
      try {
        const created = await post('categories', { ...child, parentCategory: parentId, publishedAt: NOW });
        categoryMap[child.slug] = created.id;
        console.log(`   ✓ ${child.name} (→ ${parentSlug})`);
        await sleep(80);
      } catch (e) {
        console.warn(`   ⚠ ${child.name}: ${e.message}`);
      }
    }
  }

  // 3. Brands
  console.log('\n🏷️   Creating brands...');
  const brandMap = {};
  for (const brand of BRANDS) {
    try {
      const created = await post('brands', { ...brand, publishedAt: NOW });
      brandMap[brand.slug] = created.id;
      console.log(`   ✓ ${brand.name}`);
      await sleep(80);
    } catch (e) {
      console.warn(`   ⚠ ${brand.name}: ${e.message}`);
    }
  }

  // 4. Attributes & values
  console.log('\n🔖  Creating attributes...');
  for (const attr of ATTRIBUTES) {
    try {
      const { values, ...attrData } = attr;
      const createdAttr = await post('attributes', attrData);
      console.log(`   ✓ ${attr.name}`);
      for (let i = 0; i < values.length; i++) {
        await post('attribute-values', { value: values[i], attribute: createdAttr.id, sortOrder: i });
      }
      console.log(`      └─ ${values.length} values`);
    } catch (e) {
      console.warn(`   ⚠ ${attr.name}: ${e.message}`);
    }
  }

  // 5. Products
  console.log(`\n📦  Creating ${DEMO_PRODUCTS.length} products (5 per category)...`);
  let created = 0;
  for (const product of DEMO_PRODUCTS) {
    try {
      const { categorySlug, brandSlug, ...productData } = product;
      const categoryId = categoryMap[categorySlug];
      const brandId = brandMap[brandSlug];
      if (!categoryId) console.warn(`      ⚠ Category not found: ${categorySlug}`);
      if (!brandId)    console.warn(`      ⚠ Brand not found: ${brandSlug}`);
      await post('products', {
        ...productData,
        publishedAt: NOW,
        ...(categoryId ? { category: categoryId } : {}),
        ...(brandId    ? { brand: brandId }       : {}),
      });
      created++;
      process.stdout.write(`\r   ✓ ${created}/${DEMO_PRODUCTS.length} — ${product.name.substring(0, 50)}`);
      await sleep(50);
    } catch (e) {
      console.warn(`\n   ⚠ ${product.name}: ${e.message}`);
    }
  }

  console.log(`\n\n✅  Seed complete! Created ${created} products across ${Object.keys(CHILD_CATEGORIES).reduce((a, k) => a + CHILD_CATEGORIES[k].length, 0)} categories.\n`);
  console.log('Next steps:');
  console.log('  1. http://localhost:1337/admin → Settings → API Tokens → create Read-only token');
  console.log('  2. Paste it in frontend/.env.local → NEXT_PUBLIC_STRAPI_TOKEN');
  console.log('  3. npm run dev  (in frontend/)');
}

seed().catch((err) => {
  console.error('\n❌  Seed failed:', err.message);
  process.exit(1);
});
