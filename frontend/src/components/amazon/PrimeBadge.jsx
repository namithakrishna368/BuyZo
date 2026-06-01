const PrimeBadge = ({ className = '' }) => (
  <span className={`inline-flex items-center gap-1 text-xs ${className}`}>
    <span className="font-bold text-amazon-prime">prime</span>
    <span className="text-gray-600">FREE delivery</span>
  </span>
);

export default PrimeBadge;
