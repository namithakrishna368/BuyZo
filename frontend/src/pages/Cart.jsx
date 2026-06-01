import { Link } from 'react-router-dom';
import { FiTrash2, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ShopLayout from '../layouts/ShopLayout';
import PrimeBadge from '../components/amazon/PrimeBadge';
import ProductImage from '../components/ProductImage';
import { useCart } from '../context/CartContext';
import { formatINR, FREE_DELIVERY_MIN, GST_RATE } from '../utils/currency';

const Cart = () => {
  const { items, subtotal, updateQty, removeFromCart, clearCart } = useCart();
  const shipping = subtotal >= FREE_DELIVERY_MIN ? 0 : 49;
  const gst = Math.round(subtotal * GST_RATE);
  const total = subtotal + shipping + gst;

  const checkout = () => {
    toast.success('Checkout with UPI / Card / COD — coming soon!');
  };

  if (items.length === 0) {
    return (
      <ShopLayout>
        <div className="mx-auto max-w-[1500px] px-4 py-16 text-center">
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gray-100 text-4xl">
            🛒
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Your BuyZO Cart is empty</h1>
          <p className="mt-2 text-gray-600">Shop deals with prices in ₹ (Indian Rupees)</p>
          <Link
            to="/products"
            className="mt-6 inline-block rounded-full bg-amazon-gold px-8 py-3 text-sm font-bold text-gray-900 hover:bg-amazon-gold-hover"
          >
            Continue shopping
          </Link>
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      <div className="mx-auto max-w-[1500px] px-3 py-6 sm:px-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-normal text-gray-900">
            Shopping Cart <span className="text-base text-gray-600">({items.length} items)</span>
          </h1>
          <button type="button" onClick={clearCart} className="text-sm text-amazon-link hover:underline">
            Remove all items
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] lg:gap-6">
          <div className="rounded bg-white shadow-sm">
            {items.map((item) => (
              <div key={item._id} className="flex gap-3 border-b border-gray-200 p-3 last:border-0 sm:gap-4 sm:p-4">
                <Link to={`/products/${item.slug}`} className="h-20 w-20 shrink-0 sm:h-28 sm:w-28">
                  <ProductImage
                    slug={item.slug}
                    src={item.slug ? `/images/products/${item.slug}.jpg` : item.image}
                    alt={item.name}
                    className="h-20 w-20 sm:h-28 sm:w-28"
                    wrapperClassName="h-full w-full bg-white"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link to={`/products/${item.slug}`} className="line-clamp-2 text-base text-amazon-link hover:text-amazon-link-hover hover:underline">
                    {item.name}
                  </Link>
                  {item.prime && <PrimeBadge className="mt-1" />}
                  <p className="mt-2 text-sm text-[#007600]">In stock</p>
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <select
                      value={item.qty}
                      onChange={(e) => updateQty(item._id, Number(e.target.value))}
                      className="rounded border border-gray-300 bg-gray-100 px-2 py-1 text-sm shadow-inner"
                    >
                      {Array.from({ length: Math.min(10, item.stock) }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          Qty: {n}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item._id)}
                      className="flex items-center gap-1 text-sm text-amazon-link hover:underline"
                    >
                      <FiTrash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium text-gray-900">{formatINR(item.price * item.qty)}</p>
                  {item.qty > 1 && <p className="text-xs text-gray-500">{formatINR(item.price)} per item</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded bg-white p-5 shadow-sm">
            <p className="text-lg text-[#b12704]">
              Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items):{' '}
              <span className="font-medium text-gray-900">{formatINR(subtotal)}</span>
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Delivery: {shipping === 0 ? 'FREE' : formatINR(shipping)}
              {subtotal < FREE_DELIVERY_MIN && (
                <span className="block text-xs text-gray-500">Add {formatINR(FREE_DELIVERY_MIN - subtotal)} more for FREE delivery</span>
              )}
            </p>
            <p className="text-sm text-gray-600">GST (18%): {formatINR(gst)}</p>
            <p className="mt-2 text-sm text-[#007600]">
              <FiCheck className="mr-1 inline" />
              {shipping === 0 ? 'Eligible for FREE delivery across India' : `FREE delivery on orders above ${formatINR(FREE_DELIVERY_MIN)}`}
            </p>
            <p className="mt-1 text-xs text-gray-500">Pay with UPI, cards, net banking, or Cash on Delivery</p>
            <button type="button" onClick={checkout} className="amazon-btn-cart mt-4">
              Proceed to Buy
            </button>
            <p className="mt-4 text-center text-xl font-medium text-gray-900">Order total: {formatINR(total)}</p>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
};

export default Cart;
