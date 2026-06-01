import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ShopLayout from '../layouts/ShopLayout';
import ProductCardAmazon from '../components/amazon/ProductCardAmazon';
import ProductImage from '../components/ProductImage';
import LoadingSpinner from '../components/LoadingSpinner';
import { CATEGORY_TILES } from '../data/categoryImages';

const Home = () => {
  const [deals, setDeals] = useState([]);
  const [categorySections, setCategorySections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [dealsRes, catRes] = await Promise.all([
          api.get('/products/deals'),
          api.get('/products/categories', { params: { limit: 6 } }),
        ]);
        setDeals(dealsRes.data.products || []);
        setCategorySections((catRes.data.categories || []).filter((c) => c.count > 0));
      } catch {
        setCategorySections([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <ShopLayout>
      <div className="relative bg-amazon-nav">
        <div className="mx-auto max-w-[1500px] px-4 py-10 sm:py-16">
          <div className="max-w-2xl text-white">
            <h1 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
              India&apos;s favourite place to shop
            </h1>
            <p className="mt-3 text-lg text-gray-300">
              6+ products in every category. Prices in ₹. FREE delivery on orders above ₹499.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-block rounded-full bg-amazon-gold px-8 py-3 text-sm font-bold text-gray-900 hover:bg-amazon-gold-hover"
            >
              Shop all categories
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] space-y-6 px-3 py-6 sm:px-4">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORY_TILES.filter((cat) => cat.link !== 'deals').map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.link)}`}
              className="overflow-hidden rounded bg-white shadow-sm transition hover:shadow-md"
            >
              <ProductImage
                src={cat.image}
                alt={cat.alt || cat.name}
                priority
                className="h-28 w-full sm:h-36"
                imgClassName="h-full w-full object-cover"
                wrapperClassName="bg-white"
              />
              <p className="p-3 text-sm font-bold text-gray-900">Shop {cat.name}</p>
            </Link>
          ))}
          <Link
            to="/products?featured=true"
            className="overflow-hidden rounded bg-white shadow-sm transition hover:shadow-md sm:col-span-2 lg:col-span-1"
          >
            <ProductImage
              src={CATEGORY_TILES.find((c) => c.link === 'deals')?.image}
              alt="Today's Deals"
              priority
              className="h-28 w-full sm:h-36"
              imgClassName="h-full w-full object-cover"
              wrapperClassName="bg-gray-100"
            />
            <p className="p-3 text-sm font-bold text-gray-900">Today&apos;s Deals</p>
          </Link>
        </section>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {deals.length > 0 && (
              <section className="overflow-hidden rounded bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Today&apos;s Deals</h2>
                  <Link to="/products?featured=true" className="text-sm text-amazon-link hover:underline">
                    See all deals
                  </Link>
                </div>
                <div className="amazon-product-row">
                  {deals.slice(0, 6).map((p) => (
                    <ProductCardAmazon key={p._id} product={p} priority />
                  ))}
                </div>
              </section>
            )}

            {categorySections.map((section) => (
              <section key={section.name} className="overflow-hidden rounded bg-white p-4 shadow-sm">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-xl font-bold text-gray-900">
                    {section.name}{' '}
                    <span className="text-base font-normal text-gray-500">({section.count} items)</span>
                  </h2>
                  <Link
                    to={`/products?category=${encodeURIComponent(section.name)}`}
                    className="text-sm text-amazon-link hover:underline"
                  >
                    See all in {section.name}
                  </Link>
                </div>
                {section.products?.length > 0 ? (
                  <div className="amazon-product-row">
                    {section.products.slice(0, 6).map((p) => (
                      <ProductCardAmazon key={p._id} product={p} priority />
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-center text-gray-500">No products in this category yet.</p>
                )}
              </section>
            ))}

            {categorySections.length === 0 && (
              <div className="rounded bg-white p-8 text-center shadow-sm">
                <p className="text-gray-600">No products loaded. Run seed from the backend:</p>
                <code className="mt-2 block text-sm">npm run seed:products</code>
              </div>
            )}
          </>
        )}
      </div>
    </ShopLayout>
  );
};

export default Home;
