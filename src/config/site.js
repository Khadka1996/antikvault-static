/**
 * Single source of truth for site-wide contact + identity values.
 */
export const siteConfig = {
  name: 'Antik Vault',
  shortName: 'Antik Vault',
  tagline: 'Where History Lives',
  description:
    'Antik Vault buys, sells, and documents rare coins, banknotes, medals, tokens, and antiquities from around the world. Prices and availability on inquiry.',

  // Public site URL. Overridable at build time with NEXT_PUBLIC_APP_URL.
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://antikvault.com',

  email: 'info@antikvault.com',

  // Digits only, full international format, NO leading "+" (wa.me requirement).
  whatsappNumber: '9779744959088',
  // Same number, formatted for display (footer, contact page, etc).
  whatsappDisplay: '+977 974-4959088',

  location: 'Kathmandu, Nepal',
  timezone: 'NPT (UTC+5:45)',
  hours: 'Monday – Friday, 10 AM – 6 PM (NPT)',
};

/** Build a wa.me link with an optional pre-filled message. */
export function whatsappUrl(message) {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Build a mailto: link with optional subject/body. */
export function mailtoUrl({ subject, body } = {}) {
  const params = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${siteConfig.email}${params.length ? `?${params.join('&')}` : ''}`;
}
