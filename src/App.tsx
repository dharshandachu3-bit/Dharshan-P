import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryShowcase } from './components/CategoryShowcase';
import { FeaturedDesigns } from './components/FeaturedDesigns';
import { LadiesCollectionPage } from './components/LadiesCollectionPage';
import { GentsCollectionPage } from './components/GentsCollectionPage';
import { DesignGallery } from './components/DesignGallery';
import { DesignDetailModal } from './components/DesignDetailModal';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { SearchModal } from './components/SearchModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { Design, FilterState, ShopConfig } from './types';
import { getDesignsList, getShopConfig, DEFAULT_CONFIG } from './firebase/services';
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { MessageSquare, Sparkles } from 'lucide-react';
import { formatWhatsAppUrl, getGeneralEnquiryMessage } from './utils/whatsapp';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [shopConfig, setShopConfig] = useState<ShopConfig>(DEFAULT_CONFIG);

  // Gallery initial filter state when navigated from category links
  const [galleryInitialFilter, setGalleryInitialFilter] = useState<Partial<FilterState>>({
    gender: 'All',
    category: 'All',
    subcategory: 'All',
  });

  // Load designs and shop configuration on boot
  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      try {
        const [designsData, configData] = await Promise.all([
          getDesignsList(),
          getShopConfig(),
        ]);
        setDesigns(designsData);
        setShopConfig(configData);
      } catch (err) {
        console.error('Error loading initial data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Listen to auth changes for admin badge
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsAdminLoggedIn(!!user);
    });
    return () => unsub();
  }, []);

  const handleRefreshDesigns = async () => {
    const fresh = await getDesignsList();
    setDesigns(fresh);
  };

  // Navigation handlers
  const handleSelectTab = (
    tab: string,
    meta?: { category?: string; subcategory?: string; gender?: 'Ladies' | 'Gents' }
  ) => {
    if (tab === 'gallery' && meta) {
      setGalleryInitialFilter({
        gender: meta.gender || 'All',
        category: meta.category || 'All',
        subcategory: meta.subcategory || 'All',
      });
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategoryFromHome = (category: string, gender: 'Ladies' | 'Gents') => {
    setGalleryInitialFilter({
      gender,
      category,
      subcategory: 'All',
    });
    setCurrentTab('gallery');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLadiesCategory = (category: string, subcategory?: string) => {
    // Map Ladies category name to catalog keywords
    let mappedCategory = 'Blouse';
    if (category.toLowerCase().includes('kurti')) mappedCategory = 'Kurti';
    if (category.toLowerCase().includes('salwar') || category.toLowerCase().includes('suit')) mappedCategory = 'Salwar Suit';
    if (category.toLowerCase().includes('lehenga')) mappedCategory = 'Lehenga';
    if (category.toLowerCase().includes('gown')) mappedCategory = 'Gown';
    if (category.toLowerCase().includes('other')) mappedCategory = 'Dress';

    setGalleryInitialFilter({
      gender: 'Ladies',
      category: mappedCategory,
      subcategory: subcategory || 'All',
    });
    setCurrentTab('gallery');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectGentsCategory = (category: string, subcategory?: string) => {
    let mappedCategory = 'Shirt';
    if (category.toLowerCase().includes('pant') || category.toLowerCase().includes('trouser')) mappedCategory = 'Pant';
    if (category.toLowerCase().includes('jean')) mappedCategory = 'Jeans';
    if (category.toLowerCase().includes('traditional') || category.toLowerCase().includes('kurta')) mappedCategory = 'Kurta';
    if (category.toLowerCase().includes('blazer') || category.toLowerCase().includes('jacket')) mappedCategory = 'Blazer';

    setGalleryInitialFilter({
      gender: 'Gents',
      category: mappedCategory,
      subcategory: subcategory || 'All',
    });
    setCurrentTab('gallery');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const floatingWhatsappUrl = formatWhatsAppUrl(
    shopConfig.whatsappNumber,
    getGeneralEnquiryMessage()
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1F1C18] selection:bg-[#D4AF37]/30 selection:text-[#1F1C18]">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        shopConfig={shopConfig}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <>
            <Hero
              onExploreLadies={() => handleSelectTab('ladies')}
              onExploreGents={() => handleSelectTab('gents')}
              onExploreGallery={() => handleSelectTab('gallery')}
            />

            <FeaturedDesigns
              designs={designs}
              onViewDesign={(d) => setSelectedDesign(d)}
              shopConfig={shopConfig}
              onExploreGallery={() => handleSelectTab('gallery')}
            />

            <CategoryShowcase
              onSelectCategory={handleSelectCategoryFromHome}
              onExploreLadies={() => handleSelectTab('ladies')}
              onExploreGents={() => handleSelectTab('gents')}
            />

            <AboutSection />

            <ContactSection shopConfig={shopConfig} />
          </>
        )}

        {currentTab === 'ladies' && (
          <LadiesCollectionPage
            onSelectCategory={handleSelectLadiesCategory}
            onExploreAll={() => {
              setGalleryInitialFilter({ gender: 'Ladies', category: 'All' });
              setCurrentTab('gallery');
            }}
          />
        )}

        {currentTab === 'gents' && (
          <GentsCollectionPage
            onSelectCategory={handleSelectGentsCategory}
            onExploreAll={() => {
              setGalleryInitialFilter({ gender: 'Gents', category: 'All' });
              setCurrentTab('gallery');
            }}
          />
        )}

        {currentTab === 'gallery' && (
          <DesignGallery
            designs={designs}
            onViewDesign={(d) => setSelectedDesign(d)}
            shopConfig={shopConfig}
            initialFilter={galleryInitialFilter}
          />
        )}

        {currentTab === 'about' && (
          <>
            <div className="py-12 bg-white border-b border-[#EAE2D5] text-center">
              <span className="text-xs uppercase font-semibold tracking-[0.25em] text-[#8C6D23] block mb-2">
                Atelier Heritage & Craft
              </span>
              <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-[#1F1C18]">
                About Sangeetha Tailors
              </h1>
            </div>
            <AboutSection />
            <ContactSection shopConfig={shopConfig} />
          </>
        )}

        {currentTab === 'contact' && (
          <>
            <div className="py-12 bg-white border-b border-[#EAE2D5] text-center">
              <span className="text-xs uppercase font-semibold tracking-[0.25em] text-[#8C6D23] block mb-2">
                Domlur, Bengaluru
              </span>
              <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-[#1F1C18]">
                Contact & Atelier Location
              </h1>
            </div>
            <ContactSection shopConfig={shopConfig} />
          </>
        )}
      </main>

      {/* Floating Quick Action: WhatsApp Button */}
      <aside aria-label="Customer quick actions" className="fixed bottom-6 right-6 z-30">
        <a
          href={floatingWhatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 bg-[#1F1C18] hover:bg-[#8C6D23] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl transition-all hover:scale-105 border border-[#D4AF37]/40"
          title="Chat on WhatsApp with Sangeetha Tailors"
          aria-label="Chat on WhatsApp with Sangeetha Tailors"
        >
          <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
          <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider">
            WhatsApp Atelier
          </span>
        </a>
      </aside>

      {/* Design Detail Modal (Ralph Lauren style editorial product page) */}
      <DesignDetailModal
        design={selectedDesign}
        onClose={() => setSelectedDesign(null)}
        shopConfig={shopConfig}
        allDesigns={designs}
        onSelectRelatedDesign={(d) => setSelectedDesign(d)}
      />

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        designs={designs}
        onSelectDesign={(d) => setSelectedDesign(d)}
      />

      {/* Admin Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        designs={designs}
        onRefreshDesigns={handleRefreshDesigns}
        shopConfig={shopConfig}
        onUpdateShopConfig={(cfg) => setShopConfig(cfg)}
      />

      {/* Footer */}
      <Footer
        onSelectTab={handleSelectTab}
        onOpenAdmin={() => setIsAdminOpen(true)}
        shopConfig={shopConfig}
      />
    </div>
  );
}
