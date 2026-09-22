import React, { useState } from 'react';
import { 
  Package, AlertTriangle, ShieldCheck, Upload, 
  MapPin, Check, Image as ImageIcon, ArrowLeft, Info 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INDIAN_STATES, MAJOR_INDIAN_CITIES } from '../../data/seedData';
import { ProductCondition } from '../../types';

export const PostItemPage: React.FC = () => {
  const { categories, currentUser, addProduct, navigateTo, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Books & Study Essentials');
  const [condition, setCondition] = useState<ProductCondition>('Like New (Barely Used)');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [weightGrams, setWeightGrams] = useState('450');
  const [dimensions, setDimensions] = useState('');
  const [city, setCity] = useState(currentUser.city || 'Bengaluru');
  const [state, setState] = useState(currentUser.state || 'Karnataka');
  const [pincode, setPincode] = useState('560103');
  const [tagsInput, setTagsInput] = useState('');
  const [negotiable, setNegotiable] = useState(true);
  const [pickupAvailable, setPickupAvailable] = useState(true);
  const [shippingFee, setShippingFee] = useState('49');

  // Images selection
  const imagePresets = [
    { label: 'Study Books', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' },
    { label: 'Electric Kettle', url: 'https://images.unsplash.com/photo-1594213114663-ddfe1e48eb84?auto=format&fit=crop&w=800&q=80' },
    { label: 'Brass Diya', url: 'https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&w=800&q=80' },
    { label: 'Earphones / Audio', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
    { label: 'Cotton Kurta', url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80' },
    { label: 'Yoga Mat', url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80' },
    { label: 'Masala Dabba', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80' },
    { label: 'Darjeeling Tea', url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80' }
  ];

  const [selectedImage, setSelectedImage] = useState(imagePresets[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');

  const prohibitedKeywords = [
    'engine', 'car', 'motor', 'tractor', 'industrial', 'crane', 
    'gearbox', 'welding', 'generator', 'machinery', 'truck', 'diesel'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !price) {
      showToast('Please fill in title, description, and price', 'error');
      return;
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      showToast('Please enter a valid price in ₹ INR', 'error');
      return;
    }

    const weight = Number(weightGrams);
    if (weight > 5000) {
      showToast('Weight exceeds 5000g! EasyMart only permits lightweight everyday essentials.', 'error');
      return;
    }

    // Safety checks against industrial/automotive products
    const contentToCheck = `${title} ${description} ${tagsInput}`.toLowerCase();
    const hasViolation = prohibitedKeywords.some(kw => contentToCheck.includes(kw));

    if (hasViolation) {
      showToast('Posting blocked: EasyMart explicitly bars automotive, engines, and heavy industrial machinery.', 'error');
      return;
    }

    const finalImage = customImageUrl.trim() || selectedImage;
    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const newId = addProduct({
      title: title.trim(),
      description: description.trim(),
      price: numericPrice,
      originalPrice: Number(originalPrice) || numericPrice * 1.3,
      category,
      condition,
      weightGrams: weight || 500,
      dimensions: dimensions || 'Standard size',
      images: [finalImage],
      sellerId: currentUser.id,
      seller: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        city,
        state,
        rating: currentUser.rating,
        reviewCount: currentUser.reviewCount,
        isVerified: currentUser.isVerified,
        memberSince: currentUser.memberSince
      },
      location: {
        city,
        state,
        pincode: pincode.trim() || '560001'
      },
      tags: parsedTags.length > 0 ? parsedTags : ['EverydayEssential', 'PreLoved'],
      negotiable,
      pickupAvailable,
      shippingAvailable: true,
      shippingFee: Number(shippingFee) || 49,
      featured: false
    });

    navigateTo('product-details', { productId: newId });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <button
        onClick={() => navigateTo('home')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Cancel & Back</span>
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display">
          Post a Free Ad on EasyMart India
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Reach thousands of verified buyers in your neighborhood and across India with safe UPI escrow payouts.
        </p>
      </div>

      {/* Strict Policy Banner */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-1.5 text-xs">
        <div className="flex items-center gap-2 font-bold text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Notice: Everyday Essentials &amp; Lightweight Items Only (&lt; 5kg)</span>
        </div>
        <p className="text-[11px] text-amber-800 leading-relaxed">
          EasyMart is tailored specifically for books, home decor, kitchen gadgets, mobile accessories, ethnic apparel, and everyday items. <strong>Automotive vehicles, engines, tractors, hazardous chemicals, and heavy industrial machinery are strictly prohibited</strong> and will be flagged automatically.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 space-y-8 shadow-xs">
        
        {/* Section 1: Item Basic Info */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-2">
            1. Item Details
          </h3>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Ad Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="post-title-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Prestige Stainless Steel Electric Kettle 1.5L (Auto cut-off)"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="post-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Item Condition <span className="text-rose-500">*</span>
              </label>
              <select
                id="post-condition-select"
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition"
              >
                <option value="Brand New (Packaged)">Brand New (Packaged)</option>
                <option value="Like New (Barely Used)">Like New (Barely Used)</option>
                <option value="Gently Used">Gently Used</option>
                <option value="Good Condition">Good Condition</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Description &amp; Reason for Selling <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="post-desc-input"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your item honestly: usage history, functionality, included accessories, why you are selling..."
              className="w-full p-3 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition resize-none"
            />
          </div>

          {/* Weight & Dimension Check */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Approximate Weight in Grams (&lt; 5000g) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  max={5000}
                  required
                  value={weightGrams}
                  onChange={(e) => setWeightGrams(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500 focus:bg-white"
                />
                <span className="absolute right-3 top-2.5 text-xs text-neutral-400 font-semibold">grams</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Dimensions / Sizing (Optional)
              </label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="e.g. 20 x 15 x 5 cm or Size L"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Escrow */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-2">
            2. Price &amp; Shipping
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Selling Price (₹ INR) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs sm:text-sm font-bold text-neutral-500">₹</span>
                <input
                  id="post-price-input"
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 650"
                  className="w-full pl-8 pr-3.5 py-2.5 text-xs sm:text-sm font-bold bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Original Purchase / MRP Price (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs sm:text-sm font-bold text-neutral-500">₹</span>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="e.g. 1299"
                  className="w-full pl-8 pr-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Courier Delivery Fee (Pan-India)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-neutral-500">₹</span>
                <input
                  type="number"
                  value={shippingFee}
                  onChange={(e) => setShippingFee(e.target.value)}
                  placeholder="49"
                  className="w-full pl-8 pr-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex flex-col justify-end space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={negotiable}
                  onChange={(e) => setNegotiable(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Allow buyers to make counter offers (Negotiable)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pickupAvailable}
                  onChange={(e) => setPickupAvailable(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Allow local doorstep handover with OTP verification</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Photos */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-2">
            3. Photos
          </h3>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-2">
              Choose from High-Res Indian Everyday Essentials Presets or Enter Custom Image URL
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {imagePresets.map((preset, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedImage(preset.url);
                    setCustomImageUrl('');
                  }}
                  className={`cursor-pointer rounded-xl overflow-hidden border-2 transition p-1 text-center ${selectedImage === preset.url && !customImageUrl ? 'border-emerald-600 bg-emerald-50/50' : 'border-neutral-200 hover:border-neutral-300'}`}
                >
                  <img src={preset.url} alt="" className="w-full h-20 object-cover rounded-lg" />
                  <span className="text-[11px] font-bold text-neutral-700 block mt-1 truncate">{preset.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Or Enter Custom Image URL
            </label>
            <input
              type="url"
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Section 4: Seller Location (India) */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-2">
            4. Item Location in India
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                City <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Bengaluru"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                State <span className="text-rose-500">*</span>
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500 focus:bg-white"
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                PIN Code (6 Digits) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="e.g. 560103"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500 focus:bg-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Search Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. UPSC, Laxmikanth, StudyMaterial, CleanCondition"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Payout Information */}
        <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-xs space-y-1">
          <div className="font-bold text-emerald-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Direct Payout to your Indian UPI ID</span>
          </div>
          <p className="text-emerald-800">
            Current receiving UPI VPA: <strong className="font-mono text-emerald-950">{currentUser.upiId || 'easymart.seller@upi'}</strong>. When the buyer confirms delivery, funds will be released to this UPI address automatically.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="px-6 py-3 text-xs font-bold text-neutral-600 hover:bg-neutral-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            id="post-submit-btn"
            type="submit"
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-emerald-600/25 transition hover:-translate-y-0.5"
          >
            Publish Ad for Free
          </button>
        </div>

      </form>

    </div>
  );
};
