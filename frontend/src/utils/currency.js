/** Indian Rupee formatting (en-IN locale) */

export const formatINR = (amount, { decimals = 0 } = {}) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount ?? 0);

export const formatINRParts = (amount) => {
  const value = Number(amount) || 0;
  const whole = Math.floor(value);
  const fraction = Math.round((value - whole) * 100);

  return {
    symbol: '₹',
    whole: new Intl.NumberFormat('en-IN').format(whole),
    fraction: fraction > 0 ? fraction.toString().padStart(2, '0') : null,
    full: formatINR(value, { decimals: fraction > 0 ? 2 : 0 }),
  };
};

export const formatIndianNumber = (n) => new Intl.NumberFormat('en-IN').format(n ?? 0);

/** Free delivery threshold (Amazon India–style) */
export const FREE_DELIVERY_MIN = 499;
export const GST_RATE = 0.18;
export const COD_AVAILABLE = true;
