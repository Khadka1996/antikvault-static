import Script from 'next/script';

// Renders nothing unless a real GA4 measurement ID is provided via
// NEXT_PUBLIC_GA_ID (e.g. in .env.production or the Vercel project's
// environment variables) — no placeholder/fake ID is ever hard-coded here.
// Static export bakes env vars in at build time, so changing this requires
// a rebuild+redeploy, same as any other NEXT_PUBLIC_* value in this project.
export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
