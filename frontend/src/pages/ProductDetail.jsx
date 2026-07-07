import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { FiCheck, FiTruck, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ShopLayout from '../layouts/ShopLayout';
import ProductCardAmazon from '../components/amazon/ProductCardAmazon';
import StarRating from '../components/amazon/StarRating';
import PrimeBadge from '../components/amazon/PrimeBadge';
import ProductImage from '../components/ProductImage';
import PriceDisplay from '../components/PriceDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatINR, FREE_DELIVERY_MIN } from '../utils/currency';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [alsoBought, setAlsoBought] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [tab, setTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/slug/${slug}`);
        setProduct(data.product);
        setRelated(data.related || []);
        setAlsoBought(data.alsoBought || []);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }
    addToCart(product, qty);
    toast.success('Added to cart');
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }
    addToCart(product, qty);
    navigate('/cart');
  };

  if (loading) {
    return (
      <ShopLayout>
        <LoadingSpinner fullScreen />
      </ShopLayout>
    );
  }

  if (!product) {
    return (
      <ShopLayout>
        <div className="mx-auto max-w-[1500px] px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Link to="/products" className="mt-4 inline-block text-amazon-link hover:underline">
            Continue shopping
          </Link>
        </div>
      </ShopLayout>
    );
  }

  const images = product.images?.length ? product.images : [];
  const discount =
    product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : 0;
  const specs = product.specs ? Object.entries(product.specs) : [];

  return (
    <ShopLayout>
      <div className="mx-auto max-w-[1500px] px-3 py-4 sm:px-4">
        <nav className="mb-4 text-sm text-gray-600">
          <Link to="/" className="text-amazon-link hover:underline">
            Home
          </Link>
          {' › '}
          <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="text-amazon-link hover:underline">
            {product.category}
          </Link>
          {' › '}
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] lg:gap-6">
          <div className="rounded bg-white p-3 shadow-sm sm:p-4">
            <div className="flex flex-col-reverse gap-3 sm:flex-col">
              <div className="relative mx-auto flex w-full max-w-lg items-center justify-center bg-[#f7fafa] p-3 sm:min-h-[320px] sm:p-6 lg:min-h-[400px]">
                <ProductImage
                  slug={product.slug}
                  src={images[imageIndex]?.startsWith('/') ? images[imageIndex] : product.imageUrl}
                  fallbackSrc={images.find((u) => u?.startsWith('http'))}
                  alt={product.name}
                  priority
                  className="h-full w-full min-h-[240px] sm:min-h-[320px]"
                  wrapperClassName="h-full w-full bg-white"
                  imgClassName="mx-auto max-h-[50vh] max-w-full object-contain sm:max-h-[380px] lg:max-h-[450px]"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 sm:justify-center">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImageIndex(i)}
                      className={`h-14 w-14 shrink-0 rounded border p-0.5 sm:h-16 sm:w-16 ${imageIndex === i ? 'border-amazon-link ring-2 ring-amazon-link' : 'border-gray-200'}`}
                    >
                      <ProductImage
                        slug={product.slug}
                        src={img?.startsWith('/') ? img : product.imageUrl}
                        alt=""
                        className="h-full w-full"
                        imgClassName="h-full w-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded bg-white p-4 shadow-sm sm:p-5">
            <h1 className="text-xl font-normal text-gray-900 lg:text-2xl">{product.name}</h1>
            <p className="mt-1 text-sm">
              Brand: <span className="text-amazon-link">{product.brand}</span>
            </p>
            <div className="mt-2">
              <StarRating rating={product.rating} count={product.numReviews} size="lg" />
            </div>
            {(product.bestseller || product.dealLabel) && (
              <p className="mt-2 text-sm font-bold text-[#c45500]">{product.dealLabel || '#1 Best Seller'}</p>
            )}
            <hr className="my-4 border-gray-200" />
            <PriceDisplay price={product.price} comparePrice={product.comparePrice} size="xl" showMrp />
            {discount > 0 && (
              <p className="text-sm text-[#cc0c39]">You save {discount}% ({formatINR(product.comparePrice - product.price)})</p>
            )}
            <p className="mt-1 text-xs text-gray-600">Inclusive of all taxes</p>
            {product.prime && (
              <div className="mt-2">
                <PrimeBadge />
                <p className="mt-1 text-sm text-gray-700">
                  FREE delivery across India on orders above {formatINR(FREE_DELIVERY_MIN)}
                </p>
              </div>
            )}
            <p className={`mt-2 text-lg font-medium ${product.inStock ? 'text-[#007600]' : 'text-[#b12704]'}`}>
              {product.inStock ? 'In stock' : 'Currently unavailable'}
            </p>
            {product.inStock && (
              <>
                <div className="mt-4">
                  <label className="text-sm font-bold">Quantity:</label>
                  <select
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="ml-2 rounded border border-gray-300 bg-gray-100 px-3 py-1.5 text-sm shadow-inner"
                  >
                    {Array.from({ length: Math.min(10, product.stock) }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-4 space-y-2">
                  <button type="button" onClick={handleAddToCart} className="amazon-btn-cart">
                    Add to Cart
                  </button>
                  <button type="button" onClick={handleBuyNow} className="amazon-btn-buy">
                    Buy Now
                  </button>
                  <p className="text-xs text-gray-500">UPI · Cards · Net Banking · Cash on Delivery</p>
                </div>
              </>
            )}
            <div className="mt-4 space-y-2 border-t border-gray-200 pt-4 text-sm text-gray-700">
              <p className="flex items-center gap-2">
                <FiTruck className="h-4 w-4" /> Ships from BuyZO · Delivered across India
              </p>
              <p className="flex items-center gap-2">
                <FiShield className="h-4 w-4" /> Secure payments (Razorpay-ready)
              </p>
              <p className="flex items-center gap-2">
                <FiCheck className="h-4 w-4" /> 7-day easy returns (demo)
              </p>
            </div>
            
            {product.features && product.features.length > 0 && (
              <div className="mt-6 border-t border-gray-200 pt-4">
                <h3 className="mb-2 text-base font-bold text-gray-900">About this item</h3>
                <ul className="list-inside list-disc space-y-1.5 text-sm text-gray-800">
                  {product.features.map((feature, i) => (
                    <li key={i} className="leading-relaxed">{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 rounded bg-white shadow-sm">
          <div className="flex border-b border-gray-200">
            {['description', 'details', 'reviews'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`px-6 py-3 text-sm font-medium capitalize ${
                  tab === t ? 'border-b-2 border-amazon-link text-amazon-link' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="p-6">
            {tab === 'description' && <p className="leading-relaxed text-gray-700">{product.description}</p>}
            {tab === 'details' && (
              <table className="text-sm">
                <tbody>
                  {specs.map(([k, v]) => (
                    <tr key={k} className="border-b border-gray-100">
                      <th className="bg-gray-50 px-4 py-2 text-left font-normal text-gray-600">{k}</th>
                      <td className="px-4 py-2">{v}</td>
                    </tr>
                  ))}
                  <tr>
                    <th className="bg-gray-50 px-4 py-2 text-left font-normal text-gray-600">Category</th>
                    <td className="px-4 py-2">{product.category}</td>
                  </tr>
                </tbody>
              </table>
            )}
            {tab === 'reviews' && (
              <div>
                <StarRating rating={product.rating} count={product.numReviews} size="lg" />
                <p className="mt-4 text-gray-600">Customer reviews coming in the next update.</p>
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-8 rounded bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-bold">Products related to this item</h2>
            <div className="amazon-product-row">
              {related.map((p) => (
                <ProductCardAmazon key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}

        {alsoBought.length > 0 && (
          <section className="mt-6 rounded bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-bold">Customers who bought this item also bought</h2>
            <div className="amazon-product-row">
              {alsoBought.map((p) => (
                <ProductCardAmazon key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </ShopLayout>
  );
};

export default ProductDetail;
