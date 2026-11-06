export type Gender = 'Ladies' | 'Gents';

export interface Design {
  id?: string;
  designId: string;
  name: string;
  gender: Gender;
  mainCategory: string;
  subcategory: string;
  description: string;
  fabric: string;
  colors: string[];
  occasion: string;
  price: number;
  images: string[];
  sizeOptions: string;
  featured?: boolean;
  newArrival?: boolean;
  frontImage?: string;
  backImage?: string;
  detailImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerEnquiry {
  id?: string;
  designId?: string;
  designName?: string;
  customerName: string;
  phone: string;
  service: string;
  requirements?: string;
  status: 'new' | 'contacted' | 'completed';
  createdAt: string;
}

export interface ShopConfig {
  whatsappNumber: string;
  phoneNumber: string;
  address: string;
  landmark: string;
  city: string;
  pincode: string;
  businessHours: string;
  email?: string;
}

export interface FilterState {
  gender: 'All' | Gender;
  category: string;
  subcategory: string;
  fabric: string;
  occasion: string;
  color: string;
  searchQuery: string;
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc';
}
