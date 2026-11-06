import React, { useState } from 'react';
import { Eye, MessageSquare, Sparkles } from 'lucide-react';
import { Design, ShopConfig } from '../types';
import { formatWhatsAppUrl, getDesignEnquiryMessage } from '../utils/whatsapp';

interface DesignCardProps {
  design: Design;
  onViewDesign: (design: Design) => void;
  shopConfig: ShopConfig;
  layoutMode?: 'grid' | 'masonry';
}

export const DesignCard: React.FC<DesignCardProps> = ({
  design,
  onViewDesign,
  shopConfig,
  layoutMode = 'grid',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const primaryImage =
    design.images && design.images.length > 0
      ? design.images[0]
      : '/src/assets/images/hero_atelier_craft_1793951533299.jpg';

  const whatsappUrl = formatWhatsAppUrl(
    shopConfig.whatsappNumber,
    getDesignEnquiryMessage(design.designId, design.name)
  );

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-[#EAE2D5] hover:border-[#D4AF37] transition-all duration-300 hover:shadow-lg flex flex-col justify-between">
      {/* Top Image Container */}
      <div
        className={`relative overflow-hidden bg-[#F4EFE6] cursor-pointer ${
          layoutMode === 'masonry' ? 'aspect-[3/4]' : 'aspect-[4/5]'
        }`}
        onClick={() => onViewDesign(design)}
      >
        {!imageError ? (
          <img
            src={primaryImage}
            alt={`${design.name} - ${design.gender} tailoring design by Sangeetha Tailors`}
            className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#F4EFE6] to-[#EAE2D5] text-[#6B655D]">
            <Sparkles className="w-8 h-8 text-[#8C6D23] mb-2" />
            <span className="font-editorial text-lg text-[#1F1C18]">{design.name}</span>
            <span className="text-xs text-[#8C6D23] mt-1">{design.fabric} · {design.occasion}</span>
          </div>
        )}

        {/* Badges for Featured / New */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {design.featured && (
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#1F1C18] bg-[#F4EAD4]/95 backdrop-blur-xs px-2.5 py-1 rounded shadow-xs">
              Premier Pick
            </span>
          )}
          {design.newArrival && (
            <span className="text-[10px] uppercase font-bold tracking-widest text-white bg-[#1F1C18]/90 backdrop-blur-xs px-2.5 py-1 rounded shadow-xs">
              New Arrival
            </span>
          )}
        </div>

        {/* Design ID badge top right */}
        <div className="absolute top-3 right-3 text-[11px] font-mono tracking-wider font-semibold text-[#1F1C18] bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs">
          {design.designId}
        </div>

        {/* Hover Quick Actions Overlay */}
        <div className="absolute inset-0 bg-[#1F1C18]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDesign(design);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-[#1F1C18] rounded-md text-xs font-semibold shadow hover:bg-[#F4EFE6] transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Category & Gender & Occasion */}
          <div className="flex items-center gap-2 text-xs text-[#8C6D23] font-medium tracking-wide">
            <span>{design.gender}</span>
            <span aria-hidden="true">·</span>
            <span>{design.mainCategory}</span>
            <span aria-hidden="true">·</span>
            <span>{design.occasion}</span>
          </div>

          {/* Design Name */}
          <h3
            onClick={() => onViewDesign(design)}
            className="font-editorial text-lg font-bold text-[#1F1C18] hover:text-[#8C6D23] transition-colors cursor-pointer mt-1 line-clamp-1"
            title={design.name}
          >
            {design.name}
          </h3>

          {/* Fabric & Style details */}
          <p className="text-xs text-[#6B655D] mt-1 line-clamp-1">
            <span className="font-medium text-[#4A453E]">Fabric:</span> {design.fabric}
            {design.subcategory ? ` · ${design.subcategory}` : ''}
          </p>

          {/* Color swatches / tags */}
          <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
            {design.colors.slice(0, 3).map((col, idx) => (
              <span
                key={idx}
                className="text-[11px] text-[#5A544C] bg-[#F4EFE6] px-2 py-0.5 rounded"
              >
                {col}
              </span>
            ))}
          </div>
        </div>

        {/* Card Footer: Indicative Stitching Price + Actions */}
        <div className="mt-4 pt-3 border-t border-[#EAE2D5] flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-[#6B655D] block uppercase tracking-wider">
              Est. Stitching
            </span>
            <span className="text-base font-bold text-[#1F1C18] tabular-nums font-mono">
              ₹{design.price.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onViewDesign(design)}
              className="p-2 text-[#4A453E] hover:text-[#1F1C18] hover:bg-[#F4EFE6] rounded-md transition-colors cursor-pointer"
              title="View Design Details"
              aria-label={`View ${design.name} details`}
            >
              <Eye className="w-4 h-4" />
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1F1C18] hover:bg-[#8C6D23] text-white text-xs font-semibold rounded-md transition-colors shadow-xs"
              title="Enquire on WhatsApp"
              aria-label={`Enquire on WhatsApp for ${design.name}`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Enquire</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
