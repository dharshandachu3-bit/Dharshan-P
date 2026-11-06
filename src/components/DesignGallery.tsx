import React, { useState, useMemo } from 'react';
import {
  Filter,
  Grid,
  Columns,
  Search,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
} from 'lucide-react';
import { Design, FilterState, ShopConfig } from '../types';
import { DesignCard } from './DesignCard';
import {
  filterDesigns,
  sortDesigns,
  paginateDesigns,
  getDistinctCategories,
  getDistinctFabrics,
  getDistinctOccasions,
  getDistinctColors,
} from '../utils/catalog';

interface DesignGalleryProps {
  designs: Design[];
  onViewDesign: (design: Design) => void;
  shopConfig: ShopConfig;
  initialFilter?: Partial<FilterState>;
}

export const DesignGallery: React.FC<DesignGalleryProps> = ({
  designs,
  onViewDesign,
  shopConfig,
  initialFilter,
}) => {
  const [layoutMode, setLayoutMode] = useState<'grid' | 'masonry'>('grid');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const [filterState, setFilterState] = useState<FilterState>({
    gender: initialFilter?.gender || 'All',
    category: initialFilter?.category || 'All',
    subcategory: initialFilter?.subcategory || 'All',
    fabric: initialFilter?.fabric || 'All',
    occasion: initialFilter?.occasion || 'All',
    color: initialFilter?.color || 'All',
    searchQuery: initialFilter?.searchQuery || '',
    sortBy: initialFilter?.sortBy || 'featured',
  });

  // Extract distinct filter values
  const availableCategories = useMemo(
    () => getDistinctCategories(designs, filterState.gender === 'All' ? undefined : filterState.gender),
    [designs, filterState.gender]
  );
  const availableFabrics = useMemo(() => getDistinctFabrics(designs), [designs]);
  const availableOccasions = useMemo(() => getDistinctOccasions(designs), [designs]);
  const availableColors = useMemo(() => getDistinctColors(designs), [designs]);

  // Filter & Sort
  const filteredList = useMemo(() => {
    return filterDesigns(designs, filterState);
  }, [designs, filterState]);

  const sortedList = useMemo(() => {
    return sortDesigns(filteredList, filterState.sortBy);
  }, [filteredList, filterState.sortBy]);

  // Paginate
  const pagination = useMemo(() => {
    return paginateDesigns(sortedList, currentPage, pageSize);
  }, [sortedList, currentPage, pageSize]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilterState((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilterState({
      gender: 'All',
      category: 'All',
      subcategory: 'All',
      fabric: 'All',
      occasion: 'All',
      color: 'All',
      searchQuery: '',
      sortBy: 'featured',
    });
    setCurrentPage(1);
  };

  const hasActiveFilters =
    filterState.gender !== 'All' ||
    filterState.category !== 'All' ||
    filterState.subcategory !== 'All' ||
    filterState.fabric !== 'All' ||
    filterState.occasion !== 'All' ||
    filterState.color !== 'All' ||
    filterState.searchQuery.trim() !== '';

  return (
    <div className="bg-[#FBF9F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Gallery Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs uppercase font-semibold tracking-[0.25em] text-[#8C6D23] block mb-2">
            Artisan Tailoring Showcase
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-[#1F1C18] tracking-tight">
            Design Catalog & Gallery
          </h1>
          <p className="text-sm sm:text-base text-[#6B655D] mt-3">
            Explore 100+ bespoke designs for ladies and gents. Every cut can be customized to your preferred fabric, embroidery, and precise measurements.
          </p>
        </div>

        {/* Search, Gender Segment, and Controls Bar */}
        <div className="bg-white rounded-xl border border-[#EAE2D5] p-4 sm:p-5 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8C6D23] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by design name, ID (e.g. L001, G019), fabric, style..."
                value={filterState.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-[#F4EFE6]/70 border border-[#EAE2D5] rounded-lg text-sm text-[#1F1C18] placeholder-[#8A8379] focus:outline-hidden focus:border-[#D4AF37] focus:bg-white transition-all"
              />
              {filterState.searchQuery && (
                <button
                  onClick={() => handleFilterChange('searchQuery', '')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8379] hover:text-[#1F1C18] cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Gender Segmented Control */}
            <div className="inline-flex p-1 bg-[#F4EFE6] rounded-lg border border-[#EAE2D5] self-start sm:self-auto shrink-0">
              {(['All', 'Ladies', 'Gents'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => handleFilterChange('gender', g)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    filterState.gender === g
                      ? 'bg-white text-[#1F1C18] shadow-xs'
                      : 'text-[#6B655D] hover:text-[#1F1C18]'
                  }`}
                >
                  {g === 'All' ? 'All Collections' : g}
                </button>
              ))}
            </div>

            {/* Layout Toggle & Sort */}
            <div className="flex items-center gap-3 justify-between sm:justify-end shrink-0">
              {/* Filter drawer toggle button for mobile/compact */}
              <button
                onClick={() => setShowFilterDrawer(!showFilterDrawer)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  showFilterDrawer || hasActiveFilters
                    ? 'bg-[#1F1C18] text-[#F4EAD4] border-[#1F1C18]'
                    : 'bg-[#F4EFE6] text-[#4A453E] border-[#EAE2D5] hover:bg-[#EAE2D5]'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters {hasActiveFilters ? `(Active)` : ''}</span>
              </button>

              {/* Sort Dropdown */}
              <select
                value={filterState.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value as FilterState['sortBy'])}
                className="px-3 py-2 bg-[#F4EFE6] border border-[#EAE2D5] rounded-lg text-xs font-semibold text-[#1F1C18] focus:outline-hidden focus:border-[#D4AF37] cursor-pointer"
              >
                <option value="featured">Sort: Premier Featured</option>
                <option value="newest">Sort: New Arrivals</option>
                <option value="price-asc">Stitching Price: Low to High</option>
                <option value="price-desc">Stitching Price: High to Low</option>
              </select>

              {/* Grid / Masonry toggle */}
              <div className="hidden sm:flex items-center border border-[#EAE2D5] rounded-lg p-0.5 bg-[#F4EFE6]">
                <button
                  onClick={() => setLayoutMode('grid')}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    layoutMode === 'grid' ? 'bg-white text-[#1F1C18] shadow-xs' : 'text-[#6B655D]'
                  }`}
                  title="Grid Layout"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLayoutMode('masonry')}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    layoutMode === 'masonry' ? 'bg-white text-[#1F1C18] shadow-xs' : 'text-[#6B655D]'
                  }`}
                  title="Masonry Layout"
                >
                  <Columns className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Expanded Filter Panel */}
          {showFilterDrawer && (
            <div className="pt-4 border-t border-[#EAE2D5] grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fadeIn">
              {/* Category */}
              <div>
                <label className="block text-[11px] font-semibold text-[#6B655D] uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={filterState.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4EFE6] border border-[#EAE2D5] rounded-lg text-xs text-[#1F1C18] focus:outline-hidden focus:border-[#D4AF37] cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {availableCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fabric */}
              <div>
                <label className="block text-[11px] font-semibold text-[#6B655D] uppercase tracking-wider mb-1">
                  Fabric
                </label>
                <select
                  value={filterState.fabric}
                  onChange={(e) => handleFilterChange('fabric', e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4EFE6] border border-[#EAE2D5] rounded-lg text-xs text-[#1F1C18] focus:outline-hidden focus:border-[#D4AF37] cursor-pointer"
                >
                  <option value="All">All Fabrics</option>
                  {availableFabrics.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              {/* Occasion */}
              <div>
                <label className="block text-[11px] font-semibold text-[#6B655D] uppercase tracking-wider mb-1">
                  Occasion
                </label>
                <select
                  value={filterState.occasion}
                  onChange={(e) => handleFilterChange('occasion', e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4EFE6] border border-[#EAE2D5] rounded-lg text-xs text-[#1F1C18] focus:outline-hidden focus:border-[#D4AF37] cursor-pointer"
                >
                  <option value="All">All Occasions</option>
                  {availableOccasions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color */}
              <div>
                <label className="block text-[11px] font-semibold text-[#6B655D] uppercase tracking-wider mb-1">
                  Color Tone
                </label>
                <select
                  value={filterState.color}
                  onChange={(e) => handleFilterChange('color', e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4EFE6] border border-[#EAE2D5] rounded-lg text-xs text-[#1F1C18] focus:outline-hidden focus:border-[#D4AF37] cursor-pointer"
                >
                  <option value="All">All Colors</option>
                  {availableColors.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Active Filters Bar */}
          {hasActiveFilters && (
            <div className="pt-3 border-t border-[#EAE2D5] flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[#6B655D] font-medium">Applied Filters:</span>
                {filterState.gender !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F4EFE6] text-[#1F1C18] rounded-md border border-[#EAE2D5]">
                    {filterState.gender}
                    <button
                      onClick={() => handleFilterChange('gender', 'All')}
                      className="hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filterState.category !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F4EFE6] text-[#1F1C18] rounded-md border border-[#EAE2D5]">
                    Category: {filterState.category}
                    <button
                      onClick={() => handleFilterChange('category', 'All')}
                      className="hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filterState.fabric !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F4EFE6] text-[#1F1C18] rounded-md border border-[#EAE2D5]">
                    Fabric: {filterState.fabric}
                    <button
                      onClick={() => handleFilterChange('fabric', 'All')}
                      className="hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filterState.occasion !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F4EFE6] text-[#1F1C18] rounded-md border border-[#EAE2D5]">
                    Occasion: {filterState.occasion}
                    <button
                      onClick={() => handleFilterChange('occasion', 'All')}
                      className="hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filterState.color !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F4EFE6] text-[#1F1C18] rounded-md border border-[#EAE2D5]">
                    Color: {filterState.color}
                    <button
                      onClick={() => handleFilterChange('color', 'All')}
                      className="hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-[#8C6D23] hover:text-[#1F1C18] font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All</span>
              </button>
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-[#6B655D]">
          <span>
            Showing{' '}
            <strong className="text-[#1F1C18] tabular-nums">
              {pagination.items.length > 0 ? (pagination.currentPage - 1) * pageSize + 1 : 0}
            </strong>
            {' – '}
            <strong className="text-[#1F1C18] tabular-nums">
              {Math.min(pagination.currentPage * pageSize, pagination.totalItems)}
            </strong>{' '}
            of <strong className="text-[#1F1C18] tabular-nums">{pagination.totalItems}</strong> designs
          </span>

          <span className="hidden sm:inline text-[#8C6D23] font-medium">
            * Sample stitching prices are indicative and customizable by fabric and work.
          </span>
        </div>

        {/* Designs Display Grid / Masonry */}
        {pagination.items.length > 0 ? (
          <div
            className={`grid gap-6 ${
              layoutMode === 'masonry'
                ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}
          >
            {pagination.items.map((design) => (
              <DesignCard
                key={design.designId}
                design={design}
                onViewDesign={onViewDesign}
                shopConfig={shopConfig}
                layoutMode={layoutMode}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="bg-white rounded-xl border border-[#EAE2D5] p-12 text-center max-w-lg mx-auto">
            <Sparkles className="w-10 h-10 text-[#8C6D23] mx-auto mb-3" />
            <h3 className="font-editorial text-2xl font-bold text-[#1F1C18]">
              No Designs Matched Your Filters
            </h3>
            <p className="text-sm text-[#6B655D] mt-2">
              Try adjusting your search keywords, clear category or color filters, or view our full bespoke catalog.
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 px-6 py-2.5 bg-[#1F1C18] text-white text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-[#8C6D23] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              disabled={!pagination.hasPrev}
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 350, behavior: 'smooth' });
              }}
              className="p-2.5 rounded-lg border border-[#EAE2D5] bg-white text-[#1F1C18] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F4EFE6] transition-colors cursor-pointer"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pg) => {
              const active = pagination.currentPage === pg;
              return (
                <button
                  key={pg}
                  onClick={() => {
                    setCurrentPage(pg);
                    window.scrollTo({ top: 350, behavior: 'smooth' });
                  }}
                  className={`w-10 h-10 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#1F1C18] text-white shadow-xs'
                      : 'bg-white text-[#4A453E] border border-[#EAE2D5] hover:bg-[#F4EFE6]'
                  }`}
                >
                  {pg}
                </button>
              );
            })}

            <button
              disabled={!pagination.hasNext}
              onClick={() => {
                setCurrentPage((p) => Math.min(pagination.totalPages, p + 1));
                window.scrollTo({ top: 350, behavior: 'smooth' });
              }}
              className="p-2.5 rounded-lg border border-[#EAE2D5] bg-white text-[#1F1C18] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F4EFE6] transition-colors cursor-pointer"
              aria-label="Next Page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
