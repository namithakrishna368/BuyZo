const LoadingSpinner = ({ fullScreen = false, size = 'md' }) => {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };

  const spinner = (
    <div
      className={`${sizes[size]} animate-spin rounded-full border-2 border-cream-300 border-t-navy-600`}
      role="status"
      aria-label="Loading"
    />
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-100">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center py-8">{spinner}</div>;
};

export default LoadingSpinner;
