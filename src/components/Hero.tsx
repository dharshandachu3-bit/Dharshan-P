import React from 'react';
import { Sparkles, ArrowRight, Scissors, Ruler, Award, MapPin } from 'lucide-react';

interface HeroProps {
  onExploreLadies: () => void;
  onExploreGents: () => void;
  onExploreGallery: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreLadies,
  onExploreGents,
  onExploreGallery,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#FBF9F5] border-b border-[#EAE2D5] py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8C6D23]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Bespoke Fashion Tailoring · Domlur, Bengaluru</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1F1C18] leading-[1.08] text-balance">
              Your Style.{' '}
              <span className="italic font-normal text-[#8C6D23]">
                Our Craftsmanship.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[#5A544C] max-w-2xl font-light leading-relaxed">
              Discover beautiful tailoring designs for every occasion. From intricately hand-embroidered bridal blouses and flowing lehengas to razor-sharp formal shirts and structured bandhgalas.
            </p>

            {/* Direct Journey Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onExploreLadies}
                className="group inline-flex items-center justify-center gap-3 px-7 py-4 text-sm font-semibold tracking-wider uppercase bg-[#1F1C18] text-white hover:bg-[#8C6D23] rounded-md transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>Explore Ladies Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#D4AF37]" />
              </button>

              <button
                onClick={onExploreGents}
                className="inline-flex items-center justify-center gap-3 px-7 py-4 text-sm font-semibold tracking-wider uppercase bg-white text-[#1F1C18] border border-[#C4BAAA] hover:border-[#1F1C18] hover:bg-[#F4EFE6] rounded-md transition-all shadow-sm cursor-pointer"
              >
                <span>Explore Gents Collection</span>
              </button>
            </div>

            {/* Atelier Craft Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-[#EAE2D5] text-xs text-[#6B655D]">
              <div className="flex items-start gap-2.5">
                <Scissors className="w-4 h-4 text-[#8C6D23] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1F1C18] font-medium">Bespoke Fit</strong>
                  <span>Precise custom patterns</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Ruler className="w-4 h-4 text-[#8C6D23] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1F1C18] font-medium">Any Measurement</strong>
                  <span>Personalized fitting sessions</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Award className="w-4 h-4 text-[#8C6D23] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1F1C18] font-medium">Bridal Zardozi</strong>
                  <span>Artisanal handwork</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#8C6D23] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1F1C18] font-medium">Domlur Village</strong>
                  <span>BDA Colony, Bangalore</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Artwork */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative frame */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#D4AF37]/20 via-[#F4EAD4]/30 to-transparent rounded-2xl transform rotate-1 scale-95" />
              
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-[#EAE2D5] bg-[#EAE2D5]">
                <img
                  src="/src/assets/images/hero_atelier_craft_1793951533299.jpg"
                  alt="Master tailor crafting fine gold zari Banarasi silk attire at Sangeetha Tailors atelier"
                  className="w-full h-[440px] sm:h-[500px] object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle bottom editorial plaque */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#1F1C18]/90 via-[#1F1C18]/50 to-transparent p-6 text-white">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] font-medium">
                    Atelier Spotlight
                  </span>
                  <p className="font-editorial text-lg text-white">
                    Master Draping & Tailoring Perfection
                  </p>
                  <p className="text-xs text-white/80 font-light mt-0.5">
                    Over 20 years of bespoke ladies & gents tailoring excellence in Bangalore.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
