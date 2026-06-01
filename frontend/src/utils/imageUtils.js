/** Build one optimized URL (no srcset — fewer failures, faster on slow networks) */
export const getImageUrl = (url, { width = 400, height = 400, quality = 80 } = {}) => {
  if (!url) return null;
  if (url.startsWith('/') || url.startsWith('data:')) return url;
  try {
    const u = new URL(url);
    if (u.hostname.includes('unsplash.com')) {
      u.searchParams.set('auto', 'format');
      u.searchParams.set('fit', 'crop');
      u.searchParams.set('w', String(width));
      u.searchParams.set('h', String(height));
      u.searchParams.set('q', String(quality));
    }
    return u.toString();
  } catch {
    return url;
  }
};

export const IMAGE_PRESETS = {
  card: { width: 320, height: 320, quality: 80 },
  thumb: { width: 128, height: 128, quality: 75 },
  cart: { width: 140, height: 140, quality: 75 },
  detailThumb: { width: 80, height: 80, quality: 75 },
  detailMain: { width: 640, height: 640, quality: 82 },
  banner: { width: 960, height: 400, quality: 78 },
  category: { width: 640, height: 288, quality: 78 },
};
