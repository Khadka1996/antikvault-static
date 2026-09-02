'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Coins, Banknote, Medal, Gem, Eye, Gift } from 'lucide-react';
import catalogData from '@/data/catalog.json';

const categoryIcon = {
  coins: Coins,
  banknotes: Banknote,
  medals: Medal,
  tokens: Gem,
  souvenirs: Gift,
};

const { items } = catalogData;
const FEATURED_COUNT = 16;

// Sample evenly across the whole catalog (rather than the first N) so the default
// selection is a mix of countries and categories instead of whatever sorts
// alphabetically first. This is what's in the pre-rendered static HTML.
function evenlySampled(count) {
  const step = Math.max(1, Math.floor(items.length / count));
  return Array.from({ length: count }, (_, i) => items[i * step]).filter(Boolean);
}

// A tiny deterministic PRNG (mulberry32) seeded from a number, so the same seed
// always produces the same shuffle — no external dependency needed for this.
function mulberry32(seed) {
  let a = seed;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) | 0;
  return hash;
}

// Picks `count` items deterministically from `date` (year+month+day only, so it's
// stable all day and only changes at midnight, local time) — same selection for
// every visitor on a given day, no server/database needed for a static export.
function pickForDate(date, count) {
  const seed = hashString(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
  const rng = mulberry32(seed);
  const shuffled = items.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

export default function FeaturedItems() {
  // Start with the deterministic even sample so the pre-rendered static HTML
  // (built once, viewed on many different days) is stable and crawlable, then
  // switch to today's rotation on mount — the build date and a visitor's actual
  // viewing date are different things for a static export, so "today" can only
  // be read on the client.
  const [featured, setFeatured] = useState(() => evenlySampled(FEATURED_COUNT));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- "today" differs between build time and view time on a static export; only known on the client
    setFeatured(pickForDate(new Date(), FEATURED_COUNT));
  }, []);

  return (
    <section className="bg-amber-950">
      <div className="max-w-7xl mx-auto px-4 pt-3 md:pt-4 pb-8 md:pb-12 space-y-8">
        {/* Featured pieces */}
        <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 backdrop-blur-sm rounded-2xl border border-amber-700/50 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <span className="p-3 bg-gradient-to-br from-amber-600 to-amber-500 rounded-xl shadow-lg">
                <Coins size={24} className="text-amber-50" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-2xl font-bold text-amber-50">Featured Pieces</h2>
                <p className="text-amber-400">Authenticated and professionally documented</p>
              </div>
            </div>
            <Link
              href="/collection"
              className="group hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-800/30 to-amber-700/20 rounded-lg border border-amber-700/50 hover:border-amber-600/50 text-amber-300 hover:text-amber-200 transition-all"
            >
              <span className="font-medium">View more</span>
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((item) => {
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
                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <Icon size={48} className="text-amber-600" aria-hidden="true" />
                    )}
                    <span className="absolute top-3 left-3 px-2 py-1 bg-amber-950/70 text-[11px] font-bold text-amber-200 rounded-lg capitalize">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-amber-100 mb-1 line-clamp-2 group-hover:text-amber-50">
                      {item.name}
                    </h3>
                    <p className="text-xs text-amber-500 mb-3">
                      {item.origin}
                      {item.year ? ` · ${item.year}` : ''}
                    </p>
                    <span className="w-full px-4 py-2 bg-gradient-to-r from-amber-700 to-amber-600 group-hover:from-amber-600 group-hover:to-amber-500 text-amber-950 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm">
                      <Eye size={14} aria-hidden="true" />
                      View Details
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/collection" className="btn-primary">
              View Full Collection
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
