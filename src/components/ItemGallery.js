'use client';

import { useState } from 'react';
import Image from 'next/image';

// Simple obverse/reverse (or multi-photo) switcher for the item detail page.
// A thin client component so the server-rendered detail page can pass plain
// `images`/`name` data down without needing interactivity itself.
export default function ItemGallery({ images, name }) {
  const [active, setActive] = useState(0);

  if (!images || images.length === 0) return null;

  const labelFor = (i) =>
    images.length === 2 ? (i === 0 ? 'Obverse' : 'Reverse') : `Photo ${i + 1}`;

  return (
    <div>
      <div className="relative aspect-square bg-amber-900 border border-amber-800/50 rounded-xl overflow-hidden">
        <Image
          key={images[active]}
          src={images[active]}
          alt={`${name} — ${labelFor(active)}`}
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-contain"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 mt-4" role="tablist" aria-label={`${name} photos`}>
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show ${labelFor(i)}`}
              onClick={() => setActive(i)}
              className={`relative flex-1 aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                i === active
                  ? 'border-amber-500'
                  : 'border-amber-800/50 hover:border-amber-700'
              }`}
            >
              <Image src={src} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
