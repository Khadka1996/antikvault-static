import { ShieldCheck, BookOpen, Globe } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import TrendingSection from '@/components/TrendingSection';
import FeaturedItems from '@/components/FeaturedItems';
import { siteConfig } from '@/config/site';

const title = 'Antik Vault | Antique Coins, Rare Coins & World Collectibles';
const description =
  'Discover antique and rare coins, banknotes, and world collectibles at Antik Vault — historical pieces from across the globe. Prices shared on inquiry.';
const shareImage = [{ url: '/share.jpg', width: 1254, height: 1254, alt: 'Antik Vault' }];

export const metadata = {
  title,
  description,
  alternates: { canonical: '/' },
  // The homepage gets its own designed share image instead of the generic
  // site-wide card from opengraph-image.js (which still applies to every
  // other page automatically) — specified in full, not just `images`, since
  // Next merges metadata per-field rather than deep-merging nested objects.
  openGraph: {
    title,
    description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: 'website',
    images: shareImage,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: shareImage,
  },
};

const trustPoints = [
  {
    Icon: ShieldCheck,
    title: 'Authenticated',
    text: 'Every piece in our collection is carefully verified and documented by experts.',
  },
  {
    Icon: BookOpen,
    title: 'Documented',
    text: 'Complete historical context and provenance information for each piece.',
  },
  {
    Icon: Globe,
    title: 'Globally Curated',
    text: 'Artifacts and coins from across the world, spanning centuries of history.',
  },
];

export default function HomePage() {
  return (
    <div className="bg-gradient-to-br from-amber-950 via-amber-900/10 to-amber-950">
      <HeroSection />
      <TrendingSection />
      <FeaturedItems />

      {/* Trust section */}
      <section className="bg-amber-950">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <h2 className="sr-only">Why Antik Vault</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustPoints.map(({ Icon, title, text }) => (
              <div
                key={title}
                className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 backdrop-blur-sm rounded-2xl border border-amber-700/50 p-6 shadow-xl text-center"
              >
                <span className="inline-flex p-3 mb-4 bg-gradient-to-br from-amber-600 to-amber-500 rounded-xl shadow-lg">
                  <Icon size={24} className="text-amber-50" aria-hidden="true" />
                </span>
                <h3 className="text-xl font-bold text-amber-50 mb-2">{title}</h3>
                <p className="text-amber-300 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
