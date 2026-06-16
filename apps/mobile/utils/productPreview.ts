import type { HomeProduct, ProductDetail } from '../types/catalog';

export function previewToProductDetail(preview: HomeProduct): ProductDetail {
  return {
    id: preview.id,
    handle: preview.handle,
    title: preview.title,
    description: '',
    price: preview.price,
    image: preview.image,
    images: preview.image ? [preview.image] : [],
    variants: [],
    inStock: true,
    lowStock: false,
    isNew: false,
    isTrending: false,
    isFeatured: false,
  };
}
