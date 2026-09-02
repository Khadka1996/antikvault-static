'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  ChevronRight,
  Menu,
  Shield,
  ShieldCheck,
  Clock,
  CheckCircle,
  Award,
  ArrowRight,
  Star,
  Eye,
  Coins,
  Banknote,
  Medal,
  Gem,
  Gift,
  Sparkles,
  Clover,
  Package,
} from 'lucide-react';
import catalogData from '@/data/catalog.json';

const categoryIcon = {
  coins: Coins,
  banknotes: Banknote,
  medals: Medal,
  tokens: Gem,
  souvenirs: Gift,
  rare: Sparkles,
  lucky: Clover,
};

const { items, categories } = catalogData;
// Sidebar categories = catalog categories (minus Medals & Decorations, which has no
// items yet) + Rare Coins, Lucky Coins (decorative only — not real catalog categories)
const sidebarCategories = [
  ...categories.filter((c) => c.id !== 'medals'),
  { id: 'rare', name: 'Rare Coins' },
  { id: 'lucky', name: 'Lucky Coins' },
];
// "Featured" in the hero = the oldest verifiable piece in the collection. We don't
// have minting years for most items, but the medieval-tagged Akbar (Mughal Empire)
// coin is the one era we can date with confidence, so it's the natural choice.
const featuredItem = items.find((item) => item.tags?.includes('medieval')) || items[0];

function Counter({ target, suffix = '' }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const duration = 1400;
    const steps = 40;
    const step = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

const stats = [
  { icon: Package, value: items.length, suffix: '+', label: 'Pieces' },
  { icon: Award, value: 100, suffix: '%', label: 'Satisfaction' },
  { icon: ShieldCheck, value: 100, suffix: '%', label: 'Trust' },
];

const trustPoints = [
  { icon: CheckCircle, className: 'text-emerald-400', label: '100% Satisfaction Guarantee' },
  { icon: Award, className: 'text-amber-400', label: '100% Trust & Authenticity' },
  { icon: Clock, className: 'text-amber-300', label: 'Documented Provenance' },
  { icon: Shield, className: 'text-amber-200', label: 'Expert Authenticated Items' },
];

// Real terms that return results in the actual catalog (country names and
// denomination words — the two things search matches against).
const popularSearches = ['Nepal', 'Rupee', 'USSR', 'India', 'Banknote'];

export default function HeroSection() {
  return (
    <div className="bg-amber-950">
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-3 md:pb-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="lg:w-1/4 space-y-6">
            {/* Categories */}
            <div className="bg-amber-900/50 rounded-lg shadow-lg border border-amber-700/50 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-800 to-amber-700 text-amber-50 px-4 py-3">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Menu className="w-5 h-5" aria-hidden="true" />
                  All Categories
                </h2>
              </div>
              <div className="divide-y divide-amber-800/50">
                {sidebarCategories.map((category) => {
                  const Icon = categoryIcon[category.id] || Package;
                  return (
                    <Link
                      key={category.id}
                      href={`/collection?cat=${category.id}`}
                      className="group flex items-center justify-between px-4 py-3 hover:bg-amber-800/30 text-amber-100 hover:text-amber-50 transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-amber-400" aria-hidden="true" />
                        <span className="font-medium">{category.name}</span>
                      </span>
                      <ChevronRight
                        className="w-4 h-4 text-amber-600 group-hover:text-amber-400"
                        aria-hidden="true"
                      />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Heritage & Trust */}
            <div className="bg-amber-900/30 rounded-lg border border-amber-700/30 p-6">
              <h3 className="font-bold text-amber-50 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" aria-hidden="true" />
                Heritage &amp; Trust
              </h3>
              <ul className="space-y-3">
                {trustPoints.map(({ icon: Icon, className, label }) => (
                  <li key={label} className="flex items-center gap-2 text-sm text-amber-200">
                    <Icon className={`w-5 h-5 shrink-0 ${className}`} aria-hidden="true" />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4 space-y-6">
            {/* Search Bar */}
            <div>
              <form action="/collection" className="relative">
                <div className="flex shadow-lg rounded-lg overflow-hidden">
                  <div className="flex-1 relative">
                    <label htmlFor="hero-search" className="sr-only">
                      Search the collection
                    </label>
                    <input
                      id="hero-search"
                      type="text"
                      name="q"
                      placeholder="Search historical artifacts, rare coins, antique jewelry..."
                      className="w-full h-14 pl-14 pr-4 text-amber-50 bg-amber-900/50 placeholder-amber-400/70 focus:outline-none focus:ring-2 focus:ring-amber-600"
                    />
                    <Search
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 w-5 h-5"
                      aria-hidden="true"
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-14 px-8 bg-gradient-to-r from-amber-600 to-amber-500 text-amber-950 font-semibold hover:from-amber-500 hover:to-amber-400 transition-all duration-300"
                  >
                    Search
                  </button>
                </div>
              </form>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-amber-300">
                <span>Popular:</span>
                {popularSearches.map((term) => (
                  <Link
                    key={term}
                    href={`/collection?q=${encodeURIComponent(term)}`}
                    className="hover:text-amber-200 transition-colors"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>

            {/* Stats Banner */}
            <div className="bg-gradient-to-r from-amber-900/50 to-amber-800/30 rounded-lg border border-amber-700/50 p-6 shadow-md">
              <dl className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {stats.map(({ icon: Icon, value, suffix, label }) => (
                  <div key={label} className="text-center">
                    <dd className="text-3xl font-bold text-amber-400 mb-2">
                      <Counter target={value} suffix={suffix} />
                    </dd>
                    <dt className="flex items-center justify-center gap-2 text-amber-200 font-medium">
                      <Icon className="w-5 h-5 text-amber-400" aria-hidden="true" />
                      {label}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>

            {/* Hero Banner Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Banner */}
              <div className="lg:col-span-2 relative rounded-xl overflow-hidden shadow-xl bg-amber-900">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-900 to-amber-800/80" />
                <div className="relative p-8 text-amber-50">
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    Discover <span className="text-amber-300">Timeless</span> Treasures
                  </h1>
                  <p className="text-amber-200 mb-6 max-w-2xl">
                    Authentic historical artifacts, rare coins, and exclusive collectibles from
                    verified sources worldwide. Each piece is authenticated for your peace of mind.
                  </p>
                  <Link
                    href="/collection"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-amber-950 font-semibold rounded-lg hover:from-amber-500 hover:to-amber-400 transition-all duration-300"
                  >
                    Browse Collections
                    <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              {/* Featured Item */}
              <div className="bg-gradient-to-br from-amber-900/50 to-amber-800/30 rounded-xl border border-amber-700/50 overflow-hidden shadow-md flex flex-col">
                <div className="relative h-40 flex items-center justify-center bg-gradient-to-br from-amber-800 to-amber-700">
                  {featuredItem.image ? (
                    <Image
                      src={featuredItem.image}
                      alt={featuredItem.name}
                      fill
                      sizes="320px"
                      className="object-cover"
                    />
                  ) : (
                    (() => {
                      const Icon = categoryIcon[featuredItem.category] || Gem;
                      return <Icon size={48} className="text-amber-600" aria-hidden="true" />;
                    })()
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-amber-600/20 text-amber-300 text-xs font-bold rounded-full border border-amber-500/30">
                      Featured
                    </span>
                    <Star className="w-5 h-5 text-amber-400" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-amber-50 mb-2 line-clamp-2 text-sm">
                    {featuredItem.name}
                  </h3>
                  <p className="text-xs text-amber-400 mb-3 capitalize">{featuredItem.category}</p>
                  <Link
                    href={`/item/${featuredItem.id}`}
                    className="mt-auto w-full text-center py-2 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-amber-950 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                  >
                    <Eye size={16} aria-hidden="true" />
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
