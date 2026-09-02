import { Poppins } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import Header from '@/components/Header';
import TopInfoBar from '@/components/TopInfoBar';
import Footer from '@/components/Footer';
import { siteConfig } from '@/config/site';
import { CartProvider } from '@/context/CartContext';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'antik vault',
    'coins',
    'banknotes',
    'antiquities',
    'numismatic',
    'buy rare coins',
    'sell rare coins',
    'Kathmandu',
    'Nepal',
    'rare coins',
    'historical artifacts',
  ],
  authors: [{ name: siteConfig.name }],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description:
      'Preserving History, One Coin at a Time. Discover. Collect. Preserve. Own a piece of history.',
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: 'Discover rare coins, banknotes, medals, and antiquities',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.url,
  email: siteConfig.email,
  description: siteConfig.description,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kathmandu',
    addressCountry: 'NP',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    telephone: `+${siteConfig.whatsappNumber}`,
    email: siteConfig.email,
    areaServed: 'NP',
    availableLanguage: ['English', 'Nepali'],
  },
};

// The collection page genuinely filters by ?q= client-side, so this action
// resolves to a real, working results page — not a placeholder.
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  url: siteConfig.url,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteConfig.url}/collection?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      {/* suppressHydrationWarning: some browser extensions (e.g. ColorZilla) inject
          attributes like cz-shortcut-listen onto <body> before React hydrates —
          that's a false-positive mismatch, not anything this app renders differently. */}
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <CartProvider>
          <a href="#main" className="skip-link">
            Skip to main content
          </a>
          <TopInfoBar />
          <Header />
          <main id="main" className="min-h-screen">
            {children}
          </main>
          <Footer />
        </CartProvider>
        <GoogleAnalytics />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
