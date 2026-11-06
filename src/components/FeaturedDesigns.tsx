import React from 'react';
import { Design, ShopConfig } from '../types';
import { DesignCard } from './DesignCard';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FeaturedDesignsProps {
  designs: Design[];
  onViewDesign: (design: Design) => void;
  shopConfig: ShopConfig;
  onExploreGallery: () => void;
}

export const FeaturedDesigns: React.FC<FeaturedDesignsProps> = ({
  designs,
  onViewDesign,
  shopConfig,
  onExploreGallery,
}) => {
  // Select top featured designs
  const featuredItems = designs.filter((d) => d.featured).slice(0, 8);
  const newArrivals = designs.filter((d) => d.newArrival).slice(0, 4);

  return (
    <section className="py-16 sm:py-24 bg-[#F4EFE6]/50 border-b border-[#EAE2D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section 1: Premier Featured Designs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase font-semibold tracking-[0.25em] text-[#8C6D23] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Handpicked Masterpieces</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1C18]">
              Featured Tailoring Designs
            </h2>
            <p className="text-sm sm:text-base text-[#6B655D] mt-2 max-w-xl">
              Signature bridal cutouts, custom necklines, and structured menswear crafted by our senior tailors in Domlur.
            </p>
          </div>

          <button
            onClick={onExploreGallery}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1F1C18] text-white hover:bg-[#8C6D23] text-xs font-semibold uppercase tracking-wider rounded-md transition-colors shadow-xs cursor-pointer self-start md:self-auto shrink-0"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 8-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredItems.map((design) => (
            <DesignCard
              key={design.designId}
              design={design}
              onViewDesign={onViewDesign}
              shopConfig={shopConfig}
              layoutMode="grid"
            />
          ))}
        </div>

        {/* Section 2: New Arrivals Showcase Banner */}
        <div className="mt-20 pt-16 border-t border-[#EAE2D5]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase font-semibold tracking-[0.2em] text-[#8C6D23] block">
                Fresh Off The Cutting Table
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1F1C18] mt-1">
                New Arrivals
              </h3>
            </div>
            <button
              onClick={onExploreGallery}
              className="text-xs font-semibold uppercase tracking-wider text-[#1F1C18] hover:text-[#8C6D23] transition-colors cursor-pointer"
            >
              See All New Arrivals &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((design) => (
              <DesignCard
                key={design.designId}
                design={design}
                onViewDesign={onViewDesign}
                shopConfig={shopConfig}
                layoutMode="grid"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
