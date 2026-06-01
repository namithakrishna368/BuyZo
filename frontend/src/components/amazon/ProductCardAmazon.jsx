import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import PrimeBadge from './PrimeBadge';
import ProductImage from '../ProductImage';
import PriceDisplay from '../PriceDisplay';
import { resolveProductImageFallback } from '../../utils/productImage';

const ProductCardAmazon = ({ product, listView = false, priority = false }) => {
  const fallback = resolveProductImageFallback(product);
  const discount =
    product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : 0;

  if (listView) {
    return (
      <div className="flex gap-3 border-b border-gray-200 bg-white p-3 sm:gap-4 sm:p-4">
        <Link to={`/products/${product.slug}`} className="amazon-img-slot h-24 w-24 shrink-0 sm:h-32 sm:w-32">
          <ProductImage
            slug={product.slug}
            src={product.imageUrl}
            fallbackSrc={fallback}
            alt={product.name}
            priority={priority}
            className="h-full w-full"
            wrapperClassName="h-full w-full bg-white"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <Link to={`/products/${product.slug}`} className="line-clamp-2 text-base text-amazon-link hover:underline">
            {product.name}
          </Link>
          <div className="mt-1">
            <StarRating rating={product.rating} count={product.numReviews} />
          </div>
          {product.bestseller && (
            <p className="mt-1 text-xs font-bold text-[#c45500]">{product.dealLabel || '#1 Best Seller'}</p>
          )}
          <div className="mt-2">
            <PriceDisplay price={product.price} comparePrice={product.comparePrice} size="sm" />
          </div>
          {product.prime && <PrimeBadge className="mt-1" />}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white p-2 sm:p-3">
      <Link to={`/products/${product.slug}`} className="relative flex flex-1 flex-col">
        <div className="amazon-img-slot mb-2 sm:mb-3">
          <ProductImage
            slug={product.slug}
            src={product.imageUrl}
            fallbackSrc={fallback}
            alt={product.name}
            priority={priority}
            className="h-full w-full"
            wrapperClassName="h-full w-full bg-white"
          />
          {discount > 0 && (
            <span className="absolute left-0 top-0 z-10 rounded bg-[#cc0c39] px-1.5 py-0.5 text-xs font-bold text-white">
              -{discount}%
            </span>
          )}
        </div>
        <h3 className="line-clamp-2 text-sm text-amazon-link">{product.name}</h3>
        <div className="mt-1">
          <StarRating rating={product.rating} count={product.numReviews} />
        </div>
        {(product.bestseller || product.dealLabel) && (
          <p className="mt-1 text-xs font-bold text-[#c45500]">{product.dealLabel || 'Best Seller'}</p>
        )}
        <div className="mt-2">
          <PriceDisplay price={product.price} comparePrice={product.comparePrice} size="sm" showMRP={product.comparePrice > product.price} />
        </div>
        {product.prime && <PrimeBadge className="mt-1" />}
        {!product.inStock && <p className="mt-1 text-sm font-medium text-[#b12704]">Currently unavailable</p>}
      </Link>
    </div>
  );
};

export default ProductCardAmazon;
