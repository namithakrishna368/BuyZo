import { formatINR, formatINRParts } from '../utils/currency';

/** Amazon India–style price: ₹69,999 */
const PriceDisplay = ({ price, comparePrice, size = 'md', showMRP = true }) => {
  const parts = formatINRParts(price);
  const discount =
    comparePrice > price ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;

  const sizeClasses = {
    sm: { whole: 'text-lg', symbol: 'text-xs', mrp: 'text-xs' },
    md: { whole: 'text-2xl', symbol: 'text-sm', mrp: 'text-sm' },
    lg: { whole: 'text-3xl', symbol: 'text-sm', mrp: 'text-sm' },
    xl: { whole: 'text-4xl', symbol: 'text-base', mrp: 'text-sm' },
  };
  const s = sizeClasses[size] || sizeClasses.md;

  return (
    <div>
      <div className="flex items-start gap-0.5 text-gray-900">
        <span className={`${s.symbol} align-top leading-none`}>{parts.symbol}</span>
        <span className={`${s.whole} font-medium leading-none`}>{parts.whole}</span>
        {parts.fraction && (
          <span className="text-sm align-top">{parts.fraction}</span>
        )}
      </div>
      {comparePrice > price && showMRP && (
        <p className={`mt-1 ${s.mrp} text-gray-600`}>
          M.R.P.: <span className="line-through">{formatINR(comparePrice)}</span>
          {discount > 0 && (
            <span className="ml-2 font-medium text-[#cc0c39]">({discount}% off)</span>
          )}
        </p>
      )}
    </div>
  );
};

export default PriceDisplay;
