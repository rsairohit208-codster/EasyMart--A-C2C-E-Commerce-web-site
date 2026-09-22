import React from 'react';
import { 
  ShieldCheck, Truck, RefreshCw, HeartHandshake, 
  ShoppingBag, Phone, Mail, MapPin, AlertTriangle, ExternalLink 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { navigateTo, categories } = useApp();

  return (
    <footer className="bg-neutral-900 text-neutral-300 pt-12 pb-8 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-neutral-800">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-neutral-800 text-emerald-400 rounded-xl shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Safe Indian Escrow</h4>
              <p className="text-xs text-neutral-400 mt-1">Payment is held securely in escrow until you receive & verify your item.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-neutral-800 text-teal-400 rounded-xl shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Pan-India Delivery</h4>
              <p className="text-xs text-neutral-400 mt-1">Doorstep pickup & tracked delivery via Delhivery, BlueDart & India Post.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-neutral-800 text-amber-400 rounded-xl shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">48-Hr Return Inspection</h4>
              <p className="text-xs text-neutral-400 mt-1">If item differs from description, open a dispute for a full UPI refund.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-neutral-800 text-rose-400 rounded-xl shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Everyday Essentials Only</h4>
              <p className="text-xs text-neutral-400 mt-1">Automotive engines, heavy industrial machinery & hazardous goods strictly barred.</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-10 border-b border-neutral-800 text-xs">
          
          {/* Brand Col */}
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white font-display">
                Easy<span className="text-emerald-400">Mart</span> India
              </span>
            </div>
            <p className="text-neutral-400 mt-3 text-xs leading-relaxed max-w-sm">
              India&apos;s premier customer-to-customer (C2C) marketplace for pre-loved everyday home essentials, books, lightweight gadgets, and ethnic apparel. Safe, verified, and community powered.
            </p>

            <div className="mt-4 flex items-center gap-3 text-neutral-400">
              <span className="inline-flex items-center gap-1.5 bg-neutral-800 px-2.5 py-1 rounded text-[11px] text-neutral-300">
                <span>Made with pride in India</span> 🇮🇳
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold">
                BHIM UPI • RuPay • NetBanking
              </span>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Popular Categories</h5>
            <ul className="space-y-2 text-neutral-400">
              {categories.slice(0, 5).map(c => (
                <li key={c.id}>
                  <button 
                    onClick={() => navigateTo('products', { categorySlug: c.name })}
                    className="hover:text-emerald-400 transition"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Buyer & Seller</h5>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button onClick={() => navigateTo('post-item')} className="hover:text-emerald-400 transition">
                  Post Free Ad (+ Sell)
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('orders')} className="hover:text-emerald-400 transition">
                  Track My Orders
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('sales')} className="hover:text-emerald-400 transition">
                  Seller Payouts (UPI)
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('wishlist')} className="hover:text-emerald-400 transition">
                  Saved Wishlist
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('admin')} className="hover:text-emerald-400 transition">
                  Admin Governance
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Support & Trust</h5>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button onClick={() => navigateTo('help')} className="hover:text-emerald-400 transition">
                  Help & FAQs
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('terms')} className="hover:text-emerald-400 transition">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('privacy')} className="hover:text-emerald-400 transition">
                  Privacy Policy (India)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('help')}
                  className="hover:text-emerald-400 transition text-amber-400"
                >
                  Report Fraud / Suspicious Ad
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & statutory note */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500 gap-3">
          <p>© {new Date().getFullYear()} EasyMart India Internet Pvt Ltd. Compliant with Consumer Protection (E-Commerce) Rules, 2020.</p>
          <div className="flex items-center gap-4">
            <span className="text-neutral-400">Registered Office: Koramangala 4th Block, Bengaluru, KA 560034</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
