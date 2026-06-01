/**
 * Downloads product images into frontend/public (run once: npm run images:download)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRODUCT_IMAGES_REMOTE, CATEGORY_FEATURE_IMAGE } from './productImages.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicRoot = path.join(__dirname, '../../frontend/public/images');

const download = async (url, dest) => {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
};

const run = async () => {
  const productsDir = path.join(publicRoot, 'products');
  const categoriesDir = path.join(publicRoot, 'categories');
  let ok = 0;
  let fail = 0;

  for (const [slug, urls] of Object.entries(PRODUCT_IMAGES_REMOTE)) {
    const dest = path.join(productsDir, `${slug}.jpg`);
    let saved = false;
    for (const url of urls) {
      try {
        await download(url.replace(/w=\d+&h=\d+/, 'w=600&h=600'), dest);
        console.log('OK', slug);
        ok += 1;
        saved = true;
        break;
      } catch {
        /* try next URL */
      }
    }
    if (!saved) {
      console.warn('FAIL', slug, 'all URLs failed');
      fail += 1;
    }
  }

  const categoryMap = {
    electronics: CATEGORY_FEATURE_IMAGE.Electronics,
    fashion: CATEGORY_FEATURE_IMAGE.Fashion,
    'home-kitchen': CATEGORY_FEATURE_IMAGE['Home & Kitchen'],
    sports: CATEGORY_FEATURE_IMAGE.Sports,
    beauty: CATEGORY_FEATURE_IMAGE.Beauty,
    books: CATEGORY_FEATURE_IMAGE.Books,
    toys: CATEGORY_FEATURE_IMAGE.Toys,
    deals: CATEGORY_FEATURE_IMAGE.Deals,
  };

  for (const [key, url] of Object.entries(categoryMap)) {
    const dest = path.join(categoriesDir, `${key}.jpg`);
    try {
      await download(url.replace(/w=\d+&h=\d+/, 'w=800&h=400'), dest);
      console.log('OK category', key);
      ok += 1;
    } catch (e) {
      console.warn('FAIL category', key, e.message);
      fail += 1;
    }
  }

  const copyFallback = [
    ['anker-737-power-bank', 'logitech-mx-master-3s'],
    ['adidas-ultraboost-light', 'nike-air-max-90'],
    ['ninja-professional-blender', 'prestige-coffee-maker'],
    ['dyson-v15-detect-vacuum', 'prestige-coffee-maker'],
    ['fitbit-charge-6', 'fossil-gen-6-smartwatch'],
    ['cerave-moisturizing-cream', 'psychology-of-money-book'],
    ['hair-repair-treatment', 'psychology-of-money-book'],
    ['philips-electric-toothbrush', 'prestige-coffee-maker'],
    ['sports', 'adjustable-dumbbells-24kg', categoriesDir],
    ['beauty', 'toys', categoriesDir],
    ['womens-cotton-kurti', 'levis-501-original-jeans'],
    ['prestige-pressure-cooker-5l', 'instant-pot-duo-7in1'],
    ['cricket-bat-willow', 'nivia-basketball'],
    ['resistance-bands-set', 'yoga-mat-6mm'],
    ['lakme-face-wash-100ml', 'nivea-body-lotion-400ml'],
    ['nivea-body-lotion-400ml', 'lakme-face-wash-100ml'],
    ['maybelline-mascara', 'lakme-face-wash-100ml'],
    ['rich-dad-poor-dad-book', 'psychology-of-money-book'],
    ['the-alchemist-book', 'atomic-habits-book'],
    ['ikigai-book', 'psychology-of-money-book'],
    ['sapiens-book', 'atomic-habits-book'],
    ['hot-wheels-track-set', 'nerf-elite-commander'],
    ['barbie-dreamhouse-playset', 'lego-millennium-falcon'],
    ['monopoly-india-edition', 'lego-millennium-falcon'],
    ['rubiks-cube-3x3', 'lego-millennium-falcon'],
    ['boat-airdopes-131', 'sony-wh1000xm5-headphones'],
    ['redmi-smart-tv-43', 'fire-tv-stick-4k-max'],
  ];

  for (const row of copyFallback) {
    const [target, source, dir = productsDir] = row;
    const dest = path.join(dir, `${target}.jpg`);
    const src = path.join(dir, `${source}.jpg`);
    if (!fs.existsSync(dest) && fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log('COPY', target, '<-', source);
      ok += 1;
      fail = Math.max(0, fail - 1);
    }
  }

  console.log(`Done: ${ok} saved, ${fail} failed → ${publicRoot}`);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
