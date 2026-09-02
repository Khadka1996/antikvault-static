'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

// Compact page list with ellipses for long runs, e.g. [1, '…', 4, 5, 6, '…', 12].
// Always keeps first, last, current, and the current's immediate neighbours.
function buildPageList(current, total) {
  const keep = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...keep].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const withGaps = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) withGaps.push(`gap-${p}`);
    withGaps.push(p);
    prev = p;
  }
  return withGaps;
}

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(page, totalPages);

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-amber-700/50 bg-amber-800/30 text-amber-300 hover:bg-amber-800/50 hover:text-amber-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-amber-800/30 transition-colors"
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>

      {pages.map((p) =>
        typeof p === 'string' ? (
          <span key={p} className="px-1 text-amber-600" aria-hidden="true">
            &hellip;
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`min-w-9 h-9 px-2 rounded-lg text-sm font-medium border transition-colors ${
              p === page
                ? 'bg-amber-600 text-white border-amber-500'
                : 'bg-amber-800/30 text-amber-300 border-amber-700/50 hover:bg-amber-800/50 hover:text-amber-100'
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-amber-700/50 bg-amber-800/30 text-amber-300 hover:bg-amber-800/50 hover:text-amber-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-amber-800/30 transition-colors"
      >
        <ChevronRight size={18} aria-hidden="true" />
      </button>
    </nav>
  );
}
