'use strict';

/**
 * seed-category-images.js
 *
 * Generates placeholder images for every category that has no image,
 * uploads them to Cloudinary under berlot-clean/local/categories, and
 * attaches them to the category records in Strapi.
 *
 * The Cloudinary folder routing is handled automatically by src/index.js —
 * no Cloudinary credentials are needed here.
 *
 * Usage (PowerShell):
 *   $env:STRAPI_TOKEN="<full-access-api-token>"
 *   npm run seed:category-images
 *
 * Usage (bash / Git Bash):
 *   STRAPI_TOKEN=<full-access-api-token> npm run seed:category-images
 *
 * Requirements:
 *   - Strapi must be running  (npm run develop)
 *   - STRAPI_TOKEN must be a Full Access API token
 *     Strapi admin → Settings → API Tokens → Create → Full Access
 */

// ─── Config ───────────────────────────────────────────────────
const STRAPI_URL   = process.env.STRAPI_URL   || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || '';

if (!STRAPI_TOKEN) {
  console.error('\n❌  STRAPI_TOKEN is required.');
  console.error('   Strapi admin → Settings → API Tokens → Create → Full Access\n');
  process.exit(1);
}

// sharp ships with @strapi/strapi — no extra install needed
let sharp;
try {
  sharp = require('sharp');
} catch {
  console.error('\n❌  Could not load "sharp". Run npm install in the backend/strapi directory.\n');
  process.exit(1);
}

// ─── Design-system colour pairs ──────────────────────────────
//  Each pair: { bg, accent } — cycles through categories
const PALETTE = [
  { bg: '#F4F2EF', accent: '#384F84' }, // ivory   / navy
  { bg: '#EEF1F8', accent: '#2E5C8A' }, // sky     / ocean
  { bg: '#F2F4EE', accent: '#3A6B3A' }, // sage    / forest
  { bg: '#F7F2ED', accent: '#8B5A2B' }, // cream   / brown
  { bg: '#F0EEF7', accent: '#5A3A8B' }, // lavender/ purple
  { bg: '#F7EDEE', accent: '#8B3A3A' }, // blush   / burgundy
];

const GOLD   = '#C8B496';
const MUTED  = '#999999';

// ─── SVG helpers ──────────────────────────────────────────────
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Wraps a string into lines of at most maxChars characters. */
function wrapText(text, maxChars) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Builds a 1200×900 SVG placeholder for a category.
 * Design: flat editorial look with corner bracket marks matching
 * the berlot-clean design system.
 */
function buildSvg(name, colorIndex) {
  const { bg, accent } = PALETTE[colorIndex % PALETTE.length];
  const PAD = 48;       // inner padding
  const CS  = 60;       // corner-bracket arm length
  const W   = 1200;
  const H   = 900;

  // Typography — shrink font if name is long
  const label      = name.toUpperCase();
  const lines      = wrapText(label, 18);
  const fontSize   = lines.length > 2 ? 62 : 76;
  const lineHeight = fontSize * 1.3;
  const totalH     = lines.length * lineHeight;
  const startY     = (H - totalH) / 2 + lineHeight * 0.45;

  const textEls = lines
    .map(
      (line, i) =>
        `<text` +
        ` x="${W / 2}"` +
        ` y="${Math.round(startY + i * lineHeight)}"` +
        ` font-family="Arial,Helvetica,sans-serif"` +
        ` font-size="${fontSize}"` +
        ` font-weight="700"` +
        ` text-anchor="middle"` +
        ` dominant-baseline="middle"` +
        ` fill="${accent}"` +
        ` letter-spacing="4"` +
        `>${escapeXml(line)}</text>`
    )
    .join('\n  ');

  // Corner brackets (top-left, top-right, bottom-left, bottom-right)
  const brackets = [
    `M${PAD + CS},${PAD} L${PAD},${PAD} L${PAD},${PAD + CS}`,
    `M${W - PAD - CS},${PAD} L${W - PAD},${PAD} L${W - PAD},${PAD + CS}`,
    `M${PAD + CS},${H - PAD} L${PAD},${H - PAD} L${PAD},${H - PAD - CS}`,
    `M${W - PAD - CS},${H - PAD} L${W - PAD},${H - PAD} L${W - PAD},${H - PAD - CS}`,
  ]
    .map(
      (d) =>
        `<path d="${d}" fill="none" stroke="${accent}" stroke-width="4" stroke-linecap="square"/>`
    )
    .join('\n  ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${W}" height="${H}" fill="${bg}"/>
  <!-- Inner border -->
  <rect x="${PAD}" y="${PAD}" width="${W - PAD * 2}" height="${H - PAD * 2}"
        fill="none" stroke="${GOLD}" stroke-width="1.5"/>
  <!-- Corner brackets -->
  ${brackets}
  <!-- Category name -->
  ${textEls}
  <!-- Brand watermark -->
  <text
    x="${W / 2}" y="${H - PAD - 20}"
    font-family="Arial,Helvetica,sans-serif" font-size="13"
    text-anchor="middle" dominant-baseline="middle"
    fill="${MUTED}" letter-spacing="4"
  >BERLOT CLEAN</text>
</svg>`;
}

/** Converts an SVG string to a 1200×900 PNG buffer using sharp. */
async function svgToPng(svgString) {
  return sharp(Buffer.from(svgString))
    .resize(1200, 900, { fit: 'fill' })
    .png()
    .toBuffer();
}

// ─── Strapi API helpers ───────────────────────────────────────
const AUTH = { Authorization: `Bearer ${STRAPI_TOKEN}` };

/** Fetches all categories, populated with their image field. */
async function getCategories() {
  const url =
    `${STRAPI_URL}/api/categories` +
    `?populate=image` +
    `&pagination[pageSize]=200` +
    `&sort=sortOrder:asc,name:asc`;

  const res = await fetch(url, { headers: AUTH });
  if (!res.ok) {
    throw new Error(`GET /api/categories — ${res.status}: ${await res.text()}`);
  }
  const json = await res.json();
  return json.data; // flat array in Strapi v5
}

/**
 * Uploads a PNG to Strapi and links it to a category in one request.
 *
 * Passing ref + refId + field tells Strapi to:
 *   1. Store the file in the Media Library
 *   2. Route the upload through src/index.js → berlot-clean/local/categories
 *   3. Attach the resulting media entry to category.image automatically
 */
async function uploadAndAttach(pngBuffer, category) {
  const filename = `${category.slug}-placeholder.png`;

  // In Strapi v5, refId accepts the documentId (string) or the numeric id
  const refId = category.documentId ?? String(category.id);

  const form = new FormData();
  form.append('files',  new Blob([pngBuffer], { type: 'image/png' }), filename);
  form.append('ref',    'api::category.category');
  form.append('refId',  refId);
  form.append('field',  'image');

  const res = await fetch(`${STRAPI_URL}/api/upload`, {
    method:  'POST',
    headers: AUTH, // do NOT set Content-Type — fetch sets multipart boundary automatically
    body:    form,
  });

  if (!res.ok) {
    throw new Error(`upload failed (${res.status}): ${await res.text()}`);
  }

  const json = await res.json();
  return Array.isArray(json) ? json[0] : json;
}

// ─── Main ─────────────────────────────────────────────────────
async function main() {
  console.log('');
  console.log('┌──────────────────────────────────────────────────┐');
  console.log('│   Berlot Clean — Category Image Seeder           │');
  console.log('└──────────────────────────────────────────────────┘');
  console.log(`  Strapi  : ${STRAPI_URL}`);
  console.log('');

  // 1. Fetch categories
  const all = await getCategories();
  console.log(`  Total categories : ${all.length}`);

  // 2. Filter out those that already have an image
  const todo   = all.filter((c) => !c.image);
  const skipped = all.length - todo.length;

  if (skipped > 0) {
    console.log(`  Already have image : ${skipped} (skipped)`);
  }
  if (todo.length === 0) {
    console.log('\n  ✅  All categories already have images. Nothing to do.\n');
    return;
  }

  console.log(`  Generating images  : ${todo.length}`);
  console.log('');

  let ok   = 0;
  let fail = 0;

  for (let i = 0; i < todo.length; i++) {
    const cat    = todo[i];
    const prefix = `  [${String(i + 1).padStart(2)}/${todo.length}]`;
    process.stdout.write(`${prefix} ${cat.name.padEnd(36)} `);

    try {
      const svg  = buildSvg(cat.name, i);
      const png  = await svgToPng(svg);
      const file = await uploadAndAttach(png, cat);

      const shortUrl = (file.url || '').replace(/^https?:\/\/[^/]+/, '').slice(0, 60);
      console.log(`✅  ${shortUrl || '(linked)'}`);
      ok++;
    } catch (err) {
      console.log(`❌  ${err.message}`);
      fail++;
    }

    // Brief pause between uploads to avoid overwhelming Strapi / Cloudinary
    if (i < todo.length - 1) {
      await new Promise((r) => setTimeout(r, 400));
    }
  }

  console.log('');
  console.log(`  ─────────────────────────────────────────────────`);
  console.log(`  Uploaded : ${ok}`);
  if (fail > 0) console.log(`  Failed   : ${fail}`);
  console.log('');
}

main().catch((err) => {
  console.error('\n❌  Fatal:', err.message);
  process.exit(1);
});
