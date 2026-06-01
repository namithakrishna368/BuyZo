import { FiStar } from 'react-icons/fi';
import { formatIndianNumber } from '../../utils/currency';

const StarRating = ({ rating, count, size = 'sm' }) => {
  const stars = Math.round(rating * 2) / 2;
  const iconClass = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';

  return (
    <div className="flex flex-wrap items-center gap-1">
      <div className="flex text-amazon-star">
        {[1, 2, 3, 4, 5].map((n) => (
          <FiStar
            key={n}
            className={`${iconClass} ${n <= stars ? 'fill-current' : n - 0.5 <= stars ? 'fill-current opacity-50' : 'text-gray-300'}`}
          />
        ))}
      </div>
      {count !== undefined && (
        <a href="#reviews" className="text-sm text-amazon-link hover:text-amazon-link-hover hover:underline">
          {formatIndianNumber(count)} ratings
        </a>
      )}
    </div>
  );
};

export default StarRating;
