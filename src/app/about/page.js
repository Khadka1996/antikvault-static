import Link from 'next/link';
import { Award, Globe, ShieldCheck, BookOpen, Handshake, Heart } from 'lucide-react';

export const metadata = {
  title: 'About',
  description:
    'Antik Vault buys, sells, and documents rare coins, banknotes, medals, and antiquities from around the world. Prices and availability on inquiry.',
  alternates: { canonical: '/about' },
};

const values = [
  {
    Icon: ShieldCheck,
    title: 'Authenticity',
    text: 'Committed to absolute authenticity and proper authentication standards.',
  },
  {
    Icon: BookOpen,
    title: 'Preservation',
    text: 'Professional preservation and documentation standards for all items.',
  },
  {
    Icon: Handshake,
    title: 'Education',
    text: 'Sharing knowledge and historical context with collectors and enthusiasts.',
  },
  {
    Icon: Heart,
    title: 'Passion',
    text: 'Driven by genuine passion for numismatics and historical artifacts.',
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="space-y-6 max-w-3xl">
          <h1 className="heading-xl text-5xl md:text-6xl">About Antik Vault</h1>
          <p className="text-xl text-amber-300">
            Where History Lives. Preserving History, One Coin at a Time.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 py-16 border-t border-amber-800/30">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="heading-md mb-4">Our Mission</h2>
            <p className="text-amber-300 leading-relaxed mb-6">
              Antik Vault buys, sells, and documents rare coins, banknotes, medals, tokens, and
              antiquities from around the world. We believe every piece deserves to be properly
              researched, recorded, and passed on to collectors who value it.
            </p>
            <p className="text-amber-300 leading-relaxed">
              Based in Kathmandu, Nepal, we curate each piece with full historical and physical
              detail. Prices and availability are shared directly on inquiry.
            </p>
          </div>
          <div className="space-y-4">
            <div className="bg-amber-900/50 border border-amber-800/50 rounded-lg p-6">
              <Award size={32} className="text-amber-400 mb-3" aria-hidden="true" />
              <h3 className="font-semibold text-amber-200 mb-2">Authentic &amp; Verified</h3>
              <p className="text-amber-400 text-sm">
                Every item is carefully authenticated and documented by experts.
              </p>
            </div>
            <div className="bg-amber-900/50 border border-amber-800/50 rounded-lg p-6">
              <Globe size={32} className="text-amber-400 mb-3" aria-hidden="true" />
              <h3 className="font-semibold text-amber-200 mb-2">Globally Curated</h3>
              <p className="text-amber-400 text-sm">
                Items sourced from across the world, spanning centuries of history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 py-16 border-t border-amber-800/30">
        <h2 className="heading-md mb-12">Our Values</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {values.map(({ Icon, title, text }) => (
            <div key={title} className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-amber-800/30 flex items-center justify-center">
                <Icon size={24} className="text-amber-400" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-amber-200">{title}</h3>
              <p className="text-amber-400 text-sm">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-4 py-16 border-t border-amber-800/30">
        <h2 className="heading-md mb-8">Our Story</h2>
        <div className="max-w-3xl space-y-6">
          <p className="text-amber-300 leading-relaxed">
            Antik Vault began as a passion project to document and preserve rare numismatic
            pieces. What started as a personal collection has grown into a dealership serving
            collectors, researchers, and history enthusiasts worldwide.
          </p>
          <p className="text-amber-300 leading-relaxed">
            Based in Kathmandu, Nepal, we are committed to showcasing the rich history and cultural
            heritage of this region and beyond. Each piece we handle tells a story that spans
            centuries and continents.
          </p>
          <p className="text-amber-300 leading-relaxed">
            Today, Antik Vault stands as a trusted name for buying, selling, and documenting rare
            coins and antiquities, maintaining the highest standards of authentication and
            preservation.
          </p>
        </div>
      </section>

      {/* Call to action */}
      <section className="max-w-7xl mx-auto px-4 py-16 border-t border-amber-800/30">
        <div className="bg-linear-to-r from-amber-900/50 to-amber-800/30 border border-amber-700/50 rounded-xl p-8 md:p-12 text-center">
          <h2 className="heading-md mb-4">Join Our Community</h2>
          <p className="text-amber-300 mb-8 max-w-xl mx-auto">
            Whether you&apos;re a seasoned collector or just beginning your numismatic journey, we
            welcome you to explore our collection and discover the stories behind each piece.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/collection" className="btn-primary">
              Explore Collection
            </Link>
            <Link href="/contact" className="btn-secondary">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
