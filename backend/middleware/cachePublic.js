/** Short CDN cache for public product API responses */
export const cachePublic = (seconds = 60) => (req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', `public, s-maxage=${seconds}, stale-while-revalidate=${seconds * 2}`);
  }
  next();
};
