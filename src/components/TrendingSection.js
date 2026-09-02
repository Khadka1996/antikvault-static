import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, ArrowRight, Eye, Coins, Banknote, Gem, Gift } from 'lucide-react';
import catalogData from '@/data/catalog.json';

const categoryIcon = {
  coins: Coins,
  banknotes: Banknote,
  medals: Coins,
  tokens: Gem,
  souvenirs: Gift,
};

const { items } = catalogData;

// Sample evenly across the whole catalog, offset from FeaturedItems' sampling stride,
// so the two curated sections show a spread of countries/categories without repeating.
const TRENDING_COUNT = 4;
const step = Math.max(1, Math.floor(items.length / TRENDING_COUNT));
const offset = Math.floor(step / 2);
const trendingItems = Array.from({ length: TRENDING_COUNT }, (_, i) => items[offset + i * step]).filter(
  Boolean,
);

export default function TrendingSection() {
  if (trendingItems.length === 0) return null;

  return (
    <section className="bg-amber-950">
      <div className="max-w-7xl mx-auto px-4 py-2 md:py-3">
        <div className="bg-gradient-to-b from-amber-900/30 to-transparent rounded-lg border border-amber-700/50 p-6 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-amber-50 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-amber-400" aria-hidden="true" />
              Trending Now
            </h2>
            <Link
              href="/trending"
              className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 group"
            >
              View All
              <ArrowRight
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingItems.map((item) => {
              const Icon = categoryIcon[item.category] || Gem;
              return (
                <Link
                  key={item.id}
                  href={`/item/${item.id}`}
                  className="group bg-gradient-to-br from-amber-900/30 to-amber-800/15 rounded-xl border border-amber-700/40 hover:border-amber-600/50 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="relative aspect-square flex items-center justify-center bg-gradient-to-br from-amber-800 to-amber-700 overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(min-width: 1024px) 20vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <Icon size={40} className="text-amber-600" aria-hidden="true" />
                    )}
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-950/70 text-[10px] font-bold text-amber-200 rounded capitalize">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-amber-100 mb-2 line-clamp-2 text-sm group-hover:text-amber-50">
                      {item.name}
                    </h3>
                    <span className="px-3 py-1.5 bg-gradient-to-r from-amber-700 to-amber-600 group-hover:from-amber-600 group-hover:to-amber-500 text-amber-950 rounded-lg font-medium transition-all flex items-center justify-center gap-1 text-xs">
                      <Eye size={12} aria-hidden="true" />
                      View
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
