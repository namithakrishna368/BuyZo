import { Link } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import ProductImage from './ProductImage';
import { formatINR } from '../utils/currency';

const ProductCard = ({ product }) => {
  const image = product.images?.[0];
  const discount =
    product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : 0;

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group card overflow-hidden p-0 transition hover:shadow-elevated"
    >
      <div className="relative aspect-square overflow-hidden bg-cream-100">
        <ProductImage
          slug={product.slug}
          src={product.imageUrl || image}
          alt={product.name}
          priority
          className="absolute inset-0 h-full w-full"
          imgClassName="h-full w-full object-contain p-2"
        />
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-navy-600 px-2.5 py-1 text-xs font-bold text-cream-100">
            -{discount}%
          </span>
        )}
        {!product.inStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-navy-900/50 text-sm font-semibold text-white">
            Out of Stock
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-navy-400">{product.category}</p>
        <h3 className="mt-1 line-clamp-2 font-semibold text-navy-800 group-hover:text-navy-600">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center gap-1 text-sm text-amber-600">
          <FiStar className="h-4 w-4 fill-current" />
          <span>{product.rating}</span>
          <span className="text-navy-400">({product.numReviews})</span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-navy-800">{formatINR(product.price)}</span>
          {product.comparePrice > product.price && (
            <span className="text-sm text-navy-400 line-through">{formatINR(product.comparePrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
