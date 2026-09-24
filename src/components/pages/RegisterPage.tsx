import React, { useState, useRef } from 'react';
import { 
  User, Mail, Phone, MapPin, Lock, 
  ArrowRight, ShieldCheck, CheckCircle2,
  Camera, Upload, X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INDIAN_STATES, MAJOR_INDIAN_CITIES } from '../../data/seedData';

export const RegisterPage: React.FC = () => {
  const { registerUser, navigateTo, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('seller');
  const [agreed, setAgreed] = useState(true);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be under 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
        showToast('Photo added! (Optional)');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (!agreed) {
      showToast('Please agree to terms and community rules', 'error');
      return;
    }

    registerUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      avatar: avatar.trim(),
      city,
      state,
      role
    }, password);
    navigateTo('home');
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display">
          Create Free EasyMart Account
        </h1>
        <p className="text-xs text-neutral-500">
          Join India&apos;s trusted everyday essentials trading network
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 space-y-5 shadow-xs">
        
        {/* Role Toggle */}
        <div>
          <label className="block text-xs font-bold text-neutral-700 mb-2">I primarily want to:</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('seller')}
              className={`p-3 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1 ${role === 'seller' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-neutral-200 text-neutral-600'}`}
            >
              <span>Sell Everyday Items</span>
              <span className="text-[10px] font-normal text-neutral-500">Post ads &amp; earn to UPI</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`p-3 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1 ${role === 'buyer' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-neutral-200 text-neutral-600'}`}
            >
              <span>Buy &amp; Save Money</span>
              <span className="text-[10px] font-normal text-neutral-500">Escrow protected checkout</span>
            </button>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
          id="register-photo-input"
        />

        {/* Optional Profile Photo - Reserved Slot */}
        <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-neutral-700">
              Profile Photo (Optional)
            </label>
            <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Reserved Place
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            {avatar ? (
              <div className="relative group shrink-0">
                <img
                  src={avatar}
                  alt="Preview"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setAvatar('')}
                  className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-0.5 hover:bg-rose-600"
                  title="Remove photo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-14 h-14 rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-50/50 hover:bg-emerald-50 transition cursor-pointer flex flex-col items-center justify-center shrink-0 group"
                title="Click to select photo"
              >
                <Camera className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
              </div>
            )}

            <div className="space-y-1">
              <p className="text-xs text-neutral-600">
                {avatar ? 'Custom photo ready' : 'No permanent photo required. Add a photo or leave it empty.'}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white border border-neutral-300 hover:bg-neutral-50 px-2.5 py-1 rounded-lg transition inline-flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" />
                  <span>{avatar ? 'Change' : 'Choose Photo'}</span>
                </button>
                {avatar && (
                  <button
                    type="button"
                    onClick={() => setAvatar('')}
                    className="text-xs font-medium text-rose-600 hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-700 mb-1">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ananya Sen"
              className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ananya@example.in"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Indian Mobile (+91)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-start gap-2 text-xs text-neutral-600 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>
              I agree to the EasyMart <button type="button" onClick={() => navigateTo('terms')} className="text-emerald-700 font-bold hover:underline">Terms &amp; Conditions</button> and acknowledge that heavy machinery and automotive sales are strictly prohibited.
            </span>
          </label>
        </div>

        <button
          id="register-submit-btn"
          type="submit"
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
        >
          <span>Create Account</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center text-xs text-neutral-500">
          Already registered?{' '}
          <button
            type="button"
            onClick={() => navigateTo('login')}
            className="text-emerald-700 hover:underline font-bold"
          >
            Log In
          </button>
        </div>

      </form>

    </div>
  );
};
