import React from 'react';
import { MapPin, Phone, MessageSquare, Clock, Shield } from 'lucide-react';
import { ShopConfig } from '../types';
import { formatWhatsAppUrl, getGeneralEnquiryMessage } from '../utils/whatsapp';

interface FooterProps {
  onSelectTab: (tab: string, meta?: { category?: string; gender?: 'Ladies' | 'Gents' }) => void;
  onOpenAdmin: () => void;
  shopConfig: ShopConfig;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenAdmin,
  shopConfig,
}) => {
  const whatsappUrl = formatWhatsAppUrl(shopConfig.whatsappNumber, getGeneralEnquiryMessage());

  return (
    <footer className="bg-[#1F1C18] text-[#EAE2D5] border-t border-[#332E27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Col 1: Brand & Craft Promise */}
          <div className="lg:col-span-4 space-y-4">
            <span className="font-editorial text-3xl font-bold tracking-tight text-white block">
              Sangeetha Tailors
            </span>
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-medium block">
              Bespoke Fashion Atelier · Bengaluru
            </span>
            <p className="text-xs sm:text-sm text-[#A89F91] leading-relaxed font-light">
              Specialists in fine Indian ethnic wear, bridal blouses with artisan hand zardozi, festive lehengas, and sharp gentleman’s bespoke suits and shirts. Crafted with generational precision in Domlur.
            </p>

            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] hover:bg-[#8C6D23] text-[#1F1C18] hover:text-white rounded-md text-xs font-semibold uppercase tracking-wider transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <h4 className="font-semibold uppercase tracking-wider text-white text-xs">
              Collections
            </h4>
            <ul className="space-y-2 text-[#A89F91]">
              <li>
                <button
                  onClick={() => onSelectTab('ladies')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Ladies Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('ladies', { category: 'Blouse Designs' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Blouse Back Designs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('ladies', { category: 'Lehenga Designs' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Bridal Lehengas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('gents')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Gents Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('gents', { category: 'Shirts' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Bespoke Shirts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('gents', { category: 'Traditional Wear' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Wedding Sherwanis
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Atelier Navigation */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <h4 className="font-semibold uppercase tracking-wider text-white text-xs">
              Explore Atelier
            </h4>
            <ul className="space-y-2 text-[#A89F91]">
              <li>
                <button
                  onClick={() => onSelectTab('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('gallery')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Design Gallery (100)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Our Craft
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact & Location
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-[#D4AF37] transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <Shield className="w-3 h-3" />
                  <span>Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Atelier Address & Timings */}
          <div className="lg:col-span-4 space-y-3 text-xs text-[#A89F91]">
            <h4 className="font-semibold uppercase tracking-wider text-white text-xs">
              Atelier Location
            </h4>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>
                {shopConfig.address}, {shopConfig.city} – {shopConfig.pincode}
                {shopConfig.landmark && ` (Landmark: ${shopConfig.landmark})`}
              </span>
            </div>

            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <a href={`tel:${shopConfig.phoneNumber}`} className="hover:text-white">
                {shopConfig.phoneNumber}
              </a>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>{shopConfig.businessHours}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[#332E27] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A8379] gap-4">
          <p>© {new Date().getFullYear()} Sangeetha Tailors. All rights reserved. Domlur, Bengaluru.</p>
          <div className="flex items-center gap-6">
            <span>Bespoke Handcraft</span>
            <span>·</span>
            <span>Zero Mass Production</span>
            <span>·</span>
            <button
              onClick={onOpenAdmin}
              className="text-[#8A8379] hover:text-[#D4AF37] transition-colors flex items-center gap-1"
            >
              <Shield className="w-3 h-3" />
              <span>Tailor Access</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
