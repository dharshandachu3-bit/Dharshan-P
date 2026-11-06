import React from 'react';
import { LADIES_TAXONOMY, CategoryGroup } from '../data/categoryTaxonomy';
import { ArrowRight, Sparkles } from 'lucide-react';

interface LadiesCollectionPageProps {
  onSelectCategory: (categoryName: string, subcategory?: string) => void;
  onExploreAll: () => void;
}

export const LadiesCollectionPage: React.FC<LadiesCollectionPageProps> = ({
  onSelectCategory,
  onExploreAll,
}) => {
  return (
    <div className="bg-[#FBF9F5] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#8C6D23] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Ladies Haute Couture & Tailoring</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F1C18] tracking-tight">
            Ladies Collection
          </h1>
          <p className="text-base sm:text-lg text-[#6B655D] mt-4 font-light leading-relaxed">
            Discover exquisite Indian ethnic and contemporary silhouettes. Meticulously handcrafted by master tailors with custom darting, handcrafted zardozi, and perfect comfort.
          </p>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={onExploreAll}
              className="px-6 py-2.5 bg-[#1F1C18] text-white text-xs font-semibold tracking-wider uppercase rounded-md hover:bg-[#8C6D23] transition-colors shadow-sm cursor-pointer"
            >
              Browse All 50 Ladies Designs &rarr;
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {LADIES_TAXONOMY.map((group: CategoryGroup) => (
            <div
              key={group.id}
              className="bg-white rounded-xl overflow-hidden border border-[#EAE2D5] hover:border-[#D4AF37] transition-all duration-300 hover:shadow-xl flex flex-col justify-between group"
            >
              {/* Image Banner */}
              <div
                className="relative aspect-[16/10] overflow-hidden bg-[#EAE2D5] cursor-pointer"
                onClick={() => onSelectCategory(group.name)}
              >
                <img
                  src={group.sampleImage}
                  alt={`${group.name} custom tailoring design`}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F1C18]/85 via-transparent to-transparent opacity-75 group-hover:opacity-85 transition-opacity" />

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                    Ladies Couture
                  </span>
                  <h2 className="font-editorial text-2xl font-bold leading-tight text-white group-hover:text-[#F4EAD4] transition-colors">
                    {group.name}
                  </h2>
                </div>
              </div>

              {/* Category Content & Subcategories */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-[#5A544C] leading-relaxed mb-4">
                    {group.description}
                  </p>

                  <div className="text-[11px] font-semibold text-[#8C6D23] uppercase tracking-wider mb-2">
                    Available Styles & Cuts:
                  </div>

                  {/* Subcategory Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {group.subcategories.map((sub, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => onSelectCategory(group.name, sub)}
                        className="text-xs px-2.5 py-1 bg-[#F4EFE6] hover:bg-[#1F1C18] hover:text-[#F4EAD4] text-[#4A453E] rounded-md transition-colors cursor-pointer"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-[#EAE2D5] flex items-center justify-between">
                  <span className="text-xs text-[#6B655D]">
                    {group.subcategories.length} Styles
                  </span>

                  <button
                    onClick={() => onSelectCategory(group.name)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1F1C18] group-hover:text-[#8C6D23] transition-colors cursor-pointer"
                  >
                    <span>View Gallery</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
