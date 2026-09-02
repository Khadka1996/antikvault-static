'use client';

import ItemCard from './ItemCard';
import PaginatedGrid from './PaginatedGrid';

// Paginated grid of full `ItemCard`s (used by Collection and Trending).
// A thin client wrapper so server-component pages can pass plain `items`
// data down without having to pass a render-function prop themselves.
export default function CollectionGrid({
  items,
  pageSize = 9,
  gridClassName = 'grid sm:grid-cols-2 lg:grid-cols-3 gap-6',
  emptyMessage = 'No items found.',
}) {
  return (
    <PaginatedGrid
      items={items}
      pageSize={pageSize}
      gridClassName={gridClassName}
      emptyMessage={emptyMessage}
      renderItem={(item) => <ItemCard key={item.id} item={item} />}
    />
  );
}
