export interface CategoryGroup {
  id: string;
  name: string;
  description: string;
  subcategories: string[];
  sampleImage: string;
}

export const LADIES_TAXONOMY: CategoryGroup[] = [
  {
    id: 'blouse-neck',
    name: 'Blouse Designs',
    description: 'Bespoke blouse necklines tailored with precision darting, lining, and intricate artisan piping.',
    subcategories: [
      'Round Neck',
      'V Neck',
      'U Neck',
      'Boat Neck',
      'Sweetheart Neck',
      'Square Neck',
      'Collar Neck',
      'High Neck',
      'Halter Neck',
      'Sleeveless Blouse',
      'Full Sleeve Blouse',
      'Bridal Blouse'
    ],
    sampleImage: '/designs/ladies/L001.jpg'
  },
  {
    id: 'blouse-back',
    name: 'Blouse Back Designs',
    description: 'Signature bridal and festive blouse backs featuring deep cuts, latkan tassels, and hand embroidery.',
    subcategories: [
      'Deep U Back',
      'Deep V Back',
      'Square Back',
      'Keyhole Back',
      'Pot Neck',
      'Tie-Up Back',
      'Designer Cut-Out Back',
      'Embroidered Back',
      'Tassel Back',
      'Open Back'
    ],
    sampleImage: '/designs/ladies/L006.jpg'
  },
  {
    id: 'kurti',
    name: 'Kurti Designs',
    description: 'Contemporary everyday to festive kurtis with flattering flares, tailored side slits, and clean yokes.',
    subcategories: [
      'Straight Cut Kurti',
      'Anarkali Kurti',
      'A-Line Kurti',
      'Angrakha Kurti',
      'Short Kurti',
      'Long Kurti'
    ],
    sampleImage: '/designs/ladies/L009.jpg'
  },
  {
    id: 'salwar-suit',
    name: 'Salwar & Suits',
    description: 'Classic Punjabi suits, wide-leg palazzo sets, and flowing royal sharara ensembles.',
    subcategories: [
      'Punjabi Suit',
      'Palazzo Suit',
      'Sharara Suit',
      'Churidar',
      'Straight Suit',
      'Designer Salwar'
    ],
    sampleImage: '/designs/ladies/L013.jpg'
  },
  {
    id: 'lehenga',
    name: 'Lehenga Designs',
    description: 'Bridal can-can lehengas, mirror-work sangeet sets, and modern Indo-Western silhouettes.',
    subcategories: [
      'Bridal Lehenga',
      'Party Wear Lehenga',
      'Mirror Work Lehenga',
      'Embroidered Lehenga',
      'Indo-Western Lehenga'
    ],
    sampleImage: '/designs/ladies/L016.jpg'
  },
  {
    id: 'gown',
    name: 'Gown Designs',
    description: 'Architectural floor-length evening gowns, panelled Anarkalis, and reception wear.',
    subcategories: [
      'Party Gown',
      'Anarkali Gown',
      'Bridal Gown',
      'Floor-Length Gown'
    ],
    sampleImage: '/designs/ladies/L018.jpg'
  },
  {
    id: 'other-ladies',
    name: 'Other Designer Wear',
    description: 'Saree blouses, crop top skirts, coordinated sets, and bespoke ladies trousers.',
    subcategories: [
      'Saree Blouses',
      'Maxi Dresses',
      'Skirt Sets',
      'Co-ord Sets',
      'Ladies Trousers',
      'Ethnic Jackets'
    ],
    sampleImage: '/designs/ladies/L020.jpg'
  }
];

export const GENTS_TAXONOMY: CategoryGroup[] = [
  {
    id: 'shirts',
    name: 'Shirts',
    description: 'Precision-cut formal business shirts, spread collars, mandarin collars, and lightweight casuals.',
    subcategories: [
      'Formal Shirts',
      'Casual Shirts',
      'Slim Fit Shirts',
      'Regular Fit Shirts',
      'Mandarin Collar Shirts',
      'Printed Shirts',
      'Designer Shirts',
      'Party Wear Shirts'
    ],
    sampleImage: '/designs/gents/G001.jpg'
  },
  {
    id: 'pants-trousers',
    name: 'Pants & Trousers',
    description: 'Custom tailored formal trousers, English double-pleat pants, chinos, and linen summer bottoms.',
    subcategories: [
      'Formal Pants',
      'Slim Fit Pants',
      'Regular Fit Pants',
      'Straight Fit Pants',
      'Pleated Pants',
      'Chinos',
      'Cargo Pants',
      'Linen Pants'
    ],
    sampleImage: '/designs/gents/G002.jpg'
  },
  {
    id: 'jeans',
    name: 'Jeans & Denim',
    description: 'Durable custom denim tailoring with clean tapered, straight, and relaxed cuts.',
    subcategories: [
      'Slim Fit Jeans',
      'Straight Fit Jeans',
      'Relaxed Fit Jeans',
      'Tapered Jeans'
    ],
    sampleImage: '/designs/gents/G017.jpg'
  },
  {
    id: 'traditional',
    name: 'Traditional Wear',
    description: 'Heritage kurtas, Pathani suits, wedding sherwanis, and stitched South Indian dhoti sets.',
    subcategories: [
      'Kurta',
      'Pathani Suit',
      'Kurta Pajama',
      'Dhoti Set',
      'Sherwani'
    ],
    sampleImage: '/designs/gents/G019.jpg'
  },
  {
    id: 'blazers-jackets',
    name: 'Blazers & Jackets',
    description: 'Sharp formal blazers, Bandhgalas, Nehru waistcoats, and wedding dinner jackets.',
    subcategories: [
      'Formal Blazer',
      'Wedding Blazer',
      'Bandhgala',
      'Nehru Jacket',
      'Waistcoat',
      'Casual Jacket'
    ],
    sampleImage: '/designs/gents/G021.jpg'
  }
];
