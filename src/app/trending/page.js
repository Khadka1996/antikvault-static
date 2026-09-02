import Link from 'next/link';
import { TrendingUp, ArrowRight } from 'lucide-react';
import CollectionGrid from '@/components/CollectionGrid';
import catalogData from '@/data/catalog.json';

export const metadata = {
  title: 'Trending Collections',
  description:
    'A curated look at the pieces drawing the most interest right now — rare coins, banknotes, medals, and antiquities from the Antik Vault collection.',
  alternates: { canonical: '/trending' },
};

const { items } = catalogData;
const trendingItems = items.slice(8, 16);

export default function TrendingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="space-y-6 max-w-3xl">
          <span className="badge-accent inline-flex items-center gap-2">
            <TrendingUp size={16} aria-hidden="true" />
            Trending
          </span>
          <h1 className="heading-xl text-5xl md:text-6xl">Trending Collections</h1>
          <p className="text-xl text-amber-300">
            A curated look at the pieces drawing the most interest right now.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-16 border-t border-amber-800/30 pt-16">
        <div className="bg-gradient-to-b from-amber-900/30 to-transparent rounded-2xl border border-amber-700/50 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-amber-50 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-amber-400" aria-hidden="true" />
              Trending Now
            </h2>
            <Link
              href="/collection"
              className="hidden sm:flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium group"
            >
              View Full Collection
              <ArrowRight
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </div>

          <CollectionGrid
            items={trendingItems}
            pageSize={8}
            gridClassName="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            emptyMessage="No trending items right now."
          />

          <div className="mt-8 text-center sm:hidden">
            <Link href="/collection" className="btn-primary">
              View Full Collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
