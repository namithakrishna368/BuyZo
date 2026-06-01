/**
 * Category tiles — local images (fast) from /public/images/categories/
 */
const cat = (file, alt) => ({
  image: `/images/categories/${file}.jpg`,
  alt,
  objectPosition: 'center',
});

export const CATEGORY_IMAGES = {
  Electronics: cat('electronics', 'Smartphones and electronics'),
  Fashion: cat('fashion', 'Sneakers and fashion'),
  'Home & Kitchen': cat('home-kitchen', 'Kitchen appliances'),
  Sports: cat('sports', 'Fitness equipment'),
  Beauty: cat('beauty', 'Skincare and beauty'),
  Books: cat('books', 'Books'),
  Toys: cat('toys', 'Toys and games'),
  Deals: cat('deals', "Today's deals"),
};

export const CATEGORY_TILES = [
  { name: 'Electronics', link: 'Electronics', ...CATEGORY_IMAGES.Electronics },
  { name: 'Fashion', link: 'Fashion', ...CATEGORY_IMAGES.Fashion },
  { name: 'Home & Kitchen', link: 'Home & Kitchen', ...CATEGORY_IMAGES['Home & Kitchen'] },
  { name: 'Sports', link: 'Sports', ...CATEGORY_IMAGES.Sports },
  { name: 'Beauty', link: 'Beauty', ...CATEGORY_IMAGES.Beauty },
  { name: 'Books', link: 'Books', ...CATEGORY_IMAGES.Books },
  { name: 'Toys', link: 'Toys', ...CATEGORY_IMAGES.Toys },
  { name: "Today's Deals", link: 'deals', ...CATEGORY_IMAGES.Deals },
];

export const getCategoryImage = (categoryName) => {
  if (!categoryName || categoryName === 'all') return null;
  if (categoryName === 'deals' || categoryName === "Today's Deals") return CATEGORY_IMAGES.Deals;
  return CATEGORY_IMAGES[categoryName] || null;
};
