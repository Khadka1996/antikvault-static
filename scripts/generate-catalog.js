#!/usr/bin/env node
// Generates catalog.json from the real photos in public/coin album and public/Bank Note.
// Copies the source images into a clean public/items/<slug>/ tree (no spaces, stable names)
// and writes src/data/catalog.json. Run with: node gen-catalog.js

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
// Raw source photos live outside the project directory entirely — one level up, as a
// sibling of chronovault-static — so the ~1.3GB archive (a) never ships in the static
// export and (b) isn't watched by `next dev`'s file watcher (Turbopack watches every
// file under the project root, and a tree this size can blow past the OS inotify
// watch limit — see fs.inotify.max_user_watches).
const SOURCE_ROOT = path.resolve(ROOT, '..', 'source-photos');
const COIN_ALBUM = path.join(SOURCE_ROOT, 'coin album');
const BANK_NOTE = path.join(SOURCE_ROOT, 'Bank Note');
const SOUVENIR = path.join(SOURCE_ROOT, 'Souvenir');
const OUT_ITEMS_DIR = path.join(ROOT, 'public', 'items');
const OUT_CATALOG = path.join(ROOT, 'src', 'data', 'catalog.json');

const IMG_RE = /\.(jpe?g|png)$/i;

// ---- folder -> country display name, plus default era tags / material hints ----
const COUNTRY_MAP = {
  'Afganistan': { name: 'Afghanistan' },
  'Algeria': { name: 'Algeria' },
  'Australia': { name: 'Australia' },
  'Austria': { name: 'Austria' },
  'Bangladesh': { name: 'Bangladesh' },
  'Bhutan': { name: 'Bhutan' },
  'Brasil': { name: 'Brazil' },
  'British': { name: 'United Kingdom', extraTags: ['vintage'] },
  'Bulgaria': { name: 'Bulgaria', extraTags: ['vintage'] },
  'Cameroun': { name: 'Cameroon' },
  'Canada': { name: 'Canada' },
  'Central Africa': { name: 'Central African States' },
  'Chekoslovakia': { name: 'Czechoslovakia', extraTags: ['vintage'] },
  'China': { name: 'China', extraTags: ['vintage'] },
  'Cuba': { name: 'Cuba' },
  'Danmark': { name: 'Denmark', extraTags: ['vintage'] },
  'France': { name: 'France' },
  'Georgia': { name: 'Georgia' },
  'Germany': { name: 'Germany', extraTags: ['vintage'] },
  'Hongkong': { name: 'Hong Kong' },
  'Hungary': { name: 'Hungary', extraTags: ['vintage'] },
  'India': { name: 'India' },
  'Indonesia': { name: 'Indonesia' },
  'Israel': { name: 'Israel' },
  'Italy': { name: 'Italy', extraTags: ['vintage'] },
  'Japan': { name: 'Japan' },
  'Jordan': { name: 'Jordan' },
  'Kenya': { name: 'Kenya' },
  'Lebanon': { name: 'Lebanon' },
  'Malaysia': { name: 'Malaysia' },
  'Maldives': { name: 'Maldives' },
  'Mexico': { name: 'Mexico' },
  'Mongolia': { name: 'Mongolia', extraTags: ['vintage'] },
  'Nederland': { name: 'Netherlands', extraTags: ['vintage'] },
  'nepal': { name: 'Nepal', extraTags: ['vintage'] },
  'Nigeria': { name: 'Nigeria' },
  'Norway': { name: 'Norway', extraTags: ['vintage'] },
  'Pakistan': { name: 'Pakistan' },
  'Peru': { name: 'Peru' },
  'Philippines': { name: 'Philippines' },
  'Poland': { name: 'Poland', extraTags: ['vintage'] },
  'Romania': { name: 'Romania', extraTags: ['vintage'] },
  'Russia': { name: 'USSR (Soviet Union)', extraTags: ['vintage'] },
  'Singapore': { name: 'Singapore' },
  'Spain': { name: 'Spain' },
  'Srilanka': { name: 'Sri Lanka' },
  'Sweden': { name: 'Sweden', extraTags: ['vintage'] },
  'Switzerland': { name: 'Switzerland' },
  'Taiwan': { name: 'Taiwan' },
  'Thailand': { name: 'Thailand' },
  'UAE': { name: 'United Arab Emirates' },
  'Ukraine': { name: 'Ukraine' },
  'USA': { name: 'United States' },
  'Yugoslavia': { name: 'Yugoslavia (former)', extraTags: ['vintage'] },
};

// Folders to skip entirely (duplicates / unlabeled / too ambiguous to catalog safely)
const SKIP_DIRS = new Set(['Bank Note', 'platform', 'Coin Album 1']);

function titleCase(s) {
  return s
    .toLowerCase()
    .split(/\s+/)
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Extract a human denomination label from a baseKey like "Bangladesh 1T 1" or "USA 25C 10"
// or "Nepal Bir 10P N1". Returns { code, label } or null.
function parseDenomination(baseKeyNoCountry) {
  const tokens = baseKeyNoCountry.split(/\s+/).filter(Boolean);
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const m = t.match(/^(\d+)([A-Za-z]+)$/);
    if (m) return { code: t, value: m[1], unit: m[2] };
    if (/^half$/i.test(t) && tokens[i + 1]) {
      return { code: `half ${tokens[i + 1]}`, value: '½', unit: tokens[i + 1] };
    }
    const hm = t.match(/^half([A-Za-z]+)$/i);
    if (hm) return { code: t, value: '½', unit: hm[1] };
  }
  return null;
}

const UNIT_NAMES = {
  C: 'Cents', Sent: 'Sen', Sento: 'Sentimo', S: 'Sen', F: 'Francs', Fr: 'Francs',
  T: 'Taka', D: 'Dollars', M: 'Marks', L: 'Lira',
  K: 'Kopeks', Y: 'Yen', Peso: 'Pesos', peso: 'Pesos', Mongo: 'Möngö', Jhil: 'Jhil',
  RE: 'Öre', Ore: 'Öre', Heller: 'Heller', Filler: 'Filler', Forint: 'Forint',
  Fen: 'Fen', Fils: 'Fils', Dirham: 'Dirham', Kobo: 'Kobo', Livres: 'Livres',
  Plas: 'Piastres', plas: 'Piastres', Pias: 'Piastres', Dinara: 'Dinara',
  Centi: 'Centimes', Pul: 'Pul', Lari: 'Lari', Tetri: 'Tetri', Rand: 'Rand',
  B: 'Baht', Po: 'Pound', R: 'Rupees', // Rupees is the right default for most 'R' codes (South Asia); overridden below for Russia/USSR
  // 'P' is ambiguous across countries — no blanket default; set per-country below.
};
const UNIT_NAMES_LC = Object.fromEntries(Object.entries(UNIT_NAMES).map(([k, v]) => [k.toLowerCase(), v]));

function lookupUnit(unit) {
  return UNIT_NAMES[unit] || UNIT_NAMES_LC[unit.toLowerCase()] || unit;
}

function denomLabel(d, countryFolder, originName) {
  if (!d) return null;
  let unit = lookupUnit(d.unit);
  // A few country-specific overrides for ambiguous single-letter codes
  if (/^p$/i.test(d.unit)) {
    if (countryFolder === 'Germany') unit = 'Pfennig';
    else if (['India', 'nepal', 'Pakistan', 'Bangladesh'].includes(countryFolder)) unit = 'Paisa';
    else if (countryFolder === 'British') unit = 'Pence';
    else if (countryFolder === 'Philippines') unit = 'Piso';
  }
  if (/^r$/i.test(d.unit)) {
    if (/Russia|USSR/i.test(originName || '')) unit = 'Rubles';
  }
  if (/^k$/i.test(d.unit)) {
    if (['Danmark', 'Norway', 'Sweden'].includes(countryFolder)) unit = 'Kroner';
  }
  if (/^s$/i.test(d.unit)) {
    if (countryFolder === 'British') unit = 'Shillings';
    else if (countryFolder === 'Malaysia' || countryFolder === 'Singapore') unit = 'Sen';
  }
  unit = unit.length ? unit[0].toUpperCase() + unit.slice(1) : unit;
  // Singularize common pluralized units for a value of 1 (or ½)
  if ((d.value === '1' || d.value === '½') && /s$/.test(unit) && unit !== 'Pence') {
    unit = unit.slice(0, -1);
  }
  return `${d.value} ${unit}`;
}

const items = [];
const skippedLog = [];

function walk(dir, cb) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, cb);
    else cb(full);
  }
}

// ---------- 1. Coin album ----------
const topLevel = fs.readdirSync(COIN_ALBUM, { withFileTypes: true });
for (const entry of topLevel) {
  if (!entry.isDirectory()) {
    skippedLog.push(`loose file (no country folder): ${entry.name}`);
    continue;
  }
  if (SKIP_DIRS.has(entry.name)) {
    skippedLog.push(`skipped dir (duplicate/ambiguous): ${entry.name}`);
    continue;
  }
  const countryFolder = entry.name;
  const folderDir = path.join(COIN_ALBUM, countryFolder);

  // collect files recursively within this country folder (handles nepal/Pre subfolder)
  const files = [];
  walk(folderDir, (full) => {
    if (!IMG_RE.test(full)) return;
    const rel = path.relative(folderDir, full);
    const base = path.basename(full);
    // skip raw unlabeled camera dumps like 20260401_103122.jpg
    if (/^\d{8}_\d{6}\.jpe?g$/i.test(base)) {
      skippedLog.push(`skipped raw/unlabeled: ${path.join(countryFolder, rel)}`);
      return;
    }
    files.push({ full, rel, base });
  });

  // group by baseKey (filename minus extension minus last char) + side.
  // Two conventions appear in the archive:
  //   "<...> 1A" / "<...> 1B"   -> trailing letter A/B marks the side (primary)
  //   "<Country> A1" / "A2"     -> trailing digit 1/2 marks the side, letter marks the item (secondary)
  // The source filenames are inconsistently spaced/cased between a coin's two side
  // photos (e.g. "Lebanon 50plas 1A.jpg" / "Lebanon 50Plas 1B.jpg", or a stray double
  // space), so grouping is keyed on a whitespace-collapsed, lower-cased form, while the
  // first-seen file's original casing is kept as the canonical baseKey for parsing/labels.
  const groups = new Map(); // groupKey -> { A, B, baseKey }
  for (const f of files) {
    const rawStem = f.base.replace(/\.(jpe?g|png)$/i, '');
    const stem = rawStem.trim().replace(/\s+/g, ' ');
    const ext = path.extname(f.base).toLowerCase();
    const last = stem.slice(-1).toUpperCase();
    let baseKey, side;
    if (last === 'A' || last === 'B') {
      baseKey = stem.slice(0, -1).trim();
      side = last;
    } else if (/[A-Za-z][12]$/.test(stem)) {
      baseKey = stem.slice(0, -1).trim();
      side = stem.slice(-1) === '1' ? 'A' : 'B';
    } else {
      skippedLog.push(`no A/B side marker, skipped: ${path.join(countryFolder, f.rel)}`);
      continue;
    }
    const groupKey = baseKey.toLowerCase();
    if (!groups.has(groupKey)) groups.set(groupKey, { baseKey });
    const g = groups.get(groupKey);
    // prefer .jpg over .jpeg/.png if duplicate side already captured
    if (!g[side] || (g[side].ext !== '.jpg' && ext === '.jpg')) {
      g[side] = { full: f.full, ext };
    }
  }

  for (const { baseKey, A, B } of groups.values()) {
    const sides = { A, B };
    if (!sides.A && !sides.B) continue;

    // Determine origin: special-case "final Coin Album" (mixed countries in filenames)
    // and the "Russia" folder (branded USSR on the coin itself).
    let originName = (COUNTRY_MAP[countryFolder] || { name: titleCase(countryFolder) }).name;
    let extraTags = (COUNTRY_MAP[countryFolder] || {}).extraTags || [];
    let category = 'coins';
    let strippedKey = baseKey;

    if (countryFolder === 'final Coin Album') {
      if (/^Kiev Metro/i.test(baseKey)) {
        originName = 'Ukraine (Kyiv Metro)';
        category = 'tokens';
        strippedKey = baseKey.replace(/^Kiev Metro\s*/i, '');
      } else if (/^Moscow Metro/i.test(baseKey)) {
        originName = 'Russia (Moscow Metro)';
        category = 'tokens';
        strippedKey = baseKey.replace(/^Moscow Metro\s*/i, '');
      } else if (/^USSR/i.test(baseKey)) {
        originName = 'USSR (Soviet Union)';
        extraTags = ['vintage'];
        strippedKey = baseKey.replace(/^USSR\s*/i, '');
      } else if (/^Russia/i.test(baseKey)) {
        originName = 'Russia';
        strippedKey = baseKey.replace(/^Russia\s*/i, '');
      } else {
        strippedKey = baseKey;
      }
    } else if (countryFolder === 'Germany' && /^FRG\b/i.test(baseKey)) {
      originName = 'West Germany (FRG)';
      strippedKey = baseKey.replace(/^FRG\s*/i, '');
    } else if (countryFolder === 'Germany' && /^GDR\b/i.test(baseKey)) {
      originName = 'East Germany (GDR)';
      strippedKey = baseKey.replace(/^GDR\s*/i, '');
    } else {
      // strip the leading country-folder word(s) from baseKey to isolate the denom/variant part
      const folderWordRe = new RegExp('^' + countryFolder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*', 'i');
      strippedKey = baseKey.replace(folderWordRe, '');
    }

    const isSilver = /silver/i.test(baseKey);
    if (isSilver) extraTags = [...new Set([...extraTags, 'gold-silver'])];
    const isAkbar = /^Akbar/i.test(strippedKey) || /Akbar/i.test(baseKey);
    if (isAkbar) {
      extraTags = [...new Set([...extraTags, 'medieval'])];
    }
    if (/^East India/i.test(strippedKey)) {
      originName = 'British East India Company';
      extraTags = [...new Set([...extraTags, 'vintage'])];
    }
    let isTelephoneToken = false;
    if (/Telephone/i.test(strippedKey)) {
      isTelephoneToken = true;
      category = 'tokens';
    }

    const denom = parseDenomination(strippedKey);
    const label = denomLabel(denom, countryFolder, originName);
    const noun = category === 'tokens' ? 'Token' : 'Coin';

    const name = isTelephoneToken
      ? `${originName} Telephone Token`
      : isAkbar
        ? `${originName} — Mughal Empire (Akbar) ${noun}`
        : label
          ? `${originName} ${label} ${noun}`
          : `${originName} ${noun}`;
    const slug = slugify(`${countryFolder}-${baseKey}`);

    const tags = [...new Set(['world-coins', ...extraTags])];

    items.push({
      _slug: slug,
      name,
      category,
      origin: originName,
      material: isSilver ? 'Silver' : undefined,
      denomination: label || undefined,
      description: isAkbar
        ? 'A hand-photographed coin from the Mughal Empire, struck under Emperor Akbar — the oldest piece in our collection. Exact date, mint mark, and condition details are shared on inquiry.'
        : `A hand-photographed ${originName} ${category === 'tokens' ? 'token' : 'coin'}${label ? ` (${label})` : ''} from our collection. Exact date, mint mark, and condition details are shared on inquiry.`,
      tags,
      _sides: sides,
    });
  }
}

// ---------- 2. Bank Note folder ----------
const bankFiles = fs.readdirSync(BANK_NOTE).filter((f) => IMG_RE.test(f));
const COUNTRY_OVERRIDES = {
  'USSR': 'USSR (Soviet Union)',
  'UNITED ARAB EMIRATES': 'United Arab Emirates',
  'UNITED KINGDOM': 'United Kingdom',
  'UNITED STATES OF AMERICA': 'United States',
  'NORTH KOREA': 'North Korea',
  'SOUTH KOREA': 'South Korea',
  'SAUDI ARABIA': 'Saudi Arabia',
  'TRAVEL CHEQUE': 'Travel Cheque',
  'CZEKOSLOVAKIA': 'Czechoslovakia',
  'TRANSDNIESTRIAN': 'Transnistria',
  'BRASIL': 'Brazil',
  'HONGKONG': 'Hong Kong',
  'SRILANKA': 'Sri Lanka',
  'UKRAINA': 'Ukraine',
  'COMBODIA': 'Cambodia',
  'MADAGASKAR': 'Madagascar',
  'MALAYASIA': 'Malaysia',
  'KIRGISTAN': 'Kyrgyzstan',
  'VENEZUALA': 'Venezuela',
  'PHILLIPINES': 'Philippines',
  'MYANMAR': 'Myanmar',
  'YUGOSLAVIA': 'Yugoslavia (former)',
};
const VINTAGE_BANKNOTE_ORIGINS = new Set([
  'USSR (Soviet Union)', 'Czechoslovakia', 'Yugoslavia', 'North Korea', 'Transnistria',
]);

for (const file of bankFiles) {
  const stem = file.replace(/\.(jpe?g|png)$/i, '');
  const ext = path.extname(file).toLowerCase();
  const m = stem.match(/^(.*?)[\s]*(\d+)([A-Za-z$]{0,3})$/);
  let countryRaw, value, variant;
  if (m) {
    [, countryRaw, value, variant] = m;
  } else {
    countryRaw = stem;
    value = null;
    variant = '';
  }
  countryRaw = countryRaw.trim();
  const countryKey = countryRaw.toUpperCase();
  const originName = COUNTRY_OVERRIDES[countryKey] || titleCase(countryRaw);
  const isTravelCheque = originName === 'Travel Cheque';

  const denomLabelStr = value ? `${value}${variant && /^[A-Z]$/.test(variant) ? '' : ''}` : null;
  const denomDisplay = value ? `${value}` : null;

  const name = isTravelCheque
    ? `Travel Cheque${denomDisplay ? ` ($${denomDisplay})` : ''}`
    : `${originName}${denomDisplay ? ` ${denomDisplay}` : ''} Banknote${variant && /^[A-Z]$/.test(variant) ? ` (Variant ${variant})` : ''}`;

  const tags = ['paper-money'];
  if (VINTAGE_BANKNOTE_ORIGINS.has(originName)) tags.push('vintage');

  const slug = slugify(`banknote-${stem}`);

  items.push({
    _slug: slug,
    name,
    category: 'banknotes',
    origin: isTravelCheque ? 'International' : originName,
    denomination: denomDisplay || undefined,
    description: `A hand-photographed ${isTravelCheque ? 'travel cheque' : `${originName} banknote`}${denomDisplay ? ` (face value ${denomDisplay})` : ''} from our collection. Exact date, series, and condition details are shared on inquiry.`,
    tags,
    _sides: { A: { full: path.join(BANK_NOTE, file), ext } },
  });
}

// ---------- 3. Souvenir folder ----------
// Flat, single-image items (no obverse/reverse pairing, no country/denomination
// codes to parse) — just whatever's dropped in source-photos/Souvenir/, named
// generically since we don't have per-item details for these.
if (fs.existsSync(SOUVENIR)) {
  const souvenirFiles = fs.readdirSync(SOUVENIR).filter((f) => IMG_RE.test(f)).sort();
  souvenirFiles.forEach((file, i) => {
    const ext = path.extname(file).toLowerCase();
    const n = souvenirFiles.length > 1 ? ` ${i + 1}` : '';
    items.push({
      _slug: slugify(`souvenir-${path.basename(file, ext)}`),
      name: `Antik Vault Souvenir Frame${n}`,
      category: 'souvenirs',
      origin: 'Nepal',
      description:
        'A decorative, hand-carved-style Antik Vault souvenir keepsake from our collection. Details shared on inquiry.',
      tags: [],
      _sides: { A: { full: path.join(SOUVENIR, file), ext } },
    });
  });
}

// ---------- assign ids, resize+compress images, build final catalog ----------
const os = require('os');
const { execFileSync } = require('child_process');
const sharp = require(require.resolve('sharp', { paths: [ROOT] }));

const MAX_DIM = 1000; // long-edge px — plenty for a product photo, keeps files small
const JPEG_QUALITY = 78;
// keep in sync with siteConfig.name in src/config/site.js. All-caps for the coin
// watermark; script fonts (used on notes) only look handwritten in mixed case —
// their capitals-only rendering reads as plain block letters — so notes get "Antik Vault".
const WATERMARK_TEXT_COIN = 'ANTIK VAULT';
const WATERMARK_TEXT_NOTE = 'Antik Vault';

// The handwriting font used on banknote watermarks (Caveat, Google Fonts, OFL) is
// rendered via fontconfig, so it has to be installed where fontconfig can find it —
// SVG text can't embed a font file inline (librsvg ignores @font-face data: URIs).
// This installs it into the user's font directory once, idempotently, on any
// machine that runs this script.
function ensureHandwritingFontInstalled() {
  const src = path.join(ROOT, 'assets', 'fonts', 'Caveat-Bold.ttf');
  const destDir = path.join(os.homedir(), '.local', 'share', 'fonts');
  const dest = path.join(destDir, 'Caveat-Bold.ttf');
  if (fs.existsSync(dest)) return;
  if (!fs.existsSync(src)) {
    console.warn(`Handwriting font not found at ${src} — banknote watermarks will fall back to a serif italic.`);
    return;
  }
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(src, dest);
  try {
    execFileSync('fc-cache', ['-f', destDir], { stdio: 'ignore' });
  } catch {
    console.warn('fc-cache not available — install/refresh your font cache manually if the handwriting watermark looks wrong.');
  }
}

// Coins/tokens: bold sans-serif, white-on-dark-outline, tiled fairly large.
// Banknotes: small black handwriting-style script, a bit thicker (bold weight),
// tiled more densely — per request, notes get their own distinct look.
const COIN_WATERMARK_STYLE = {
  text: WATERMARK_TEXT_COIN,
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontWeight: 700,
  sizeRatio: 0.07,
  minFontSize: 16,
  fill: 'rgba(255,255,255,0.32)',
  stroke: 'rgba(0,0,0,0.22)',
  strokeWidth: 0.75,
  tileHRatio: 4.5,
  letterSpacing: 1,
};
const NOTE_WATERMARK_STYLE = {
  text: WATERMARK_TEXT_NOTE,
  fontFamily: "Caveat, 'DejaVu Serif', serif",
  fontWeight: 700,
  sizeRatio: 0.05,
  minFontSize: 14,
  fill: 'rgba(0,0,0,0.45)',
  stroke: 'rgba(0,0,0,0.45)', // stroke doubles up on the fill to read "a bit thicker"
  strokeWidth: 0.5,
  tileHRatio: 3,
  letterSpacing: 0,
};

// A diagonal, tiled text watermark baked directly into the pixels — not a CSS/DOM
// overlay — so it's still there in any right-click "Save Image" / screenshot /
// downloaded copy of the photo, not just when viewed on the site.
function buildWatermarkSvg(width, height, style) {
  const fontSize = Math.max(style.minFontSize, Math.round(Math.min(width, height) * style.sizeRatio));
  const tileW = fontSize * style.text.length * 0.62;
  const tileH = fontSize * style.tileHRatio;
  return `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="wm" width="${tileW}" height="${tileH}" patternUnits="userSpaceOnUse" patternTransform="rotate(-32)">
      <text x="0" y="${fontSize}" font-family="${style.fontFamily}" font-size="${fontSize}"
            font-weight="${style.fontWeight}" letter-spacing="${style.letterSpacing}" fill="${style.fill}"
            stroke="${style.stroke}" stroke-width="${style.strokeWidth}">${style.text}</text>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#wm)" />
</svg>`;
}

async function processImage(srcPath, destPath, category) {
  // 1. Resize + recompress into the destination file.
  await sharp(srcPath)
    .rotate() // respect EXIF orientation, then strip it
    .resize({ width: MAX_DIM, height: MAX_DIM, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toFile(destPath);

  // 2. Composite the watermark into the pixels themselves (a second pass, so the
  //    SVG overlay is sized to this image's actual, already-resized dimensions).
  const style = category === 'banknotes' ? NOTE_WATERMARK_STYLE : COIN_WATERMARK_STYLE;
  const { width, height } = await sharp(destPath).metadata();
  const watermarked = await sharp(destPath)
    .composite([{ input: Buffer.from(buildWatermarkSvg(width, height, style)), top: 0, left: 0 }])
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer();
  await fs.promises.writeFile(destPath, watermarked);
}

async function main() {
  ensureHandwritingFontInstalled();

  fs.rmSync(OUT_ITEMS_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_ITEMS_DIR, { recursive: true });

  const usedSlugs = new Map();
  let counter = 1;
  const finalItems = [];

  // Bounded concurrency so we don't spawn 1300+ sharp workers at once.
  const CONCURRENCY = 8;
  let cursor = 0;
  const queue = items.slice();

  async function worker() {
    while (cursor < queue.length) {
      const idx = cursor++;
      const it = queue[idx];

      let slug = it._slug || `item-${idx + 1}`;
      if (usedSlugs.has(slug)) {
        const n = usedSlugs.get(slug) + 1;
        usedSlugs.set(slug, n);
        slug = `${slug}-${n}`;
      } else {
        usedSlugs.set(slug, 1);
      }

      const itemDir = path.join(OUT_ITEMS_DIR, slug);
      fs.mkdirSync(itemDir, { recursive: true });

      const gallery = [];
      if (it._sides.A) {
        const destA = path.join(itemDir, 'a.jpg');
        await processImage(it._sides.A.full, destA, it.category);
        gallery.push(`/items/${slug}/a.jpg`);
      }
      if (it._sides.B) {
        const destB = path.join(itemDir, 'b.jpg');
        await processImage(it._sides.B.full, destB, it.category);
        gallery.push(`/items/${slug}/b.jpg`);
      }

      const { _slug, _sides, ...rest } = it;
      finalItems[idx] = {
        id: null, // assigned below, after stable sort by original order
        slug,
        ...rest,
        image: gallery[0],
        gallery,
        availability: 'available',
      };
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  // Assign sequential ids in original (deterministic) order.
  finalItems.forEach((it, i) => { it.id = String(i + 1); });

  const categories = [
    { id: 'coins', name: 'Coins', description: 'Rare and historical coins from around the world', icon: 'Coins' },
    { id: 'banknotes', name: 'Banknotes', description: 'Antique currency and historical banknotes', icon: 'Banknote' },
    { id: 'medals', name: 'Medals & Decorations', description: 'Military decorations and commemorative medals', icon: 'Medal' },
    { id: 'tokens', name: 'Tokens & Artifacts', description: 'Commemorative tokens and historical artifacts', icon: 'Gem' },
    { id: 'souvenirs', name: 'Souvenirs', description: 'Decorative keepsakes and gift pieces', icon: 'Gift' },
  ];

  fs.writeFileSync(OUT_CATALOG, JSON.stringify({ categories, items: finalItems }, null, 2) + '\n');

  console.log(`Total items generated: ${finalItems.length}`);
  const byCat = {};
  const byTag = {};
  for (const it of finalItems) {
    byCat[it.category] = (byCat[it.category] || 0) + 1;
    for (const t of it.tags) byTag[t] = (byTag[t] || 0) + 1;
  }
  console.log('By category:', byCat);
  console.log('By tag:', byTag);
  console.log(`Skipped entries: ${skippedLog.length}`);
  fs.writeFileSync(path.join(ROOT, '_gen_skipped.log'), skippedLog.join('\n'));
  console.log('Skipped log written to _gen_skipped.log (project root)');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
