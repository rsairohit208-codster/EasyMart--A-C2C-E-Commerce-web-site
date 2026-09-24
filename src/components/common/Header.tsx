import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, MapPin, Heart, Bell, PlusCircle, ShieldCheck, 
  User as UserIcon, Package, ShoppingBag, MessageSquare, 
  HelpCircle, Settings, ChevronDown, Check, Sparkles, LogOut, ArrowRight, LogIn, UserPlus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MAJOR_INDIAN_CITIES } from '../../data/seedData';
import { AvatarPlaceholder } from './AvatarPlaceholder';

export const Header: React.FC = () => {
  const { 
    currentUser, isAuthenticated, logoutUser, requireAuth, activePage, navigateTo, 
    searchQuery, setSearchQuery, selectedCity, setSelectedCity, 
    wishlist, notifications, markNotificationRead, categories 
  } = useApp();

  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const cityRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setIsCityOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setIsUserMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setIsNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    navigateTo('products', { query: localSearch });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-xs">
      {/* Top Bar for Trust & Escrow Guarantee */}
      <div className="bg-neutral-900 text-neutral-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              EasyMart 100% Escrow Protection
            </span>
            <span className="hidden sm:inline text-neutral-500">•</span>
            <span className="hidden sm:inline text-neutral-300">Payment released only after parcel inspection at your doorstep.</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[11px]">
            <span className="text-amber-300 font-medium hidden md:inline">
              🇮🇳 Pan-India Courier Network (Delhivery, BlueDart, India Post)
            </span>
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigateTo('my-profile')}
                  className="text-neutral-300 hover:text-white transition flex items-center gap-1"
                >
                  <span>Namaste,</span>
                  <strong className="text-emerald-400 font-semibold underline underline-offset-2">{currentUser.name}</strong>
                </button>
                <span className="text-neutral-600">•</span>
                <button
                  onClick={logoutUser}
                  className="text-neutral-400 hover:text-rose-300 transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 font-medium">
                <button
                  onClick={() => navigateTo('login')}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition flex items-center gap-1"
                >
                  <LogIn className="w-3 h-3" />
                  <span>Sign In</span>
                </button>
                <span className="text-neutral-600">•</span>
                <button
                  onClick={() => navigateTo('register')}
                  className="text-neutral-300 hover:text-white transition"
                >
                  Register Free
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-4 shrink-0">
            <button 
              id="brand-logo-btn"
              onClick={() => navigateTo('home')} 
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-neutral-900 font-display">
                    Easy<span className="text-emerald-600">Mart</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                    India 🇮🇳
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500 font-medium leading-none hidden sm:block">Everyday Essentials C2C</p>
              </div>
            </button>

            {/* City Selector */}
            <div className="relative hidden md:block" ref={cityRef}>
              <button 
                id="header-city-btn"
                onClick={() => setIsCityOpen(!isCityOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200/80 rounded-lg transition border border-neutral-200"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span className="truncate max-w-[100px]">{selectedCity}</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {isCityOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-50 max-h-64 overflow-y-auto">
                  <div className="px-3 py-1 text-[11px] font-semibold text-neutral-400 uppercase">
                    Select Your City
                  </div>
                  <button
                    onClick={() => { setSelectedCity('All India'); setIsCityOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-neutral-50 flex items-center justify-between ${selectedCity === 'All India' ? 'text-emerald-600 font-bold bg-emerald-50' : 'text-neutral-700'}`}
                  >
                    <span>🇮🇳 All India</span>
                    {selectedCity === 'All India' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                  {MAJOR_INDIAN_CITIES.map(city => (
                    <button
                      key={city}
                      onClick={() => { setSelectedCity(city); setIsCityOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-neutral-50 flex items-center justify-between ${selectedCity === city ? 'text-emerald-600 font-bold bg-emerald-50' : 'text-neutral-700'}`}
                    >
                      <span>{city}</span>
                      {selectedCity === city && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl relative">
            <div className="relative flex items-center">
              <input
                id="global-search-input"
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search books, kitchen essentials, kurtas, electronics, decor..."
                className="w-full bg-neutral-100/90 hover:bg-neutral-100 focus:bg-white text-neutral-900 pl-10 pr-24 py-2 text-xs sm:text-sm rounded-xl border border-neutral-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
              <button 
                type="submit"
                id="global-search-submit-btn"
                className="absolute right-1.5 px-3 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Post Item Button */}
            <button 
              id="header-post-ad-btn"
              onClick={() => requireAuth('list an item for sale', () => navigateTo('post-item'))}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition hover:shadow-md hover:shadow-emerald-600/20 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Post Free Ad</span>
              <span className="sm:hidden">Sell</span>
            </button>

            {/* Wishlist */}
            <button 
              id="header-wishlist-btn"
              onClick={() => navigateTo('wishlist')}
              className="relative p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition"
              title="Saved Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Chat Icon */}
            <button
              id="header-chat-btn"
              onClick={() => requireAuth('open your chats', () => navigateTo('chat'))}
              className="relative p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition"
              title="C2C Chats"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button 
                    id="header-notif-btn"
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="relative p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotifsCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadNotifsCount}
                      </span>
                    )}
                  </button>

                  {isNotifOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-neutral-200 p-2 z-50">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-100">
                        <span className="font-bold text-neutral-900 text-xs">Notifications</span>
                        <button 
                          onClick={() => { navigateTo('notifications'); setIsNotifOpen(false); }}
                          className="text-xs text-emerald-600 font-semibold hover:underline"
                        >
                          View All
                        </button>
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-neutral-50 py-1">
                        {notifications.slice(0, 4).map(n => (
                          <div 
                            key={n.id}
                            onClick={() => {
                              markNotificationRead(n.id);
                              if (n.linkPage) navigateTo(n.linkPage as any, { productId: n.linkId, conversationId: n.linkId });
                              setIsNotifOpen(false);
                            }}
                            className={`p-2.5 rounded-xl cursor-pointer transition text-left hover:bg-neutral-50 ${!n.read ? 'bg-emerald-50/50' : ''}`}
                          >
                            <div className="text-xs font-bold text-neutral-900 flex items-center justify-between">
                              <span>{n.title}</span>
                              <span className="text-[10px] text-neutral-400 font-normal">{n.timestamp}</span>
                            </div>
                            <p className="text-[11px] text-neutral-600 mt-0.5 line-clamp-2">{n.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Dropdown */}
                <div className="relative" ref={userRef}>
                  <button 
                    id="header-user-menu-btn"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 pl-1.5 rounded-xl hover:bg-neutral-100 transition border border-transparent hover:border-neutral-200"
                  >
                    <AvatarPlaceholder name={currentUser.name} avatar={currentUser.avatar} size="sm" />
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-500 hidden sm:block" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-neutral-200 py-2 z-50 text-xs">
                      <div className="px-4 py-2.5 border-b border-neutral-100 flex items-center gap-3">
                        <AvatarPlaceholder name={currentUser.name} avatar={currentUser.avatar} size="sm" />
                        <div className="overflow-hidden">
                          <p className="font-bold text-neutral-900 truncate">{currentUser.name}</p>
                          <p className="text-[11px] text-neutral-500 truncate">{currentUser.email || currentUser.phone}</p>
                          <div className="mt-1 flex items-center gap-1.5">
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded capitalize">
                              {currentUser.role}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-medium">★ {currentUser.rating} ({currentUser.reviewCount})</span>
                          </div>
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => { navigateTo('my-profile'); setIsUserMenuOpen(false); }}
                          className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center gap-2.5 text-neutral-700 font-medium"
                        >
                          <UserIcon className="w-4 h-4 text-neutral-400" />
                          <span>My Profile & Addresses</span>
                        </button>

                        <button
                          onClick={() => { navigateTo('my-listings'); setIsUserMenuOpen(false); }}
                          className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center gap-2.5 text-neutral-700 font-medium"
                        >
                          <Package className="w-4 h-4 text-neutral-400" />
                          <span>My Active Listings</span>
                        </button>

                        <button
                          onClick={() => { navigateTo('orders'); setIsUserMenuOpen(false); }}
                          className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center gap-2.5 text-neutral-700 font-medium"
                        >
                          <ShoppingBag className="w-4 h-4 text-neutral-400" />
                          <span>Purchases & Orders</span>
                        </button>

                        <button
                          onClick={() => { navigateTo('sales'); setIsUserMenuOpen(false); }}
                          className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center gap-2.5 text-neutral-700 font-medium"
                        >
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>Selling Sales & Payouts</span>
                        </button>

                        {currentUser.role === 'admin' && (
                          <button
                            onClick={() => { navigateTo('admin'); setIsUserMenuOpen(false); }}
                            className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center gap-2.5 text-neutral-700 font-medium"
                          >
                            <Settings className="w-4 h-4 text-blue-500" />
                            <span>Platform Admin Panel</span>
                          </button>
                        )}

                        <button
                          onClick={() => { navigateTo('help'); setIsUserMenuOpen(false); }}
                          className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center gap-2.5 text-neutral-700 font-medium"
                        >
                          <HelpCircle className="w-4 h-4 text-neutral-400" />
                          <span>Help & Support Center</span>
                        </button>
                      </div>

                      <div className="pt-1 border-t border-neutral-100">
                        <button
                          onClick={() => { logoutUser(); setIsUserMenuOpen(false); }}
                          className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 font-medium flex items-center gap-2.5"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="header-sign-in-btn"
                  onClick={() => navigateTo('login')}
                  className="px-3 py-1.5 text-xs font-bold text-neutral-700 hover:text-emerald-700 hover:bg-neutral-100 rounded-xl transition"
                >
                  Sign In
                </button>
                <button
                  id="header-register-btn"
                  onClick={() => navigateTo('register')}
                  className="px-3 py-1.5 text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Categories Strip */}
        <div className="flex items-center gap-2 py-2.5 overflow-x-auto no-scrollbar text-xs border-t border-neutral-100">
          <button 
            onClick={() => navigateTo('products')}
            className={`shrink-0 px-3 py-1 rounded-full font-semibold transition ${activePage === 'products' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
          >
            All Products
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => navigateTo('products', { categorySlug: c.name })}
              className="shrink-0 px-3 py-1 rounded-full bg-neutral-100 hover:bg-emerald-50 hover:text-emerald-700 text-neutral-700 font-medium transition"
            >
              {c.name}
            </button>
          ))}
          <button
            onClick={() => navigateTo('categories')}
            className="shrink-0 px-3 py-1 rounded-full text-emerald-700 hover:bg-emerald-50 font-bold transition flex items-center gap-1"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </header>
  );
};
