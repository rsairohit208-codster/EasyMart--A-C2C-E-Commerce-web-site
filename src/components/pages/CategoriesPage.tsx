import React from 'react';
import { ChevronRight, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CategoriesPage: React.FC = () => {
  const { categories, products, navigateTo } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 font-display">
          Everyday Essentials Categories
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
          Browse peer-to-peer verified listings across India. All items comply with our lightweight rule (<span className="font-semibold text-emerald-800">&lt; 5kg</span>).
        </p>

        <div className="inline-flex items-center gap-2 p-2 px-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Automotive, tractors, and industrial machinery are strictly prohibited on EasyMart.</span>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const categoryProducts = products.filter(p => p.category === cat.name && p.status === 'active');

          return (
            <div
              key={cat.id}
              className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden hover:border-emerald-500 hover:shadow-lg transition p-6 flex flex-col justify-between space-y-4"
            >
              <div className="flex gap-4">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-24 h-24 rounded-2xl object-cover border border-neutral-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {categoryProducts.length} Active Items
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 font-display mt-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              {/* Sample Items preview pills */}
              {categoryProducts.length > 0 && (
                <div className="pt-2 border-t border-neutral-100">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block mb-1.5">
                    Recent Verified Listings in India
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {categoryProducts.slice(0, 3).map(cp => (
                      <button
                        key={cp.id}
                        onClick={() => navigateTo('product-details', { productId: cp.id })}
                        className="text-[11px] font-semibold text-neutral-700 bg-neutral-100 hover:bg-emerald-50 hover:text-emerald-700 px-2.5 py-1 rounded-lg transition truncate max-w-[200px]"
                      >
                        {cp.title} (₹{cp.price})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => navigateTo('products', { categorySlug: cat.name })}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                >
                  <span>Explore {cat.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
