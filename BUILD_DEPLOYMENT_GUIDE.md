# Antik Vault Static Site — Build & Deployment Guide

## Build

```bash
npm install
npm run lint      # ESLint (flat config, next/core-web-vitals)
npm run build     # static export -> out/
```

- **Framework:** Next.js 16.1.1 (App Router) + React 19
- **Styling:** Tailwind CSS 4 (CSS-first — the amber palette lives in `src/app/globals.css` under `@theme`; there is no `tailwind.config.js`)
- **Icons:** `lucide-react`
- **Output:** fully static HTML in `out/` — no server or database required

### Pages generated

| Route | Notes |
| --- | --- |
| `/` | Hero, trending, featured items (rotates daily, client-seeded), trust section |
| `/collection` | Full 671-item catalog; category filter + search + pagination are client enhancements (page 1 is in the static HTML) |
| `/trending` | Curated subset |
| `/eras`, `/eras/[era]` | Hub + 6 dedicated static routes (ancient/medieval/gold-silver/world-coins/paper-money/vintage) |
| `/item/[id]` | 671 pages via `generateStaticParams`; `dynamicParams = false`; Product + BreadcrumbList JSON-LD |
| `/cart` | Client-side shortlist (localStorage), `noindex` |
| `/about`, `/contact` | Static; `/contact` form is a client island |
| `/sitemap.xml`, `/robots.txt` | Generated from the catalog |
| `/opengraph-image` | 1200×630 social image generated at build time, with the real logo embedded |
| `/icon.png`, `/apple-icon.png` | Favicon + iOS home-screen icon |
| `/404` | Custom not-found page |

---

## Configuration before launch

All contact / identity values are centralised in **`src/config/site.js`**:

```js
export const siteConfig = {
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://antikvault.com',
  email: 'info@antikvault.com',
  whatsappNumber: '9779823153502', // digits only, no '+', full intl format
  whatsappDisplay: '+977 98231 53502',
  ...
};
```

- [ ] Confirm `whatsappNumber`/`whatsappDisplay` are still correct.
- [ ] Confirm `email`.
- [ ] Set `NEXT_PUBLIC_APP_URL` in the deploy environment (drives canonical URLs, OG tags, sitemap).
- [ ] Set `NEXT_PUBLIC_GA_ID` if you want GA4 (optional — omit to skip it entirely).

### Colour theme

Edit the `@theme` block in `src/app/globals.css` (a single `--color-canvas` token,
amber-950-equivalent — most of the palette is Tailwind's built-in `amber-*` scale
used directly in class names, not custom tokens).

### Item images

Images are **generated, not manually added** — see "Catalog pipeline" in `README.md`.
Drop real photos into `../source-photos/` and run `npm run catalog:generate`; it
resizes, watermarks, and wires them into `catalog.json` automatically.

---

## Deployment

### Vercel (recommended)
Push to GitHub and import the repo — Next.js is auto-detected. Set `NEXT_PUBLIC_APP_URL`
in Project Settings → Environment Variables.

### Netlify
```bash
npm run build
npx netlify deploy --prod --dir=out
```

### Any static host (S3/CloudFront, nginx, cPanel, GitHub Pages)
Upload the contents of `out/`. Ensure `404.html` is served for unknown paths.

### Docker (static, via nginx)
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/out /usr/share/nginx/html
```

---

## CI

`.github/workflows/ci.yml` runs `npm ci`, `npm run lint`, and `npm run build` on every
push/PR and uploads `out/` as an artifact.

---

## Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| `@import must precede all rules` | Keep `@import "tailwindcss";` at the top of `globals.css`. |
| Route error: `dynamic = "force-static" not configured` under `output: export` | Metadata routes (`sitemap`, `robots`, `opengraph-image`) must export `export const dynamic = 'force-static'` — they already do. |
| Item pages 404 | `generateStaticParams()` must return every `id`; `dynamicParams = false` makes unknown ids 404 by design. |
| WhatsApp link does nothing | `whatsappNumber` must be digits only, full international format, no `+`. |
| Theme colours missing | `--color-canvas` must exist in `globals.css` `@theme` (not a JS config — v4 does not load one here). |
