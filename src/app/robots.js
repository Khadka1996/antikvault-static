import { siteConfig } from '@/config/site';

export const dynamic = 'force-static';

export default function robots() {
  const base = siteConfig.url.replace(/\/$/, '');
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
