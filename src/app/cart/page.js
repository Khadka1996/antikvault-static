import CartPageClient from '@/components/CartPageClient';

export const metadata = {
  title: 'Your Cart',
  description: 'Coins, banknotes, and pieces you’ve shortlisted from the Antik Vault collection.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/cart' },
};

export default function CartPage() {
  return <CartPageClient />;
}
