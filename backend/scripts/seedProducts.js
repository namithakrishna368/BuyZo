import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { getProductImages } from './productImages.js';
import { SHOP_CATEGORIES, MIN_PRODUCTS_PER_CATEGORY } from '../constants/categories.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const p = (item) => ({
  ...item,
  isActive: true,
  specs: item.specs || {},
  images: item.images?.length ? item.images : getProductImages(item.slug),
});

const products = [
  p({ name: 'Apple iPhone 15 (128 GB) — Black', slug: 'iphone-15-128gb-black', description: '6.1-inch Super Retina display, A16 Bionic chip, dual camera, 5G. Made for India with dual SIM support.', price: 69999, comparePrice: 79900, category: 'Electronics', brand: 'Apple', stock: 42, rating: 4.7, numReviews: 12453, featured: true, prime: true, bestseller: true, dealLabel: '#1 Best Seller', specs: { Storage: '128 GB', Colour: 'Black', Warranty: '1 Year' } }),
  p({ name: 'Samsung Galaxy S24 Ultra 5G', slug: 'samsung-galaxy-s24-ultra', description: '200MP camera, S Pen, titanium frame, 5000mAh battery. Supports Indian 5G bands.', price: 124999, comparePrice: 134999, category: 'Electronics', brand: 'Samsung', stock: 28, rating: 4.6, numReviews: 8921, featured: true, prime: true, bestseller: true, dealLabel: 'Limited time deal' }),
  p({ name: 'Sony WH-1000XM5 Wireless Headphones', slug: 'sony-wh1000xm5-headphones', description: 'Best-in-class noise cancellation, 30-hour battery, multipoint Bluetooth.', price: 26990, comparePrice: 34990, category: 'Electronics', brand: 'Sony', stock: 156, rating: 4.8, numReviews: 23441, featured: true, prime: true, bestseller: true, dealLabel: "BuyZO's Choice" }),
  p({ name: 'MacBook Air M3 13" Laptop', slug: 'macbook-air-m3-13', description: 'Apple M3, 8GB RAM, 256GB SSD, up to 18 hours battery. Ideal for students & professionals.', price: 99900, comparePrice: 114900, category: 'Electronics', brand: 'Apple', stock: 35, rating: 4.9, numReviews: 5621, featured: true, prime: true }),
  p({ name: 'Fire TV Stick 4K Max', slug: 'fire-tv-stick-4k-max', description: 'Stream Netflix, Prime Video, Hotstar & more. Alexa voice remote included.', price: 4999, comparePrice: 7499, category: 'Electronics', brand: 'Amazon', stock: 500, rating: 4.5, numReviews: 89234, featured: true, prime: true, bestseller: true, dealLabel: '33% off' }),
  p({ name: 'Kindle Paperwhite (16 GB)', slug: 'kindle-paperwhite-16gb', description: '6.8" glare-free display, adjustable warm light, waterproof, weeks of battery.', price: 12999, comparePrice: 16999, category: 'Electronics', brand: 'Amazon', stock: 200, rating: 4.7, numReviews: 45123, prime: true, bestseller: true }),
  p({ name: 'Logitech MX Master 3S Mouse', slug: 'logitech-mx-master-3s', description: 'Quiet clicks, USB-C charging, works on any surface including glass.', price: 7495, comparePrice: 9995, category: 'Electronics', brand: 'Logitech', stock: 88, rating: 4.6, numReviews: 12340, prime: true }),
  p({ name: 'Anker 737 Power Bank 24000mAh', slug: 'anker-737-power-bank', description: '140W fast charging for laptops & phones. BIS certified for India.', price: 8999, comparePrice: 12999, category: 'Electronics', brand: 'Anker', stock: 120, rating: 4.5, numReviews: 8765, prime: true, dealLabel: 'Deal of the Day' }),
  p({ name: "Levi's 501 Original Fit Jeans", slug: 'levis-501-original-jeans', description: 'Classic straight fit, 100% cotton denim. Available in multiple waist sizes.', price: 3499, comparePrice: 4999, category: 'Fashion', brand: "Levi's", stock: 200, rating: 4.4, numReviews: 34521, prime: true, bestseller: true }),
  p({ name: 'Nike Air Max 90 Shoes', slug: 'nike-air-max-90', description: 'Iconic Air Max cushioning, durable outsole. UK/India sizing chart on product page.', price: 9995, comparePrice: 12995, category: 'Fashion', brand: 'Nike', stock: 75, rating: 4.7, numReviews: 18932, featured: true, prime: true, bestseller: true }),
  p({ name: 'Adidas Ultraboost Light', slug: 'adidas-ultraboost-light', description: 'LightBOOST midsole, breathable Primeknit upper for Indian weather.', price: 8999, comparePrice: 15999, category: 'Fashion', brand: 'Adidas', stock: 60, rating: 4.6, numReviews: 7654, prime: true, dealLabel: '44% off' }),
  p({ name: 'Fossil Gen 6 Smartwatch', slug: 'fossil-gen-6-smartwatch', description: 'Wear OS, heart rate, SpO2, contactless pay. Compatible with Android & iOS.', price: 14995, comparePrice: 24995, category: 'Fashion', brand: 'Fossil', stock: 45, rating: 4.3, numReviews: 4321, prime: true }),
  p({ name: "Men's Cotton Hoodie", slug: 'mens-cotton-hoodie', description: 'Soft fleece fabric, kangaroo pocket. Perfect for winter across India.', price: 899, comparePrice: 1499, category: 'Fashion', brand: 'BuyZO Basics', stock: 300, rating: 4.5, numReviews: 67890, prime: true, bestseller: true }),
  p({ name: 'Instant Pot Duo 7-in-1 (3L)', slug: 'instant-pot-duo-7in1', description: 'Pressure cook, slow cook, rice, steam & more. 220V for Indian kitchens.', price: 6499, comparePrice: 8999, category: 'Home & Kitchen', brand: 'Instant Pot', stock: 90, rating: 4.7, numReviews: 156789, featured: true, prime: true, bestseller: true, dealLabel: '#1 Best Seller' }),
  p({ name: 'Ninja Blender 1000W', slug: 'ninja-professional-blender', description: 'Crush ice & make lassi, smoothies, chutneys. Dishwasher-safe jars.', price: 5499, comparePrice: 7499, category: 'Home & Kitchen', brand: 'Ninja', stock: 110, rating: 4.6, numReviews: 89234, prime: true, bestseller: true }),
  p({ name: 'Dyson V15 Cordless Vacuum', slug: 'dyson-v15-detect-vacuum', description: 'Laser dust detect, 60 min runtime, HEPA filter for Indian dust & pollen.', price: 54990, comparePrice: 62990, category: 'Home & Kitchen', brand: 'Dyson', stock: 25, rating: 4.5, numReviews: 12345, prime: true, featured: true }),
  p({ name: 'Prestige Coffee Maker', slug: 'prestige-coffee-maker', description: 'Filter coffee & espresso-style brew. 220V, auto shut-off, Indian plug.', price: 3999, comparePrice: 5999, category: 'Home & Kitchen', brand: 'Prestige', stock: 70, rating: 4.4, numReviews: 45678, prime: true }),
  p({ name: 'Wakefit Orthopedic Mattress Queen', slug: 'wakefit-mattress-queen', description: 'High-density foam, 7-zone support. 100 nights trial, 10-year warranty in India.', price: 8999, comparePrice: 12999, category: 'Home & Kitchen', brand: 'Wakefit', stock: 15, rating: 4.6, numReviews: 9876, prime: false }),
  p({ name: 'Adjustable Dumbbells Pair 24kg', slug: 'adjustable-dumbbells-24kg', description: 'Home gym essential, quick weight change 2–24 kg per hand.', price: 34999, comparePrice: 44999, category: 'Sports', brand: 'BuyZO Sport', stock: 20, rating: 4.8, numReviews: 23456, prime: true, featured: true }),
  p({ name: 'Yoga Mat 6mm Anti-Slip', slug: 'yoga-mat-6mm', description: 'Extra thick, sweat-resistant, carry strap included. For yoga & exercise at home.', price: 999, comparePrice: 1999, category: 'Sports', brand: 'Strauss', stock: 55, rating: 4.7, numReviews: 8765, prime: true }),
  p({ name: 'Fitbit Charge 6', slug: 'fitbit-charge-6', description: 'GPS, heart rate, sleep score, 7-day battery. Works with Google Fit.', price: 9999, comparePrice: 14999, category: 'Sports', brand: 'Fitbit', stock: 95, rating: 4.4, numReviews: 15432, prime: true, dealLabel: '33% off' }),
  p({ name: 'Nivia Basketball Size 7', slug: 'nivia-basketball', description: 'Official size 7, moisture grip, deep channels. Popular in schools & colleges.', price: 899, comparePrice: 1299, category: 'Sports', brand: 'Nivia', stock: 140, rating: 4.8, numReviews: 5432, prime: true }),
  p({ name: 'CeraVe Moisturizing Cream 340g', slug: 'cerave-moisturizing-cream', description: 'Hyaluronic acid & ceramides. Dermatologist recommended for Indian skin.', price: 899, comparePrice: 1199, category: 'Beauty', brand: 'CeraVe', stock: 400, rating: 4.7, numReviews: 98765, prime: true, bestseller: true, dealLabel: '#1 Best Seller' }),
  p({ name: 'Hair Repair Treatment 100ml', slug: 'hair-repair-treatment', description: 'Repairs damaged hair from heat & pollution. Use once a week.', price: 1299, comparePrice: 1799, category: 'Beauty', brand: 'L\'Oreal', stock: 180, rating: 4.6, numReviews: 34567, prime: true, bestseller: true }),
  p({ name: 'Philips Electric Toothbrush', slug: 'philips-electric-toothbrush', description: 'Sonic clean, 2 modes, 2-week battery. Includes 2 brush heads.', price: 2999, comparePrice: 4499, category: 'Beauty', brand: 'Philips', stock: 65, rating: 4.5, numReviews: 21345, prime: true }),
  p({ name: 'The Psychology of Money (Paperback)', slug: 'psychology-of-money-book', description: 'Bestselling book on wealth & behaviour. English edition, Indian pricing.', price: 399, comparePrice: 599, category: 'Books', brand: 'Jaico', stock: 250, rating: 4.8, numReviews: 67890, prime: true, bestseller: true }),
  p({ name: 'Atomic Habits — James Clear', slug: 'atomic-habits-book', description: 'Build good habits & break bad ones. #1 self-help book in India.', price: 449, comparePrice: 799, category: 'Books', brand: 'Penguin', stock: 320, rating: 4.8, numReviews: 123456, prime: true, bestseller: true, dealLabel: '44% off' }),
  p({ name: 'LEGO Star Wars Millennium Falcon', slug: 'lego-millennium-falcon', description: '1351 pieces, ages 9+. Great gift for kids — ships across India.', price: 13999, comparePrice: 15999, category: 'Toys', brand: 'LEGO', stock: 40, rating: 4.9, numReviews: 8765, prime: true, featured: true }),
  p({ name: 'Nerf Elite 2.0 Blaster', slug: 'nerf-elite-commander', description: '6-dart drum, slam fire. Safe foam darts for children 8+.', price: 999, comparePrice: 1499, category: 'Toys', brand: 'Nerf', stock: 200, rating: 4.5, numReviews: 23456, prime: true }),
  // —— 6+ per category: extra Fashion ——
  p({ name: "Women's Cotton Kurti (Pack of 2)", slug: 'womens-cotton-kurti', description: 'Soft breathable cotton kurtis for daily wear. Multiple colours. Easy wash & iron.', price: 1299, comparePrice: 1999, category: 'Fashion', brand: 'BuyZO Basics', stock: 180, rating: 4.3, numReviews: 12450, prime: true }),
  // —— Home & Kitchen ——
  p({ name: 'Prestige Pressure Cooker 5L (Induction)', slug: 'prestige-pressure-cooker-5l', description: 'Stainless steel, 5-litre capacity, induction & gas compatible. ISI certified for India.', price: 2499, comparePrice: 3499, category: 'Home & Kitchen', brand: 'Prestige', stock: 95, rating: 4.6, numReviews: 45600, prime: true, bestseller: true }),
  // —— Sports ——
  p({ name: 'English Willow Cricket Bat (Full Size)', slug: 'cricket-bat-willow', description: 'Light pick-up, Kashmir/English willow blend. Popular for tennis-ball & leather-ball cricket.', price: 1999, comparePrice: 2999, category: 'Sports', brand: 'SG', stock: 65, rating: 4.5, numReviews: 8900, prime: true }),
  p({ name: 'Resistance Bands Set (5 Levels)', slug: 'resistance-bands-set', description: 'Home workout bands with handles & door anchor. Great for strength training.', price: 699, comparePrice: 1299, category: 'Sports', brand: 'BuyZO Sport', stock: 220, rating: 4.4, numReviews: 15600, prime: true }),
  // —— Beauty ——
  p({ name: 'Lakmé Face Wash 100ml', slug: 'lakme-face-wash-100ml', description: 'Deep cleanse for Indian skin types. Removes oil & pollution without over-drying.', price: 249, comparePrice: 349, category: 'Beauty', brand: 'Lakmé', stock: 500, rating: 4.5, numReviews: 67800, prime: true }),
  p({ name: 'Nivea Body Lotion 400ml', slug: 'nivea-body-lotion-400ml', description: '24h moisture for dry skin. Non-greasy formula suited to humid Indian climates.', price: 349, comparePrice: 499, category: 'Beauty', brand: 'Nivea', stock: 420, rating: 4.6, numReviews: 89000, prime: true, bestseller: true }),
  p({ name: 'Maybelline Colossal Mascara', slug: 'maybelline-mascara', description: 'Volumizing mascara, smudge-resistant for all-day wear in heat & humidity.', price: 499, comparePrice: 699, category: 'Beauty', brand: 'Maybelline', stock: 310, rating: 4.4, numReviews: 34500, prime: true }),
  // —— Books ——
  p({ name: 'Rich Dad Poor Dad (Paperback)', slug: 'rich-dad-poor-dad-book', description: 'Personal finance classic. Easy read for students & professionals in India.', price: 350, comparePrice: 550, category: 'Books', brand: 'Plata', stock: 400, rating: 4.7, numReviews: 89000, prime: true, bestseller: true }),
  p({ name: 'The Alchemist — Paulo Coelho', slug: 'the-alchemist-book', description: 'Inspirational fiction loved worldwide. English paperback, Indian edition.', price: 299, comparePrice: 499, category: 'Books', brand: 'Harper', stock: 380, rating: 4.8, numReviews: 112000, prime: true }),
  p({ name: 'IKIGAI — The Japanese Secret', slug: 'ikigai-book', description: 'Find purpose & longevity habits. Bestseller in India.', price: 399, comparePrice: 599, category: 'Books', brand: 'Penguin', stock: 290, rating: 4.7, numReviews: 56000, prime: true }),
  p({ name: 'Sapiens — Yuval Noah Harari', slug: 'sapiens-book', description: 'A brief history of humankind. Thought-provoking read for curious minds.', price: 499, comparePrice: 799, category: 'Books', brand: 'Penguin', stock: 210, rating: 4.8, numReviews: 78000, prime: true, dealLabel: '38% off' }),
  // —— Toys ——
  p({ name: 'Hot Wheels Track Builder Set', slug: 'hot-wheels-track-set', description: 'Build custom tracks & race die-cast cars. Ages 4+. Great birthday gift.', price: 1499, comparePrice: 2199, category: 'Toys', brand: 'Hot Wheels', stock: 85, rating: 4.6, numReviews: 12300, prime: true }),
  p({ name: 'Barbie Dreamhouse Playset', slug: 'barbie-dreamhouse-playset', description: '3-storey dollhouse with furniture & accessories. Ages 3+.', price: 4999, comparePrice: 6999, category: 'Toys', brand: 'Barbie', stock: 35, rating: 4.5, numReviews: 5600, prime: true, featured: true }),
  p({ name: 'Monopoly India Edition Board Game', slug: 'monopoly-india-edition', description: 'Classic property game with Indian cities. Family game night favourite.', price: 899, comparePrice: 1299, category: 'Toys', brand: 'Hasbro', stock: 150, rating: 4.7, numReviews: 34000, prime: true, bestseller: true }),
  p({ name: "Rubik's Cube 3×3 (Speed Cube)", slug: 'rubiks-cube-3x3', description: 'Smooth-turning stickerless cube. Improves focus & problem-solving for kids & adults.', price: 299, comparePrice: 499, category: 'Toys', brand: 'Rubik\'s', stock: 400, rating: 4.6, numReviews: 28900, prime: true }),
  // —— Electronics (already 8; +2 popular items) ——
  p({ name: 'boAt Airdopes 131 Wireless Earbuds', slug: 'boat-airdopes-131', description: '13mm drivers, 15h playback with case, IPX4. Made for India.', price: 999, comparePrice: 2990, category: 'Electronics', brand: 'boAt', stock: 600, rating: 4.3, numReviews: 234000, prime: true, bestseller: true, dealLabel: '67% off' }),
  p({ name: 'Redmi 43" Smart LED TV 4K', slug: 'redmi-smart-tv-43', description: 'Android TV, Dolby Audio, multiple HDMI ports. 220V Indian model.', price: 24999, comparePrice: 32999, category: 'Electronics', brand: 'Redmi', stock: 40, rating: 4.4, numReviews: 18900, prime: true, featured: true }),
];

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products.\n`);
  for (const cat of SHOP_CATEGORIES) {
    const count = await Product.countDocuments({ category: cat, isActive: true });
    const ok = count >= MIN_PRODUCTS_PER_CATEGORY ? '✓' : '✗';
    console.log(`  ${ok} ${cat}: ${count} products`);
  }
  process.exit(0);
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
