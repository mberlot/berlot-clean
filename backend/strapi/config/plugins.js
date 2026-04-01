module.exports = ({ env }) => {
  const baseFolder = env("CLOUDINARY_BASE_FOLDER", "berlot-clean/local");
  const assetType = env("CLOUDINARY_ASSET_TYPE", "products");

  return {
    upload: {
      config: {
        provider: "cloudinary",
        providerOptions: {
          cloud_name: env("CLOUDINARY_CLOUD_NAME"),
          api_key: env("CLOUDINARY_API_KEY"),
          api_secret: env("CLOUDINARY_API_SECRET"),
          params: {
            folder: `${baseFolder}/${assetType}`,
          },
        },
      },
    },
  };
};
