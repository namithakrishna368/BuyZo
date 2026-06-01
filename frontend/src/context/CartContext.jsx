import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'buyzo_cart_v3';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      if (existing) {
        return prev.map((i) =>
          i._id === product._id
            ? { ...i, qty: Math.min(i.stock, i.qty + qty) }
            : i
        );
      }
      return [
        ...prev,
        {
          _id: product._id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          comparePrice: product.comparePrice,
          image: `/images/products/${product.slug}.jpg`,
          stock: product.stock,
          prime: product.prime,
          qty: Math.min(qty, product.stock),
        },
      ];
    });
  }, []);

  const updateQty = useCallback((id, qty) => {
    if (qty < 1) {
      setItems((prev) => prev.filter((i) => i._id !== id));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, qty: Math.min(i.stock, qty) } : i))
    );
  }, []);

  const removeFromCart = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i._id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const cartCount = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        subtotal,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
