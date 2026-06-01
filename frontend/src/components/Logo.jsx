import { Link } from 'react-router-dom';

const Logo = ({ className = '', size = 'default' }) => {
  const sizes = {
    sm: 'text-xl',
    default: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <Link to="/" className={`font-display font-bold tracking-tight ${sizes[size]} ${className}`}>
      <span className="text-navy-600">Buy</span>
      <span className="text-navy-400">ZO</span>
    </Link>
  );
};

export default Logo;
