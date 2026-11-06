import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface CategoryShowcaseProps {
  onSelectCategory: (category: string, gender: 'Ladies' | 'Gents') => void;
  onExploreLadies: () => void;
  onExploreGents: () => void;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
  onSelectCategory,
  onExploreLadies,
  onExploreGents,
}) => {
  const categories = [
    {
      title: 'Blouse & Back Designs',
      gender: 'Ladies' as const,
      categoryKey: 'Blouse',
      count: '30+ Neck & Back Variations',
      image: '/src/assets/images/blouse_couture_1793951549448.jpg',
      tag: 'Couture Embroidery',
      desc: 'Pot neck, deep U back, sweetheart, collar, tassels, and zari handwork.',
    },
    {
      title: 'Bespoke Shirts & Trousers',
      gender: 'Gents' as const,
      categoryKey: 'Shirt',
      count: '25+ Cuts & Fabrics',
      image: '/src/assets/images/gents_blue_pleated_1793953128036.jpg',
      tag: 'Executive Fit',
      desc: 'Spread collars, mandarin styles, Oxford cottons, and English pleats.',
    },
    {
      title: 'Bridal Lehengas & Gowns',
      gender: 'Ladies' as const,
      categoryKey: 'Lehenga',
      count: '15+ Royal Ensembles',
      image: '/src/assets/images/bridal_lehenga_1793951603169.jpg',
      tag: 'Bridal & Sangeet',
      desc: 'Heavy can-can flair, velvet borders, mirror work, and Anarkali gowns.',
    },
    {
      title: 'Wedding Sherwanis & Kurtas',
      gender: 'Gents' as const,
      categoryKey: 'Sherwani',
      count: '20+ Traditional Styles',
      image: '/src/assets/images/regal_sherwani_1793951585581.jpg',
      tag: 'Heritage Festive',
      desc: 'Jacquard bandhgalas, Pathani suits, dhoti sets, and Nehru waistcoats.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#FBF9F5] border-b border-[#EAE2D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs uppercase font-semibold tracking-[0.25em] text-[#8C6D23] block mb-2">
              Curated Catalog
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1C18]">
              Popular Tailoring Categories
            </h2>
            <p className="text-sm sm:text-base text-[#6B655D] mt-2 max-w-xl">
              Browse our most-requested silhouettes for ladies and gents, meticulously tailored to your exact measurements.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onExploreLadies}
              className="text-xs font-semibold tracking-wider uppercase px-4 py-2 bg-[#F4EFE6] hover:bg-[#EAE2D5] text-[#1F1C18] rounded-md transition-colors cursor-pointer"
            >
              All Ladies (50)
            </button>
            <button
              onClick={onExploreGents}
              className="text-xs font-semibold tracking-wider uppercase px-4 py-2 bg-[#F4EFE6] hover:bg-[#EAE2D5] text-[#1F1C18] rounded-md transition-colors cursor-pointer"
            >
              All Gents (50)
            </button>
          </div>
        </div>

        {/* 4 Large Editorial Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => onSelectCategory(cat.categoryKey, cat.gender)}
              className="group relative bg-[#F4EFE6] rounded-xl overflow-hidden border border-[#EAE2D5] hover:border-[#D4AF37] transition-all duration-300 hover:shadow-xl cursor-pointer flex flex-col"
            >
              {/* Image Frame */}
              <div className="relative aspect-[4/5] overflow-hidden bg-[#EAE2D5]">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F1C18]/85 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Top unboxed metadata */}
                <div className="absolute top-3 left-3 text-[11px] font-semibold uppercase tracking-wider text-[#F4EAD4] bg-[#1F1C18]/60 backdrop-blur-xs px-2.5 py-1 rounded">
                  {cat.gender} · {cat.tag}
                </div>

                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-[#1F1C18] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-1 group-hover:translate-y-0 shadow">
                  <ArrowUpRight className="w-4 h-4" />
                </div>

                {/* Bottom text inside image */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-editorial text-2xl font-bold leading-tight text-white group-hover:text-[#F4EAD4] transition-colors">
                    {cat.title}
                  </h3>
                  <span className="text-xs text-white/80 font-light mt-1 block">
                    {cat.count}
                  </span>
                </div>
              </div>

              {/* Card Footer details */}
              <div className="p-4 bg-white/60 flex-1 flex flex-col justify-between">
                <p className="text-xs text-[#5A544C] leading-relaxed">
                  {cat.desc}
                </p>
                <div className="mt-3 pt-3 border-t border-[#EAE2D5] flex items-center justify-between text-xs font-semibold text-[#8C6D23] group-hover:text-[#1F1C18]">
                  <span>Explore Designs</span>
                  <span aria-hidden="true">&rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
