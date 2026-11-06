import test from 'node:test';
import assert from 'node:assert/strict';
import { filterDesigns, sortDesigns, paginateDesigns } from './catalog';
import { Design, FilterState } from '../types';

const MOCK_DESIGNS: Design[] = [
  {
    designId: 'L001',
    name: 'Deep U-neck blouse',
    gender: 'Ladies',
    mainCategory: 'Blouse',
    subcategory: 'Deep U Neck',
    description: 'Deep U back, elbow sleeves, zari border',
    fabric: 'Silk',
    colors: ['Ivory', 'Gold'],
    occasion: 'Wedding',
    price: 1500,
    images: ['/img1.jpg'],
    sizeOptions: 'Custom measurement',
    featured: true,
    newArrival: false,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    designId: 'L002',
    name: 'Boat-neck blouse',
    gender: 'Ladies',
    mainCategory: 'Blouse',
    subcategory: 'Boat Neck',
    description: 'Boat neckline, contrast piping',
    fabric: 'Cotton silk',
    colors: ['Maroon'],
    occasion: 'Traditional',
    price: 1100,
    images: ['/img2.jpg'],
    sizeOptions: 'Custom measurement',
    featured: false,
    newArrival: true,
    createdAt: '2026-01-02T00:00:00.000Z',
  },
  {
    designId: 'G001',
    name: 'Slim-fit formal shirt',
    gender: 'Gents',
    mainCategory: 'Shirt',
    subcategory: 'Formal Shirt',
    description: 'Spread collar, button front, slim fit',
    fabric: 'Cotton',
    colors: ['Emerald Green'],
    occasion: 'Office',
    price: 1100,
    images: ['/img3.jpg'],
    sizeOptions: 'XS,S,M,L,XL,XXL',
    featured: true,
    newArrival: false,
    createdAt: '2026-01-03T00:00:00.000Z',
  },
];

const BASE_FILTER: FilterState = {
  gender: 'All',
  category: 'All',
  subcategory: 'All',
  fabric: 'All',
  occasion: 'All',
  color: 'All',
  searchQuery: '',
  sortBy: 'featured',
};

test('filterDesigns filters correctly by gender', () => {
  const ladies = filterDesigns(MOCK_DESIGNS, { ...BASE_FILTER, gender: 'Ladies' });
  assert.equal(ladies.length, 2);
  assert.equal(ladies[0].designId, 'L001');

  const gents = filterDesigns(MOCK_DESIGNS, { ...BASE_FILTER, gender: 'Gents' });
  assert.equal(gents.length, 1);
  assert.equal(gents[0].designId, 'G001');
});

test('filterDesigns searches by keyword across name, ID, and fabric', () => {
  const searchId = filterDesigns(MOCK_DESIGNS, { ...BASE_FILTER, searchQuery: 'L001' });
  assert.equal(searchId.length, 1);
  assert.equal(searchId[0].designId, 'L001');

  const searchFabric = filterDesigns(MOCK_DESIGNS, { ...BASE_FILTER, searchQuery: 'Cotton silk' });
  assert.equal(searchFabric.length, 1);
  assert.equal(searchFabric[0].designId, 'L002');
});

test('sortDesigns sorts by price ascending and descending', () => {
  const asc = sortDesigns(MOCK_DESIGNS, 'price-asc');
  assert.equal(asc[0].price, 1100);
  assert.equal(asc[2].price, 1500);

  const desc = sortDesigns(MOCK_DESIGNS, 'price-desc');
  assert.equal(desc[0].price, 1500);
});

test('paginateDesigns splits records into requested page chunks', () => {
  const page1 = paginateDesigns(MOCK_DESIGNS, 1, 2);
  assert.equal(page1.items.length, 2);
  assert.equal(page1.totalPages, 2);
  assert.equal(page1.hasNext, true);
  assert.equal(page1.hasPrev, false);

  const page2 = paginateDesigns(MOCK_DESIGNS, 2, 2);
  assert.equal(page2.items.length, 1);
  assert.equal(page2.hasNext, false);
  assert.equal(page2.hasPrev, true);
});

test('INITIAL_DESIGNS has unique images for all ladies items', async () => {
  const { INITIAL_DESIGNS } = await import('../data/initialCatalog');
  const ladies = INITIAL_DESIGNS.filter((d) => d.gender === 'Ladies');
  assert.equal(ladies.length, 50);

  const ladiesImages = ladies.map((d) => d.images[0]);
  const uniqueImages = new Set(ladiesImages);
  assert.equal(uniqueImages.size, 50, 'All 50 ladies designs must have unique, distinct primary images');
});

