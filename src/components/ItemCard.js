import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, Award, Coins, Banknote, Medal, Gem, Gift, Eye } from 'lucide-react';

const categoryIcon = {
  coins: Coins,
  banknotes: Banknote,
  medals: Medal,
  tokens: Gem,
  souvenirs: Gift,
};

export default function ItemCard({ item, featured = false }) {
  const Icon = categoryIcon[item.category] || Coins;

  return (
    <Link
      href={`/item/${item.id}`}
      className={`card-hover group overflow-hidden h-full flex flex-col ${
        featured ? 'sm:col-span-2 lg:row-span-2' : ''
      }`}
    >
      {/* Image / placeholder */}
      <div className="relative w-full h-64 md:h-72 overflow-hidden bg-gradient-to-br from-amber-800 to-amber-700 border-b border-amber-800/50">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center px-4">
              <Icon size={56} className="mx-auto mb-2 text-amber-600" aria-hidden="true" />
              <p className="text-amber-200 text-sm font-medium">{item.name}</p>
            </div>
          </div>
        )}

        {/* Category badge */}
        <span className="absolute top-4 right-4 px-3 py-1 bg-amber-900/80 backdrop-blur-sm border border-amber-700/50 rounded-full text-xs font-semibold text-amber-300 capitalize">
          {item.category}
        </span>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white font-semibold">View Details</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 md:p-5 flex flex-col">
        <h3 className="text-lg md:text-xl font-bold text-amber-100 mb-3 line-clamp-2 group-hover:text-amber-300 transition-colors">
          {item.name}
        </h3>

        {/* Key info */}
        <div className="space-y-2 mb-4 flex-1">
          {item.origin && (
            <div className="flex items-center gap-2 text-sm text-amber-400">
              <MapPin size={14} className="shrink-0" aria-hidden="true" />
              <span>{item.origin}</span>
            </div>
          )}
          {item.year && (
            <div className="flex items-center gap-2 text-sm text-amber-400">
              <Calendar size={14} className="shrink-0" aria-hidden="true" />
              <span>{item.year}</span>
            </div>
          )}
          {item.condition && (
            <div className="flex items-center gap-2 text-sm text-amber-400">
              <Award size={14} className="shrink-0" aria-hidden="true" />
              <span>{item.condition}</span>
            </div>
          )}
        </div>

        {/* Material / details */}
        {item.material && (
          <div className="flex gap-2 flex-wrap mb-4">
            <span className="badge">{item.material}</span>
            {item.weight && <span className="badge">{item.weight}</span>}
            {item.denomination && <span className="badge">{item.denomination}</span>}
          </div>
        )}

        {/* Footer action — same "View Details" pill as the homepage Featured Pieces cards */}
        <span className="mt-auto w-full px-4 py-2 bg-gradient-to-r from-amber-700 to-amber-600 group-hover:from-amber-600 group-hover:to-amber-500 text-amber-950 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm">
          <Eye size={14} aria-hidden="true" />
          View Details
        </span>
      </div>
    </Link>
  );
}
