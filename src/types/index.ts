export type ProductCondition = 
  | 'Brand New (Packaged)'
  | 'Like New (Barely Used)'
  | 'Gently Used'
  | 'Good Condition';

export type ListingStatus = 'active' | 'sold' | 'reserved' | 'under_review';

export interface UserSummary {
  id: string;
  name: string;
  avatar?: string;
  city: string;
  state: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  memberSince: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  label: 'Home' | 'Work' | 'Other';
}

export interface User extends UserSummary {
  email: string;
  phone: string;
  password?: string;
  bio: string;
  upiId: string;
  bankAccount?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  role: 'buyer' | 'seller' | 'admin';
  savedAddresses: Address[];
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  itemCount: number;
  image: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  condition: ProductCondition;
  weightGrams: number; // e.g. 500g (must be lightweight < 5000g)
  dimensions?: string; // e.g. "20 x 15 x 5 cm"
  images: string[];
  sellerId: string;
  seller: UserSummary;
  location: {
    city: string;
    state: string;
    pincode: string;
  };
  tags: string[];
  status: ListingStatus;
  createdAt: string;
  views: number;
  likesCount: number;
  negotiable: boolean;
  pickupAvailable: boolean;
  shippingAvailable: boolean;
  shippingFee: number;
  featured?: boolean;
}

export interface Review {
  id: string;
  targetType: 'seller' | 'product';
  targetId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  offerPrice?: number;
  isOffer?: boolean;
  offerStatus?: 'pending' | 'accepted' | 'declined';
}

export interface Conversation {
  id: string;
  productId: string;
  productTitle: string;
  productPrice: number;
  productImage: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
}

export type OrderStatus = 
  | 'placed'
  | 'confirmed'
  | 'dispatched'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type EscrowStatus = 
  | 'held_in_escrow'
  | 'released_to_seller'
  | 'refunded';

export interface Order {
  id: string;
  orderNumber: string;
  productId: string;
  productTitle: string;
  productPrice: number;
  productImage: string;
  category: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  sellerUpiId: string;
  amount: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: 'upi' | 'netbanking' | 'card' | 'cod';
  paymentDetails: {
    upiId?: string;
    bankName?: string;
    transactionId: string;
    paidAt: string;
    status: 'success' | 'pending' | 'failed';
  };
  shippingAddress: Address;
  status: OrderStatus;
  trackingNumber?: string;
  courierPartner?: string;
  estimatedDelivery: string;
  createdAt: string;
  escrowStatus: EscrowStatus;
  ratingSubmitted?: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'chat' | 'price_drop' | 'listing' | 'system';
  read: boolean;
  timestamp: string;
  linkPage?: string;
  linkId?: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: 'listing' | 'user';
  targetId: string;
  targetTitle: string;
  reason: string;
  details: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface HelpTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  category: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}

export type ActivePage = 
  | 'home'
  | 'products'
  | 'product-details'
  | 'categories'
  | 'seller-profile'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'my-profile'
  | 'my-listings'
  | 'post-item'
  | 'edit-listing'
  | 'wishlist'
  | 'chat'
  | 'notifications'
  | 'orders'
  | 'sales'
  | 'reviews'
  | 'help'
  | 'admin'
  | 'terms'
  | 'privacy';
