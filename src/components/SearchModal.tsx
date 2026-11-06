import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';
import { Design } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  designs: Design[];
  onSelectDesign: (design: Design) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  designs,
  onSelectDesign,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = query.trim()
    ? designs
        .filter((d) => {
          const q = query.toLowerCase();
          return (
            d.designId.toLowerCase().includes(q) ||
            d.name.toLowerCase().includes(q) ||
            d.mainCategory.toLowerCase().includes(q) ||
            d.fabric.toLowerCase().includes(q) ||
            d.occasion.toLowerCase().includes(q) ||
            d.colors.some((c) => c.toLowerCase().includes(q))
          );
        })
        .slice(0, 8)
    : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 pt-20 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#EAE2D5] overflow-hidden">
        {/* Search Input Bar */}
        <div className="relative border-b border-[#EAE2D5] p-4 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#8C6D23] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by design name, design ID (e.g. L001, G016), fabric, occasion..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm sm:text-base text-[#1F1C18] placeholder-[#8A8379] focus:outline-hidden bg-transparent"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-[#6B655D] hover:text-[#1F1C18] rounded-full hover:bg-[#F4EFE6] transition-colors cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Tags */}
        {!query && (
          <div className="p-5 bg-[#FBF9F5] text-xs text-[#6B655D] space-y-3">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-[#8C6D23] block">
              Popular Searches
            </span>
            <div className="flex flex-wrap gap-2">
              {['Deep U Neck', 'Boat Neck', 'Bridal Blouse', 'Silk', 'Formal Shirt', 'Bandhgala', 'Sherwani', 'Lehenga', 'L001', 'G001'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1 bg-white hover:bg-[#1F1C18] hover:text-[#F4EAD4] border border-[#EAE2D5] rounded-full text-xs text-[#4A453E] transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results List */}
        {query && (
          <div className="max-h-[60vh] overflow-y-auto divide-y divide-[#EAE2D5]">
            {results.length > 0 ? (
              results.map((design) => (
                <div
                  key={design.designId}
                  onClick={() => {
                    onSelectDesign(design);
                    onClose();
                  }}
                  className="p-3 sm:p-4 hover:bg-[#FBF9F5] cursor-pointer flex items-center justify-between gap-4 transition-colors group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-14 rounded-md overflow-hidden bg-[#F4EFE6] shrink-0 border border-[#EAE2D5]">
                      <img
                        src={design.images?.[0] || '/src/assets/images/hero_atelier_craft_1793951533299.jpg'}
                        alt={design.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-[11px] text-[#8C6D23] font-mono">
                        <span>{design.designId}</span>
                        <span aria-hidden="true">·</span>
                        <span>{design.gender}</span>
                        <span aria-hidden="true">·</span>
                        <span>{design.mainCategory}</span>
                      </div>
                      <h4 className="font-editorial text-sm sm:text-base font-bold text-[#1F1C18] truncate group-hover:text-[#8C6D23] transition-colors">
                        {design.name}
                      </h4>
                      <p className="text-xs text-[#6B655D] truncate">
                        {design.fabric} · {design.occasion}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-3">
                    <div>
                      <span className="text-[10px] text-[#8A8379] block uppercase">Est. Stitching</span>
                      <span className="text-xs sm:text-sm font-bold font-mono text-[#1F1C18]">
                        ₹{design.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8C6D23] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-sm text-[#6B655D]">
                No tailoring designs found matching "{query}".
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
