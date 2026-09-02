import fs from 'node:fs';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site';

export const dynamic = 'force-static';

export const alt = `${siteConfig.name} — Rare Coins, Banknotes & Antiquities`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Read + inline the real logo as a data URI at build time — ImageResponse
// (Satori) can't resolve a plain "/logo.png" app path, and a data URI keeps
// this self-contained with no runtime fetch dependency.
const logoDataUri = `data:image/png;base64,${fs
  .readFileSync(path.join(process.cwd(), 'public', 'logo.png'))
  .toString('base64')}`;

// Generated at build time, so the OG image URL Next derives for it is always
// the real production domain (metadataBase in layout.js) — never localhost.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#441A09',
          color: '#f5f0e6',
          fontFamily: 'Georgia, serif',
          padding: '64px',
          textAlign: 'center',
        }}
      >
        <img src={logoDataUri} width={140} height={140} alt="" style={{ marginBottom: 28 }} />
        <div style={{ fontSize: 40, letterSpacing: 8, color: '#c4b070', marginBottom: 24 }}>
          ANTIK VAULT
        </div>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>
          Where History Lives
        </div>
        <div style={{ fontSize: 32, color: '#ddd1aa', marginTop: 28 }}>
          Rare coins, banknotes, medals &amp; antiquities
        </div>
      </div>
    ),
    { ...size },
  );
}
