import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, MapPin, Heart, MessageSquare, Tag, 
  Share2, AlertTriangle, Truck, Clock, CheckCircle2, 
  Star, ChevronLeft, ArrowRight, UserCheck, Lock, ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './HomePage';
import { AvatarPlaceholder } from '../common/AvatarPlaceholder';

export const ProductDetailPage: React.FC = () => {
  const { 
    navParams, products, navigateTo, isWishlisted, 
    toggleWishlist, openPaymentModal, openReportModal, 
    startConversation, reviews, addReview, currentUser,
    isAuthenticated, requireAuth,
    incrementProductViews, showToast 
  } = useApp();

  const productId = navParams.productId || products[0]?.id;
  const product = products.find(p => p.id === productId);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [offerInput, setOfferInput] = useState('');
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  
  // Review form state
  const [ratingVal, setRatingVal] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    if (product) {
      incrementProductViews(product.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [productId]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-neutral-800">Product Not Found</h2>
        <p className="text-xs text-neutral-500">The listing might have been sold or removed by the seller.</p>
        <button
          onClick={() => navigateTo('products')}
          className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  const productReviews = reviews.filter(r => 
    (r.targetType === 'product' && r.targetId === product.id) || 
    (r.targetType === 'seller' && r.targetId === product.sellerId)
  );

  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category && p.status === 'active')
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} on EasyMart India for ₹${product.price}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!');
    }
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(offerInput);
    if (!parsed || parsed <= 0) {
      showToast('Please enter a valid offer amount in ₹', 'error');
      return;
    }
    if (parsed >= product.price) {
      showToast('Offer price should be less than the listing price', 'error');
      return;
    }
    setIsOfferModalOpen(false);
    startConversation(product.id, parsed);
  };

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast('Please write a short review before submitting', 'error');
      return;
    }

    addReview({
      targetType: 'seller',
      targetId: product.sellerId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar || '',
      rating: ratingVal,
      comment: reviewComment.trim(),
      verifiedPurchase: true
    });

    setReviewComment('');
  };

  const isFavorited = isWishlisted(product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Back button */}
      <button
        onClick={() => navigateTo('products')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 transition"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Indian Essentials Catalog</span>
      </button>

      {/* Main Product Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: Image Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Hero Image */}
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-xs">
            <img 
              src={product.images[activeImageIndex] || product.images[0]} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />

            {/* Condition Pill */}
            <div className="absolute top-3 left-3">
              <span className="bg-white/95 backdrop-blur-xs text-neutral-900 text-xs font-bold px-3 py-1 rounded-lg shadow-sm border border-neutral-200">
                {product.condition}
              </span>
            </div>

            {/* Status if Reserved */}
            {product.status !== 'active' && (
              <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center">
                <span className="bg-amber-400 text-neutral-900 font-extrabold text-sm uppercase px-4 py-1.5 rounded-full tracking-wider">
                  {product.status === 'reserved' ? 'Reserved in Escrow' : 'Sold Out'}
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${activeImageIndex === idx ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-neutral-200 hover:border-neutral-300'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Escrow Guarantee Notice */}
          <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200/90 text-emerald-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>EasyMart Escrow Protection Included</span>
            </div>
            <p className="text-xs text-emerald-800/90 leading-relaxed">
              When you buy this item, your money is securely locked in EasyMart&apos;s Escrow vault. The seller only gets paid after you receive and inspect the parcel. If it doesn&apos;t match the description, you get a 100% UPI refund.
            </p>
          </div>
        </div>

        {/* Right Col: Details, Price, Seller, Buy Actions (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Header Info */}
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {product.category}
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {product.location.city}, {product.location.state}
                </span>
                <button 
                  onClick={handleShare}
                  className="hover:text-neutral-900 transition flex items-center gap-1"
                  title="Share Listing"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display mt-2 leading-tight">
              {product.title}
            </h1>

            {/* Price section */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-neutral-900 font-display">
                ₹{product.price}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-base text-neutral-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500">
              <span>+ ₹{product.shippingFee} Courier delivery (Pan-India)</span>
              <span>•</span>
              <span className="text-neutral-700 font-medium">Views: {product.views}</span>
            </div>
          </div>

          {/* Lightweight Specs Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
            <div>
              <span className="text-neutral-400 text-[10px] uppercase font-semibold">Weight</span>
              <p className="font-bold text-neutral-800">{product.weightGrams}g (Lightweight)</p>
            </div>
            <div>
              <span className="text-neutral-400 text-[10px] uppercase font-semibold">Condition</span>
              <p className="font-bold text-neutral-800">{product.condition.split(' ')[0]}</p>
            </div>
            <div>
              <span className="text-neutral-400 text-[10px] uppercase font-semibold">Pickup / Courier</span>
              <p className="font-bold text-neutral-800">
                {product.pickupAvailable ? 'Handover & Courier' : 'Courier Only'}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                id="product-buy-now-btn"
                disabled={product.status !== 'active'}
                onClick={() => requireAuth('buy with escrow protection', () => openPaymentModal(product))}
                className="flex-1 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5"
              >
                <Lock className="w-4 h-4" />
                <span>Buy Now with Escrow (₹{product.price + product.shippingFee})</span>
              </button>

              <button
                id="product-wishlist-toggle-btn"
                onClick={() => requireAuth('save this product to your wishlist', () => toggleWishlist(product.id))}
                className={`p-3.5 rounded-xl border transition flex items-center justify-center gap-2 text-sm font-bold ${isFavorited ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-neutral-300 hover:bg-neutral-50 text-neutral-700'}`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span className="hidden sm:inline">{isFavorited ? 'Wishlisted' : 'Save'}</span>
              </button>
            </div>

            <div className="flex gap-3">
              {product.negotiable && (
                <button
                  id="make-offer-btn"
                  onClick={() => requireAuth('send a bargain price offer', () => setIsOfferModalOpen(true))}
                  className="flex-1 py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Tag className="w-3.5 h-3.5 text-amber-600" />
                  <span>Make an Offer (Bargain)</span>
                </button>
              )}

              <button
                id="chat-seller-btn"
                onClick={() => requireAuth('chat with the seller', () => startConversation(product.id))}
                className="flex-1 py-2.5 px-4 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Chat with Seller</span>
              </button>
            </div>
          </div>

          {/* Seller Card */}
          <div className="p-4 bg-white rounded-2xl border border-neutral-200/90 shadow-2xs flex items-center justify-between gap-4">
            <div 
              onClick={() => navigateTo('seller-profile', { sellerId: product.sellerId })}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <AvatarPlaceholder 
                name={product.seller.name} 
                avatar={product.seller.avatar} 
                size="md" 
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-neutral-900 text-sm group-hover:text-emerald-700 transition">
                    {product.seller.name}
                  </h4>
                  {product.seller.isVerified && (
                    <span className="inline-flex items-center text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                  <span className="flex items-center text-amber-500 font-bold">
                    ★ {product.seller.rating}
                  </span>
                  <span>({product.seller.reviewCount} Reviews)</span>
                  <span>•</span>
                  <span>Member since {product.seller.memberSince}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigateTo('seller-profile', { sellerId: product.sellerId })}
              className="px-3 py-1.5 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition"
            >
              View Profile
            </button>
          </div>

          {/* Description */}
          <div className="space-y-2 pt-2">
            <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider">
              Item Description & Condition Notes
            </h3>
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed whitespace-pre-line bg-neutral-50/50 p-4 rounded-xl border border-neutral-100">
              {product.description}
            </p>
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {product.tags.map((tag, i) => (
                <span key={i} className="text-[11px] font-medium bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-md">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Report Button */}
          <div className="pt-2">
            <button
              id="report-listing-btn"
              onClick={() => openReportModal('listing', product.id, product.title)}
              className="text-xs text-neutral-400 hover:text-rose-600 transition flex items-center gap-1 font-medium"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report this listing (Fraud, Heavy Machinery Violation, etc.)</span>
            </button>
          </div>

        </div>

      </div>

      {/* Reviews & Ratings Section */}
      <section className="pt-10 border-t border-neutral-200 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-neutral-900 font-display">
              Seller & Product Reviews ({productReviews.length})
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">Verified Indian buyers who traded with {product.seller.name}</p>
          </div>
          <div className="flex items-center gap-1 text-sm font-bold text-neutral-900">
            <span className="text-amber-500">★</span>
            <span>{product.seller.rating} / 5.0</span>
          </div>
        </div>

        {/* Existing Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productReviews.map((rev) => (
            <div key={rev.id} className="p-4 bg-white rounded-2xl border border-neutral-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <AvatarPlaceholder 
                    name={rev.authorName} 
                    avatar={rev.authorAvatar} 
                    size="sm" 
                  />
                  <div>
                    <h5 className="font-bold text-xs text-neutral-900">{rev.authorName}</h5>
                    <span className="text-[10px] text-neutral-400">{rev.date}</span>
                  </div>
                </div>
                <div className="flex text-amber-400 text-xs">
                  {'★'.repeat(rev.rating)}
                </div>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">&quot;{rev.comment}&quot;</p>
              {rev.verifiedPurchase && (
                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified Purchase via Escrow</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Review Form */}
        <form onSubmit={handlePostReview} className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
          <h4 className="font-bold text-xs text-neutral-900 uppercase tracking-wider">Leave a Review for this Seller</h4>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-600">Your Rating:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingVal(star)}
                  className={`text-lg transition ${star <= ratingVal ? 'text-amber-400' : 'text-neutral-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <textarea
            rows={2}
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="How was the seller communication, packing, and courier speed?"
            className="w-full p-3 text-xs bg-white border border-neutral-300 rounded-xl outline-none focus:border-emerald-500 resize-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              Submit Review
            </button>
          </div>
        </form>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-neutral-200 space-y-4">
          <h3 className="text-lg font-bold text-neutral-900 font-display">
            More in {product.category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {relatedProducts.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                isWishlisted={isWishlisted(p.id)}
                onToggleWishlist={() => toggleWishlist(p.id)}
                onClick={() => navigateTo('product-details', { productId: p.id })}
              />
            ))}
          </div>
        </section>
      )}

      {/* Offer Modal */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 p-6 max-w-sm w-full space-y-4">
            <h4 className="font-bold text-sm text-neutral-900">Make an Offer to {product.seller.name}</h4>
            <p className="text-xs text-neutral-500">
              Listing Price is <strong>₹{product.price}</strong>. Enter your fair counter-offer in INR:
            </p>
            <form onSubmit={handleSendOffer} className="space-y-4">
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-bold text-neutral-400 text-sm">₹</span>
                <input
                  type="number"
                  autoFocus
                  value={offerInput}
                  onChange={(e) => setOfferInput(e.target.value)}
                  placeholder="e.g. 450"
                  className="w-full pl-8 pr-3 py-2 text-sm font-bold bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="flex-1 py-2 text-xs font-bold text-neutral-600 bg-neutral-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                >
                  Send Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
