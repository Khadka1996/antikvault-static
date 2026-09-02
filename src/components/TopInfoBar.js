import { BadgeCheck, Mail, Phone } from 'lucide-react';
import { siteConfig } from '@/config/site';

export default function TopInfoBar() {
  return (
    <div className="border-b border-[#9a664b]/60 bg-[#8E3B1D] text-[#f5e7d3]">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-3 px-4 py-1.5 text-sm md:px-6">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#f7ead0] sm:gap-2 sm:text-[12px] md:text-[13px]">
          <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-[#f0c777]" aria-hidden="true" />
          <span className="whitespace-nowrap">Authentic Collector</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] md:gap-6 md:text-[12px]">
          <a
            href={`mailto:${siteConfig.email}`}
            className="hidden items-center gap-2 transition-colors hover:text-[#f0c777] sm:flex"
          >
            <Mail size={12} aria-hidden="true" />
            <span>{siteConfig.email}</span>
          </a>
          <a
            href={`tel:+${siteConfig.whatsappNumber}`}
            className="flex items-center gap-1.5 transition-colors hover:text-[#f0c777] sm:gap-2"
          >
            <Phone size={12} className="shrink-0" aria-hidden="true" />
            <span className="whitespace-nowrap">{siteConfig.whatsappDisplay}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
