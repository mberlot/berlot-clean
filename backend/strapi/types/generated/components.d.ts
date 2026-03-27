import type { Schema, Struct } from '@strapi/strapi';

export interface ProductSpecification extends Struct.ComponentSchema {
  collectionName: 'components_product_specifications';
  info: {
    description: 'A key-value product specification (e.g. Diluci\u00F3n: 1:20)';
    displayName: 'Specification';
  };
  attributes: {
    key: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    value: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
  };
}

export interface SharedBanner extends Struct.ComponentSchema {
  collectionName: 'components_shared_banners';
  info: {
    description: 'A promotional banner with image, title, and CTA';
    displayName: 'Banner';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
    image: Schema.Attribute.Media<'images'>;
    linkLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    linkUrl: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    mobileImage: Schema.Attribute.Media<'images'>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 250;
      }>;
    textColor: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 150;
      }>;
  };
}

export interface UiHero extends Struct.ComponentSchema {
  collectionName: 'components_ui_heroes';
  info: {
    description: 'Full-width hero section with media, title, description and CTA';
    displayName: 'Hero';
  };
  attributes: {
    ctaLink: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    ctaText: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 400;
      }>;
    heroMedia: Schema.Attribute.Media<'images' | 'files'>;
    heroMediaAlt: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    layout: Schema.Attribute.Enumeration<['image-right', 'image-left']> &
      Schema.Attribute.DefaultTo<'image-right'>;
    titleHighlight: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    titlePrimary: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'product.specification': ProductSpecification;
      'shared.banner': SharedBanner;
      'ui.hero': UiHero;
    }
  }
}
