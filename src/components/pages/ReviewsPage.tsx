import React, { useState } from 'react';
import { Star, CheckCircle2, MessageSquare, ThumbsUp, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReviewsPage: React.FC = () => {
  const { reviews, products, navigateTo } = useApp();
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  const filteredReviews = reviews.filter(r => {
    if (filterRating === 'all') return true;
    return r.rating === filterRating;
  });

  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display">
            Community Reviews &amp; Ratings
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Transparent feedback from verified buyers across Indian cities
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-3 px-4 rounded-2xl border border-neutral-200 shadow-2xs">
          <div className="text-2xl font-black text-amber-500 font-display">★ {averageRating}</div>
          <div className="text-xs text-neutral-600">
            <span className="font-bold block text-neutral-900">{reviews.length} Total Ratings</span>
            <span>100% Escrow Verified</span>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 text-xs font-bold">
        <button
          onClick={() => setFilterRating('all')}
          className={`px-3 py-1.5 rounded-lg transition ${filterRating === 'all' ? 'bg-neutral-900 text-white' : 'bg-white border text-neutral-600 hover:bg-neutral-50'}`}
        >
          All ({reviews.length})
        </button>
        {[5, 4, 3].map(rating => (
          <button
            key={rating}
            onClick={() => setFilterRating(rating)}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${filterRating === rating ? 'bg-neutral-900 text-white' : 'bg-white border text-neutral-600 hover:bg-neutral-50'}`}
          >
            <span>{rating} Star</span>
            <span className="text-amber-400">★</span>
          </button>
        ))}
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-3xl border border-neutral-200/90 p-5 space-y-3 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={rev.authorAvatar}
                  alt={rev.authorName}
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div>
                  <h4 className="font-bold text-xs text-neutral-900">{rev.authorName}</h4>
                  <span className="text-[10px] text-neutral-400">{rev.date}</span>
                </div>
              </div>
              <div className="flex text-amber-400 text-xs">
                {'★'.repeat(rev.rating)}
              </div>
            </div>

            <p className="text-xs text-neutral-700 leading-relaxed">&quot;{rev.comment}&quot;</p>

            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px]">
              {rev.verifiedPurchase && (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Escrow Order
                </span>
              )}
              <span className="text-neutral-400">Feedback for Indian Seller</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
