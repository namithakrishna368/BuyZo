/**
 * Product images: local files (fast) + Unsplash CDN fallback (remote).
 */
const u = (id, w = 800, h = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const localProductImage = (slug) => `/images/products/${slug}.jpg`;
export const localCategoryImage = (key) => `/images/categories/${key}.jpg`;

export const PRODUCT_IMAGES_REMOTE = {
  'iphone-15-128gb-black': [u('1695048133142-1a20484d2569'), u('1592750475338-74b7b21085ab')],
  'samsung-galaxy-s24-ultra': [u('1511707171634-5f897ff02aa9'), u('1567581933762-63969aaf8ccb')],
  'sony-wh1000xm5-headphones': [u('1505740420928-5e560c06d30e'), u('1484704849700-f032a568e944')],
  'macbook-air-m3-13': [u('1517336714731-489689fd1ca8'), u('1496181133206-80ce9b88a853')],
  'fire-tv-stick-4k-max': [u('1593359677879-a4bb92f829d1'), u('1522869635104-22642e725637')],
  'kindle-paperwhite-16gb': [u('1544716278-ca5e3f4abd8c'), u('1512820790803-83ca734da794')],
  'logitech-mx-master-3s': [u('1527864550417-7fd91fc51a46'), u('1615663243697-444ad5f67817')],
  'anker-737-power-bank': [u('1609594377-ef22beb01b01'), u('1625948515221-268976c09821')],
  'levis-501-original-jeans': [u('1542272604-787c3835535d'), u('1473966962640-7e69fd457f90')],
  'nike-air-max-90': [u('1542291026-7eec264c27ff'), u('1460353584753-92bab37ad42b')],
  'adidas-ultraboost-light': [u('1542291026-7eec264c27ff'), u('1460353584753-92bab37ad42b')],
  'fossil-gen-6-smartwatch': [u('1523275335684-37898b6baf30'), u('1579586337278-3befc242f588')],
  'mens-cotton-hoodie': [u('1556821840-3a63f95609a7'), u('1620799140408-edc5e740a762')],
  'instant-pot-duo-7in1': [u('1556911220-bff31c812dba'), u('1556909114-f6e7ad7d3136')],
  'ninja-professional-blender': [u('1556909114-f6e7ad7d3136'), u('1570967767003-af903f8c84da')],
  'dyson-v15-detect-vacuum': [u('1563456810544-4a5e4694cbbe'), u('1628177140286-4ef405800169')],
  'prestige-coffee-maker': [u('1495474472287-4d71bcdd2085'), u('1517668808822-9ebb02f2a0b6')],
  'wakefit-mattress-queen': [u('1505693416388-ac5ce068fe85'), u('1631048792244-39cd6eb0e268')],
  'adjustable-dumbbells-24kg': [u('1583454110551-21f069fa61bd'), u('1517836357463-d25dfeac3438')],
  'yoga-mat-6mm': [u('1601925260368-ae2f83cf8b7f'), u('1544367567-0f2fcb009e0b')],
  'fitbit-charge-6': [u('1434492030108-6a110753ff2f'), u('1523275335684-37898b6baf30')],
  'nivia-basketball': [u('1546519638-68e109498ffc'), u('1519861534503-964494272dde')],
  'cerave-moisturizing-cream': [u('1570172619647-df8fb441d427'), u('1487412720507-e435ab49783f')],
  'hair-repair-treatment': [u('1522337360782-8b79dee2a066'), u('1487412720507-e435ab49783f')],
  'philips-electric-toothbrush': [u('1571019613454-1cb2f99b5d9f'), u('1559592861-8f0dcbe0b1ca')],
  'psychology-of-money-book': [u('1544947950-fa07a98d237f'), u('1481627834876-7837e8f05bfd')],
  'atomic-habits-book': [u('1495446815901-a7297e633e8d'), u('1512820790803-83ca734da794')],
  'lego-millennium-falcon': [u('1587654780291-39c9404d746b'), u('1617874721651-781bb877b3e7')],
  'nerf-elite-commander': [u('1566576912321-d58ddd7a6088'), u('1558060370-d644dec2777b')],
  'womens-cotton-kurti': [u('1483986767636-b1b1f48ceabb'), u('1445205170230-053b83016050')],
  'prestige-pressure-cooker-5l': [u('1556911220-bff31c812dba'), u('1556909114-f6e7ad7d3136')],
  'cricket-bat-willow': [u('1535137110889-64b0414b0b5d'), u('1546519638-68e109498ffc')],
  'resistance-bands-set': [u('1517836357463-d25dfeac3438'), u('1601925260368-ae2f83cf8b7f')],
  'lakme-face-wash-100ml': [u('1556228720-195a672d8f03'), u('1596462502278-27bfdc403348')],
  'nivea-body-lotion-400ml': [u('1556228720-195a672d8f03'), u('1570172619647-df8fb441d427')],
  'maybelline-mascara': [u('1596462502278-27bfdc403348'), u('1522337360782-8b79dee2a066')],
  'rich-dad-poor-dad-book': [u('1544947950-fa07a98d237f'), u('1495446815901-a7297e633e8d')],
  'the-alchemist-book': [u('1495446815901-a7297e633e8d'), u('1512820790803-83ca734da794')],
  'ikigai-book': [u('1512820790803-83ca734da794'), u('1481627834876-7837e8f05bfd')],
  'sapiens-book': [u('1481627834876-7837e8f05bfd'), u('1544947950-fa07a98d237f')],
  'hot-wheels-track-set': [u('1566576912321-d58ddd7a6088'), u('1587654780291-39c9404d746b')],
  'barbie-dreamhouse-playset': [u('1558060370-d644dec2777b'), u('1617874721651-781bb877b3e7')],
  'monopoly-india-edition': [u('1617874721651-781bb877b3e7'), u('1566576912321-d58ddd7a6088')],
  'rubiks-cube-3x3': [u('1587654780291-39c9404d746b'), u('1558060370-d644dec2777b')],
  'boat-airdopes-131': [u('1505740420928-5e560c06d30e'), u('1484704849700-f032a568e944')],
  'redmi-smart-tv-43': [u('1593359677879-a4bb92f829d1'), u('1522869635104-22642e725637')],
};

/** DB stores local path only — fast like Amazon CDN assets */
export const getProductImages = (slug) => [localProductImage(slug)];

export const CATEGORY_IMAGES_LOCAL = {
  Electronics: localCategoryImage('electronics'),
  Fashion: localCategoryImage('fashion'),
  'Home & Kitchen': localCategoryImage('home-kitchen'),
  Sports: localCategoryImage('sports'),
  Beauty: localCategoryImage('beauty'),
  Books: localCategoryImage('books'),
  Toys: localCategoryImage('toys'),
  Deals: localCategoryImage('deals'),
};

export const CATEGORY_FEATURE_IMAGE = {
  Electronics: PRODUCT_IMAGES_REMOTE['iphone-15-128gb-black'][0],
  Fashion: PRODUCT_IMAGES_REMOTE['nike-air-max-90'][0],
  'Home & Kitchen': u('1556911220-bff31c812dba', 1200, 500),
  Sports: u('1517836357463-d25dfeac3438', 1200, 500),
  Beauty: u('1570172619647-df8fb441d427', 1200, 500),
  Books: PRODUCT_IMAGES_REMOTE['psychology-of-money-book'][0],
  Toys: PRODUCT_IMAGES_REMOTE['lego-millennium-falcon'][0],
  Deals: u('1556742049-0cfed4f6a45d', 1200, 500),
};
