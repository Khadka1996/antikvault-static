'use client';

import { Check, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

// A thin client wrapper so the server-rendered item detail page can pass plain
// item data down without needing cart interactivity itself.
export default function AddToCartButton({ item }) {
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(item.id);

  return (
    <button
      type="button"
      onClick={() => !inCart && addItem(item)}
      disabled={inCart}
      className={`gap-2 w-full ${inCart ? 'btn-secondary cursor-default' : 'btn-secondary'}`}
    >
      {inCart ? (
        <>
          <Check size={20} aria-hidden="true" />
          In Cart
        </>
      ) : (
        <>
          <ShoppingCart size={20} aria-hidden="true" />
          Add to Cart
        </>
      )}
    </button>
  );
}
