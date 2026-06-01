import express from 'express';
import {
  getProducts,
  getProductBySlug,
  getProductById,
  getDeals,
  getCategories,
} from '../controllers/productController.js';
import { cachePublic } from '../middleware/cachePublic.js';

const router = express.Router();

router.use(cachePublic(120));

router.get('/deals', getDeals);
router.get('/categories', getCategories);
router.get('/', getProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);

export default router;
