import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import catalogData from '@/data/catalog.json';
import { eras } from '@/config/eras';

export const metadata = {
  title: 'Shop by Era & Theme',
  description:
    'Browse the Antik Vault collection by era and theme — Ancient, Medieval, Gold & Silver, World Coins, Paper Money, and Vintage.',
  alternates: { canonical: '/eras' },
};

const countFor = (id) => catalogData.items.filter((item) => item.tags?.includes(id)).length;

export default function ErasPage() {
  return (
    <div className="bg-amber-950 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Same panel design as "Featured Pieces" on the home page */}
        <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 backdrop-blur-sm rounded-2xl border border-amber-700/50 p-6 shadow-xl">
          <div className="flex items-center gap-4 mb-8">
            <span className="p-3 bg-gradient-to-br from-amber-600 to-amber-500 rounded-xl shadow-lg">
              <Sparkles size={24} className="text-amber-50" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-amber-50">Shop by Era &amp; Theme</h1>
              <p className="text-amber-400">Each era and theme has its own dedicated page</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {eras.map((era) => {
              const Icon = era.icon;
              return (
                <Link
                  key={era.id}
                  href={`/eras/${era.id}`}
                  className="group bg-gradient-to-br from-amber-900/30 to-amber-800/15 rounded-xl border border-amber-700/40 hover:border-amber-600/50 hover:shadow-lg transition-all duration-300 p-6 text-center"
                >
                  <Icon
                    size={40}
                    className="mx-auto mb-3 text-amber-500 group-hover:text-amber-400 transition-colors"
                    aria-hidden="true"
                  />
                  <h2 className="font-semibold text-amber-100 group-hover:text-amber-50">
                    {era.name}
                  </h2>
                  <p className="text-xs text-amber-500 mt-1">{countFor(era.id)} pieces</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
