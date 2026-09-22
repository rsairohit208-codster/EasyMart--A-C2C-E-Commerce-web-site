import React, { useState } from 'react';
import { 
  Lock, Mail, ArrowRight, ShieldCheck, 
  Smartphone, UserCheck, CheckCircle2 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LoginPage: React.FC = () => {
  const { loginUser, setCurrentUserById, navigateTo } = useApp();

  const [identifier, setIdentifier] = useState('priya.sharma@example.in');
  const [password, setPassword] = useState('password123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(identifier);
    navigateTo('home');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-neutral-900 font-display">
          Welcome to EasyMart India
        </h1>
        <p className="text-xs text-neutral-500">
          India&apos;s verified peer-to-peer everyday essentials marketplace
        </p>
      </div>

      {/* Demo Quick Logins */}
      <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs space-y-2.5">
        <span className="font-bold text-emerald-900 block text-[11px] uppercase tracking-wider">
          Quick Demo 1-Click Persona Switcher:
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              setCurrentUserById('usr-seller-priya');
              navigateTo('home');
            }}
            className="p-2 bg-white rounded-xl border border-emerald-200 font-bold text-[11px] text-emerald-800 hover:bg-emerald-100/50 shadow-2xs transition"
          >
            Priya (Seller)
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentUserById('usr-buyer-demo');
              navigateTo('home');
            }}
            className="p-2 bg-white rounded-xl border border-emerald-200 font-bold text-[11px] text-emerald-800 hover:bg-emerald-100/50 shadow-2xs transition"
          >
            Rahul (Buyer)
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentUserById('usr-admin-demo');
              navigateTo('admin');
            }}
            className="p-2 bg-white rounded-xl border border-emerald-200 font-bold text-[11px] text-emerald-800 hover:bg-emerald-100/50 shadow-2xs transition"
          >
            Vikram (Admin)
          </button>
        </div>
      </div>

      {/* Login Card */}
      <form onSubmit={handleLogin} className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 space-y-5 shadow-xs">
        <div>
          <label className="block text-xs font-bold text-neutral-700 mb-1">
            Email or Indian Mobile (+91)
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
            <input
              id="login-identifier"
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. priya.sharma@example.in or 9876543210"
              className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-neutral-700">Password</label>
            <button
              type="button"
              onClick={() => navigateTo('forgot-password')}
              className="text-[11px] text-emerald-700 hover:underline font-semibold"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>
        </div>

        <button
          id="login-submit-btn"
          type="submit"
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
        >
          <span>Sign In Securely</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="pt-2 text-center text-xs text-neutral-500">
          Don&apos;t have an EasyMart account?{' '}
          <button
            type="button"
            onClick={() => navigateTo('register')}
            className="text-emerald-700 hover:underline font-bold"
          >
            Register Free
          </button>
        </div>
      </form>

      {/* Safety footer */}
      <div className="text-center text-[11px] text-neutral-400 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Secured with 256-bit encryption &amp; Indian NPCI Escrow protocols</span>
      </div>

    </div>
  );
};
