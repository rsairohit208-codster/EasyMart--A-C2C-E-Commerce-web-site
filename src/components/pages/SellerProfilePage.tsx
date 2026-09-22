import React, { useState } from 'react';
import { 
  MapPin, Star, ShieldCheck, CheckCircle2, Package, 
  MessageSquare, AlertTriangle, ArrowLeft, Heart 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './HomePage';
import { AvatarPlaceholder } from '../common/AvatarPlaceholder';

export const SellerProfilePage: React.FC = () => {
  const { 
    navParams, users, products, reviews, navigateTo, 
    isWishlisted, toggleWishlist, openPaymentModal, openReportModal 
  } = useApp();

  const sellerId = navParams.sellerId || 'usr-seller-priya';
  const seller = users.find(u => u.id === sellerId) || users[1];

  const [activeTab, setActiveTab] = useState<'active' | 'sold' | 'reviews'>('active');

  const sellerProducts = products.filter(p => p.sellerId === seller.id);
  const activeListings = sellerProducts.filter(p => p.status === 'active');
  const soldListings = sellerProducts.filter(p => p.status === 'sold' || p.status === 'reserved');

  const sellerReviews = reviews.filter(r => r.targetType === 'seller' && r.targetId === seller.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <button
        onClick={() => navigateTo('products')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Catalog</span>
      </button>

      {/* Seller Header Banner */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4 sm:gap-6">
            <AvatarPlaceholder 
              name={seller.name} 
              avatar={seller.avatar} 
              size="xl" 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 font-display">
                  {seller.name}
                </h1>
                {seller.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Seller
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {seller.city}, {seller.state}
                </span>
                <span>•</span>
                <span>Member since {seller.memberSince}</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-bold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {seller.rating} ({seller.reviewCount} Reviews)
                </span>
              </div>

              <p className="text-xs text-neutral-600 max-w-xl leading-relaxed pt-1">
                {seller.bio || 'Verified everyday essentials community seller on EasyMart India.'}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => openReportModal('user', seller.id, seller.name)}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-neutral-500 hover:text-rose-600 hover:bg-rose-50 border border-neutral-200 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report User</span>
            </button>
          </div>

        </div>

        {/* Stats Strip */}
        <div className="mt-8 pt-6 border-t border-neutral-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
          <div className="p-3 bg-neutral-50 rounded-xl">
            <span className="text-lg font-bold text-neutral-900 block">{sellerProducts.length}</span>
            <span className="text-neutral-500 text-[11px]">Total Listings</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-xl">
            <span className="text-lg font-bold text-emerald-600 block">{activeListings.length}</span>
            <span className="text-neutral-500 text-[11px]">Active Now</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-xl">
            <span className="text-lg font-bold text-neutral-900 block">{soldListings.length}</span>
            <span className="text-neutral-500 text-[11px]">Items Sold</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-xl">
            <span className="text-lg font-bold text-teal-600 block">100%</span>
            <span className="text-neutral-500 text-[11px]">Escrow Delivered</span>
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 flex gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 transition relative ${activeTab === 'active' ? 'text-emerald-700 border-b-2 border-emerald-600' : 'text-neutral-500 hover:text-neutral-900'}`}
        >
          Active Listings ({activeListings.length})
        </button>
        <button
          onClick={() => setActiveTab('sold')}
          className={`pb-3 transition relative ${activeTab === 'sold' ? 'text-emerald-700 border-b-2 border-emerald-600' : 'text-neutral-500 hover:text-neutral-900'}`}
        >
          Sold / Reserved ({soldListings.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 transition relative ${activeTab === 'reviews' ? 'text-emerald-700 border-b-2 border-emerald-600' : 'text-neutral-500 hover:text-neutral-900'}`}
        >
          Buyer Reviews ({sellerReviews.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'active' && (
        <div>
          {activeListings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-neutral-200">
              <Package className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-xs text-neutral-500">No active listings currently from this seller.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeListings.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  isWishlisted={isWishlisted(p.id)}
                  onToggleWishlist={() => toggleWishlist(p.id)}
                  onClick={() => navigateTo('product-details', { productId: p.id })}
                  onQuickBuy={(e) => {
                    e.stopPropagation();
                    openPaymentModal(p);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'sold' && (
        <div>
          {soldListings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-neutral-200">
              <Package className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-xs text-neutral-500">No sold listings yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 opacity-80">
              {soldListings.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  isWishlisted={isWishlisted(p.id)}
                  onToggleWishlist={() => toggleWishlist(p.id)}
                  onClick={() => navigateTo('product-details', { productId: p.id })}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {sellerReviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-neutral-200">
              <Star className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-xs text-neutral-500">No reviews yet for this seller.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sellerReviews.map(r => (
                <div key={r.id} className="p-4 bg-white rounded-2xl border border-neutral-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={r.authorAvatar} alt="" className="w-8 h-8 rounded-full object-cover border" />
                      <div>
                        <h5 className="font-bold text-xs text-neutral-900">{r.authorName}</h5>
                        <span className="text-[10px] text-neutral-400">{r.date}</span>
                      </div>
                    </div>
                    <div className="flex text-amber-400 text-xs">
                      {'★'.repeat(r.rating)}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">&quot;{r.comment}&quot;</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Escrow Delivery
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
