import React from 'react';
import { Heart, Package, ArrowRight, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './HomePage';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, toggleWishlist, openPaymentModal, navigateTo } = useApp();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display">
          My Saved Wishlist ({wishlistedProducts.length})
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Everyday essentials you have bookmarked across Indian cities
        </p>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-4">
          <div className="w-14 h-14 bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-base text-neutral-800">Your wishlist is empty</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Tap the heart icon on any product in the catalog to save it for later price comparisons.
          </p>
          <button
            onClick={() => navigateTo('products')}
            className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {wishlistedProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={true}
              onToggleWishlist={() => toggleWishlist(product.id)}
              onClick={() => navigateTo('product-details', { productId: product.id })}
              onQuickBuy={(e) => {
                e.stopPropagation();
                openPaymentModal(product);
              }}
            />
          ))}
        </div>
      )}

    </div>
  );
};
