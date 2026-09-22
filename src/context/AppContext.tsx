import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, Product, ProductCategory, Review, Order, Notification, 
  Conversation, ChatMessage, Report, HelpTicket, ActivePage, Address,
  OrderStatus, EscrowStatus
} from '../types';
import { 
  INITIAL_USERS, INITIAL_PRODUCTS, INITIAL_REVIEWS, 
  INITIAL_ORDERS, INITIAL_CONVERSATIONS, INITIAL_CHAT_MESSAGES, 
  INITIAL_NOTIFICATIONS, CATEGORIES 
} from '../data/seedData';

interface NavigationParams {
  productId?: string;
  sellerId?: string;
  categorySlug?: string;
  query?: string;
  conversationId?: string;
}

interface ToastInfo {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  // Navigation & Routing
  activePage: ActivePage;
  navParams: NavigationParams;
  navigateTo: (page: ActivePage, params?: NavigationParams) => void;
  
  // Auth & Current User
  currentUser: User;
  users: User[];
  setCurrentUserById: (userId: string) => void;
  loginUser: (email: string, role?: 'buyer' | 'seller' | 'admin') => boolean;
  registerUser: (userData: Partial<User>) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  addSavedAddress: (address: Omit<Address, 'id'>) => void;
  updateSavedAddress: (address: Address) => void;
  deleteSavedAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  
  // Products & Catalog
  products: Product[];
  categories: ProductCategory[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  addProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'views' | 'likesCount' | 'status'>) => string;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  markProductSold: (productId: string) => void;
  incrementProductViews: (productId: string) => void;
  
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  
  // Orders & Purchases & Escrow
  orders: Order[];
  createOrder: (orderData: {
    productId: string;
    product: Product;
    amount: number;
    shippingFee: number;
    paymentMethod: 'upi' | 'netbanking' | 'card' | 'cod';
    paymentDetails: {
      upiId?: string;
      bankName?: string;
      transactionId: string;
    };
    shippingAddress: Address;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string, courierPartner?: string) => void;
  releaseEscrow: (orderId: string) => void;
  
  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  
  // Chat & Negotiations
  conversations: Conversation[];
  chatMessages: Record<string, ChatMessage[]>;
  startConversation: (productId: string, initialOfferPrice?: number) => string;
  sendChatMessage: (conversationId: string, text: string, isOffer?: boolean, offerPrice?: number) => void;
  respondToOffer: (conversationId: string, messageId: string, accept: boolean) => void;
  
  // Notifications
  notifications: Notification[];
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  
  // Moderation, Reports & Admin
  reports: Report[];
  submitReport: (report: Omit<Report, 'id' | 'createdAt' | 'status'>) => void;
  resolveReport: (reportId: string, newStatus: 'reviewed' | 'resolved' | 'dismissed') => void;
  helpTickets: HelpTicket[];
  submitHelpTicket: (ticket: Omit<HelpTicket, 'id' | 'createdAt' | 'status'>) => void;
  
  // Modals & UI states
  paymentModal: {
    isOpen: boolean;
    product: Product | null;
    offerPrice?: number;
  };
  openPaymentModal: (product: Product, offerPrice?: number) => void;
  closePaymentModal: () => void;
  
  reportModal: {
    isOpen: boolean;
    targetType: 'listing' | 'user';
    targetId: string;
    targetTitle: string;
  };
  openReportModal: (type: 'listing' | 'user', id: string, title: string) => void;
  closeReportModal: () => void;
  
  // Toast notifications
  toast: ToastInfo | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'easymart_users_v1',
  CURRENT_USER_ID: 'easymart_current_user_id_v1',
  PRODUCTS: 'easymart_products_v1',
  WISHLIST: 'easymart_wishlist_v1',
  ORDERS: 'easymart_orders_v1',
  REVIEWS: 'easymart_reviews_v1',
  CONVERSATIONS: 'easymart_conversations_v1',
  CHAT_MESSAGES: 'easymart_chat_messages_v1',
  NOTIFICATIONS: 'easymart_notifications_v1',
  REPORTS: 'easymart_reports_v1',
  TICKETS: 'easymart_tickets_v1',
  SELECTED_CITY: 'easymart_selected_city_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [navParams, setNavParams] = useState<NavigationParams>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCityState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_CITY) || 'All India';
  });

  const setSelectedCity = (city: string) => {
    setSelectedCityState(city);
    localStorage.setItem(STORAGE_KEYS.SELECTED_CITY, city);
  };

  const navigateTo = (page: ActivePage, params?: NavigationParams) => {
    setActivePage(page);
    if (params) {
      setNavParams(params);
      if (params.query !== undefined) {
        setSearchQuery(params.query);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toast
  const [toast, setToast] = useState<ToastInfo | null>(null);
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 3500);
  };

  // Users
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved || 'usr-buyer-demo';
  });

  const currentUser = users.find(u => u.id === currentUserId) || users[0] || INITIAL_USERS[0];

  const setCurrentUserById = (userId: string) => {
    setCurrentUserId(userId);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
    showToast(`Switched profile to ${users.find(u => u.id === userId)?.name || 'User'}`, 'info');
  };

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    return saved ? JSON.parse(saved) : ['prod-1', 'prod-4'];
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Conversations & Chat
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Reports
  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return saved ? JSON.parse(saved) : [
      {
        id: 'rep-1',
        reporterId: 'usr-buyer-demo',
        reporterName: 'Aarav Sharma',
        targetType: 'listing' as const,
        targetId: 'prod-heavy-sample',
        targetTitle: 'Car Engine Gearbox Assembly (Prohibited Item)',
        reason: 'Heavy Machinery / Automotive violation',
        details: 'EasyMart is strictly for everyday essentials. This user posted an automotive engine weighing 40kg.',
        status: 'pending' as const,
        createdAt: '2026-09-21T09:00:00Z'
      }
    ];
  });

  // Help Tickets
  const [helpTickets, setHelpTickets] = useState<HelpTicket[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TICKETS);
    return saved ? JSON.parse(saved) : [
      {
        id: 'tkt-1',
        userId: 'usr-buyer-demo',
        userName: 'Aarav Sharma',
        userEmail: 'aarav.sharma@example.in',
        category: 'Escrow Payment Question',
        subject: 'How long until funds are released to seller?',
        message: 'Namaste EasyMart team, does the escrow release automatically after 48 hours of delivery if no dispute is opened?',
        status: 'resolved' as const,
        createdAt: '2026-09-18T14:00:00Z'
      }
    ];
  });

  // Modals state
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    product: Product | null;
    offerPrice?: number;
  }>({
    isOpen: false,
    product: null,
  });

  const openPaymentModal = (product: Product, offerPrice?: number) => {
    setPaymentModal({ isOpen: true, product, offerPrice });
  };

  const closePaymentModal = () => {
    setPaymentModal({ isOpen: false, product: null });
  };

  const [reportModal, setReportModal] = useState<{
    isOpen: boolean;
    targetType: 'listing' | 'user';
    targetId: string;
    targetTitle: string;
  }>({
    isOpen: false,
    targetType: 'listing',
    targetId: '',
    targetTitle: ''
  });

  const openReportModal = (type: 'listing' | 'user', id: string, title: string) => {
    setReportModal({
      isOpen: true,
      targetType: type,
      targetId: id,
      targetTitle: title
    });
  };

  const closeReportModal = () => {
    setReportModal({
      isOpen: false,
      targetType: 'listing',
      targetId: '',
      targetTitle: ''
    });
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(helpTickets));
  }, [helpTickets]);

  // Auth Functions
  const loginUser = (email: string, role?: 'buyer' | 'seller' | 'admin') => {
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUserId(existing.id);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, existing.id);
      showToast(`Welcome back, ${existing.name}!`);
      return true;
    }
    // Auto-create if not found for seamless test demo
    const namePart = email.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: formattedName,
      email,
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      city: 'Bengaluru',
      state: 'Karnataka',
      rating: 5.0,
      reviewCount: 0,
      isVerified: true,
      memberSince: 'Just now',
      bio: 'New member on EasyMart India.',
      upiId: `${namePart}@okhdfcbank`,
      role: role || 'buyer',
      savedAddresses: [
        {
          id: `addr-${Date.now()}`,
          fullName: formattedName,
          phone: '+91 98765 43210',
          addressLine1: 'Flat 101, Prestige Palms',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560001',
          isDefault: true,
          label: 'Home'
        }
      ]
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, newUser.id);
    showToast(`Account created & logged in as ${newUser.name}!`);
    return true;
  };

  const registerUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: userData.name || 'New Member',
      email: userData.email || 'user@example.in',
      phone: userData.phone || '+91 98765 43210',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      city: userData.city || 'Mumbai',
      state: userData.state || 'Maharashtra',
      rating: 5.0,
      reviewCount: 0,
      isVerified: true,
      memberSince: 'Today',
      bio: userData.bio || 'Verified member on EasyMart India.',
      upiId: userData.upiId || 'easymart.user@upi',
      role: userData.role || 'buyer',
      savedAddresses: userData.savedAddresses || []
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, newUser.id);
    showToast(`Welcome to EasyMart, ${newUser.name}!`);
  };

  const updateUserProfile = (updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...updates } : u));
    showToast('Profile updated successfully!');
  };

  const addSavedAddress = (addressData: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...addressData,
      id: `addr-${Date.now()}`,
      isDefault: currentUser.savedAddresses.length === 0 ? true : addressData.isDefault
    };

    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const addresses = newAddress.isDefault 
          ? u.savedAddresses.map(a => ({ ...a, isDefault: false }))
          : u.savedAddresses;
        return {
          ...u,
          savedAddresses: [...addresses, newAddress]
        };
      }
      return u;
    }));

    showToast('Delivery address saved!');
  };

  const updateSavedAddress = (updated: Address) => {
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          savedAddresses: u.savedAddresses.map(a => a.id === updated.id ? updated : (updated.isDefault ? { ...a, isDefault: false } : a))
        };
      }
      return u;
    }));
    showToast('Address updated!');
  };

  const deleteSavedAddress = (addressId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          savedAddresses: u.savedAddresses.filter(a => a.id !== addressId)
        };
      }
      return u;
    }));
    showToast('Address removed');
  };

  const setDefaultAddress = (addressId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          savedAddresses: u.savedAddresses.map(a => ({ ...a, isDefault: a.id === addressId }))
        };
      }
      return u;
    }));
    showToast('Default delivery address updated');
  };

  // Product Functions
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'views' | 'likesCount' | 'status'>) => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
      status: 'active',
      views: 1,
      likesCount: 0,
      createdAt: new Date().toISOString()
    };

    setProducts(prev => [newProduct, ...prev]);

    // Send notification
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Listing Published! 🚀',
      message: `Your item "${newProduct.title}" is live on EasyMart India.`,
      type: 'listing',
      read: false,
      timestamp: 'Just now',
      linkPage: 'product-details',
      linkId: newId
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast('Your item has been listed for sale!');
    return newId;
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updates } : p));
    showToast('Listing updated successfully!');
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setWishlist(prev => prev.filter(id => id !== productId));
    showToast('Listing removed');
  };

  const markProductSold = (productId: string) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: 'sold' } : p));
    showToast('Marked as sold! Great job.');
  };

  const incrementProductViews = (productId: string) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, views: p.views + 1 } : p));
  };

  // Wishlist Functions
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Added to your wishlist! ❤️');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Orders & Escrow
  const createOrder = (orderData: {
    productId: string;
    product: Product;
    amount: number;
    shippingFee: number;
    paymentMethod: 'upi' | 'netbanking' | 'card' | 'cod';
    paymentDetails: {
      upiId?: string;
      bankName?: string;
      transactionId: string;
    };
    shippingAddress: Address;
  }) => {
    const orderNumber = `EM-IN-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      productId: orderData.productId,
      productTitle: orderData.product.title,
      productPrice: orderData.amount,
      productImage: orderData.product.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      category: orderData.product.category,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerPhone: currentUser.phone,
      sellerId: orderData.product.sellerId,
      sellerName: orderData.product.seller.name,
      sellerPhone: '+91 98450 71290',
      sellerUpiId: 'seller@upi',
      amount: orderData.amount,
      shippingFee: orderData.shippingFee,
      totalAmount: orderData.amount + orderData.shippingFee,
      paymentMethod: orderData.paymentMethod,
      paymentDetails: {
        ...orderData.paymentDetails,
        paidAt: new Date().toISOString(),
        status: 'success'
      },
      shippingAddress: orderData.shippingAddress,
      status: 'confirmed',
      estimatedDelivery: '3-4 business days via Indian Courier',
      createdAt: new Date().toISOString(),
      escrowStatus: 'held_in_escrow'
    };

    setOrders(prev => [newOrder, ...prev]);

    // Mark product as sold or reserved
    setProducts(prev => prev.map(p => p.id === orderData.productId ? { ...p, status: 'reserved' } : p));

    // Buyer Notification
    const buyerNotif: Notification = {
      id: `notif-${Date.now()}-1`,
      userId: currentUser.id,
      title: `Order Confirmed: ${orderNumber} 🎉`,
      message: `₹${newOrder.totalAmount} is held securely in EasyMart Escrow. Seller has been notified to pack & dispatch.`,
      type: 'order',
      read: false,
      timestamp: 'Just now',
      linkPage: 'orders',
      linkId: newOrder.id
    };

    // Seller Notification
    const sellerNotif: Notification = {
      id: `notif-${Date.now()}-2`,
      userId: orderData.product.sellerId,
      title: `You have a new sale! 📦`,
      message: `${currentUser.name} purchased "${orderData.product.title}". Please dispatch via courier.`,
      type: 'order',
      read: false,
      timestamp: 'Just now',
      linkPage: 'sales',
      linkId: newOrder.id
    };

    setNotifications(prev => [buyerNotif, sellerNotif, ...prev]);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, trackingNumber?: string, courierPartner?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updated = { ...o, status };
        if (trackingNumber) updated.trackingNumber = trackingNumber;
        if (courierPartner) updated.courierPartner = courierPartner;
        if (status === 'delivered') {
          updated.escrowStatus = 'released_to_seller';
        }
        return updated;
      }
      return o;
    }));

    showToast(`Order status updated to "${status.replace('_', ' ')}"`);
  };

  const releaseEscrow = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'delivered',
          escrowStatus: 'released_to_seller'
        };
      }
      return o;
    }));
    showToast('Parcel delivery confirmed! Escrow funds released to seller UPI.');
  };

  // Reviews
  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Today'
    };
    setReviews(prev => [newReview, ...prev]);

    // Recalculate target seller rating if seller
    if (reviewData.targetType === 'seller') {
      const sellerReviews = [...reviews.filter(r => r.targetType === 'seller' && r.targetId === reviewData.targetId), newReview];
      const avg = sellerReviews.reduce((sum, r) => sum + r.rating, 0) / sellerReviews.length;
      setUsers(prev => prev.map(u => u.id === reviewData.targetId ? {
        ...u,
        rating: Number(avg.toFixed(2)),
        reviewCount: sellerReviews.length
      } : u));
    }

    showToast('Review and rating submitted! Thank you.');
  };

  // Chat & Negotiations
  const startConversation = (productId: string, initialOfferPrice?: number): string => {
    const targetProduct = products.find(p => p.id === productId);
    if (!targetProduct) return '';

    // Check existing conversation
    const existing = conversations.find(c => 
      c.productId === productId && 
      ((c.buyerId === currentUser.id && c.sellerId === targetProduct.sellerId) || 
       (c.sellerId === currentUser.id && c.buyerId === targetProduct.sellerId))
    );

    if (existing) {
      navigateTo('chat', { conversationId: existing.id });
      return existing.id;
    }

    const convId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: convId,
      productId: targetProduct.id,
      productTitle: targetProduct.title,
      productPrice: targetProduct.price,
      productImage: targetProduct.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      sellerId: targetProduct.sellerId,
      sellerName: targetProduct.seller.name,
      lastMessage: initialOfferPrice ? `Sent an offer for ₹${initialOfferPrice}` : 'Hi, is this everyday essential still available?',
      lastTimestamp: 'Just now',
      unreadCount: 0
    };

    const initialMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      conversationId: convId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: initialOfferPrice 
        ? `Namaste! I am interested in "${targetProduct.title}". Would you accept an offer of ₹${initialOfferPrice}?` 
        : `Namaste! I am interested in this item. Is it still available for quick delivery in India?`,
      timestamp: 'Just now',
      isOffer: Boolean(initialOfferPrice),
      offerPrice: initialOfferPrice,
      offerStatus: initialOfferPrice ? 'pending' : undefined
    };

    setConversations(prev => [newConv, ...prev]);
    setChatMessages(prev => ({
      ...prev,
      [convId]: [initialMsg]
    }));

    // Automated seller reply simulation after 1.5 seconds if talking to another seller
    setTimeout(() => {
      setChatMessages(curr => {
        const existingList = curr[convId] || [];
        const botReply: ChatMessage = {
          id: `m-reply-${Date.now()}`,
          conversationId: convId,
          senderId: targetProduct.sellerId,
          senderName: targetProduct.seller.name,
          text: initialOfferPrice 
            ? `Namaste ${currentUser.name}! Thank you for the offer. I can accept this! Feel free to proceed with EasyMart Escrow payment.`
            : `Namaste ${currentUser.name}! Yes, it is in excellent condition and ready to pack today. You can place the order anytime via UPI.`,
          timestamp: 'Just now'
        };
        return {
          ...curr,
          [convId]: [...existingList, botReply]
        };
      });

      setConversations(curr => curr.map(c => c.id === convId ? {
        ...c,
        lastMessage: initialOfferPrice ? 'Offer accepted! You can proceed to payment.' : 'Yes, ready to pack today!',
        lastTimestamp: 'Just now'
      } : c));
    }, 1200);

    navigateTo('chat', { conversationId: convId });
    return convId;
  };

  const sendChatMessage = (conversationId: string, text: string, isOffer?: boolean, offerPrice?: number) => {
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      timestamp: 'Just now',
      isOffer,
      offerPrice,
      offerStatus: isOffer ? 'pending' : undefined
    };

    setChatMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg]
    }));

    setConversations(prev => prev.map(c => c.id === conversationId ? {
      ...c,
      lastMessage: text,
      lastTimestamp: 'Just now'
    } : c));
  };

  const respondToOffer = (conversationId: string, messageId: string, accept: boolean) => {
    setChatMessages(prev => {
      const list = prev[conversationId] || [];
      return {
        ...prev,
        [conversationId]: list.map(m => m.id === messageId ? {
          ...m,
          offerStatus: accept ? 'accepted' : 'declined'
        } : m)
      };
    });

    const statusText = accept ? 'Offer accepted! Buyer can now complete payment.' : 'Offer declined.';
    showToast(statusText);

    // Send confirmation message
    sendChatMessage(conversationId, accept ? 'I have accepted your offer! You can now checkout securely.' : 'Sorry, the offered price is too low for this item condition.');
  };

  // Notifications
  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  // Moderation & Reports
  const submitReport = (reportData: Omit<Report, 'id' | 'createdAt' | 'status'>) => {
    const newReport: Report = {
      ...reportData,
      id: `rep-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setReports(prev => [newReport, ...prev]);
    showToast('Thank you for reporting. Our Indian safety team will review this within 2 hours.');
  };

  const resolveReport = (reportId: string, newStatus: 'reviewed' | 'resolved' | 'dismissed') => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
    showToast(`Report updated to ${newStatus}`);
  };

  const submitHelpTicket = (ticketData: Omit<HelpTicket, 'id' | 'createdAt' | 'status'>) => {
    const newTicket: HelpTicket = {
      ...ticketData,
      id: `tkt-${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    setHelpTickets(prev => [newTicket, ...prev]);
    showToast('Support ticket raised! Ticket ID: #' + newTicket.id.slice(-6).toUpperCase());
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        navParams,
        navigateTo,
        currentUser,
        users,
        setCurrentUserById,
        loginUser,
        registerUser,
        updateUserProfile,
        addSavedAddress,
        updateSavedAddress,
        deleteSavedAddress,
        setDefaultAddress,
        products,
        categories: CATEGORIES,
        searchQuery,
        setSearchQuery,
        selectedCity,
        setSelectedCity,
        addProduct,
        updateProduct,
        deleteProduct,
        markProductSold,
        incrementProductViews,
        wishlist,
        toggleWishlist,
        isWishlisted,
        orders,
        createOrder,
        updateOrderStatus,
        releaseEscrow,
        reviews,
        addReview,
        conversations,
        chatMessages,
        startConversation,
        sendChatMessage,
        respondToOffer,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        reports,
        submitReport,
        resolveReport,
        helpTickets,
        submitHelpTicket,
        paymentModal,
        openPaymentModal,
        closePaymentModal,
        reportModal,
        openReportModal,
        closeReportModal,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
