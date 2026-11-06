import { Design, FilterState } from '../types';

export function filterDesigns(designs: Design[], filter: FilterState): Design[] {
  return designs.filter((item) => {
    // Gender filter
    if (filter.gender !== 'All' && item.gender !== filter.gender) {
      return false;
    }

    // Category filter
    if (filter.category && filter.category !== 'All') {
      const matchCat = item.mainCategory.toLowerCase().trim();
      const targetCat = filter.category.toLowerCase().trim();
      if (!matchCat.includes(targetCat) && !targetCat.includes(matchCat)) {
        return false;
      }
    }

    // Subcategory filter
    if (filter.subcategory && filter.subcategory !== 'All') {
      const matchSub = (item.subcategory || '').toLowerCase();
      const targetSub = filter.subcategory.toLowerCase();
      if (!matchSub.includes(targetSub)) {
        return false;
      }
    }

    // Fabric filter
    if (filter.fabric && filter.fabric !== 'All') {
      if (item.fabric.toLowerCase() !== filter.fabric.toLowerCase()) {
        return false;
      }
    }

    // Occasion filter
    if (filter.occasion && filter.occasion !== 'All') {
      if (item.occasion.toLowerCase() !== filter.occasion.toLowerCase()) {
        return false;
      }
    }

    // Color filter
    if (filter.color && filter.color !== 'All') {
      const hasColor = item.colors.some((c) =>
        c.toLowerCase().includes(filter.color.toLowerCase())
      );
      if (!hasColor) {
        return false;
      }
    }

    // Search query matching (matches design name, ID, category, fabric, or details)
    if (filter.searchQuery && filter.searchQuery.trim() !== '') {
      const q = filter.searchQuery.toLowerCase().trim();
      const inId = item.designId.toLowerCase().includes(q);
      const inName = item.name.toLowerCase().includes(q);
      const inCat = item.mainCategory.toLowerCase().includes(q);
      const inSub = (item.subcategory || '').toLowerCase().includes(q);
      const inFabric = item.fabric.toLowerCase().includes(q);
      const inDesc = item.description.toLowerCase().includes(q);

      if (!inId && !inName && !inCat && !inSub && !inFabric && !inDesc) {
        return false;
      }
    }

    return true;
  });
}

export function sortDesigns(
  designs: Design[],
  sortBy: FilterState['sortBy']
): Design[] {
  const cloned = [...designs];
  switch (sortBy) {
    case 'featured':
      return cloned.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.designId.localeCompare(b.designId);
      });
    case 'newest':
      return cloned.sort((a, b) => {
        if (a.newArrival && !b.newArrival) return -1;
        if (!a.newArrival && b.newArrival) return 1;
        return (b.createdAt || '').localeCompare(a.createdAt || '');
      });
    case 'price-asc':
      return cloned.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return cloned.sort((a, b) => b.price - a.price);
    default:
      return cloned;
  }
}

export function paginateDesigns(
  designs: Design[],
  page: number,
  pageSize: number
): {
  items: Design[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
} {
  const safePageSize = Math.max(1, pageSize);
  const totalItems = designs.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (currentPage - 1) * safePageSize;
  const items = designs.slice(startIndex, startIndex + safePageSize);

  return {
    items,
    totalItems,
    totalPages,
    currentPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}

export function getDistinctCategories(designs: Design[], gender?: 'Ladies' | 'Gents'): string[] {
  const filtered = gender ? designs.filter((d) => d.gender === gender) : designs;
  const set = new Set<string>();
  filtered.forEach((d) => {
    if (d.mainCategory) set.add(d.mainCategory);
  });
  return Array.from(set).sort();
}

export function getDistinctFabrics(designs: Design[]): string[] {
  const set = new Set<string>();
  designs.forEach((d) => {
    if (d.fabric) set.add(d.fabric);
  });
  return Array.from(set).sort();
}

export function getDistinctOccasions(designs: Design[]): string[] {
  const set = new Set<string>();
  designs.forEach((d) => {
    if (d.occasion) set.add(d.occasion);
  });
  return Array.from(set).sort();
}

export function getDistinctColors(designs: Design[]): string[] {
  const set = new Set<string>();
  designs.forEach((d) => {
    d.colors.forEach((c) => {
      if (c && !c.includes('Custom')) set.add(c);
    });
  });
  return Array.from(set).sort();
}
