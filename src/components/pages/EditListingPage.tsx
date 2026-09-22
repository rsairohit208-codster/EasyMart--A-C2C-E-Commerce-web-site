import React, { useState } from 'react';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EditListingPage: React.FC = () => {
  const { navParams, products, updateProduct, deleteProduct, navigateTo, showToast } = useApp();
  const productId = navParams.productId;
  const product = products.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <h2 className="text-lg font-bold text-neutral-800">Listing Not Found</h2>
        <button onClick={() => navigateTo('my-listings')} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold">
          Go to My Listings
        </button>
      </div>
    );
  }

  const [title, setTitle] = useState(product.title);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price.toString());
  const [status, setStatus] = useState(product.status);
  const [shippingFee, setShippingFee] = useState(product.shippingFee.toString());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = Number(price);
    if (!numPrice || numPrice <= 0) {
      showToast('Please enter a valid price in ₹', 'error');
      return;
    }

    updateProduct(product.id, {
      title: title.trim(),
      description: description.trim(),
      price: numPrice,
      status,
      shippingFee: Number(shippingFee) || 49
    });

    navigateTo('my-listings');
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this listing?')) {
      deleteProduct(product.id);
      navigateTo('my-listings');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <button
        onClick={() => navigateTo('my-listings')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Listings</span>
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 font-display">Edit Listing</h1>
          <p className="text-xs text-neutral-500">Update pricing, description, or mark status</p>
        </div>
        <button
          onClick={handleDelete}
          className="px-3.5 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Listing</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-neutral-200/90 p-6 space-y-5 shadow-xs">
        <div>
          <label className="block text-xs font-bold text-neutral-700 mb-1">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Price (₹ INR)</label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm font-bold bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500"
            >
              <option value="active">Active (Available)</option>
              <option value="reserved">Reserved in Escrow</option>
              <option value="sold">Sold Out</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Shipping Fee (₹)</label>
            <input
              type="number"
              value={shippingFee}
              onChange={(e) => setShippingFee(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-700 mb-1">Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
          <button
            type="button"
            onClick={() => navigateTo('my-listings')}
            className="px-5 py-2.5 text-xs font-bold text-neutral-600 hover:bg-neutral-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>

    </div>
  );
};
