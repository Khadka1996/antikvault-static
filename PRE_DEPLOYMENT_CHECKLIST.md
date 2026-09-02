# Pre-Deployment Checklist

## 1. Contact / identity — single file

Edit **`src/config/site.js`**:

- [ ] `whatsappNumber`/`whatsappDisplay` — confirm still correct (currently
      `+977 98231 53502`). Used by the footer, top bar, contact page, cart, and every
      item page.
- [ ] `email` — verified inbox.
- [ ] `url` — production URL, or set `NEXT_PUBLIC_APP_URL` in the deploy environment.
- [ ] `location`, `hours`, `timezone` — confirm.

Verify nothing is still hard-coded:

```bash
grep -rn "wa.me\|antikvault.com" src/ | grep -v "src/config/site.js"
```

## 2. Item images

Generated, not manual — see "Catalog pipeline" in `README.md`. All 671 items already
have real, watermarked photos; add more by dropping files into `../source-photos/`
and running `npm run catalog:generate`.

## 3. Catalog content

- [ ] `description` / `historicalContext` reviewed for accuracy.
- [ ] `certificate` text is generic ("… provided on inquiry"). Only reinstate a named
      grading authority (PCGS, a numismatic society, a museum) if it is genuinely true —
      publishing false authentication claims is a liability.

## 4. Build & test

```bash
npm run lint
npm run build
npx serve out        # or any static server; visit the printed URL
```

- [ ] All pages load; nav + footer links work.
- [ ] `/collection` shows all 671 items, paginated; category buttons filter; `?cat=coins`/`?q=` deep links work (including clicking between them without leaving the page).
- [ ] Item pages: specs, historical context, WhatsApp + email CTAs.
- [ ] Contact form opens the mail client and shows the confirmation panel.
- [ ] Keyboard: visible focus ring everywhere; mobile menu opens/closes with `Enter`/`Escape`.
- [ ] Mobile layout from 320px; `sm`/`md`/`lg` breakpoints behave.
- [ ] Unknown URL → custom 404.
- [ ] `view-source` on `/` shows real content (not an empty shell) and unique `<title>` per page.
- [ ] `/sitemap.xml`, `/robots.txt`, `/opengraph-image` all resolve.

## 5. Domain & hosting

- [ ] Domain DNS pointed at the host.
- [ ] HTTPS / SSL active.
- [ ] `NEXT_PUBLIC_APP_URL` set to the final HTTPS URL, then rebuild.
- [ ] Submit `sitemap.xml` to Google Search Console.

## 6. Analytics

Vercel Analytics + Speed Insights are already wired in (`src/app/layout.js`) — no
action needed, they work automatically once deployed on Vercel. GA4 is optional: set
`NEXT_PUBLIC_GA_ID` to enable it (`src/components/GoogleAnalytics.js`); leave it unset
to skip it entirely. Add a privacy notice if you enable GA4.
