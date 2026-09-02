'use client';

import { Suspense, useCallback, useMemo, useState } from 'react';
import { Filter, X } from 'lucide-react';
import CollectionGrid from '@/components/CollectionGrid';
import UrlParamSync from '@/components/UrlParamSync';
import catalogData from '@/data/catalog.json';

const { items, categories } = catalogData;
const validCategories = new Set(categories.map((c) => c.id));
const PAGE_SIZE = 20; // 4 rows of 5 on desktop
const GRID_CLASSNAME = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6';

export default function CollectionBrowser() {
  // Start with everything visible so the pre-rendered static HTML contains
  // all items (crawlable). Deep links like ?cat=coins and ?q=rupee (from the
  // homepage search bar) are applied via UrlParamSync below — and re-applied
  // whenever the URL's params change client-side (e.g. clicking "Coins" then
  // "Banknotes" in the header doesn't remount this component, since it's the
  // same route, so a mount-only effect would only ever catch the first one).
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const syncFromParams = useCallback((params) => {
    const cat = params.get('cat');
    const q = params.get('q');
    setSelectedCategory(cat && validCategories.has(cat) ? cat : '');
    setSearchQuery(q || '');
  }, []);

  // Search matches the coin/banknote name or its country of origin — the two
  // things a visitor is most likely to type in.
  const filteredItems = useMemo(() => {
    let result = selectedCategory
      ? items.filter((item) => item.category === selectedCategory)
      : items;
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.origin?.toLowerCase().includes(query),
      );
    }
    return result;
  }, [selectedCategory, searchQuery]);

  const countFor = (id) => items.filter((item) => item.category === id).length;
  const selectedName = categories.find((c) => c.id === selectedCategory)?.name;

  return (
    <div className="max-w-7xl mx-auto px-4">
      <Suspense fallback={null}>
        <UrlParamSync onChange={syncFromParams} />
      </Suspense>

      {/* Page header */}
      <div className="mb-12">
        <h1 className="heading-lg mb-4">Our Collection</h1>
        <p className="text-amber-400 max-w-2xl">
          Browse our carefully curated collection of {items.length} rare pieces spanning coins,
          banknotes, medals, and antiquities. Prices and availability shared on inquiry.
        </p>
      </div>

      {/* Active search indicator — the search box itself lives on the homepage;
          this just surfaces (and lets you clear) a ?q= arriving from there. */}
      {searchQuery && (
        <div className="mb-6 flex items-center gap-2 text-sm text-amber-300">
          <span>
            Showing results for &ldquo;<span className="font-semibold text-amber-100">{searchQuery}</span>&rdquo;
          </span>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-200 transition-colors"
          >
            <X size={14} aria-hidden="true" />
            Clear
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="mb-8">
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className="md:hidden flex items-center gap-2 text-amber-300 hover:text-amber-100 transition-colors mb-4"
          aria-expanded={showFilters}
          aria-controls="category-filters"
        >
          <Filter size={20} aria-hidden="true" />
          {showFilters ? 'Hide' : 'Show'} Filters
        </button>

        <div
          id="category-filters"
          className={`flex-wrap gap-2 ${showFilters ? 'flex' : 'hidden md:flex'}`}
        >
          <button
            type="button"
            onClick={() => setSelectedCategory('')}
            aria-pressed={selectedCategory === ''}
            className={`px-4 py-2 rounded-lg transition-colors font-medium text-sm border ${
              selectedCategory === ''
                ? 'bg-amber-600 text-white border-amber-500'
                : 'bg-amber-800/30 text-amber-300 border-amber-700/50 hover:bg-amber-800/50'
            }`}
          >
            All Items ({items.length})
          </button>
          {categories.filter((cat) => countFor(cat.id) > 0).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              aria-pressed={selectedCategory === cat.id}
              className={`px-4 py-2 rounded-lg transition-colors font-medium text-sm border ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-white border-amber-500'
                  : 'bg-amber-800/30 text-amber-300 border-amber-700/50 hover:bg-amber-800/50'
              }`}
            >
              {cat.name} ({countFor(cat.id)})
            </button>
          ))}
        </div>

        {showFilters && (
          <div className="md:hidden flex justify-between items-center mt-4 p-3 bg-amber-800/20 rounded-lg border border-amber-700/30">
            <span className="text-sm text-amber-400">
              Showing: {selectedName || 'All Items'}
            </span>
            <button
              type="button"
              onClick={() => setShowFilters(false)}
              className="text-amber-400 hover:text-amber-200 transition-colors"
              aria-label="Close filters"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="mb-6 text-amber-400 text-sm" aria-live="polite">
        {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
      </div>

      {/* Items grid — keyed by category+search so changing either resets to page 1 */}
      <CollectionGrid
        key={`${selectedCategory}-${searchQuery}`}
        items={filteredItems}
        pageSize={PAGE_SIZE}
        gridClassName={GRID_CLASSNAME}
        emptyMessage={
          searchQuery ? `No items match "${searchQuery}".` : 'No items found in this category.'
        }
      />
    </div>
  );
}
