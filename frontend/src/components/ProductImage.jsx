import { useMemo, useState } from 'react';
import { FiImage } from 'react-icons/fi';
import { getLocalProductImage } from '../utils/productImage';

const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="280" viewBox="0 0 280 280">
      <rect fill="#ffffff" width="280" height="280"/>
      <rect fill="#f3f3f3" x="40" y="40" width="200" height="200" rx="8"/>
      <text x="140" y="145" text-anchor="middle" fill="#999" font-family="Arial,sans-serif" font-size="13">BuyZO</text>
    </svg>`
  );

/**
 * Amazon-style product image: local file by slug, visible immediately, no fade delay.
 */
const ProductImage = ({
  slug,
  src,
  alt = 'Product',
  className = '',
  imgClassName = 'max-h-full max-w-full object-contain',
  wrapperClassName = 'flex items-center justify-center bg-white',
  priority = false,
  objectPosition,
  fallbackSrc,
}) => {
  const sources = useMemo(() => {
    const list = [];
    if (slug) list.push(getLocalProductImage(slug));
    if (src && !list.includes(src)) list.push(src);
    if (fallbackSrc && !list.includes(fallbackSrc)) list.push(fallbackSrc);
    return list.filter(Boolean);
  }, [slug, src, fallbackSrc]);

  const [index, setIndex] = useState(0);
  const imgSrc = sources[index] || PLACEHOLDER;
  const exhausted = index >= sources.length && sources.length > 0;

  if (!slug && !src && !fallbackSrc) {
    return (
      <div className={`amazon-product-image ${wrapperClassName} ${className}`}>
        <div className="flex flex-col items-center justify-center text-gray-400">
          <FiImage className="h-10 w-10" aria-hidden />
        </div>
      </div>
    );
  }

  return (
    <div className={`amazon-product-image ${wrapperClassName} ${className}`}>
      <img
        src={exhausted ? PLACEHOLDER : imgSrc}
        alt={alt}
        className={imgClassName}
        style={objectPosition ? { objectPosition } : undefined}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onError={() => {
          if (index < sources.length - 1) setIndex((i) => i + 1);
          else if (imgSrc !== PLACEHOLDER) setIndex(sources.length);
        }}
      />
    </div>
  );
};

export default ProductImage;
