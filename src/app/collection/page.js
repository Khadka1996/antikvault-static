import CollectionBrowser from '@/components/CollectionBrowser';
import { siteConfig } from '@/config/site';

export const metadata = {
  title: 'Collection',
  description:
    'Browse the full Antik Vault collection — rare coins, banknotes, medals, and antiquities, filterable by category. Prices on inquiry.',
  alternates: { canonical: '/collection' },
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
    { '@type': 'ListItem', position: 2, name: 'Collection', item: `${siteConfig.url}/collection` },
  ],
};

export default function CollectionPage() {
  return (
    <div className="py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <CollectionBrowser />
    </div>
  );
}
