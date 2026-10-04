import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  increment,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';

const PRODUCTS_COLLECTION = 'products';

/**
 * Strips out any `undefined` values from an object before saving to Firestore,
 * preventing unsupported field value exceptions.
 */
function sanitizeForFirestore<T>(data: T): any {
  if (data === null || data === undefined) {
    return null;
  }
  if (Array.isArray(data)) {
    return data.map(item => sanitizeForFirestore(item));
  }
  if (typeof data === 'object') {
    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        sanitized[key] = sanitizeForFirestore(value);
      }
    }
    return sanitized;
  }
  return data;
}

/**
 * Normalizes Firestore document data into a strict Product object.
 */
function parseProductDoc(id: string, data: any): Product {
  return {
    id: id || data.id,
    title: data.title || 'Untitled Item',
    description: data.description || '',
    price: Number(data.price) || 0,
    originalPrice: Number(data.originalPrice) || Number(data.price) || 0,
    category: data.category || 'General Essentials',
    condition: data.condition || 'Like New (Barely Used)',
    weightGrams: Number(data.weightGrams) || 500,
    dimensions: data.dimensions || '',
    images: Array.isArray(data.images) && data.images.length > 0 
      ? data.images 
      : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
    sellerId: data.sellerId || 'unknown-seller',
    seller: {
      id: data.seller?.id || data.sellerId || 'unknown-seller',
      name: data.seller?.name || 'Community Member',
      avatar: data.seller?.avatar || '',
      city: data.seller?.city || data.location?.city || 'India',
      state: data.seller?.state || data.location?.state || '',
      rating: Number(data.seller?.rating) || 5.0,
      reviewCount: Number(data.seller?.reviewCount) || 0,
      isVerified: Boolean(data.seller?.isVerified),
      memberSince: data.seller?.memberSince || 'Verified Member'
    },
    location: {
      city: data.location?.city || 'Bengaluru',
      state: data.location?.state || 'Karnataka',
      pincode: data.location?.pincode || '560001'
    },
    tags: Array.isArray(data.tags) ? data.tags : [],
    status: data.status || 'active',
    createdAt: data.createdAt || new Date().toISOString(),
    views: Number(data.views) || 0,
    likesCount: Number(data.likesCount) || 0,
    negotiable: data.negotiable !== false,
    pickupAvailable: data.pickupAvailable !== false,
    shippingAvailable: data.shippingAvailable !== false,
    shippingFee: Number(data.shippingFee) || 0,
    featured: Boolean(data.featured)
  };
}

/**
 * Listens in real-time to the live Firestore `products` collection.
 * Any product ad posted, updated, or deleted on any device globally is immediately
 * propagated to all connected clients.
 */
export function subscribeToProductAds(
  onProductsUpdate: (products: Product[]) => void,
  onError?: (error: Error) => void
): () => void {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    
    // Listen to real-time changes
    const unsubscribe = onSnapshot(
      productsRef,
      (snapshot) => {
        const loaded: Product[] = [];
        snapshot.forEach((docSnap) => {
          try {
            const prod = parseProductDoc(docSnap.id, docSnap.data());
            loaded.push(prod);
          } catch (err) {
            console.error(`Error parsing product doc ${docSnap.id}:`, err);
          }
        });

        // Sort newest first by createdAt timestamp
        loaded.sort((a, b) => {
          const timeA = new Date(a.createdAt).getTime() || 0;
          const timeB = new Date(b.createdAt).getTime() || 0;
          return timeB - timeA;
        });

        onProductsUpdate(loaded);
      },
      (error) => {
        console.error('Firebase Firestore real-time listener error:', error);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (err: any) {
    console.error('Failed to initialize Firebase snapshot listener:', err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Fetches all product ads directly from Firestore.
 */
export async function getProductAdsFromFirestore(): Promise<Product[]> {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsRef);
    const loaded: Product[] = [];
    
    snapshot.forEach((docSnap) => {
      loaded.push(parseProductDoc(docSnap.id, docSnap.data()));
    });

    loaded.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime() || 0;
      const timeB = new Date(b.createdAt).getTime() || 0;
      return timeB - timeA;
    });

    return loaded;
  } catch (error) {
    console.error('Error fetching products from Firestore:', error);
    throw error;
  }
}

/**
 * Saves a new or edited product ad directly to Google Firebase Firestore.
 * Automatically accessible globally on all devices.
 */
export async function saveProductAdToFirestore(product: Product): Promise<void> {
  try {
    const cleanData = sanitizeForFirestore(product);
    const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
    await setDoc(docRef, cleanData, { merge: true });
  } catch (error) {
    console.error(`Error saving product ${product.id} to Firestore:`, error);
    throw error;
  }
}

/**
 * Updates specific fields of an existing product ad in Firestore.
 */
export async function updateProductAdInFirestore(
  productId: string, 
  updates: Partial<Product>
): Promise<void> {
  try {
    const cleanUpdates = sanitizeForFirestore(updates);
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(docRef, cleanUpdates);
  } catch (error) {
    console.error(`Error updating product ${productId} in Firestore:`, error);
    throw error;
  }
}

/**
 * Deletes a product ad completely from Firestore.
 */
export async function deleteProductAdFromFirestore(productId: string): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting product ${productId} from Firestore:`, error);
    throw error;
  }
}

/**
 * Atomically increments view count for a product ad in Firestore.
 */
export async function incrementProductViewsInFirestore(productId: string): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(docRef, {
      views: increment(1)
    });
  } catch (error) {
    console.warn(`Could not increment views in Firestore for ${productId}:`, error);
  }
}
