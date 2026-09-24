import React, { useState, useRef } from 'react';
import { 
  User, Mail, Phone, MapPin, ShieldCheck, 
  CreditCard, CheckCircle2, Save, Star, Package, ShoppingBag,
  Camera, Upload, Trash2, Image as ImageIcon, Plus, Link2, X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INDIAN_STATES, MAJOR_INDIAN_CITIES } from '../../data/seedData';
import { AvatarPlaceholder } from '../common/AvatarPlaceholder';

export const MyProfilePage: React.FC = () => {
  const { 
    currentUser, isAuthenticated, updateUserProfile, updateProfilePhoto, 
    removeProfilePhoto, navigateTo, showToast 
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [city, setCity] = useState(currentUser.city);
  const [state, setState] = useState(currentUser.state);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [upiId, setUpiId] = useState(currentUser.upiId || '');
  const defaultAddr = currentUser.savedAddresses[0];
  const [addressLine1, setAddressLine1] = useState(defaultAddr?.addressLine1 || '');
  const [pincode, setPincode] = useState(defaultAddr?.pincode || '');

  // Handle local file upload (converts to base64 Data URL for persistent preview)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be under 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateProfilePhoto(reader.result);
        showToast('Profile photo added successfully!');
      }
    };
    reader.onerror = () => {
      showToast('Failed to read image file', 'error');
    };
    reader.readAsDataURL(file);

    // Reset input value so same file can be re-selected if needed
    e.target.value = '';
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      showToast('Please enter an image URL', 'error');
      return;
    }
    updateProfilePhoto(urlInput.trim());
    setUrlInput('');
    setShowUrlInput(false);
    showToast('Profile photo updated from link!');
  };

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

  const quickAvatarPresets = [
    { label: 'Friendly Portrait', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80' },
    { label: 'Professional', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80' },
    { label: 'Minimalist Store', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80' },
    { label: 'Casual Trader', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80' },
  ];

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto shadow-xs">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-neutral-900 font-display">Sign In to View Your Profile</h2>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
            Manage your personal profile, pan-India delivery addresses, UPI payout IDs, and trust badges.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigateTo('login')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition"
          >
            Sign In Now
          </button>
          <button
            onClick={() => navigateTo('register')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs transition"
          >
            Register Free Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
        id="profile-photo-file-input"
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display">
          My Account &amp; Payout Settings
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Manage your contact credentials, optional profile photo, Indian shipping address, and Escrow UPI VPA
        </p>
      </div>

      {/* Profile Overview Card with Reserved Photo Area */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          
          {/* Reserved Photo Placement */}
          <div className="relative shrink-0">
            {currentUser.avatar ? (
              <div className="relative group">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Change photo"
                  className="absolute inset-0 bg-black/40 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-[11px] font-bold"
                >
                  <Camera className="w-5 h-5" />
                  <span>Change</span>
                </button>
              </div>
            ) : (
              /* Reserved Photo Slot: Empty & Optional State */
              <div 
                id="reserved-photo-slot"
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-2xl border-2 border-dashed border-emerald-400/90 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-600 transition cursor-pointer flex flex-col items-center justify-center p-2 text-center group shadow-2xs"
                title="Click to add optional profile photo"
              >
                <div className="w-9 h-9 rounded-full bg-white text-emerald-600 shadow-xs flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-emerald-800 leading-tight">
                  + Add Photo
                </span>
                <span className="text-[9px] font-medium text-emerald-600 uppercase tracking-wide">
                  Optional
                </span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-neutral-900">{currentUser.name}</h2>
              {currentUser.isVerified && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500">{currentUser.email}</p>
            
            <div className="flex items-center gap-3 text-xs text-neutral-600 pt-1">
              <span className="font-semibold capitalize text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                Role: {currentUser.role}
              </span>
              <span className="flex items-center text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                {currentUser.rating} ({currentUser.reviewCount} Reviews)
              </span>
            </div>

            {/* Quick Photo Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              {currentUser.avatar ? (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-xl transition inline-flex items-center gap-1.5 border border-emerald-200"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Change Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={removeProfilePhoto}
                    className="text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-xl transition inline-flex items-center gap-1.5 border border-rose-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Photo</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-xl transition inline-flex items-center gap-1.5 shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo (Optional)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1.5 rounded-xl transition inline-flex items-center gap-1"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>{showUrlInput ? 'Cancel' : 'Paste Link'}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Nav shortcuts */}
        <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0">
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

      {/* URL Input Form if toggled */}
      {showUrlInput && (
        <form onSubmit={handleApplyUrl} className="bg-emerald-50/80 rounded-2xl border border-emerald-200 p-4 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-emerald-700" />
              Add Photo via Web URL (Optional)
            </span>
            <button
              type="button"
              onClick={() => setShowUrlInput(false)}
              className="text-neutral-400 hover:text-neutral-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://example.com/my-photo.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs bg-white border border-emerald-300 rounded-xl outline-none focus:border-emerald-600"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shrink-0"
            >
              Apply Photo
            </button>
          </div>
        </form>
      )}

      {/* Edit Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
        
        {/* Profile Photo Dedicated Optional Management Section */}
        <div className="space-y-3 border-b border-neutral-100 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider">
                Profile Photo (Optional)
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                EasyMart keeps your photo optional. You can upload an avatar or leave this reserved slot empty.
              </p>
            </div>
            <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
              Optional Field
            </span>
          </div>

          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AvatarPlaceholder 
                name={currentUser.name} 
                avatar={currentUser.avatar} 
                size="lg" 
              />
              <div>
                <p className="text-xs font-bold text-neutral-800">
                  {currentUser.avatar ? 'Custom Photo Active' : 'No Photo Uploaded (Default Place Reserved)'}
                </p>
                <p className="text-[11px] text-neutral-500">
                  {currentUser.avatar 
                    ? 'Your photo is visible to Indian buyers & sellers on your listings.' 
                    : 'The slot is reserved. Click below to add an optional image anytime.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-2xs"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                <span>{currentUser.avatar ? 'Change' : 'Choose File'}</span>
              </button>

              {currentUser.avatar && (
                <button
                  type="button"
                  onClick={removeProfilePhoto}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Avatar Presets for Testing */}
          <div className="pt-1">
            <span className="text-[11px] font-semibold text-neutral-500 block mb-2">
              Or pick an optional sample avatar:
            </span>
            <div className="flex flex-wrap gap-2">
              {quickAvatarPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => updateProfilePhoto(preset.url)}
                  className="flex items-center gap-2 px-2.5 py-1.5 bg-white hover:bg-emerald-50 border border-neutral-200 hover:border-emerald-300 rounded-xl transition text-left"
                >
                  <img src={preset.url} alt="" className="w-6 h-6 rounded-full object-cover" />
                  <span className="text-[11px] font-medium text-neutral-700">{preset.label}</span>
                </button>
              ))}
              {currentUser.avatar && (
                <button
                  type="button"
                  onClick={removeProfilePhoto}
                  className="text-[11px] font-bold text-neutral-500 hover:text-rose-600 px-2.5 py-1.5 rounded-xl hover:bg-neutral-100 transition"
                >
                  Clear Photo
                </button>
              )}
            </div>
          </div>
        </div>

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
