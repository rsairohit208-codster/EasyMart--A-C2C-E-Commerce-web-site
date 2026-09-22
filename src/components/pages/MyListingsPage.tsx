import React, { useState } from 'react';
import { 
  Package, PlusCircle, Edit3, Trash2, CheckCircle2, 
  Eye, Heart, ExternalLink, AlertCircle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MyListingsPage: React.FC = () => {
  const { currentUser, products, deleteProduct, markProductSold, navigateTo } = useApp();
  const [filter, setFilter] = useState<'all' | 'active' | 'sold' | 'reserved'>('all');

  const myListings = products.filter(p => p.sellerId === currentUser.id);

  const displayedListings = myListings.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display">
            My Listings &amp; Ads
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage your active, reserved, and sold everyday essentials
          </p>
        </div>

        <button
          id="post-new-listing-btn"
          onClick={() => navigateTo('post-item')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Item (+ Sell)</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 pb-3 text-xs font-bold">
        {[
          { id: 'all', label: `All Ads (${myListings.length})` },
          { id: 'active', label: `Active (${myListings.filter(p => p.status === 'active').length})` },
          { id: 'reserved', label: `In Escrow (${myListings.filter(p => p.status === 'reserved').length})` },
          { id: 'sold', label: `Sold (${myListings.filter(p => p.status === 'sold').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-lg transition ${filter === tab.id ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-600 hover:bg-neutral-100'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Listings List */}
      {displayedListings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-4">
          <div className="w-14 h-14 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-base text-neutral-800">No listings found in this tab</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Have study books, small kitchenware, or accessories lying around? Post an ad to start earning directly to your UPI ID.
          </p>
          <button
            onClick={() => navigateTo('post-item')}
            className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl"
          >
            Post Your First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {displayedListings.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-neutral-200/90 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-neutral-300 transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="w-20 h-20 rounded-xl object-cover border border-neutral-200 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                      {p.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      p.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                      p.status === 'reserved' ? 'bg-amber-100 text-amber-800' :
                      'bg-neutral-200 text-neutral-700'
                    }`}>
                      {p.status.toUpperCase()}
                    </span>
                  </div>

                  <h3 
                    onClick={() => navigateTo('product-details', { productId: p.id })}
                    className="font-bold text-sm text-neutral-900 hover:text-emerald-700 cursor-pointer transition line-clamp-1"
                  >
                    {p.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-neutral-500">
                    <span className="font-extrabold text-neutral-900 text-sm">₹{p.price}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {p.views} views
                    </span>
                    <span>•</span>
                    <span>Condition: {p.condition.split(' ')[0]}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                <button
                  onClick={() => navigateTo('product-details', { productId: p.id })}
                  className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition"
                  title="View Ad in Marketplace"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigateTo('edit-listing', { productId: p.id })}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                {p.status === 'active' && (
                  <button
                    onClick={() => markProductSold(p.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Sold</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    if (confirm('Delete this listing?')) deleteProduct(p.id);
                  }}
                  className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
