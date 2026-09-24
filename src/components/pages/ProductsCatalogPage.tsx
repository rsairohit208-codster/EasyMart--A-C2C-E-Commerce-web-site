import React, { useState, useMemo } from 'react';
import { 
  Filter, SlidersHorizontal, Search, X, Check, MapPin, 
  ArrowUpDown, ShieldCheck, Sparkles, Tag 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './HomePage';
import { MAJOR_INDIAN_CITIES } from '../../data/seedData';
import { ProductCondition } from '../../types';

export const ProductsCatalogPage: React.FC = () => {
  const { 
    products, categories, navParams, navigateTo, 
    searchQuery, setSearchQuery, selectedCity, setSelectedCity,
    isWishlisted, toggleWishlist, openPaymentModal, requireAuth 
  } = useApp();

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(navParams.categorySlug || 'All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [onlyVerifiedSellers, setOnlyVerifiedSellers] = useState<boolean>(false);
  const [onlyNegotiable, setOnlyNegotiable] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'popular'>('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync category from navParams if provided
  React.useEffect(() => {
    if (navParams.categorySlug) {
      setSelectedCategory(navParams.categorySlug);
    }
  }, [navParams.categorySlug]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Status check
      if (p.status !== 'active') return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        const matchCity = p.location.city.toLowerCase().includes(q);
        const matchTags = p.tags.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchCat && !matchCity && !matchTags) {
          return false;
        }
      }

      // City filter
      if (selectedCity !== 'All India' && p.location.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Condition filter
      if (selectedCondition !== 'All' && p.condition !== selectedCondition) {
        return false;
      }

      // Price filter
      if (p.price < minPrice || p.price > maxPrice) {
        return false;
      }

      // Verified Seller filter
      if (onlyVerifiedSellers && !p.seller.isVerified) {
        return false;
      }

      // Negotiable filter
      if (onlyNegotiable && !p.negotiable) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'popular') return b.views - a.views;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, searchQuery, selectedCity, selectedCategory, selectedCondition, minPrice, maxPrice, onlyVerifiedSellers, onlyNegotiable, sortBy]);

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSelectedCondition('All');
    setMinPrice(0);
    setMaxPrice(5000);
    setOnlyVerifiedSellers(false);
    setOnlyNegotiable(false);
    setSearchQuery('');
    setSelectedCity('All India');
  };

  const hasActiveFilters = 
    selectedCategory !== 'All' || 
    selectedCondition !== 'All' || 
    minPrice > 0 || 
    maxPrice < 5000 || 
    onlyVerifiedSellers || 
    onlyNegotiable || 
    Boolean(searchQuery) ||
    selectedCity !== 'All India';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-display">
            Everyday Essentials Catalog (India)
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Discover {filteredProducts.length} verified listings across Indian cities with Escrow protection
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-2">
          {/* Mobile Filter Button */}
          <button
            id="mobile-filter-btn"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-neutral-100 text-neutral-800 rounded-xl"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters {hasActiveFilters && '•'}</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-xl px-3 py-1.5 text-xs text-neutral-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
            <span className="font-semibold text-neutral-500">Sort:</span>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-bold text-neutral-900 outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <aside className={`md:block ${isMobileFilterOpen ? 'block fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden'}`}>
          
          {isMobileFilterOpen && (
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-200 md:hidden">
              <h3 className="font-bold text-base text-neutral-900">Filter Products</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-neutral-500">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 space-y-6">
            
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                Refine Search
              </h3>
              {hasActiveFilters && (
                <button
                  id="reset-filters-btn"
                  onClick={resetAllFilters}
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-2">Location / Metro</label>
              <select
                id="catalog-city-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-emerald-500"
              >
                <option value="All India">🇮🇳 All India</option>
                {MAJOR_INDIAN_CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-2">Category</label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${selectedCategory === 'All' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-neutral-600 hover:bg-neutral-50'}`}
                >
                  <span>All Categories</span>
                  {selectedCategory === 'All' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.name)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${selectedCategory === c.name ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-neutral-600 hover:bg-neutral-50'}`}
                  >
                    <span className="truncate">{c.name}</span>
                    {selectedCategory === c.name && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-neutral-700">Price Range (₹ INR)</label>
                <span className="text-xs font-mono font-bold text-neutral-900">₹{minPrice} - ₹{maxPrice}</span>
              </div>
              <input
                id="price-range-slider"
                type="range"
                min="0"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1">
                <span>₹0</span>
                <span>₹2,500</span>
                <span>₹5,000+</span>
              </div>
            </div>

            {/* Condition Filter */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-2">Condition</label>
              <div className="space-y-1">
                {['All', 'Brand New (Packaged)', 'Like New (Barely Used)', 'Gently Used', 'Good Condition'].map((cond) => (
                  <label key={cond} className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer hover:text-neutral-900">
                    <input
                      type="radio"
                      name="condition"
                      checked={selectedCondition === cond}
                      onChange={() => setSelectedCondition(cond)}
                      className="accent-emerald-600"
                    />
                    <span>{cond}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="pt-2 border-t border-neutral-100 space-y-2.5">
              <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyVerifiedSellers}
                  onChange={(e) => setOnlyVerifiedSellers(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Indian Sellers Only
                </span>
              </label>

              <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyNegotiable}
                  onChange={(e) => setOnlyNegotiable(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="flex items-center gap-1 font-medium">
                  <Tag className="w-3.5 h-3.5 text-amber-600" />
                  Price Negotiable (Accepts Offers)
                </span>
              </label>
            </div>

            {/* Policy Reminder */}
            <div className="p-3 bg-neutral-50 rounded-xl text-[11px] text-neutral-500 border border-neutral-200">
              <span className="font-bold text-neutral-700 block mb-0.5">EasyMart Indian Community Rules:</span>
              All listed items are weighed under 5kg. Automotive vehicles, heavy tools, and industrial equipment are filtered out automatically.
            </div>

            {isMobileFilterOpen && (
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
            )}

          </div>
        </aside>

        {/* Products Grid */}
        <div className="md:col-span-3 space-y-6">
          
          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-neutral-500">Active Filters:</span>
              
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Search: &quot;{searchQuery}&quot;
                  <button onClick={() => setSearchQuery('')} className="hover:text-emerald-950">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedCity !== 'All India' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-neutral-100 text-neutral-800">
                  City: {selectedCity}
                  <button onClick={() => setSelectedCity('All India')} className="hover:text-neutral-950">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-neutral-100 text-neutral-800">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')} className="hover:text-neutral-950">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedCondition !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-neutral-100 text-neutral-800">
                  {selectedCondition}
                  <button onClick={() => setSelectedCondition('All')} className="hover:text-neutral-950">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {onlyVerifiedSellers && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Verified Sellers
                  <button onClick={() => setOnlyVerifiedSellers(false)} className="hover:text-emerald-950">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Grid or Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">No everyday essentials match your filters</h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                Try expanding your price range, searching for another keyword, or resetting filters to explore all community listings across India.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
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
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
