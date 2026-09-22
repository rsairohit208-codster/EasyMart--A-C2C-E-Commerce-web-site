import React, { useState } from 'react';
import { Mail, ArrowRight, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ForgotPasswordPage: React.FC = () => {
  const { navigateTo, showToast } = useApp();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [step, setStep] = useState<'request' | 'sent'>('request');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      showToast('Please enter your email or registered Indian mobile number', 'error');
      return;
    }
    setStep('sent');
    showToast('Password reset link and OTP dispatched successfully!');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      
      <button
        onClick={() => navigateTo('login')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Login</span>
      </button>

      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 font-display">
          Reset EasyMart Password
        </h1>
        <p className="text-xs text-neutral-500">
          Enter your registered email address or 10-digit Indian phone number to receive a secure OTP
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 space-y-5 shadow-xs">
        {step === 'request' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Email or Mobile Number (+91)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="e.g. rahul.verma@example.in or 9811223344"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-xs transition flex items-center justify-center gap-2"
            >
              <span>Send OTP Verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4 py-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-base text-neutral-900">OTP Sent!</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              We have sent a 6-digit verification code and reset link to <strong>{emailOrPhone}</strong>. Check your SMS inbox or email spam folder.
            </p>
            <button
              onClick={() => navigateTo('login')}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs"
            >
              Return to Login
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
