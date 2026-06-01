import express from 'express';
import {
  getProducts,
  getProductBySlug,
  getProductById,
  getDeals,
  getCategories,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/deals', getDeals);
router.get('/categories', getCategories);
router.get('/', getProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);

export default router;
