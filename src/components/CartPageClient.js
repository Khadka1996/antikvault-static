'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  MessageCircle,
  ArrowRight,
  Coins,
  Banknote,
  Medal,
  Gem,
  Gift,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { siteConfig, whatsappUrl } from '@/config/site';

const categoryIcon = {
  coins: Coins,
  banknotes: Banknote,
  medals: Medal,
  tokens: Gem,
  souvenirs: Gift,
};

export default function CartPageClient() {
  const { items, removeItem, updateQty, clear } = useCart();

  const inquiryMessage =
    items.length === 0
      ? ''
      : [
          "Hi, I'm interested in the following pieces from Antik Vault:",
          '',
          ...items.map(
            (item, i) => `${i + 1}. ${item.name}${item.qty > 1 ? ` (x${item.qty})` : ''} — ${siteConfig.url}/item/${item.id}`,
          ),
          '',
          'Can you provide more information?',
        ].join('\n');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="heading-lg mb-2">Your Cart</h1>
          <p className="text-amber-400">
            {items.length === 0
              ? 'No pieces shortlisted yet.'
              : `${items.length} piece${items.length !== 1 ? 's' : ''} shortlisted. Prices and availability shared on inquiry.`}
          </p>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={clear}
            className="hidden sm:block text-sm text-amber-500 hover:text-amber-300 transition-colors shrink-0"
          >
            Clear cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 border border-amber-800/50 rounded-xl bg-amber-900/30">
          <ShoppingCart size={48} className="mx-auto mb-4 text-amber-700" aria-hidden="true" />
          <p className="text-amber-300 mb-6">Browse the collection and add pieces you&rsquo;re interested in.</p>
          <Link href="/collection" className="btn-primary inline-flex">
            Browse Collection
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-4 mb-8">
            {items.map((item) => {
              const Icon = categoryIcon[item.category] || Coins;
              return (
                <li
                  key={item.id}
                  className="flex items-center gap-4 p-3 sm:p-4 bg-amber-900/40 border border-amber-800/50 rounded-xl"
                >
                  <Link
                    href={`/item/${item.id}`}
                    className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-amber-800 to-amber-700"
                  >
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                    ) : (
                      <Icon size={28} className="text-amber-600 m-auto" aria-hidden="true" />
                    )}
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/item/${item.id}`}
                      className="font-semibold text-amber-100 hover:text-amber-300 transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-amber-500 capitalize">{item.category}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      disabled={item.qty <= 1}
                      aria-label={`Decrease quantity of ${item.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-amber-700/50 text-amber-300 hover:bg-amber-800/50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                    >
                      <Minus size={14} aria-hidden="true" />
                    </button>
                    <span className="w-6 text-center text-amber-100 font-medium">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      aria-label={`Increase quantity of ${item.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-amber-700/50 text-amber-300 hover:bg-amber-800/50 transition-colors"
                    >
                      <Plus size={14} aria-hidden="true" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                    className="shrink-0 text-amber-500 hover:text-red-400 transition-colors p-2"
                  >
                    <Trash2 size={18} aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-amber-800/30 pt-6 space-y-4">
            <p className="text-amber-400 text-sm">
              Ready to move forward? Send this shortlist to us on WhatsApp and we&rsquo;ll get back to you with
              pricing and availability.
            </p>
            <a
              href={whatsappUrl(inquiryMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary gap-2 w-full sm:w-auto"
            >
              <MessageCircle size={20} aria-hidden="true" />
              Send Inquiry via WhatsApp
            </a>
            <button
              type="button"
              onClick={clear}
              className="block sm:hidden text-sm text-amber-500 hover:text-amber-300 transition-colors"
            >
              Clear cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}
