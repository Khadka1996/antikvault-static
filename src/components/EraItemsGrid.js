'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Eye, Coins, Banknote, Medal, Gem, Gift } from 'lucide-react';
import PaginatedGrid from './PaginatedGrid';

const categoryIcon = {
  coins: Coins,
  banknotes: Banknote,
  medals: Medal,
  tokens: Gem,
  souvenirs: Gift,
};

const PAGE_SIZE = 8; // 2 rows of 4 on desktop — matches the Featured Pieces grid

export default function EraItemsGrid({ items }) {
  return (
    <PaginatedGrid
      items={items}
      pageSize={PAGE_SIZE}
      gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      emptyMessage="No items in this collection yet."
      renderItem={(item) => {
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
      }}
    />
  );
}
