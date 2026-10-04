import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order, Notification } from '../types';

const ORDERS_COLLECTION = 'orders';
const NOTIFICATIONS_COLLECTION = 'notifications';

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
 * Subscribes in real-time to orders from Firestore.
 * Allows sellers to immediately receive sales orders from buyers on any device.
 */
export function subscribeToOrders(
  onOrdersUpdate: (orders: Order[]) => void,
  onError?: (error: Error) => void
): () => void {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(ordersRef, orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const ordersList: Order[] = [];
        snapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data() as Order;
          ordersList.push({
            ...data,
            id: docSnapshot.id || data.id
          });
        });
        onOrdersUpdate(ordersList);
      },
      (error) => {
        console.warn('Real-time order subscription note:', error.message);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.error('Failed to subscribe to orders:', err);
    return () => {};
  }
}

/**
 * Saves a new order to Firebase Firestore.
 */
export async function saveOrderToFirestore(order: Order): Promise<void> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, order.id);
    const sanitized = sanitizeForFirestore(order);
    await setDoc(docRef, sanitized, { merge: true });
  } catch (err) {
    console.error('Error saving order to Firestore:', err);
    throw err;
  }
}

/**
 * Updates an order in Firestore (e.g. dispatched, escrow released, OTP verified).
 */
export async function updateOrderInFirestore(orderId: string, updates: Partial<Order>): Promise<void> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const sanitized = sanitizeForFirestore(updates);
    await updateDoc(docRef, sanitized);
  } catch (err) {
    console.error(`Error updating order ${orderId} in Firestore:`, err);
    throw err;
  }
}

/**
 * Subscribes in real-time to notifications from Firestore.
 * Ensures sellers instantly get the "You have a new sale! 📦" notification globally.
 */
export function subscribeToNotifications(
  onNotificationsUpdate: (notifications: Notification[]) => void,
  onError?: (error: Error) => void
): () => void {
  try {
    const notifsRef = collection(db, NOTIFICATIONS_COLLECTION);
    
    return onSnapshot(
      notifsRef,
      (snapshot) => {
        const notifsList: Notification[] = [];
        snapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data() as Notification;
          notifsList.push({
            ...data,
            id: docSnapshot.id || data.id
          });
        });
        // Sort descending by id or timestamp
        notifsList.sort((a, b) => b.id.localeCompare(a.id));
        onNotificationsUpdate(notifsList);
      },
      (error) => {
        console.warn('Real-time notification subscription note:', error.message);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.error('Failed to subscribe to notifications:', err);
    return () => {};
  }
}

/**
 * Saves a notification to Firebase Firestore.
 */
export async function saveNotificationToFirestore(notification: Notification): Promise<void> {
  try {
    const docRef = doc(db, NOTIFICATIONS_COLLECTION, notification.id);
    const sanitized = sanitizeForFirestore(notification);
    await setDoc(docRef, sanitized, { merge: true });
  } catch (err) {
    console.error('Error saving notification to Firestore:', err);
    throw err;
  }
}

/**
 * Marks a notification as read in Firestore.
 */
export async function markNotificationReadInFirestore(notificationId: string): Promise<void> {
  try {
    const docRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
    await updateDoc(docRef, { read: true });
  } catch (err) {
    console.error(`Error marking notification ${notificationId} as read in Firestore:`, err);
  }
}
