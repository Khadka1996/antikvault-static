import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import catalogData from '@/data/catalog.json';
import { eras } from '@/config/eras';
import { siteConfig } from '@/config/site';
import EraItemsGrid from '@/components/EraItemsGrid';

export const dynamicParams = false;

export function generateStaticParams() {
  return eras.map((era) => ({ era: era.id }));
}

function itemsForEra(eraId) {
  return catalogData.items.filter((item) => item.tags?.includes(eraId));
}

export async function generateMetadata({ params }) {
  const { era: eraId } = await params;
  const era = eras.find((e) => e.id === eraId);
  if (!era) return {};
  const count = itemsForEra(era.id).length;
  const description =
    count > 0
      ? `${era.description} Browse ${count} piece${count !== 1 ? 's' : ''} in the Antik Vault collection.`
      : `${era.description} New pieces are added to the Antik Vault collection regularly — check back soon.`;
  return {
    title: era.name,
    description,
    alternates: { canonical: `/eras/${era.id}` },
    // An empty category shouldn't be indexed under a description promising
    // content it doesn't have yet — it's picked back up automatically the
    // moment a real item carries this era's tag.
    ...(count === 0 && { robots: { index: false, follow: true } }),
  };
}

export default async function EraPage({ params }) {
  const { era: eraId } = await params;
  const era = eras.find((e) => e.id === eraId);

  if (!era) notFound();

  const HeaderIcon = era.icon;
  const items = itemsForEra(era.id);
  const base = siteConfig.url.replace(/\/$/, '');

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: base },
      { '@type': 'ListItem', position: 2, name: 'Shop by Era', item: `${base}/eras` },
      { '@type': 'ListItem', position: 3, name: era.name, item: `${base}/eras/${era.id}` },
    ],
  };

  const itemListLd =
    items.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `${era.name} — Antik Vault`,
          itemListElement: items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${base}/item/${item.id}`,
            name: item.name,
          })),
        }
      : null;

  return (
    <div className="bg-amber-950 py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {itemListLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
        />
      )}
      <div className="max-w-7xl mx-auto px-4">
        <Link
          href="/eras"
          className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-200 transition-colors mb-6"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          All Eras &amp; Themes
        </Link>

        {/* Same panel design as "Featured Pieces" on the home page */}
        <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 backdrop-blur-sm rounded-2xl border border-amber-700/50 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <span className="p-3 bg-gradient-to-br from-amber-600 to-amber-500 rounded-xl shadow-lg">
                <HeaderIcon size={24} className="text-amber-50" aria-hidden="true" />
              </span>
              <div>
                <h1 className="text-2xl font-bold text-amber-50">{era.name}</h1>
                <p className="text-amber-400">
                  {era.description} &middot; {items.length} piece{items.length !== 1 ? 's' : ''}
                </p>
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

          <EraItemsGrid items={items} />

          <div className="mt-8 text-center sm:hidden">
            <Link href="/collection" className="btn-primary">
              View Full Collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
