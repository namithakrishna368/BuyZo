import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ShopLayout from '../layouts/ShopLayout';
import ProductCardAmazon from '../components/amazon/ProductCardAmazon';
import ProductImage from '../components/ProductImage';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axios';
import { getCategoryImage, CATEGORY_IMAGES } from '../data/categoryImages';
import { SHOP_CATEGORIES } from '../data/shopCategories';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [listView, setListView] = useState(false);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'featured';
  const featured = searchParams.get('featured') || '';
  const prime = searchParams.get('prime') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const page = Number(searchParams.get('page') || 1);

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v === '' || v === 'all' || v === undefined) next.delete(k);
      else next.set(k, String(v));
    });
    if (!updates.page) next.set('page', '1');
    setSearchParams(next);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products', {
        params: {
          search,
          category,
          sort,
          featured: featured || undefined,
          prime: prime || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          page,
          limit: 20,
        },
      });
      setProducts(data.products);
      setCategories(data.categories || []);
      setPagination(data.pagination);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, featured, prime, minPrice, maxPrice, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const title =
    search
      ? `Results for "${search}"`
      : category !== 'all'
        ? category
        : featured
          ? "Today's Deals"
          : 'All Products';

  const categoryBanner =
    !search && (featured ? CATEGORY_IMAGES.Deals : getCategoryImage(category));

  return (
    <ShopLayout>
      <div className="mx-auto max-w-[1500px] px-3 py-4 sm:px-4">
        {categoryBanner && (
          <div className="relative mb-4 overflow-hidden rounded shadow-sm">
            <ProductImage
              src={categoryBanner.image}
              alt={categoryBanner.alt}
              priority
              objectPosition={categoryBanner.objectPosition}
              className="h-28 w-full sm:h-36 md:h-40"
              imgClassName="h-full w-full object-cover"
              wrapperClassName="bg-white"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent px-4 pb-3">
              <h2 className="text-xl font-bold text-white sm:text-2xl">{title}</h2>
            </div>
          </div>
        )}
        <p className="mb-2 text-sm text-gray-600">
          {pagination.total > 0 ? `1-${Math.min(page * 20, pagination.total)} of ${pagination.total} results` : '0 results'}
          {search && ` for "${search}"`}
        </p>

        <div className="flex flex-col gap-4 lg:flex-row">
          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="rounded bg-white p-4 shadow-sm">
              <h3 className="font-bold text-gray-900">Department</h3>
              <ul className="mt-2 space-y-1 text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => updateParams({ category: 'all' })}
                    className={`text-left hover:text-amazon-link-hover hover:underline ${category === 'all' ? 'font-bold text-amazon-link' : 'text-amazon-link'}`}
                  >
                    All
                  </button>
                </li>
                {(categories.length ? categories : SHOP_CATEGORIES).map((cat) => (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => updateParams({ category: cat })}
                      className={`text-left hover:text-amazon-link-hover hover:underline ${category === cat ? 'font-bold text-amazon-link' : 'text-amazon-link'}`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>

              <h3 className="mt-6 font-bold text-gray-900">Price (₹)</h3>
              <div className="mt-2 flex gap-2">
                <input
                  type="number"
                  placeholder="Min ₹"
                  min={0}
                  className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                  value={minPrice}
                  onChange={(e) => updateParams({ minPrice: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Max ₹"
                  min={0}
                  className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                  value={maxPrice}
                  onChange={(e) => updateParams({ maxPrice: e.target.value })}
                />
              </div>

              <h3 className="mt-6 font-bold text-gray-900">BuyZO Prime</h3>
              <label className="mt-2 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={prime === 'true'}
                  onChange={(e) => updateParams({ prime: e.target.checked ? 'true' : '' })}
                />
                FREE delivery eligible
              </label>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded bg-white px-4 py-3 shadow-sm">
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              <div className="flex items-center gap-3">
                <select
                  value={sort}
                  onChange={(e) => updateParams({ sort: e.target.value })}
                  className="rounded border border-gray-300 px-3 py-1.5 text-sm"
                >
                  <option value="featured">Featured</option>
                  <option value="rating">Avg. Customer Review</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
                <button
                  type="button"
                  onClick={() => setListView(!listView)}
                  className="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  {listView ? 'Grid' : 'List'}
                </button>
              </div>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : products.length === 0 ? (
              <div className="rounded bg-white p-12 text-center shadow-sm">
                <p className="text-gray-600">
                  {category !== 'all'
                    ? `No products in "${category}" yet. Try another category or run: npm run seed:products`
                    : 'No products found. Try different filters or seed the database.'}
                </p>
                <Link to="/products" className="mt-4 inline-block text-amazon-link hover:underline">
                  Browse all categories
                </Link>
              </div>
            ) : listView ? (
              <div className="rounded bg-white shadow-sm">
                {products.map((p) => (
                  <ProductCardAmazon key={p._id} product={p} listView />
                ))}
              </div>
            ) : (
              <div className="amazon-product-row">
                {products.map((p, i) => (
                  <ProductCardAmazon key={p._id} product={p} priority={page === 1 && i < 8} />
                ))}
              </div>
            )}

            {pagination.pages > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                  .slice(Math.max(0, page - 3), page + 2)
                  .map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => updateParams({ page: p })}
                      className={`rounded border px-3 py-1 text-sm ${
                        p === page ? 'border-amazon-link bg-gray-100 font-bold' : 'border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ShopLayout>
  );
};

export default Products;
