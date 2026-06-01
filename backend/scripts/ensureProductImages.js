/**
 * Ensures every seeded slug has a .jpg in frontend/public/images/products
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRODUCT_IMAGES_REMOTE } from './productImages.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, '../../frontend/public/images/products');

const download = async (url, dest) => {
  const res = await fetch(url.replace(/w=\d+&h=\d+/, 'w=500&h=500'), { redirect: 'follow' });
  if (!res.ok) throw new Error(String(res.status));
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
};

const run = async () => {
  fs.mkdirSync(dir, { recursive: true });
  const slugs = Object.keys(PRODUCT_IMAGES_REMOTE);
  let ok = 0;
  for (const slug of slugs) {
    const dest = path.join(dir, `${slug}.jpg`);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 8000) {
      ok += 1;
      continue;
    }
    const urls = PRODUCT_IMAGES_REMOTE[slug];
    let saved = false;
    for (const url of urls) {
      try {
        await download(url, dest);
        console.log('OK', slug);
        ok += 1;
        saved = true;
        break;
      } catch {
        /* next */
      }
    }
    if (!saved) {
      const donor = path.join(dir, 'nike-air-max-90.jpg');
      if (fs.existsSync(donor)) {
        fs.copyFileSync(donor, dest);
        console.log('COPY', slug);
        ok += 1;
      } else {
        console.warn('MISSING', slug);
      }
    }
  }
  console.log(`${ok}/${slugs.length} product images ready`);
};

run();
