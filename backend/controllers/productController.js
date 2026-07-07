import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { MIN_PRODUCTS_PER_CATEGORY } from '../constants/categories.js';

const LIST_SELECT =
  'name slug price comparePrice category brand stock rating numReviews featured prime bestseller dealLabel';

const formatProductCard = (product) => ({
  _id: product._id,
  name: product.name,
  slug: product.slug,
  price: product.price,
  comparePrice: product.comparePrice,
  category: product.category,
  brand: product.brand,
  imageUrl: `/images/products/${product.slug}.jpg`,
  stock: product.stock,
  rating: product.rating,
  numReviews: product.numReviews,
  featured: product.featured,
  prime: product.prime,
  bestseller: product.bestseller,
  dealLabel: product.dealLabel,
  inStock: product.stock > 0,
});

const formatProduct = (product) => ({
  ...formatProductCard(product),
  description: product.description,
  images: [
    `/images/products/${product.slug}.jpg`,
    ...(product.images || []).filter((u) => u?.startsWith('http')),
  ],
  specs:
    product.specs instanceof Map
      ? Object.fromEntries(product.specs)
      : product.specs && typeof product.specs === 'object'
        ? product.specs
        : {},
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

    const activeCategories = await Category.find({ isActive: true }).lean();
    const activeCategoryNames = activeCategories.map(c => c.name);

    if (category && category !== 'all') {
      const cat = decodeURIComponent(String(category)).trim();
      const match = activeCategoryNames.find((c) => c.toLowerCase() === cat.toLowerCase());
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

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [total, products, dbCategories] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .select(LIST_SELECT)
        .sort(sortOptions[sort] || sortOptions.featured)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.distinct('category', { isActive: true }),
    ]);

    const categories = activeCategoryNames.filter((c) => dbCategories.includes(c));

    res.json({
      success: true,
      products: products.map(formatProductCard),
      categories: categories.length ? categories : activeCategoryNames,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || MIN_PRODUCTS_PER_CATEGORY, 12);

    const activeCategories = await Category.find({ isActive: true }).lean();
    const activeCategoryNames = activeCategories.map(c => c.name);

    const grouped = await Product.aggregate([
      { $match: { isActive: true, category: { $in: activeCategoryNames } } },
      { $sort: { bestseller: -1, rating: -1, numReviews: -1 } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          products: { $push: '$$ROOT' },
        },
      },
      {
        $project: {
          name: '$_id',
          count: 1,
          products: { $slice: ['$products', limit] },
        },
      },
    ]);

    const byName = Object.fromEntries(grouped.map((g) => [g.name, g]));

    const categories = activeCategoryNames.map((name) => {
      const row = byName[name];
      return {
        name,
        count: row?.count ?? 0,
        products: (row?.products ?? []).map(formatProductCard),
      };
    });

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
      .select(LIST_SELECT)
      .sort({ rating: -1 })
      .limit(12)
      .lean();

    res.json({ success: true, products: products.map(formatProductCard) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true }).lean();

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const [related, alsoBought] = await Promise.all([
      Product.find({
        _id: { $ne: product._id },
        category: product.category,
        isActive: true,
      })
        .select(LIST_SELECT)
        .sort({ rating: -1 })
        .limit(6)
        .lean(),
      Product.find({
        _id: { $ne: product._id },
        isActive: true,
        featured: true,
      })
        .select(LIST_SELECT)
        .sort({ rating: -1 })
        .limit(6)
        .lean(),
    ]);

    res.json({
      success: true,
      product: formatProduct(product),
      related: related.map(formatProductCard),
      alsoBought: alsoBought.map(formatProductCard),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true }).lean();

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.json({ success: true, product: formatProduct(product) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
