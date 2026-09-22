import React from 'react';
import { ShieldCheck, Lock, EyeOff, FileText } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="border-b border-neutral-200 pb-5">
        <h1 className="text-3xl font-extrabold text-neutral-900 font-display">
          Privacy Policy
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Compliant with the Digital Personal Data Protection (DPDP) Act 2023 of India
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-neutral-700 leading-relaxed shadow-xs">
        
        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900 font-display flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            1. Our Commitment to Indian Citizens&apos; Privacy
          </h2>
          <p>
            EasyMart values the trust you place in our peer-to-peer everyday essentials platform. We strictly collect only information necessary to ensure safe product handovers, accurate PIN code courier logistics, and secure UPI escrow settlements.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900 font-display flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" />
            2. Masked Contact Information in Chat
          </h2>
          <p>
            To prevent harassment and off-platform fraudulent deals, personal contact numbers and emails are masked in our peer negotiation chat. All inquiries and price offers should occur directly within EasyMart so that Escrow guarantees remain enforceable.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900 font-display flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-emerald-600" />
            3. Financial &amp; UPI Security
          </h2>
          <p>
            EasyMart never stores sensitive bank account credentials, credit card CVV codes, or UPI MPINs. Payout VPAs are only used to trigger NPCI payment transfers upon buyer delivery approval. All transmissions use end-to-end TLS 1.3 encryption.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900 font-display flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            4. User Rights &amp; Data Deletion
          </h2>
          <p>
            Under India&apos;s DPDP Act, you have the right to review, update, or request the permanent deletion of your profile and listing history at any time. Simply submit a request to <span className="font-semibold text-emerald-800">privacy@easymart.in</span>.
          </p>
        </section>

      </div>

    </div>
  );
};
