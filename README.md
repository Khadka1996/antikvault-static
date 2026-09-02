# Antik Vault

A fully static Next.js catalog site for Antik Vault, a numismatic and antiquities
business based in Kathmandu, Nepal — antique coins, banknotes, tokens, and souvenirs,
with real hand-photographed pieces, watermarked, from a private collection.

**Brand:** Antik Vault — "Where History Lives"
**Positioning:** a digital archive/catalog, not a checkout store — prices are never
shown; every inquiry path goes through WhatsApp or email.

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS 4, CSS-first config (`@theme` in `src/app/globals.css` —
  there is intentionally no `tailwind.config.js`)
- **Icons:** `lucide-react`
- **Images:** processed with `sharp` (resize + watermark) at catalog-generation time
- **Deployment:** fully static export (`output: 'export'`) — no server or database
  at runtime
- **Analytics:** `@vercel/analytics` + `@vercel/speed-insights`, plus an optional
  GA4 hook gated on an env var

## Features

- **671-item real catalog** — coins, banknotes, tokens, and souvenirs, generated from
  a private photo archive (see "Catalog pipeline" below), each with two real photos
  (obverse/reverse) where applicable
- **Watermarking baked into the image files themselves** (not a CSS overlay) — coins
  get a bold diagonal mark, banknotes get a smaller handwritten-style one — so it
  survives any download of the photo, not just on-page viewing
- **Category browsing** (`/collection`, filterable, paginated) and **6 dedicated era
  pages** (`/eras/ancient`, `/medieval`, `/gold-silver`, `/world-coins`, `/paper-money`,
  `/vintage`) as real static routes, not query-param views
- **Live search** — matches coin/banknote name or country of origin, from the homepage
  search bar or `/collection?q=`
- **Cart** — a shortlist tool (not checkout, since prices aren't shown), persisted in
  `localStorage`, that batches a WhatsApp inquiry message for everything in it
- **Share** — per-item share menu (Facebook, X, WhatsApp, Instagram/Copy Link) with
  correct Open Graph/Twitter image + title per item, so shared links preview the
  actual coin photo and name
- **SEO**: unique metadata per route, JSON-LD (`Organization` w/ `ContactPoint`,
  `WebSite` w/ `SearchAction`, `Product` + `BreadcrumbList` on item pages,
  `BreadcrumbList` + `ItemList` on era pages), `sitemap.xml`/`robots.txt` generated
  from the catalog, a build-time Open Graph image with the real logo embedded, a
  dedicated homepage share image (`public/share.jpg`)
- **No commerce flow** — every CTA is "Inquire via WhatsApp" / email, never "Buy"

## Catalog pipeline

The catalog is **generated, not hand-written**. Real source photos live in
`../source-photos/` (a sibling directory, *outside* this project — both so the ~1.3GB
raw archive never ships in the static export, and so `next dev`'s file watcher isn't
stuck tracking it):

```
source-photos/
├── coin album/<Country>/*.jpg      # coin photos, paired front/back
├── Bank Note/*.jpg                 # banknote photos, one per note
└── Souvenir/*.{jpg,png}            # single-image souvenir items
```

```bash
npm run catalog:generate
```

`scripts/generate-catalog.js` walks that tree, pairs each coin's two photos, parses
country/denomination from the filenames, resizes + watermarks every image with
`sharp`, writes the resized copies to `public/items/<slug>/{a,b}.jpg`, and writes
`src/data/catalog.json`. It also installs the handwriting font used for the banknote
watermark (`assets/fonts/Caveat-Bold.ttf`, OFL-licensed) into the local fontconfig
directory the first time it runs, since SVG text rendering resolves fonts by family
name, not by file path.

Add more photos to `source-photos/` (following the same naming convention) and rerun
the command to add them to the site — no manual catalog editing needed.

## Setup

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint      # ESLint (flat config, next/core-web-vitals)
npm run build     # static export -> out/
```

### Environment Variables

See `.env.example`. All optional — the app has sane defaults and simply omits a
feature if its variable is unset:

```env
NEXT_PUBLIC_APP_URL=https://antikvault.com   # canonical URLs, sitemap, OG tags
NEXT_PUBLIC_GA_ID=                           # GA4 measurement ID; blank = no GA4
```

This is a static export, so env vars are baked in at **build time** — changing one
needs a rebuild + redeploy, not just a restart.

## Deployment

Static export — deploy the contents of `out/` (produced by `npm run build`) to any
static host, or connect the repo to Vercel (auto-detected, recommended). GitHub
Actions (`.github/workflows/ci.yml`) runs lint + build on every push/PR.

## Contact / identity

Centralised in `src/config/site.js` — name, email, WhatsApp number (used to build
`wa.me` links and `tel:` links, and shown in the footer/top bar/contact page), and
the production URL. Change it there once; every page picks it up.

## File Structure

```
├── src/
│   ├── app/                        # routes (App Router)
│   │   ├── page.js                 # Home
│   │   ├── layout.js               # Root layout, metadata, Organization/WebSite JSON-LD
│   │   ├── collection/page.js      # Full catalog (filter + search + pagination)
│   │   ├── trending/page.js
│   │   ├── eras/page.js            # Era hub
│   │   ├── eras/[era]/page.js      # One static route per era
│   │   ├── item/[id]/page.js       # Item detail (SSG, Product JSON-LD)
│   │   ├── cart/page.js
│   │   ├── about/page.js, contact/page.js
│   │   ├── sitemap.js, robots.js
│   │   ├── opengraph-image.js      # Build-time social image (site-wide fallback)
│   │   ├── icon.png, apple-icon.png
│   │   └── not-found.js
│   ├── components/                 # Header, Footer, ItemCard, CollectionBrowser,
│   │                                # CartPageClient, ShareButton, PaginatedGrid, ...
│   ├── context/CartContext.js
│   ├── config/site.js, eras.js     # Single sources of truth
│   └── data/catalog.json           # Generated — do not hand-edit, see Catalog pipeline
├── scripts/generate-catalog.js
├── assets/fonts/                   # Font used by the generator (banknote watermark)
├── public/items/                   # Generated — resized, watermarked photos
└── .github/workflows/ci.yml
```

> Tailwind v4 is CSS-first: design tokens live in `globals.css`'s `@theme` block.

## Notes

- **No pricing shown anywhere**, by design — every CTA is WhatsApp/email inquiry.
- **`public/items/` and `src/data/catalog.json` are generated** — edit
  `scripts/generate-catalog.js` or add source photos, don't hand-edit the JSON.
- **Mobile-first responsive**, from ~320px width.
