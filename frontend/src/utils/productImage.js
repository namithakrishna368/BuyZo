/** Local product photos — same path as backend seed (instant, no CDN) */
export const getLocalProductImage = (slug) => (slug ? `/images/products/${slug}.jpg` : '');

export const getLocalCategoryImage = (key) => (key ? `/images/categories/${key}.jpg` : '');

/** Best image for a product: always try local file first (Amazon-style) */
export const resolveProductImage = (product) => {
  if (!product) return '';
  if (product.slug) return getLocalProductImage(product.slug);
  const first = product.images?.[0];
  if (first?.startsWith('/')) return first;
  return first || '';
};

export const resolveProductImageFallback = (product) => {
  const remote = product?.images?.find((u) => u?.startsWith('http'));
  return remote || '';
};
