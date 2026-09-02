'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { eras } from '@/config/eras';
import { siteConfig } from '@/config/site';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/collection', label: 'Collections' },
  { href: '/collection?cat=coins', label: 'Coins' },
  { href: '/collection?cat=banknotes', label: 'Banknotes' },
  { href: '/collection?cat=tokens', label: 'Artifacts' },
  { href: '/trending', label: 'Trending' },
  { href: '/eras', label: 'Shop by Era' },
  { href: '/about', label: 'About' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { count } = useCart();

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMenuOpen]);

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href.split('?')[0]);

  return (
    <header className="sticky top-0 z-50 border-b border-[#7d4830]/50 bg-[#823F23] shadow-[0_8px_18px_rgba(0,0,0,0.18)]" style={{ backgroundColor: '#823F23' }}>
      <div className="mx-auto max-w-[1320px] px-4 md:px-6">
        <nav className="flex min-h-[78px] items-center justify-between py-2 md:py-3">
          <Link href="/" className="flex items-center gap-3" aria-label="Antik Vault home">
            <Image
              src="/logo.png"
              alt="Antik Vault"
              width={44}
              height={44}
              className="h-10 w-10 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.18)] md:h-11 md:w-11"
              priority
            />
            <div>
              <div className="bg-gradient-to-r from-[#f5dca1] via-[#d5d6db] to-[#f0c777] bg-clip-text text-[1.6rem] font-black tracking-tight text-transparent leading-none md:text-[1.9rem]">
                Antik Vault
              </div>
              <div className="mt-1 text-[8px] uppercase tracking-[0.22em] text-[#d9b17a] md:text-[9px]">
                Timeless Treasures
              </div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`text-[15px] font-medium transition-colors ${
                  isActive(link.href) ? 'text-[#f5e7d3]' : 'text-[#f1d3ad] hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/cart"
              aria-label={`Shopping cart${count > 0 ? ` (${count} item${count !== 1 ? 's' : ''})` : ''}`}
              className="relative flex h-11 w-11 items-center justify-center text-[#f0c777] transition-transform hover:scale-[1.03] hover:text-[#fff1c6]"
            >
              <ShoppingCart size={22} strokeWidth={2.2} />
              {count > 0 && (
                <span
                  className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-amber-950"
                  aria-hidden="true"
                >
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0c777] text-[#3b251e] shadow-[0_4px_12px_rgba(0,0,0,0.18)] lg:hidden"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
          >
            {isMenuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </nav>
      </div>

      <div className="hidden md:block -mt-px border-t border-[#9a664b]/40 bg-[#823F23]">
        <div className="mx-auto flex max-w-[1320px] items-center justify-center gap-8 px-4 py-2.5 text-[13px] font-medium text-[#f0c777]">
          {eras.map((era) => (
            <Link
              key={era.id}
              href={`/eras/${era.id}`}
              className="transition-colors hover:text-[#fff6dd]"
            >
              {era.name}
            </Link>
          ))}
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#2f1b15]/70 backdrop-blur-sm lg:hidden" onClick={() => setIsMenuOpen(false)}>
          <aside
            id="mobile-nav"
            className="ml-auto h-full w-[78%] max-w-sm bg-[#823F23] p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between border-b border-[#af7754]/50 pb-4">
              <div className="flex items-center gap-3">
                <Image src="/logo.png" alt="Antik Vault" width={36} height={36} className="h-9 w-9 rounded-full" />
                <div>
                  <div className="text-xl font-black bg-gradient-to-r from-[#f5dca1] via-[#d5d6db] to-[#f0c777] bg-clip-text text-transparent">
                    Antik Vault
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#d9b17a]">Treasures</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0c777] text-[#3b251e]"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={`rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-[#f0c777] text-[#3b251e]'
                      : 'text-[#f5e7d3] hover:bg-[#713f28]'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/cart"
                aria-current={isActive('/cart') ? 'page' : undefined}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                  isActive('/cart')
                    ? 'bg-[#f0c777] text-[#3b251e]'
                    : 'text-[#f5e7d3] hover:bg-[#713f28]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <ShoppingCart size={18} aria-hidden="true" />
                  Cart
                </span>
                {count > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-600 px-1.5 text-xs font-bold text-white">
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </Link>
            </nav>

            <div className="mt-6 border-t border-[#af7754]/50 pt-4 text-[#f5e7d3]">
              <div className="mb-2 text-sm uppercase tracking-[0.2em] text-[#d9b17a]">Contact</div>
              <p className="mb-2">{siteConfig.email}</p>
              <p>{siteConfig.whatsappDisplay}</p>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
