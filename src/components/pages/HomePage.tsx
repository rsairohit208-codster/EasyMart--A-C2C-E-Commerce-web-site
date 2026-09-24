import React from 'react';
import { 
  ShieldCheck, Search, ArrowRight, Sparkles, MapPin, Heart, 
  Package, CheckCircle2, ChevronRight, Lock, Truck, RefreshCw, AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';

export const HomePage: React.FC = () => {
  const { 
    products, categories, navigateTo, isWishlisted, 
    toggleWishlist, openPaymentModal, setSelectedCity,
    requireAuth
  } = useApp();

  const featuredProducts = products.filter(p => p.status === 'active').slice(0, 8);
  const recentProducts = [...products].reverse().slice(0, 4);

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-neutral-50/50 pt-10 pb-16 border-b border-neutral-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <div className="max-w-3xl mx-auto text-center space-y-6">
            
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-900 border border-emerald-300/80 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>India&apos;s Trusted C2C Everyday Essentials Marketplace 🇮🇳</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-900 tracking-tight font-display leading-[1.15]">
              Buy & Sell <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Everyday Essentials</span> with 100% Escrow Safety.
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Find pre-loved study books, compact kitchenware, home decor, mobile accessories, and handloom apparel from verified neighbors across India.
            </p>

            {/* Scope Discipline Banner */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 text-left font-medium">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Everyday Essentials Only:</strong> Strictly limited to lightweight household & lifestyle products (<strong className="font-bold">under 5kg</strong>). No cars, tractors, or industrial machinery.
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                id="hero-explore-btn"
                onClick={() => navigateTo('products')}
                className="w-full sm:w-auto px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                <span>Browse All Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-sell-btn"
                onClick={() => requireAuth('post a free ad', () => navigateTo('post-item'))}
                className="w-full sm:w-auto px-7 py-3 bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-sm rounded-xl border border-neutral-300 shadow-xs transition flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                <Package className="w-4 h-4 text-emerald-600" />
                <span>Post Free Ad (+ Sell an Item)</span>
              </button>
            </div>

            {/* City Quick Pills */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-neutral-500">
              <span className="font-semibold text-neutral-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Popular Hubs:
              </span>
              {['Bengaluru', 'Mumbai', 'Delhi NCR', 'Pune', 'Hyderabad', 'Chennai'].map(city => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    navigateTo('products');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-emerald-50 hover:text-emerald-700 text-neutral-700 font-medium transition"
                >
                  {city}
                </button>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 font-display">
              Explore Everyday Categories
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">Handpicked lightweight products for Indian homes and students</p>
          </div>
          <button
            onClick={() => navigateTo('categories')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
          >
            <span>View All ({categories.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigateTo('products', { categorySlug: cat.name })}
              className="group cursor-pointer bg-white rounded-2xl border border-neutral-200/80 p-3 hover:border-emerald-500 hover:shadow-md transition flex flex-col items-center text-center"
            >
              <div className="w-full h-24 rounded-xl overflow-hidden mb-3 bg-neutral-100 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {cat.itemCount}+ Ads
                </span>
              </div>
              <h3 className="font-bold text-neutral-900 text-xs group-hover:text-emerald-700 transition">
                {cat.name}
              </h3>
              <p className="text-[10px] text-neutral-500 mt-0.5 line-clamp-1">
                {cat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Verified Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 bg-amber-100 text-amber-800 rounded-md">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 font-display">
                Featured Verified Listings
              </h2>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">Top-rated peer listings with verified photos & fast pan-India shipping</p>
          </div>
          <button
            onClick={() => navigateTo('products')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
          >
            <span>See Catalog</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {featuredProducts.length === 0 ? (
            <div className="col-span-full bg-white rounded-3xl border border-neutral-200/90 p-8 sm:p-12 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto border border-emerald-100">
                <Package className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Community Marketplace Live 🇮🇳
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-display pt-1">
                  Be the First Neighbor to Post an Ad!
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto leading-relaxed">
                  All demo products have been cleared. EasyMart is 100% reserved for genuine real-world users buying and selling pre-loved study books, kitchen gadgets, mobile accessories, and home items with escrow protection.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => requireAuth('post a free ad', () => navigateTo('post-item'))}
                  className="w-full sm:w-auto px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  <span>Post the First Ad (+ Sell Free)</span>
                </button>
                <button
                  onClick={() => navigateTo('categories')}
                  className="w-full sm:w-auto px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs sm:text-sm rounded-xl transition"
                >
                  Browse Category Taxonomy
                </button>
              </div>
            </div>
          ) : (
            featuredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                isWishlisted={isWishlisted(product.id)}
                onToggleWishlist={() => requireAuth('save this product to your wishlist', () => toggleWishlist(product.id))}
                onClick={() => navigateTo('product-details', { productId: product.id })}
                onQuickBuy={(e) => {
                  e.stopPropagation();
                  requireAuth('buy this product with escrow', () => openPaymentModal(product));
                }}
              />
            ))
          )}
        </div>
      </section>

      {/* How EasyMart Works & Indian Escrow Guarantee */}
      <section className="bg-neutral-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/80 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              EasyMart Escrow Protocol
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
              Safe Peer-to-Peer Shopping in 3 Easy Steps
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-2">
              Unlike risky classifieds where you send UPI directly to strangers, EasyMart locks payments safely in an Indian Escrow vault until delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-neutral-800/70 rounded-2xl border border-neutral-700/60 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h3 className="font-bold text-base text-white">Buy with UPI or Cards</h3>
              <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                Pay securely using Google Pay, PhonePe, Paytm, BHIM, or Net Banking. Your funds are held securely in the EasyMart escrow vault — not transferred directly to the seller yet.
              </p>
            </div>

            <div className="p-6 bg-neutral-800/70 rounded-2xl border border-neutral-700/60 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h3 className="font-bold text-base text-white">Doorstep Courier Delivery</h3>
              <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                The seller packs the everyday essential and dispatches via Delhivery, BlueDart, or India SpeedPost with live tracking provided in your account.
              </p>
            </div>

            <div className="p-6 bg-neutral-800/70 rounded-2xl border border-neutral-700/60 relative">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h3 className="font-bold text-base text-white">Inspect & Release Funds</h3>
              <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                You have 48 hours to open the parcel and verify it matches the condition listed. Once you confirm, funds are instantly credited to the seller&apos;s UPI ID.
              </p>
            </div>
          </div>

          <div className="mt-10 p-4 bg-emerald-950/40 rounded-xl border border-emerald-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Compliant with Indian Reserve Bank & Consumer Protection (E-Commerce) Rules 2020.</span>
            </div>
            <button
              onClick={() => navigateTo('help')}
              className="text-white bg-emerald-600 hover:bg-emerald-700 font-bold px-4 py-2 rounded-lg transition shrink-0"
            >
              Read Escrow FAQ
            </button>
          </div>

        </div>
      </section>

      {/* Community Stats Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-8 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display">₹2.8 Cr+</div>
            <div className="text-xs text-neutral-500 font-medium mt-1">Escrow Transacted Safely</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-display">52,000+</div>
            <div className="text-xs text-neutral-500 font-medium mt-1">Lightweight Items Traded</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display">4.92 ★</div>
            <div className="text-xs text-neutral-500 font-medium mt-1">Community Rating (India)</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-600 font-display">100%</div>
            <div className="text-xs text-neutral-500 font-medium mt-1">Escrow Protected Orders</div>
          </div>
        </div>
      </section>

      {/* Call to Action: Post an Ad */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 text-white px-3 py-1 rounded-full">
              Zero Listing Fees
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display leading-tight">
              Have books, kitchen gadgets, or apparel lying around?
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
              Join thousands of Indian sellers decluttering responsibly. Post your ad for free in under 60 seconds and receive instant payouts directly to your UPI ID.
            </p>
          </div>

          <div className="shrink-0 flex flex-col gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => navigateTo('post-item')}
              className="px-8 py-3.5 bg-white text-emerald-900 hover:bg-neutral-100 font-extrabold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4 text-emerald-700" />
              <span>Post Your Free Listing</span>
            </button>
            <span className="text-[11px] text-emerald-200 text-center">
              Safe UPI Payouts • Free Doorstep Pickup
            </span>
          </div>
        </div>
      </section>

    </div>
  );
};

// Reusable Product Card Component
export const ProductCard: React.FC<{
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onClick: () => void;
  onQuickBuy?: (e: React.MouseEvent) => void;
}> = ({ product, isWishlisted, onToggleWishlist, onClick, onQuickBuy }) => {
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-2xl border border-neutral-200/90 overflow-hidden hover:border-emerald-500 hover:shadow-lg transition-all duration-200 flex flex-col"
    >
      {/* Product Image */}
      <div className="relative aspect-4/3 overflow-hidden bg-neutral-100">
        <img 
          src={product.images[0]} 
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Condition Badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className="bg-white/95 backdrop-blur-xs text-neutral-800 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs border border-neutral-200">
            {product.condition}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist();
          }}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 hover:bg-white text-neutral-700 shadow-xs transition"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'text-rose-500 fill-rose-500' : ''}`} />
        </button>

        {/* Weight Tag */}
        <div className="absolute bottom-2 left-2.5">
          <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
            ⚖️ {product.weightGrams}g (Lightweight)
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1">
            <span className="truncate max-w-[140px] font-medium">{product.category}</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-600" />
              {product.location.city}
            </span>
          </div>

          <h3 className="font-bold text-neutral-900 text-sm line-clamp-2 group-hover:text-emerald-700 transition">
            {product.title}
          </h3>
        </div>

        {/* Price & Action */}
        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-neutral-900">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-neutral-400 line-through">₹{product.originalPrice}</span>
              )}
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold">
              Escrow Guaranteed
            </span>
          </div>

          {onQuickBuy && (
            <button
              onClick={onQuickBuy}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 text-xs font-bold rounded-lg transition"
            >
              Buy Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
