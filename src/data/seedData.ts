import { Product, ProductCategory, User, Review, Order, Notification, Conversation, ChatMessage } from '../types';

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Delhi NCR', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 
  'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
];

export const MAJOR_INDIAN_CITIES = [
  'Bengaluru', 'Mumbai', 'Delhi NCR', 'Pune', 'Hyderabad', 
  'Chennai', 'Kolkata', 'Jaipur', 'Ahmedabad', 'Kochi', 'Chandigarh', 'Lucknow'
];

export const CATEGORIES: ProductCategory[] = [
  {
    id: 'cat-books',
    name: 'Books & Study Essentials',
    slug: 'books-study',
    iconName: 'BookOpen',
    description: 'Textbooks, UPSC prep, competitive exam guides, novels & self-help',
    itemCount: 48,
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cat-kitchen',
    name: 'Kitchen & Dining Essentials',
    slug: 'kitchen-dining',
    iconName: 'Utensils',
    description: 'Spice boxes, flasks, electric kettles, tiffins & compact cooking appliances',
    itemCount: 62,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cat-home',
    name: 'Home Decor & Linen',
    slug: 'home-decor',
    iconName: 'Home',
    description: 'Cotton bedsheets, brass diyas, diffusers, cushions & handmade pottery',
    itemCount: 54,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cat-mobile',
    name: 'Mobile & Audio Accessories',
    slug: 'mobile-audio',
    iconName: 'Headphones',
    description: 'Earphones, power banks, chargers, laptop stands & lightweight peripherals',
    itemCount: 89,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cat-fashion',
    name: 'Daily Wear & Handloom',
    slug: 'fashion-apparel',
    iconName: 'Shirt',
    description: 'Cotton kurtas, dupattas, daily wear tees, watches, bags & footwear',
    itemCount: 71,
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cat-grooming',
    name: 'Personal Care & Grooming',
    slug: 'personal-care',
    iconName: 'Sparkles',
    description: 'Trimmers, hair stylers, skincare organizers & grooming essentials',
    itemCount: 39,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cat-baby',
    name: 'Kids & Baby Essentials',
    slug: 'kids-baby',
    iconName: 'Smile',
    description: 'Non-toxic toys, flashcards, soft storybooks, baby feeding sets',
    itemCount: 33,
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cat-fitness',
    name: 'Fitness & Everyday Sports',
    slug: 'sports-fitness',
    iconName: 'Activity',
    description: 'Yoga mats, resistance bands, badminton sets & skipping ropes',
    itemCount: 41,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cat-crafts',
    name: 'Handmade Crafts & Gifts',
    slug: 'crafts-gifts',
    iconName: 'Gift',
    description: 'Handcrafted journals, jute bags, festive decor, crochet & art prints',
    itemCount: 45,
    image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cat-pantry',
    name: 'Packaged Spices & Teas',
    slug: 'pantry-tea',
    iconName: 'Coffee',
    description: 'Sealed Darjeeling tea tins, Kashmiri saffron, organic coffee beans',
    itemCount: 28,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80'
  }
];

export const SAMPLE_STARTER_USERS: User[] = [
  {
    id: 'usr-buyer-demo',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.in',
    phone: '+91 98201 44512',
    avatar: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    rating: 4.9,
    reviewCount: 18,
    isVerified: true,
    memberSince: 'Mar 2024',
    bio: 'Software engineer living in Koramangala, Bengaluru. Love reading non-fiction and tech books, and trading gently used home goods.',
    upiId: 'aarav.sharma@okaxis',
    password: 'password123',
    role: 'buyer',
    savedAddresses: [
      {
        id: 'addr-1',
        fullName: 'Aarav Sharma',
        phone: '+91 98201 44512',
        addressLine1: 'Flat 402, Green Glen Layout, Bellandur',
        addressLine2: 'Near Outer Ring Road',
        landmark: 'Opposite Central Mall',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560103',
        isDefault: true,
        label: 'Home'
      },
      {
        id: 'addr-2',
        fullName: 'Aarav Sharma',
        phone: '+91 98201 44512',
        addressLine1: 'Embassy TechVillage, Block 2B, 3rd Floor',
        landmark: 'Devarabisanahalli',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560103',
        isDefault: false,
        label: 'Work'
      }
    ]
  },
  {
    id: 'usr-seller-priya',
    name: 'Priya Iyer',
    email: 'priya.iyer@example.in',
    phone: '+91 98450 71290',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    city: 'Pune',
    state: 'Maharashtra',
    rating: 4.95,
    reviewCount: 34,
    isVerified: true,
    memberSince: 'Jan 2023',
    bio: 'Interior enthusiast & verified EasyMart Super Seller. All items are strictly authentic, neatly packaged, and dispatched within 24 hours.',
    upiId: 'priya.iyer@oksbi',
    password: 'password123',
    role: 'seller',
    savedAddresses: [
      {
        id: 'addr-3',
        fullName: 'Priya Iyer',
        phone: '+91 98450 71290',
        addressLine1: 'B-701, Rohan Mithila, Viman Nagar',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411014',
        isDefault: true,
        label: 'Home'
      }
    ]
  },
  {
    id: 'usr-seller-vikram',
    name: 'Vikram Malhotra',
    email: 'vikram.m@example.in',
    phone: '+91 99100 88231',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    city: 'Delhi NCR',
    state: 'Delhi NCR',
    rating: 4.88,
    reviewCount: 22,
    isVerified: true,
    memberSince: 'Jun 2023',
    bio: 'Avid bookworm & tech enthusiast. De-cluttering books, wireless accessories, and home items at fair prices.',
    upiId: 'vikram.malhotra@okhdfcbank',
    password: 'password123',
    role: 'seller',
    savedAddresses: [
      {
        id: 'addr-4',
        fullName: 'Vikram Malhotra',
        phone: '+91 99100 88231',
        addressLine1: '14/B, Block C, Vasant Kunj',
        city: 'Delhi NCR',
        state: 'Delhi NCR',
        pincode: '110070',
        isDefault: true,
        label: 'Home'
      }
    ]
  },
  {
    id: 'usr-admin-rajesh',
    name: 'Rajesh K. Verma (Platform Admin)',
    email: 'admin@easymart.in',
    phone: '+91 98111 00222',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
    city: 'Mumbai',
    state: 'Maharashtra',
    rating: 5.0,
    reviewCount: 65,
    isVerified: true,
    memberSince: 'Aug 2022',
    bio: 'EasyMart Community Trust & Safety Team Lead. Ensuring safe peer-to-peer transactions across India.',
    upiId: 'easymart.escrow@icici',
    password: 'admin123',
    role: 'admin',
    savedAddresses: []
  }
];

export const SAMPLE_STARTER_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Indian Polity by M. Laxmikanth (7th Edition) - Clean Condition',
    description: 'The standard bible for UPSC civil services exam and state PSCs. Bought 4 months ago, no pen markings, pristine pages. Includes constitutional amendment updates. Essential for civil service aspirants.',
    price: 499,
    originalPrice: 995,
    category: 'Books & Study Essentials',
    condition: 'Like New (Barely Used)',
    weightGrams: 950,
    dimensions: '24 x 18 x 4 cm',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'usr-seller-vikram',
    seller: {
      id: 'usr-seller-vikram',
      name: 'Vikram Malhotra',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      city: 'Delhi NCR',
      state: 'Delhi NCR',
      rating: 4.88,
      reviewCount: 22,
      isVerified: true,
      memberSince: 'Jun 2023'
    },
    location: {
      city: 'Delhi NCR',
      state: 'Delhi NCR',
      pincode: '110070'
    },
    tags: ['UPSC', 'CivilServices', 'Polity', 'Laxmikanth', 'Books'],
    status: 'active',
    createdAt: '2026-09-18T10:30:00Z',
    views: 342,
    likesCount: 29,
    negotiable: true,
    pickupAvailable: true,
    shippingAvailable: true,
    shippingFee: 49,
    featured: true
  },
  {
    id: 'prod-2',
    title: 'Prestige 1.5L Stainless Steel Electric Kettle (Auto Cut-off)',
    description: 'Prestige electric kettle with 1500W rapid boiling, 360-degree swivel base, and automatic dry boil protection. Perfect for making quick morning chai, green tea, instant noodles, or boiling drinking water. Barely used in my PG room, moving back home.',
    price: 680,
    originalPrice: 1245,
    category: 'Kitchen & Dining Essentials',
    condition: 'Gently Used',
    weightGrams: 850,
    dimensions: '22 x 16 x 24 cm',
    images: [
      'https://images.unsplash.com/photo-1594213114663-ddfe1e48eb84?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'usr-seller-priya',
    seller: {
      id: 'usr-seller-priya',
      name: 'Priya Iyer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
      city: 'Pune',
      state: 'Maharashtra',
      rating: 4.95,
      reviewCount: 34,
      isVerified: true,
      memberSince: 'Jan 2023'
    },
    location: {
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411014'
    },
    tags: ['Prestige', 'Kettle', 'HostelEssential', 'Kitchen', 'HomeAppliances'],
    status: 'active',
    createdAt: '2026-09-19T14:15:00Z',
    views: 418,
    likesCount: 38,
    negotiable: false,
    pickupAvailable: true,
    shippingAvailable: true,
    shippingFee: 60,
    featured: true
  },
  {
    id: 'prod-3',
    title: 'Traditional Pure Brass Akhand Diya with Glass Chimney & Bell',
    description: 'Exquisite handcrafted heavy brass pooja diya with heat-resistant borosilicate glass cover. Burns continuously without flickering in fan air. Comes along with a small tuned pooja ghanti (bell). Cleaned with pitambari, shining bright.',
    price: 450,
    originalPrice: 899,
    category: 'Home Decor & Linen',
    condition: 'Like New (Barely Used)',
    weightGrams: 620,
    dimensions: '14 x 14 x 18 cm',
    images: [
      'https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'usr-seller-priya',
    seller: {
      id: 'usr-seller-priya',
      name: 'Priya Iyer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
      city: 'Pune',
      state: 'Maharashtra',
      rating: 4.95,
      reviewCount: 34,
      isVerified: true,
      memberSince: 'Jan 2023'
    },
    location: {
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411014'
    },
    tags: ['BrassDiya', 'PoojaItems', 'HomeDecor', 'Festive', 'Handicraft'],
    status: 'active',
    createdAt: '2026-09-20T09:00:00Z',
    views: 290,
    likesCount: 22,
    negotiable: true,
    pickupAvailable: true,
    shippingAvailable: true,
    shippingFee: 49,
    featured: true
  },
  {
    id: 'prod-4',
    title: 'boAt Rockerz 450 Bluetooth On-Ear Headphones (Matte Black)',
    description: 'Up to 15 hours battery backup, 40mm dynamic drivers with signature punchy bass. Soft adaptive ear cushions and dual modes (Bluetooth 5.0 + AUX). Charging cable and audio cable included. Only tested twice.',
    price: 899,
    originalPrice: 1990,
    category: 'Mobile & Audio Accessories',
    condition: 'Like New (Barely Used)',
    weightGrams: 168,
    dimensions: '18 x 16 x 6 cm',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'usr-seller-vikram',
    seller: {
      id: 'usr-seller-vikram',
      name: 'Vikram Malhotra',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      city: 'Delhi NCR',
      state: 'Delhi NCR',
      rating: 4.88,
      reviewCount: 22,
      isVerified: true,
      memberSince: 'Jun 2023'
    },
    location: {
      city: 'Delhi NCR',
      state: 'Delhi NCR',
      pincode: '110070'
    },
    tags: ['boAt', 'Headphones', 'Audio', 'Bluetooth', 'Wireless'],
    status: 'active',
    createdAt: '2026-09-20T11:45:00Z',
    views: 520,
    likesCount: 64,
    negotiable: true,
    pickupAvailable: true,
    shippingAvailable: true,
    shippingFee: 49,
    featured: true
  },
  {
    id: 'prod-5',
    title: 'Handloom Pure Khadi Cotton Kurta (Size L / 40 - Indigo Blue)',
    description: 'Authentic 100% breathable khadi cotton long kurta with mandarin collar and functional wooden buttons. Hand-spun yarn keeps you cool during Indian summers. Worn once for a family festival, dry-cleaned.',
    price: 550,
    originalPrice: 1450,
    category: 'Daily Wear & Handloom',
    condition: 'Like New (Barely Used)',
    weightGrams: 280,
    dimensions: 'L: 42 inch chest',
    images: [
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'usr-buyer-demo',
    seller: {
      id: 'usr-buyer-demo',
      name: 'Aarav Sharma',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      city: 'Bengaluru',
      state: 'Karnataka',
      rating: 4.9,
      reviewCount: 18,
      isVerified: true,
      memberSince: 'Mar 2024'
    },
    location: {
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103'
    },
    tags: ['Khadi', 'Kurta', 'EthnicWear', 'Cotton', 'SummerFashion'],
    status: 'active',
    createdAt: '2026-09-21T08:20:00Z',
    views: 215,
    likesCount: 19,
    negotiable: false,
    pickupAvailable: true,
    shippingAvailable: true,
    shippingFee: 40,
    featured: false
  },
  {
    id: 'prod-6',
    title: 'Philips Series 3000 Cordless Beard Trimmer with Lift & Trim',
    description: 'Philips stainless steel self-sharpening blades, 20 lock-in length settings (0.5mm to 10mm). Washable head, 45 minutes cordless usage on one charge. Comes with cleaning brush and USB charging cable.',
    price: 799,
    originalPrice: 1595,
    category: 'Personal Care & Grooming',
    condition: 'Good Condition',
    weightGrams: 220,
    dimensions: '19 x 6 x 4 cm',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'usr-seller-vikram',
    seller: {
      id: 'usr-seller-vikram',
      name: 'Vikram Malhotra',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      city: 'Delhi NCR',
      state: 'Delhi NCR',
      rating: 4.88,
      reviewCount: 22,
      isVerified: true,
      memberSince: 'Jun 2023'
    },
    location: {
      city: 'Delhi NCR',
      state: 'Delhi NCR',
      pincode: '110070'
    },
    tags: ['Philips', 'Trimmer', 'Grooming', 'MenCare'],
    status: 'active',
    createdAt: '2026-09-21T12:00:00Z',
    views: 310,
    likesCount: 27,
    negotiable: true,
    pickupAvailable: true,
    shippingAvailable: true,
    shippingFee: 49,
    featured: false
  },
  {
    id: 'prod-7',
    title: 'Boldfit 6mm Eco-friendly TPE Yoga Mat with Alignment Lines',
    description: 'Dual-layer anti-tear non-slip surface yoga mat with embossed laser body alignment marks. Moisture resistant, easy to clean with damp cloth. Comes with carrying strap and carry bag. Ideal for home morning workouts & pranayama.',
    price: 599,
    originalPrice: 1299,
    category: 'Fitness & Everyday Sports',
    condition: 'Like New (Barely Used)',
    weightGrams: 900,
    dimensions: '183 x 61 x 0.6 cm',
    images: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'usr-seller-priya',
    seller: {
      id: 'usr-seller-priya',
      name: 'Priya Iyer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
      city: 'Pune',
      state: 'Maharashtra',
      rating: 4.95,
      reviewCount: 34,
      isVerified: true,
      memberSince: 'Jan 2023'
    },
    location: {
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411014'
    },
    tags: ['YogaMat', 'Fitness', 'Boldfit', 'HomeGym', 'Wellness'],
    status: 'active',
    createdAt: '2026-09-21T15:30:00Z',
    views: 260,
    likesCount: 33,
    negotiable: false,
    pickupAvailable: true,
    shippingAvailable: true,
    shippingFee: 55,
    featured: true
  },
  {
    id: 'prod-8',
    title: 'Milton 7-Piece Stainless Steel Spice Box / Masala Dabba',
    description: 'Heavy gauge food-grade rust-resistant stainless steel masala container with transparent see-through lid and mini brass spice spoon. Keeps everyday Indian spices fresh and aromatic. No dents.',
    price: 380,
    originalPrice: 750,
    category: 'Kitchen & Dining Essentials',
    condition: 'Like New (Barely Used)',
    weightGrams: 580,
    dimensions: '20 x 20 x 8 cm',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'usr-seller-priya',
    seller: {
      id: 'usr-seller-priya',
      name: 'Priya Iyer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
      city: 'Pune',
      state: 'Maharashtra',
      rating: 4.95,
      reviewCount: 34,
      isVerified: true,
      memberSince: 'Jan 2023'
    },
    location: {
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411014'
    },
    tags: ['MasalaDabba', 'KitchenStorage', 'Milton', 'SteelContainer'],
    status: 'active',
    createdAt: '2026-09-21T17:10:00Z',
    views: 180,
    likesCount: 15,
    negotiable: true,
    pickupAvailable: true,
    shippingAvailable: true,
    shippingFee: 49,
    featured: false
  },
  {
    id: 'prod-9',
    title: 'Portronics 20000mAh Power Bank with 22.5W Fast Charging (Type-C)',
    description: 'Power Series 20K compact portable charger with dual USB-A and Type-C Power Delivery. Charges iPhone 15/Samsung twice as fast. LED power level indicator. Safe circuit protection.',
    price: 950,
    originalPrice: 1899,
    category: 'Mobile & Audio Accessories',
    condition: 'Like New (Barely Used)',
    weightGrams: 360,
    dimensions: '14 x 6.8 x 2.7 cm',
    images: [
      'https://images.unsplash.com/photo-1609592807664-44b2591696a2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'usr-seller-vikram',
    seller: {
      id: 'usr-seller-vikram',
      name: 'Vikram Malhotra',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      city: 'Delhi NCR',
      state: 'Delhi NCR',
      rating: 4.88,
      reviewCount: 22,
      isVerified: true,
      memberSince: 'Jun 2023'
    },
    location: {
      city: 'Delhi NCR',
      state: 'Delhi NCR',
      pincode: '110070'
    },
    tags: ['PowerBank', 'Portronics', 'FastCharging', 'TravelEssential'],
    status: 'active',
    createdAt: '2026-09-22T04:00:00Z',
    views: 410,
    likesCount: 42,
    negotiable: false,
    pickupAvailable: true,
    shippingAvailable: true,
    shippingFee: 49,
    featured: true
  },
  {
    id: 'prod-10',
    title: 'Original Darjeeling First Flush Whole Leaf Tea Tin (100g Sealed)',
    description: 'Single-estate loose whole leaf Darjeeling tea packed in a collectible airtight embossed tin. Delicate floral muscatel aroma. Unopened sealed foil pack with expiry date December 2027.',
    price: 340,
    originalPrice: 650,
    category: 'Packaged Spices & Teas',
    condition: 'Brand New (Packaged)',
    weightGrams: 160,
    dimensions: '9 x 9 x 12 cm',
    images: [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'usr-seller-priya',
    seller: {
      id: 'usr-seller-priya',
      name: 'Priya Iyer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
      city: 'Pune',
      state: 'Maharashtra',
      rating: 4.95,
      reviewCount: 34,
      isVerified: true,
      memberSince: 'Jan 2023'
    },
    location: {
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411014'
    },
    tags: ['DarjeelingTea', 'OrganicTea', 'FirstFlush', 'Pantry'],
    status: 'active',
    createdAt: '2026-09-22T05:30:00Z',
    views: 195,
    likesCount: 20,
    negotiable: false,
    pickupAvailable: true,
    shippingAvailable: true,
    shippingFee: 45,
    featured: false
  }
];

export const SAMPLE_STARTER_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    targetType: 'seller',
    targetId: 'usr-seller-priya',
    authorId: 'usr-buyer-demo',
    authorName: 'Aarav Sharma',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
    rating: 5,
    comment: 'Priya packed the items with bubble wrap and dispatched via Delhivery on the exact same afternoon. Everything arrived in immaculate condition! Highly trustworthy seller.',
    date: '10 Sep 2026',
    verifiedPurchase: true
  },
  {
    id: 'rev-2',
    targetType: 'seller',
    targetId: 'usr-seller-vikram',
    authorId: 'usr-buyer-demo',
    authorName: 'Aarav Sharma',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
    rating: 5,
    comment: 'Great dealing with Vikram! Book was exactly as photographed, no scribbles, and prompt answers in the chat.',
    date: '14 Sep 2026',
    verifiedPurchase: true
  },
  {
    id: 'rev-3',
    targetType: 'product',
    targetId: 'prod-1',
    authorId: 'usr-seller-priya',
    authorName: 'Priya Iyer',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    rating: 5,
    comment: '7th edition has all the updated tables. Must-have copy for UPSC aspirants, saved nearly ₹500 off retail!',
    date: '19 Sep 2026',
    verifiedPurchase: true
  }
];

export const SAMPLE_STARTER_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'EM-IN-78219',
    productId: 'prod-3',
    productTitle: 'Traditional Pure Brass Akhand Diya with Glass Chimney & Bell',
    productPrice: 450,
    productImage: 'https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&w=800&q=80',
    category: 'Home Decor & Linen',
    buyerId: 'usr-buyer-demo',
    buyerName: 'Aarav Sharma',
    buyerPhone: '+91 98201 44512',
    sellerId: 'usr-seller-priya',
    sellerName: 'Priya Iyer',
    sellerPhone: '+91 98450 71290',
    sellerUpiId: 'priya.iyer@oksbi',
    amount: 450,
    shippingFee: 49,
    totalAmount: 499,
    paymentMethod: 'upi',
    paymentDetails: {
      upiId: 'aarav.sharma@okaxis',
      transactionId: 'UPI-IN-98127391283',
      paidAt: '2026-09-20T10:14:00Z',
      status: 'success'
    },
    shippingAddress: {
      id: 'addr-1',
      fullName: 'Aarav Sharma',
      phone: '+91 98201 44512',
      addressLine1: 'Flat 402, Green Glen Layout, Bellandur',
      addressLine2: 'Near Outer Ring Road',
      landmark: 'Opposite Central Mall',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103',
      isDefault: true,
      label: 'Home'
    },
    status: 'dispatched',
    trackingNumber: 'DEL-928172635IN',
    courierPartner: 'Delhivery Surface',
    estimatedDelivery: '24 Sep 2026',
    createdAt: '2026-09-20T10:14:00Z',
    escrowStatus: 'held_in_escrow'
  }
];

export const SAMPLE_STARTER_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    productId: 'prod-1',
    productTitle: 'Indian Polity by M. Laxmikanth (7th Edition)',
    productPrice: 499,
    productImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    buyerId: 'usr-buyer-demo',
    buyerName: 'Aarav Sharma',
    sellerId: 'usr-seller-vikram',
    sellerName: 'Vikram Malhotra',
    lastMessage: 'Sure, I can pack it with bubble wrap and ship it tomorrow via India Post!',
    lastTimestamp: 'Yesterday, 6:40 PM',
    unreadCount: 0
  },
  {
    id: 'conv-2',
    productId: 'prod-4',
    productTitle: 'boAt Rockerz 450 Bluetooth On-Ear Headphones',
    productPrice: 899,
    productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    buyerId: 'usr-buyer-demo',
    buyerName: 'Aarav Sharma',
    sellerId: 'usr-seller-vikram',
    sellerName: 'Vikram Malhotra',
    lastMessage: 'Hi Aarav, would you consider ₹800 if I order today?',
    lastTimestamp: '10:15 AM',
    unreadCount: 1
  }
];

export const SAMPLE_STARTER_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  'conv-1': [
    {
      id: 'm-1',
      conversationId: 'conv-1',
      senderId: 'usr-buyer-demo',
      senderName: 'Aarav Sharma',
      text: 'Namaste Vikram! Does the Laxmikanth 7th edition contain the recent 105th & 106th constitutional amendment chapters?',
      timestamp: 'Yesterday, 5:30 PM'
    },
    {
      id: 'm-2',
      conversationId: 'conv-1',
      senderId: 'usr-seller-vikram',
      senderName: 'Vikram Malhotra',
      text: 'Yes Aarav! 7th edition has all the latest amendments, supreme court cases up to 2023, and tabular appendices. No highlight marks either.',
      timestamp: 'Yesterday, 5:45 PM'
    },
    {
      id: 'm-3',
      conversationId: 'conv-1',
      senderId: 'usr-buyer-demo',
      senderName: 'Aarav Sharma',
      text: 'Awesome. Would you be willing to do ₹450?',
      timestamp: 'Yesterday, 6:15 PM',
      isOffer: true,
      offerPrice: 450,
      offerStatus: 'accepted'
    },
    {
      id: 'm-4',
      conversationId: 'conv-1',
      senderId: 'usr-seller-vikram',
      senderName: 'Vikram Malhotra',
      text: 'Sure, I can pack it with bubble wrap and ship it tomorrow via India Post!',
      timestamp: 'Yesterday, 6:40 PM'
    }
  ],
  'conv-2': [
    {
      id: 'm-5',
      conversationId: 'conv-2',
      senderId: 'usr-buyer-demo',
      senderName: 'Aarav Sharma',
      text: 'Hi Vikram, is the aux cable included with the boAt headphones?',
      timestamp: 'Today, 9:50 AM'
    },
    {
      id: 'm-6',
      conversationId: 'conv-2',
      senderId: 'usr-seller-vikram',
      senderName: 'Vikram Malhotra',
      text: 'Yes, original 3.5mm braided cable and micro-USB charging cable both are inside the box!',
      timestamp: 'Today, 10:02 AM'
    },
    {
      id: 'm-7',
      conversationId: 'conv-2',
      senderId: 'usr-buyer-demo',
      senderName: 'Aarav Sharma',
      text: 'Hi Vikram, would you consider ₹800 if I order today?',
      timestamp: '10:15 AM',
      isOffer: true,
      offerPrice: 800,
      offerStatus: 'pending'
    }
  ]
};

export const SAMPLE_STARTER_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'usr-buyer-demo',
    title: 'Order Dispatched with Delhivery 📦',
    message: 'Your order #EM-IN-78219 (Brass Diya) has been picked up. Tracking ID: DEL-928172635IN.',
    type: 'order',
    read: false,
    timestamp: '2 hours ago',
    linkPage: 'orders',
    linkId: 'ord-101'
  },
  {
    id: 'notif-2',
    userId: 'usr-buyer-demo',
    title: 'Offer Accepted! 🎉',
    message: 'Vikram Malhotra accepted your offer of ₹450 for Indian Polity by M. Laxmikanth.',
    type: 'chat',
    read: false,
    timestamp: 'Yesterday',
    linkPage: 'chat',
    linkId: 'conv-1'
  },
  {
    id: 'notif-3',
    userId: 'usr-buyer-demo',
    title: 'EasyMart Buyer Protection 🛡️',
    message: 'Your payment remains safely in Escrow until you inspect and verify the parcel delivery.',
    type: 'system',
    read: true,
    timestamp: '3 days ago'
  }
];

// 100% REAL-WORLD EMPTY REPOSITORIES FOR COMMUNITY LAUNCH
// All lists start pristine and reserved for genuine peer-to-peer users
export const INITIAL_USERS: User[] = [];
export const INITIAL_PRODUCTS: Product[] = [];
export const INITIAL_ORDERS: Order[] = [];
export const INITIAL_CONVERSATIONS: Conversation[] = [];
export const INITIAL_CHAT_MESSAGES: Record<string, ChatMessage[]> = {};
export const INITIAL_NOTIFICATIONS: Notification[] = [];
export const INITIAL_REVIEWS: Review[] = [];

