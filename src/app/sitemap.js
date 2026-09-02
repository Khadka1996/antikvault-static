import catalogData from '@/data/catalog.json';
import { siteConfig } from '@/config/site';
import { eras } from '@/config/eras';

export const dynamic = 'force-static';

export default function sitemap() {
  const now = new Date();
  const base = siteConfig.url.replace(/\/$/, '');

  const staticRoutes = ['', '/collection', '/trending', '/eras', '/about', '/contact'].map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency:
      route === '' || route === '/collection' || route === '/trending' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.7,
  }));

  const eraRoutes = eras.map((era) => ({
    url: `${base}/eras/${era.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const itemRoutes = catalogData.items.map((item) => ({
    url: `${base}/item/${item.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...eraRoutes, ...itemRoutes];
}
