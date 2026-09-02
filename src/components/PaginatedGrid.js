'use client';

import { useMemo, useRef, useState } from 'react';
import Pagination from './Pagination';

/**
 * Renders one page's worth of `items` at a time instead of the whole list,
 * so the DOM only ever holds `pageSize` cards — the main cost on a page like
 * this is images/icons + card markup per item, not the (already tiny)
 * catalog.json data, which is loaded either way.
 *
 * Mount with `key={someFilterValue}` on pages that also filter (e.g. by
 * category) so changing the filter remounts this component and resets
 * pagination to page 1 — no extra effect needed.
 */
export default function PaginatedGrid({
  items,
  pageSize,
  gridClassName,
  renderItem,
  emptyMessage = 'No items found.',
}) {
  const [page, setPage] = useState(1);
  const gridRef = useRef(null);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  if (items.length === 0) {
    return <p className="text-amber-400 text-center py-16">{emptyMessage}</p>;
  }

  const handleChange = (nextPage) => {
    setPage(nextPage);
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div ref={gridRef}>
      <div className={gridClassName}>{pageItems.map(renderItem)}</div>
      <Pagination page={currentPage} totalPages={totalPages} onChange={handleChange} />
    </div>
  );
}
