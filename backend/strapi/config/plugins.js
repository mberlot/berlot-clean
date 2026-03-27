'use strict';

/**
 * Upload plugin — Cloudinary provider
 *
 * Folder structure:
 *   ${CLOUDINARY_BASE_FOLDER}/${CLOUDINARY_ASSET_TYPE}
 *
 * Examples:
 *   berlot-clean/local/products
 *   berlot-clean/local/categories
 *   berlot-clean/local/hero
 *   berlot-clean/local/banners
 *
 * To switch asset type, change CLOUDINARY_ASSET_TYPE in .env.
 */
module.exports = ({ env }) => {
  const baseFolder = env('CLOUDINARY_BASE_FOLDER', 'berlot-clean/local');
  const assetType = env('CLOUDINARY_ASSET_TYPE', 'products');

  return {
    upload: {
      config: {
        provider: '@strapi/provider-upload-cloudinary',
        providerOptions: {
          cloud_name: env('CLOUDINARY_CLOUD_NAME'),
          api_key:    env('CLOUDINARY_API_KEY'),
          api_secret: env('CLOUDINARY_API_SECRET'),
          params: {
            folder: `${baseFolder}/${assetType}`,
          },
        },
        actionOptions: {
          upload:       {},
          uploadStream: {},
          delete:       {},
        },
        // Disable local image processing — prevents Windows EBUSY temp-file
        // error (sharp holds optimized-* handles while Strapi tries to unlink).
        // Cloudinary handles optimization and responsive transformations.
        sizeOptimization: false,
        responsiveDimensions: false,
      },
    },
  };
};
