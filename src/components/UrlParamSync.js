'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// Renders nothing — its only job is calling `onChange` with the current
// search params, both on mount and whenever they change via client-side
// navigation (e.g. clicking between "Coins"/"Banknotes" links while already
// on /collection, which doesn't remount that page's component tree).
//
// Isolated into its own component, wrapped in its own <Suspense>, so that
// `useSearchParams()` — which forces Next to bail out to client-only
// rendering for whatever it's called in — only affects this invisible node,
// not the actual item grid around it. That grid needs to stay in the
// pre-rendered static HTML for crawlers; it must not end up hidden behind a
// Suspense fallback just because something elsewhere on the page reads the
// URL reactively.
export default function UrlParamSync({ onChange }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    onChange(searchParams);
  }, [searchParams, onChange]);

  return null;
}
