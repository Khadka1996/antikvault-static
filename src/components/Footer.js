import Link from 'next/link';
import Image from 'next/image';
import {
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Award,
  ScrollText,
  Globe,
  CheckCircle,
} from 'lucide-react';
import { siteConfig, whatsappUrl } from '@/config/site';

const featureBadges = [
  { Icon: ShieldCheck, title: '100% Authentic', text: 'Expert verified' },
  { Icon: Award, title: 'Fully Documented', text: 'Historical & physical detail' },
  { Icon: ScrollText, title: 'Verified Provenance', text: 'Where records exist' },
  { Icon: Globe, title: 'Global Reach', text: 'Serving collectors worldwide' },
];

const linkColumns = [
  {
    title: 'Explore',
    links: [
      { href: '/', label: 'Home' },
      { href: '/collection', label: 'Collection' },
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Categories',
    links: [
      { href: '/collection?cat=coins', label: 'Coins' },
      { href: '/collection?cat=banknotes', label: 'Banknotes' },
      { href: '/collection?cat=medals', label: 'Medals' },
      { href: '/collection?cat=tokens', label: 'Tokens' },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-amber-900 text-amber-50 border-t border-amber-800">
      {/* Feature strip */}
      <div className="bg-gradient-to-r from-amber-800 to-amber-700/90 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featureBadges.map(({ Icon, title, text }) => (
              <div
                key={title}
                className="flex items-center gap-4 p-4 bg-amber-900/30 backdrop-blur-sm rounded-xl border border-amber-700/50"
              >
                <span className="p-3 bg-gradient-to-br from-amber-700 to-amber-600 rounded-lg shrink-0">
                  <Icon className="w-6 h-6 text-amber-50" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-amber-50">{title}</p>
                  <p className="text-sm text-amber-300">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <Image
                  src="/logo.png"
                  alt="Antik Vault"
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full shadow-lg"
                />
                <div>
                  <h2 className="text-2xl font-bold text-amber-50">Antik Vault</h2>
                  <p className="text-amber-300 text-sm">{siteConfig.tagline}</p>
                </div>
              </div>
              <p className="text-amber-300 mb-6 leading-relaxed max-w-md">
                Antik Vault buys, sells, and documents rare coins, banknotes, medals, and antiquities.
                Prices and availability are shared on inquiry.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-amber-400 shrink-0" aria-hidden="true" />
                  <span className="text-amber-300">{siteConfig.location}</span>
                </div>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-amber-300 hover:text-amber-50 transition-colors"
                >
                  <MessageCircle size={16} className="text-amber-400 shrink-0" aria-hidden="true" />
                  {siteConfig.whatsappDisplay} (WhatsApp)
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-3 text-amber-300 hover:text-amber-50 transition-colors break-all"
                >
                  <Mail size={16} className="text-amber-400 shrink-0" aria-hidden="true" />
                  {siteConfig.email}
                </a>
              </div>
            </div>

            {/* Link columns */}
            {linkColumns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3 className="text-lg font-bold text-amber-50 mb-6 pb-2 border-b border-amber-800">
                  {col.title}
                </h3>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-2 text-amber-300 hover:text-amber-50 transition-colors"
                      >
                        <CheckCircle
                          className="w-4 h-4 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-hidden="true"
                        />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-amber-950 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
            <p className="text-amber-400 text-sm">
              &copy; {year} {siteConfig.name}. All rights reserved. Based in {siteConfig.location}.
            </p>
            <p className="text-amber-500 text-xs">
              Discover. Collect. Preserve. Prices and availability on inquiry.
            </p>
          </div>
          <p className="text-amber-600 text-xs border-t border-amber-900 w-full pt-4">
            Developed and designed by{' '}
            <a
              href="https://khadka-manish.com.np"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-amber-500 hover:text-amber-300 transition-colors"
            >
              MNZ
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
