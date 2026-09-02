import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  ChevronRight,
  MapPin,
  Calendar,
  Trophy,
  Weight,
  Ruler,
  Award,
  MessageCircle,
  Coins,
  Banknote,
  Medal,
  Gem,
  Gift,
} from 'lucide-react';
import catalogData from '@/data/catalog.json';
import { siteConfig, whatsappUrl } from '@/config/site';
import ItemGallery from '@/components/ItemGallery';
import AddToCartButton from '@/components/AddToCartButton';
import ShareButton from '@/components/ShareButton';

const categoryIcon = {
  coins: Coins,
  banknotes: Banknote,
  medals: Medal,
  tokens: Gem,
  souvenirs: Gift,
};

export const dynamicParams = false;

export function generateStaticParams() {
  return catalogData.items.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const item = catalogData.items.find((i) => i.id === id);
  if (!item) return {};
  const images = item.image ? [{ url: item.image, alt: item.name }] : undefined;
  return {
    title: item.name,
    description: item.description,
    alternates: { canonical: `/item/${item.id}` },
    openGraph: {
      title: item.name,
      description: item.description,
      url: `${siteConfig.url}/item/${item.id}`,
      type: 'article',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: item.name,
      description: item.description,
      images,
    },
  };
}

export default async function ItemDetailPage({ params }) {
  const { id } = await params;
  const item = catalogData.items.find((i) => i.id === id);

  if (!item) notFound();

  const categoryLabel =
    catalogData.categories.find((c) => c.id === item.category)?.name || item.category;
  const Icon = categoryIcon[item.category] || Coins;

  const whatsappMessage = `I'm interested in the ${item.name}. Can you provide more information?`;
  const relatedItems = catalogData.items
    .filter((i) => i.category === item.category && i.id !== item.id)
    .slice(0, 3);

  // Product, not CreativeWork — these are physical items for sale, which is
  // what the type is for. No `offers`/price/SKU/rating: this business shares
  // price on inquiry rather than listing it, and none of those exist to
  // report — Google's guidelines are explicit that structured data should
  // never state a value the page doesn't actually have.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.name,
    description: item.description,
    category: categoryLabel,
    brand: { '@type': 'Brand', name: siteConfig.name },
    ...(item.image ? { image: `${siteConfig.url}${item.image}` } : {}),
    ...(item.material ? { material: item.material } : {}),
    ...(item.origin ? { countryOfOrigin: item.origin } : {}),
    url: `${siteConfig.url}/item/${item.id}`,
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
      { '@type': 'ListItem', position: 2, name: 'Collection', item: `${siteConfig.url}/collection` },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryLabel,
        item: `${siteConfig.url}/collection?cat=${item.category}`,
      },
      { '@type': 'ListItem', position: 4, name: item.name, item: `${siteConfig.url}/item/${item.id}` },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-amber-500">
            <li>
              <Link href="/" className="hover:text-amber-300 transition-colors">
                Home
              </Link>
            </li>
            <ChevronRight size={14} className="text-amber-700 shrink-0" aria-hidden="true" />
            <li>
              <Link href="/collection" className="hover:text-amber-300 transition-colors">
                Collection
              </Link>
            </li>
            <ChevronRight size={14} className="text-amber-700 shrink-0" aria-hidden="true" />
            <li>
              <Link
                href={`/collection?cat=${item.category}`}
                className="hover:text-amber-300 transition-colors"
              >
                {categoryLabel}
              </Link>
            </li>
            <ChevronRight size={14} className="text-amber-700 shrink-0" aria-hidden="true" />
            <li className="text-amber-300 font-medium truncate max-w-48 sm:max-w-xs" aria-current="page">
              {item.name}
            </li>
          </ol>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Image */}
          <div className="md:sticky md:top-24 md:self-start">
            {item.gallery?.length ? (
              <ItemGallery images={item.gallery} name={item.name} />
            ) : (
              <div className="aspect-square bg-amber-900 border border-amber-800/50 rounded-xl overflow-hidden flex items-center justify-center">
                <div className="text-center px-6">
                  <Icon size={96} className="mx-auto mb-4 text-amber-600" aria-hidden="true" />
                  <p className="text-amber-500 text-lg font-medium">{item.name}</p>
                  <p className="text-amber-600 text-xs mt-2">Photography available on request</p>
                </div>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6 md:space-y-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="badge-accent capitalize">{categoryLabel}</span>
                {item.condition && <span className="badge">{item.condition}</span>}
              </div>
              <h1 className="heading-lg mb-4">{item.name}</h1>
              <p className="text-amber-300 text-lg leading-relaxed">{item.description}</p>
            </div>

            {/* Physical specifications */}
            <div>
              <h2 className="sr-only">Specifications</h2>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  item.year && { Icon: Calendar, label: 'Year', value: item.year },
                  item.origin && { Icon: MapPin, label: 'Origin', value: item.origin },
                  item.material && { Icon: Trophy, label: 'Material', value: item.material },
                  item.weight && { Icon: Weight, label: 'Weight', value: item.weight },
                  item.diameter && { Icon: Ruler, label: 'Diameter', value: item.diameter },
                  item.denomination && {
                    Icon: Award,
                    label: 'Denomination',
                    value: item.denomination,
                  },
                ]
                  .filter(Boolean)
                  .map(({ Icon: SpecIcon, label, value }) => (
                    <div
                      key={label}
                      className="bg-amber-900/50 border border-amber-800/50 rounded-lg p-3 sm:p-4"
                    >
                      <div className="flex items-center gap-2 text-amber-500 text-sm mb-1">
                        <SpecIcon size={16} aria-hidden="true" />
                        {label}
                      </div>
                      <p className="text-amber-200 font-semibold">{value}</p>
                    </div>
                  ))}
              </div>
            </div>

            {item.certificate && (
              <div className="bg-linear-to-br from-amber-800/30 to-amber-900/30 border border-amber-700/50 rounded-lg p-4">
                <p className="text-amber-400 text-sm mb-1">Documentation</p>
                <p className="text-amber-200 font-semibold">{item.certificate}</p>
              </div>
            )}

            {item.historicalContext && (
              <div className="space-y-2">
                <h2 className="heading-md">Historical Context</h2>
                <p className="text-amber-400 leading-relaxed">{item.historicalContext}</p>
              </div>
            )}

            {/* Inquiry CTA */}
            <div className="border-t border-amber-800/30 pt-6 md:pt-8 space-y-4">
              <p className="text-amber-400 text-sm">
                Interested in this piece? We buy and sell — price and availability are shared
                directly on inquiry.
              </p>
              <a
                href={whatsappUrl(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary gap-2 w-full"
              >
                <MessageCircle size={20} aria-hidden="true" />
                Inquire via WhatsApp
              </a>
              <div className="grid grid-cols-2 gap-4">
                <AddToCartButton
                  item={{
                    id: item.id,
                    name: item.name,
                    image: item.image,
                    category: item.category,
                  }}
                />
                <ShareButton url={`${siteConfig.url}/item/${item.id}`} title={item.name} />
              </div>
              <a href={`mailto:${siteConfig.email}`} className="btn-secondary gap-2 w-full">
                Email Us
              </a>
            </div>
          </div>
        </div>

        {/* Related items */}
        {relatedItems.length > 0 && (
          <section className="mt-16 pt-12 border-t border-amber-800/30">
            <h2 className="heading-md mb-8">More in {categoryLabel}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedItems.map((related) => {
                const RelatedIcon = categoryIcon[related.category] || Coins;
                return (
                  <Link
                    key={related.id}
                    href={`/item/${related.id}`}
                    className="card-hover group overflow-hidden flex flex-col"
                  >
                    <div className="relative w-full h-48 bg-amber-900 border-b border-amber-800/50 flex items-center justify-center overflow-hidden">
                      {related.image ? (
                        <Image
                          src={related.image}
                          alt={related.name}
                          fill
                          sizes="(min-width: 1024px) 33vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <RelatedIcon size={40} className="text-amber-600" aria-hidden="true" />
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-amber-100 mb-2 line-clamp-2 group-hover:text-amber-300 transition-colors">
                        {related.name}
                      </h3>
                      <p className="text-sm text-amber-400 line-clamp-2">{related.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
