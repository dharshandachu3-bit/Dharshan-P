import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, auth } from './config';
import { Design, CustomerEnquiry, ShopConfig } from '../types';
import { INITIAL_DESIGNS } from '../data/initialCatalog';
import { DEFAULT_WHATSAPP_NUMBER, DEFAULT_PHONE_NUMBER } from '../utils/whatsapp';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation:', JSON.stringify(errInfo));
  return errInfo;
}

export const DEFAULT_CONFIG: ShopConfig = {
  whatsappNumber: DEFAULT_WHATSAPP_NUMBER,
  phoneNumber: DEFAULT_PHONE_NUMBER,
  address: 'BDA Colony, Domlur Village, Domlur',
  landmark: 'Near Domlur Club & Shanthi Sagar',
  city: 'Bengaluru, Karnataka',
  pincode: '560071',
  businessHours: 'Mon – Sat: 10:00 AM – 8:30 PM | Sunday: 11:00 AM – 5:00 PM',
  email: 'sangeethatailors.blr@gmail.com',
};

/**
 * Fetch all designs from Firestore.
 * If Firestore is empty, auto-seed with the 100 sample designs.
 */
export async function getDesignsList(): Promise<Design[]> {
  const colPath = 'designs';
  try {
    const snap = await getDocs(collection(db, colPath));
    if (!snap.empty) {
      const items: Design[] = [];
      snap.forEach((d) => {
        const data = d.data() as Design;
        items.push({
          ...data,
          id: d.id,
        });
      });
      return items;
    }

    // If empty or unauthenticated, return the complete initial catalog
    if (auth.currentUser) {
      console.log('Seeding initial 100 catalog designs to Firestore as admin...');
      const seedPromises = INITIAL_DESIGNS.map(async (design) => {
        try {
          await setDoc(doc(db, colPath, design.designId), design);
        } catch (e) {
          // ignore
        }
      });
      await Promise.all(seedPromises.slice(0, 10));
    }

    return INITIAL_DESIGNS;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, colPath);
    // Graceful fallback to rich local catalog
    return INITIAL_DESIGNS;
  }
}

/**
 * Admin: Add new design
 */
export async function createDesignDoc(design: Design): Promise<Design> {
  const colPath = 'designs';
  const docId = design.designId || `D${Date.now().toString().slice(-4)}`;
  const payload: Design = {
    ...design,
    designId: docId,
    id: docId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, colPath, docId), payload);
    return payload;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${colPath}/${docId}`);
    return payload;
  }
}

/**
 * Admin: Update design
 */
export async function updateDesignDoc(docId: string, updates: Partial<Design>): Promise<void> {
  const docPath = `designs/${docId}`;
  try {
    await updateDoc(doc(db, 'designs', docId), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
    throw error;
  }
}

/**
 * Admin: Delete design
 */
export async function deleteDesignDoc(docId: string): Promise<void> {
  const docPath = `designs/${docId}`;
  try {
    await deleteDoc(doc(db, 'designs', docId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
    throw error;
  }
}

/**
 * Customer: Submit enquiry
 */
export async function submitCustomerEnquiry(
  enquiry: Omit<CustomerEnquiry, 'id' | 'createdAt' | 'status'>
): Promise<CustomerEnquiry> {
  const colPath = 'enquiries';
  const payload: CustomerEnquiry = {
    ...enquiry,
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = await addDoc(collection(db, colPath), payload);
    return { ...payload, id: docRef.id };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, colPath);
    return { ...payload, id: `local_${Date.now()}` };
  }
}

/**
 * Admin: Fetch customer enquiries
 */
export async function getCustomerEnquiries(): Promise<CustomerEnquiry[]> {
  const colPath = 'enquiries';
  try {
    const q = query(collection(db, colPath), orderBy('createdAt', 'desc'), limit(100));
    const snap = await getDocs(q);
    const results: CustomerEnquiry[] = [];
    snap.forEach((d) => {
      results.push({ ...(d.data() as CustomerEnquiry), id: d.id });
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, colPath);
    return [];
  }
}

/**
 * Admin: Update enquiry status
 */
export async function updateEnquiryStatus(
  enquiryId: string,
  status: 'new' | 'contacted' | 'completed'
): Promise<void> {
  const docPath = `enquiries/${enquiryId}`;
  try {
    await updateDoc(doc(db, 'enquiries', enquiryId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

/**
 * Fetch shop settings / contact details
 */
export async function getShopConfig(): Promise<ShopConfig> {
  const docPath = 'config/store';
  try {
    const snap = await getDoc(doc(db, 'config', 'store'));
    if (snap.exists()) {
      return { ...DEFAULT_CONFIG, ...(snap.data() as ShopConfig) };
    }
    return DEFAULT_CONFIG;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, docPath);
    return DEFAULT_CONFIG;
  }
}

/**
 * Admin: Save shop configuration
 */
export async function saveShopConfig(config: ShopConfig): Promise<void> {
  const docPath = 'config/store';
  try {
    await setDoc(doc(db, 'config', 'store'), {
      ...config,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
    throw error;
  }
}
