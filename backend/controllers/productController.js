import Product from '../models/Product.js';
import { SHOP_CATEGORIES, MIN_PRODUCTS_PER_CATEGORY } from '../constants/categories.js';

const formatProduct = (product) => ({
  _id: product._id,
  name: product.name,
  slug: product.slug,
  description: product.description,
  price: product.price,
  comparePrice: product.comparePrice,
  category: product.category,
  brand: product.brand,
  imageUrl: `/images/products/${product.slug}.jpg`,
  images: [`/images/products/${product.slug}.jpg`, ...(product.images || []).filter((u) => u?.startsWith('http'))],
  stock: product.stock,
  rating: product.rating,
  numReviews: product.numReviews,
  featured: product.featured,
  prime: product.prime,
  bestseller: product.bestseller,
  dealLabel: product.dealLabel,
  specs:
    product.specs instanceof Map
      ? Object.fromEntries(product.specs)
      : product.specs && typeof product.specs === 'object'
        ? product.specs
        : {},
  inStock: product.stock > 0,
});

export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      featured,
      prime,
      minPrice,
      maxPrice,
      minRating,
      sort = 'featured',
      page = 1,
      limit = 16,
    } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'all') {
      const cat = decodeURIComponent(String(category)).trim();
      const match = SHOP_CATEGORIES.find((c) => c.toLowerCase() === cat.toLowerCase());
      query.category = match || cat;
    }

    if (featured === 'true') query.featured = true;
    if (prime === 'true') query.prime = true;
    if (minRating) query.rating = { $gte: Number(minRating) };

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sortOptions = {
      featured: { featured: -1, bestseller: -1, rating: -1 },
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating: { rating: -1, numReviews: -1 },
      reviews: { numReviews: -1 },
    };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions[sort] || sortOptions.featured)
      .skip(skip)
      .limit(Number(limit));

    const dbCategories = await Product.distinct('category', { isActive: true });
    const categories = SHOP_CATEGORIES.filter((c) => dbCategories.includes(c));

    res.json({
      success: true,
      products: products.map(formatProduct),
      categories: categories.length ? categories : SHOP_CATEGORIES,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || MIN_PRODUCTS_PER_CATEGORY, 12);

    const categories = await Promise.all(
      SHOP_CATEGORIES.map(async (name) => {
        const count = await Product.countDocuments({ category: name, isActive: true });
        const products = await Product.find({ category: name, isActive: true })
          .sort({ bestseller: -1, rating: -1, numReviews: -1 })
          .limit(limit)
          .lean();

        return {
          name,
          count,
          products: products.map(formatProduct),
        };
      })
    );

    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDeals = async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true,
      comparePrice: { $gt: 0 },
      $expr: { $gt: ['$comparePrice', '$price'] },
    })
      .sort({ rating: -1 })
      .limit(12);

    res.json({ success: true, products: products.map(formatProduct) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const related = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isActive: true,
    })
      .limit(6)
      .select('name slug price images rating stock comparePrice prime bestseller numReviews brand');

    const alsoBought = await Product.find({
      _id: { $ne: product._id },
      isActive: true,
      featured: true,
    })
      .limit(6)
      .select('name slug price images rating stock comparePrice prime bestseller numReviews');

    res.json({
      success: true,
      product: formatProduct(product),
      related: related.map(formatProduct),
      alsoBought: alsoBought.map(formatProduct),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.json({ success: true, product: formatProduct(product) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
