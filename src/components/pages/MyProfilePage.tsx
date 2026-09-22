import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, ShieldCheck, 
  CreditCard, CheckCircle2, Save, Star, Package, ShoppingBag 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INDIAN_STATES, MAJOR_INDIAN_CITIES } from '../../data/seedData';

export const MyProfilePage: React.FC = () => {
  const { currentUser, updateUserProfile, navigateTo } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [city, setCity] = useState(currentUser.city);
  const [state, setState] = useState(currentUser.state);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [upiId, setUpiId] = useState(currentUser.upiId || '');
  const defaultAddr = currentUser.savedAddresses[0];
  const [addressLine1, setAddressLine1] = useState(defaultAddr?.addressLine1 || '');
  const [pincode, setPincode] = useState(defaultAddr?.pincode || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedAddress = {
      id: defaultAddr?.id || `addr-${Date.now()}`,
      fullName: name.trim(),
      phone: phone.trim(),
      addressLine1: addressLine1.trim(),
      city,
      state,
      pincode: pincode.trim(),
      isDefault: true,
      label: 'Home' as const
    };

    updateUserProfile({
      name: name.trim(),
      phone: phone.trim(),
      city,
      state,
      bio: bio.trim(),
      upiId: upiId.trim(),
      savedAddresses: [updatedAddress]
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display">
          My Account &amp; Payout Settings
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Manage your contact credentials, Indian shipping address, and Escrow UPI VPA
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-neutral-900">{currentUser.name}</h2>
              {currentUser.isVerified && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">{currentUser.email}</p>
            <div className="flex items-center gap-3 text-xs text-neutral-600 mt-2">
              <span className="font-semibold capitalize text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                Role: {currentUser.role}
              </span>
              <span className="flex items-center text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                {currentUser.rating} ({currentUser.reviewCount} Reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Quick Nav shortcuts */}
        <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
          <button
            onClick={() => navigateTo('my-listings')}
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4 text-emerald-600" />
            <span>My Listings</span>
          </button>
          <button
            onClick={() => navigateTo('orders')}
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>My Orders</span>
          </button>
        </div>
      </div>

      {/* Edit Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
        
        {/* Personal Details */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-2">
            Personal &amp; Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Indian Mobile (+91)</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Bio / Seller Note</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell fellow Indian buyers about your selling style, packing speed, etc."
              className="w-full p-3 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500 resize-none"
            />
          </div>
        </div>

        {/* Escrow Payout Configuration (UPI) */}
        <div className="space-y-4 pt-2">
          <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-2 flex items-center justify-between">
            <span>Escrow UPI Payout Details (India)</span>
            <span className="text-[11px] font-bold text-emerald-700 normal-case bg-emerald-50 px-2 py-0.5 rounded">
              Zero Platform Commission
            </span>
          </h3>

          <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Direct Instant Bank Settlement via NPCI UPI
            </span>
            <p className="text-[11px] text-emerald-800">
              When an item you sold is received and confirmed by the buyer, funds held in EasyMart Escrow are automatically transferred to this UPI ID within minutes.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Your UPI VPA (Virtual Payment Address)
            </label>
            <div className="relative">
              <CreditCard className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. yourname@oksbi or 9876543210@paytm"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-mono font-bold bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Address in India */}
        <div className="space-y-4 pt-2">
          <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-2">
            Default Indian Shipping &amp; Delivery Address
          </h3>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Flat / House No. / Street Address
            </label>
            <input
              type="text"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              placeholder="e.g. Flat 402, Green Glen Layout, Bellandur"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500"
              >
                {MAJOR_INDIAN_CITIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">State</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500"
              >
                {INDIAN_STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">PIN Code (6 digits)</label>
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="560103"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-neutral-100">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
};
