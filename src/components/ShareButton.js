'use client';

import { useEffect, useRef, useState } from 'react';
import { Share2, Facebook, Twitter, Instagram, Check, Link2 } from 'lucide-react';

// A brand-accurate WhatsApp glyph — lucide-react doesn't ship one. `size` is
// mapped to width/height explicitly: plain <svg> has no such attribute, so
// passing size={n} straight through via {...props} (like lucide icons accept)
// would silently no-op and the SVG would render at its unconstrained default.
function WhatsAppIcon({ size = 24, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.76.46 3.48 1.34 5L2 22l5.18-1.36c1.46.8 3.1 1.22 4.86 1.22 5.52 0 10-4.48 10-10s-4.48-10-10-10zm0 18.15c-1.54 0-3.05-.41-4.37-1.2l-.31-.18-3.07.8.82-3-.2-.32a8.1 8.1 0 0 1-1.24-4.29c0-4.5 3.66-8.15 8.17-8.15 4.5 0 8.15 3.66 8.15 8.15 0 4.5-3.66 8.19-8.15 8.19zm4.47-6.12c-.24-.12-1.45-.71-1.68-.8-.22-.08-.39-.12-.55.13-.16.24-.63.8-.78.96-.14.16-.29.18-.53.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.44-1.35-1.68-.14-.24-.02-.37.11-.5.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.42-.55-.42-.14 0-.31-.02-.47-.02-.16 0-.43.06-.65.31-.22.24-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.16 1.73 2.65 4.2 3.71.59.25 1.05.4 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.45-.59 1.66-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z" />
    </svg>
  );
}

export default function ShareButton({ url, title }) {
  const [open, setOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [open]);

  const shareText = `${title} — ${url}`;

  async function copyLink(id) {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 2000);
    } catch {
      // clipboard API unavailable — nothing more we can do here
    }
  }

  const shareTargets = [
    {
      id: 'facebook',
      label: 'Facebook',
      Icon: Facebook,
      iconSize: 18,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      id: 'x',
      label: 'X (Twitter)',
      Icon: Twitter,
      iconSize: 14,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      Icon: WhatsAppIcon,
      iconSize: 14,
      href: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
    },
    // Instagram has no web share-URL intent, so this copies the link (same
    // action as "Copy Link" below) — kept as its own row since that's where
    // people look for it, with feedback that says what it actually does.
    {
      id: 'instagram',
      label: 'Instagram',
      Icon: Instagram,
      iconSize: 18,
      onClick: () => copyLink('instagram'),
    },
    {
      id: 'copy',
      label: 'Copy Link',
      Icon: Link2,
      iconSize: 18,
      onClick: () => copyLink('copy'),
    },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="btn-secondary gap-2 w-full"
      >
        <Share2 size={20} aria-hidden="true" />
        Share
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Share this piece"
          className="absolute z-20 bottom-full mb-2 left-0 right-0 sm:left-auto sm:right-0 sm:w-64 bg-amber-900 border border-amber-700/50 rounded-lg shadow-xl p-2 space-y-1"
        >
          {shareTargets.map(({ id, label, Icon, iconSize, href, onClick }) => {
            const isCopied = copiedId === id;
            const content = (
              <>
                {isCopied ? (
                  <Check size={iconSize} className="text-emerald-400" aria-hidden="true" />
                ) : (
                  <Icon size={iconSize} aria-hidden="true" />
                )}
                {isCopied ? 'Copied!' : label}
              </>
            );
            const className =
              'flex items-center gap-3 px-3 py-2 rounded-md text-amber-200 hover:bg-amber-800/60 hover:text-amber-50 transition-colors';

            return href ? (
              <a
                key={id}
                role="menuitem"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className={className}
              >
                {content}
              </a>
            ) : (
              <button key={id} type="button" role="menuitem" onClick={onClick} className={`w-full ${className}`}>
                {content}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
