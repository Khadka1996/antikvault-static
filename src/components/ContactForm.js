'use client';

import { useState } from 'react';
import { siteConfig, mailtoUrl } from '@/config/site';

const initialState = { name: '', email: '', subject: '', message: '' };

export default function ContactForm() {
  const [formData, setFormData] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const body =
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n\n` +
      `Message:\n${formData.message}`;
    // Static site: hand off to the visitor's mail client.
    window.location.href = mailtoUrl({ subject: formData.subject, body });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className="card-gradient p-6 space-y-3"
        role="status"
        aria-live="polite"
      >
        <p className="text-amber-200 font-medium">Your email app should have opened.</p>
        <p className="text-amber-400 text-sm">
          If nothing happened, email us directly at{' '}
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-amber-300 underline hover:text-amber-100"
          >
            {siteConfig.email}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => {
            setFormData(initialState);
            setSubmitted(false);
          }}
          className="btn-secondary"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-amber-300 mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          autoComplete="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-amber-900/50 border border-amber-800/50 rounded-lg text-amber-100 placeholder-amber-500 focus:border-amber-500 focus:outline-none transition-colors"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-amber-300 mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-amber-900/50 border border-amber-800/50 rounded-lg text-amber-100 placeholder-amber-500 focus:border-amber-500 focus:outline-none transition-colors"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-amber-300 mb-2">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-amber-900/50 border border-amber-800/50 rounded-lg text-amber-100 placeholder-amber-500 focus:border-amber-500 focus:outline-none transition-colors"
          placeholder="How can we help?"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-amber-300 mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full px-4 py-3 bg-amber-900/50 border border-amber-800/50 rounded-lg text-amber-100 placeholder-amber-500 focus:border-amber-500 focus:outline-none transition-colors"
          placeholder="Tell us more..."
        />
      </div>

      <button type="submit" className="btn-primary w-full">
        Send Message
      </button>
      <p className="text-amber-500 text-xs">
        This opens your email app with the message pre-filled. Prefer to write directly? Email{' '}
        <a href={`mailto:${siteConfig.email}`} className="underline hover:text-amber-300">
          {siteConfig.email}
        </a>
        .
      </p>
    </form>
  );
}
