import { Mail, MapPin, MessageCircle, Clock } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import { siteConfig, whatsappUrl } from '@/config/site';

export const metadata = {
  title: 'Contact',
  description:
    'Questions about our collection or interested in an item? Get in touch with Antik Vault by email or WhatsApp.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="space-y-6 max-w-3xl">
          <h1 className="heading-xl text-5xl md:text-6xl">Get In Touch</h1>
          <p className="text-xl text-amber-300">
            Have questions about our collection? Interested in an item? We&apos;d love to hear from
            you.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
          <div className="card-gradient p-8 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-amber-800/50 flex items-center justify-center">
              <MapPin size={24} className="text-amber-400" aria-hidden="true" />
            </div>
            <h2 className="font-semibold text-amber-200 text-lg">Location</h2>
            <p className="text-amber-400">{siteConfig.location}</p>
            <p className="text-amber-500 text-sm">
              Preserving history from the heart of the Himalayas
            </p>
          </div>

          <div className="card-gradient p-8 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-amber-800/50 flex items-center justify-center">
              <Mail size={24} className="text-amber-400" aria-hidden="true" />
            </div>
            <h2 className="font-semibold text-amber-200 text-lg">Email</h2>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-amber-300 hover:text-amber-100 transition-colors break-all"
            >
              {siteConfig.email}
            </a>
            <p className="text-amber-500 text-sm">
              Reach out anytime with questions or inquiries
            </p>
          </div>

          <div className="card-gradient p-8 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-amber-800/50 flex items-center justify-center">
              <MessageCircle size={24} className="text-amber-400" aria-hidden="true" />
            </div>
            <h2 className="font-semibold text-amber-200 text-lg">WhatsApp</h2>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:text-amber-100 transition-colors"
            >
              Direct Message
            </a>
            <p className="text-amber-500 text-sm">Quick inquiries and item information</p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="heading-md mb-8">Send us a Message</h2>
            <ContactForm />
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="heading-md mb-4">Response Time</h2>
              <div className="card-gradient p-6 flex gap-4">
                <Clock size={24} className="text-amber-400 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-amber-300 mb-2">
                    We typically respond to inquiries within 24&ndash;48 hours during business hours.
                  </p>
                  <p className="text-amber-500 text-sm">
                    For urgent matters, please reach out via WhatsApp.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="heading-md mb-4">What We Can Help With</h2>
              <ul className="space-y-3">
                {[
                  'Item information and historical context',
                  'Collection inquiries and details',
                  'Research and numismatic consultation',
                  'General questions about Antik Vault',
                ].map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="text-amber-400 font-bold" aria-hidden="true">
                      &bull;
                    </span>
                    <span className="text-amber-300">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-900/50 border border-amber-800/50 rounded-lg p-6">
              <h2 className="font-semibold text-amber-200 mb-3">Availability</h2>
              <p className="text-amber-400 text-sm mb-3">{siteConfig.hours}</p>
              <p className="text-amber-500 text-xs">
                We&apos;re based in {siteConfig.location} ({siteConfig.timezone})
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
