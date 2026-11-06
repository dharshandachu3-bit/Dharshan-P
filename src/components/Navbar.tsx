import React, { useState } from 'react';
import { Search, MessageSquare, Menu, X, Shield, Phone, Sparkles } from 'lucide-react';
import { formatWhatsAppUrl, getGeneralEnquiryMessage } from '../utils/whatsapp';
import { ShopConfig } from '../types';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string, meta?: { category?: string; gender?: 'Ladies' | 'Gents' }) => void;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
  shopConfig: ShopConfig;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSearch,
  onOpenAdmin,
  shopConfig,
  isAdminLoggedIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'ladies', label: 'Ladies Collection' },
    { id: 'gents', label: 'Gents Collection' },
    { id: 'gallery', label: 'Design Gallery' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappUrl = formatWhatsAppUrl(shopConfig.whatsappNumber, getGeneralEnquiryMessage());

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#EAE2D5] transition-all">
      {/* Top micro banner */}
      <div className="bg-[#1F1C18] text-[#F4EAD4] text-xs py-1.5 px-4 text-center tracking-wider">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="hidden sm:inline">BDA Colony, Domlur, Bengaluru · Custom Fitting & Bridal Couture</span>
          <span className="sm:hidden mx-auto font-medium">Bespoke Tailoring in Domlur, Bengaluru</span>
          <a
            href={`tel:${shopConfig.phoneNumber}`}
            className="hidden sm:flex items-center gap-1.5 text-[#D4AF37] hover:underline"
          >
            <Phone className="w-3 h-3" />
            <span>{shopConfig.phoneNumber}</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex flex-col text-left group cursor-pointer shrink-0"
          >
            <span className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[#1F1C18] group-hover:text-[#8C6D23] transition-colors">
              Sangeetha Tailors
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C6D23] -mt-1 font-medium">
              Bespoke Fashion Atelier
            </span>
          </button>

          {/* Zone 2: Clean 5-6 Single-line Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#4A453E]">
            {navItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? 'text-[#1F1C18] font-semibold'
                      : 'hover:text-[#1F1C18]'
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D4AF37] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions - Search, WhatsApp CTA, Admin */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 text-[#4A453E] hover:text-[#1F1C18] hover:bg-[#F4EFE6] rounded-full transition-colors cursor-pointer"
              title="Search catalog (Ctrl + K)"
              aria-label="Search designs"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Admin entry button */}
            <button
              onClick={onOpenAdmin}
              className={`p-2.5 rounded-full transition-colors cursor-pointer ${
                isAdminLoggedIn
                  ? 'bg-[#1F1C18] text-[#D4AF37]'
                  : 'text-[#6B655D] hover:text-[#1F1C18] hover:bg-[#F4EFE6]'
              }`}
              title={isAdminLoggedIn ? 'Admin Dashboard (Active)' : 'Admin Portal'}
              aria-label="Admin Portal"
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* Primary Action Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide uppercase text-white bg-[#1F1C18] hover:bg-[#8C6D23] rounded-md transition-all shadow-sm hover:shadow whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
              <span>WhatsApp Enquiry</span>
            </a>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#1F1C18] hover:bg-[#F4EFE6] rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FBF9F5] border-b border-[#EAE2D5] px-6 py-6 shadow-xl animate-fadeIn">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left text-base py-2.5 px-3 rounded-lg transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#F4EFE6] text-[#1F1C18] font-semibold'
                      : 'text-[#4A453E] hover:bg-[#F4EFE6]/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            <div className="pt-4 border-t border-[#EAE2D5] flex flex-col gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 bg-[#1F1C18] text-white rounded-lg text-sm font-semibold uppercase tracking-wider text-center"
              >
                <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                <span>Chat on WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 py-2 px-3 text-xs text-[#6B655D] hover:text-[#1F1C18]"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{isAdminLoggedIn ? 'Open Admin Dashboard' : 'Tailor / Admin Login'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
