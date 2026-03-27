'use strict';

const { AsyncLocalStorage } = require('async_hooks');

/**
 * Per-request async context: carries the resolved Cloudinary folder from
 * the route middleware (where ctx.request.body.ref is available) down to
 * the upload provider (where the actual Cloudinary API call happens).
 * AsyncLocalStorage is concurrency-safe across async/await boundaries.
 */
const uploadCtx = new AsyncLocalStorage();

// ─── Content-type UID → Cloudinary subfolder ──────────────────
const FOLDER_MAP = {
  'api::category.category':           'categories',
  'api::product.product':             'products',
  'api::brand.brand':                 'brands',
  'api::promotion.promotion':         'banners',
  'api::home-section.home-section':   'hero',
};

/**
 * Upload-time Cloudinary transformations per subfolder.
 *
 * Rules:
 *  - Use only parameters supported on all Cloudinary plans.
 *  - crop:'fill' + gravity:'center' (not 'auto' — that requires Smart Cropping addon).
 *  - Omit quality — let Cloudinary decide, or set a fixed integer if needed.
 *  - These params are merged into the Cloudinary upload call as customConfig,
 *    which spreads AFTER providerOptions.params, so they override the defaults.
 */
const TRANSFORMS_MAP = {
  categories: {
    // 4:3  1200 × 900 — consistent category card images
    width:   1200,
    height:  900,
    crop:    'fill',
    gravity: 'center',
  },
};

// ─── Helpers ──────────────────────────────────────────────────
function resolveUploadConfig(ref) {
  const subfolder = FOLDER_MAP[ref];
  if (!subfolder) return null;

  const baseFolder = process.env.CLOUDINARY_BASE_FOLDER || 'berlot-clean/local';

  return {
    folder:     `${baseFolder}/${subfolder}`,
    transforms: TRANSFORMS_MAP[subfolder] || {},
  };
}

// ─── Strapi lifecycle ─────────────────────────────────────────
module.exports = {
  bootstrap({ strapi }) {

    // ── 1. Route-level middleware ────────────────────────────
    //
    // strapi.server.router.use(path, fn) runs AFTER the global body
    // parser (app-level) but BEFORE the route handler, so
    // ctx.request.body is already populated with multipart text fields
    // (ref, refId, field) by the time our middleware executes.
    //
    // This avoids the fragile service-method wrapping that caused issues
    // with Strapi v5's internal service proxies.
    try {
      if (!strapi.server?.router) {
        strapi.log.warn('[upload-folder] strapi.server.router not available — folder routing disabled');
      } else {
        strapi.server.router.use('/api/upload', async (ctx, next) => {
          if (ctx.method === 'POST') {
            const ref = ctx.request.body?.ref;
            const cfg = resolveUploadConfig(ref);
            if (cfg) {
              return uploadCtx.run(cfg, () => next());
            }
          }
          return next();
        });
      }
    } catch (err) {
      strapi.log.error('[upload-folder] Failed to register route middleware:', err.message);
    }

    // ── 2. Wrap upload PROVIDER ──────────────────────────────
    //
    // The Cloudinary provider accepts an optional customConfig second
    // argument that is spread AFTER providerOptions.params:
    //   { resource_type: 'auto', ...params, ...customConfig }
    // So customConfig.folder overrides the default params.folder.
    try {
      const provider = strapi.plugin('upload').provider;

      if (!provider) {
        strapi.log.warn('[upload-folder] Upload provider not available — folder routing disabled');
        return;
      }

      if (typeof provider.upload === 'function') {
        const _upload = provider.upload.bind(provider);

        provider.upload = async function(file, customConfig = {}) {
          const ctx   = uploadCtx.getStore();
          const extra = ctx ? { folder: ctx.folder, ...ctx.transforms } : {};
          return _upload(file, { ...customConfig, ...extra });
        };
      }

      if (typeof provider.uploadStream === 'function') {
        const _uploadStream = provider.uploadStream.bind(provider);

        provider.uploadStream = async function(file, customConfig = {}) {
          const ctx   = uploadCtx.getStore();
          const extra = ctx ? { folder: ctx.folder, ...ctx.transforms } : {};
          return _uploadStream(file, { ...customConfig, ...extra });
        };
      }

    } catch (err) {
      strapi.log.error('[upload-folder] Failed to wrap upload provider:', err.message);
    }
  },
};
