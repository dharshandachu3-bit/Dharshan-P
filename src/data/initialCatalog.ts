import rawCatalogData from '../../public/assets/aistudio/sangeetha_tailors_design_catalog_100_8fc367ac.json';
import { Design } from '../types';

// Curated high quality imagery for catalog items
const MASTER_IMAGES = {
  hero: '/src/assets/images/hero_atelier_craft_1793951533299.jpg',
  blouseCouture: '/src/assets/images/blouse_couture_1793951549448.jpg',
  blouseGreen: '/src/assets/images/blouse_green_zardozi_1793953058653.jpg',
  blouseBoat: '/src/assets/images/blouse_boat_neck_1793952976725.jpg',
  blousePurple: '/src/assets/images/blouse_purple_tassels_1793953082860.jpg',
  blouseWhite: '/src/assets/images/blouse_white_gold_temple_1793953153255.jpg',
  blouseAqua: '/src/assets/images/blouse_aqua_teardrop_1793953106002.jpg',
  gentsShirt: '/src/assets/images/gents_bespoke_1793951567349.jpg',
  gentsPleated: '/src/assets/images/gents_blue_pleated_1793953128036.jpg',
  sherwani: '/src/assets/images/regal_sherwani_1793951585581.jpg',
  lehenga: '/src/assets/images/bridal_lehenga_1793951603169.jpg',
};

export function getCuratedImagesForDesign(design: {
  design_id: string;
  gender: string;
  category: string;
  design_name: string;
}): { images: string[]; frontImage: string; backImage?: string; detailImage?: string } {
  const isLadies = design.gender === 'Ladies';
  const id = design.design_id;

  if (isLadies) {
    // Unique primary image dedicated to this specific ladies design ID
    const primary = `/designs/ladies/${id}.jpg`;
    
    // Choose complementary secondary and angle views based on category
    let secondary = MASTER_IMAGES.hero;
    let detail = primary;
    let back = primary;

    if (design.category === 'Blouse' || design.category === 'Saree Blouse') {
      // Complementary view from the couture blouse collection
      secondary = id === 'L001' ? MASTER_IMAGES.blouseBoat :
                  id === 'L002' ? MASTER_IMAGES.blouseGreen :
                  id === 'L003' ? MASTER_IMAGES.blousePurple :
                  id === 'L004' ? MASTER_IMAGES.blouseAqua :
                  id === 'L005' ? MASTER_IMAGES.blouseWhite : MASTER_IMAGES.blouseCouture;
      back = primary;
      detail = secondary;
    } else if (design.category === 'Lehenga') {
      secondary = MASTER_IMAGES.lehenga;
      detail = primary;
      back = MASTER_IMAGES.hero;
    } else {
      secondary = MASTER_IMAGES.hero;
      detail = primary;
      back = primary;
    }

    return {
      images: [primary, secondary, detail],
      frontImage: primary,
      backImage: back,
      detailImage: detail,
    };
  } else {
    // Unique primary image dedicated to this specific gents design ID
    const primary = `/designs/gents/${id}.jpg`;
    
    let secondary = MASTER_IMAGES.gentsPleated;
    let detail = primary;

    if (design.category === 'Traditional Wear' || design.category === 'Sherwani') {
      secondary = MASTER_IMAGES.sherwani;
    } else if (design.category === 'Shirts') {
      secondary = MASTER_IMAGES.gentsShirt;
    }

    return {
      images: [primary, secondary, detail],
      frontImage: primary,
      backImage: primary,
      detailImage: detail,
    };
  }
}

// Transform the 100 raw designs into full Design model
export const INITIAL_DESIGNS: Design[] = rawCatalogData.designs.map((item, index) => {
  const imageInfo = getCuratedImagesForDesign(item);
  
  // Extract clean subcategory from design_name or style_details
  let subcategory = item.design_name.replace(' - Variant 2', '').trim();
  if (item.category === 'Blouse' && item.style_details.includes('back')) {
    const parts = item.style_details.split(',');
    if (parts[0]) subcategory = parts[0].trim();
  }

  // Feature premier showcase designs
  const isFeatured = index < 12 || item.design_id === 'L001' || item.design_id === 'L016' || item.design_id === 'G001' || item.design_id === 'G019';
  const isNewArrival = (index % 4 === 0) || item.design_id.endsWith('2');

  return {
    id: item.design_id,
    designId: item.design_id,
    name: item.design_name,
    gender: item.gender as 'Ladies' | 'Gents',
    mainCategory: item.category,
    subcategory: subcategory,
    description: `${item.style_details}. Crafted with bespoke tailoring standards at Sangeetha Tailors, Domlur, Bengaluru. Tailored for exceptional drape, comfort and longevity.`,
    fabric: item.fabric,
    colors: [item.color_option, 'Custom Dye / Fabric match'],
    occasion: item.occasion,
    price: item.sample_stitching_price_inr,
    images: imageInfo.images,
    frontImage: imageInfo.frontImage,
    backImage: imageInfo.backImage,
    detailImage: imageInfo.detailImage,
    sizeOptions: item.size_options || 'Custom measurement',
    featured: isFeatured,
    newArrival: isNewArrival,
    createdAt: new Date(Date.now() - index * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  };
});
