import React from 'react';
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="border-b border-neutral-200 pb-5">
        <h1 className="text-3xl font-extrabold text-neutral-900 font-display">
          Terms &amp; Conditions
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Effective Date: January 2026 • Governed by the Laws of the Republic of India
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-neutral-700 leading-relaxed shadow-xs">
        
        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900 font-display flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">1</span>
            Jurisdiction &amp; Territory
          </h2>
          <p>
            EasyMart operates exclusively within the geographic territory of India. All transactions, escrow services, and courier handovers are denominated in Indian Rupees (₹ INR) and regulated in accordance with the Information Technology Act 2000, Consumer Protection (E-Commerce) Rules 2020, and Reserve Bank of India (RBI) guidelines for electronic payment systems.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2 p-4 bg-amber-50 rounded-2xl border border-amber-200">
          <h2 className="text-base font-bold text-amber-950 font-display flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            2. Lightweight Essentials Only &amp; Prohibited Goods Mandate
          </h2>
          <p className="text-amber-900">
            EasyMart strictly caters to lightweight consumer essentials weighing under <strong>5000 grams (5kg)</strong>. Users are <strong>strictly prohibited</strong> from listing, marketing, or facilitating transactions for:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-amber-900 font-medium">
            <li>Motor vehicles, cars, bikes, scooters, tractors, or commercial automotive parts.</li>
            <li>Industrial machinery, machine tools, welding equipment, and commercial generators.</li>
            <li>Hazardous chemicals, weapons, combustible fuels, and counterfeit goods.</li>
          </ul>
          <p className="text-amber-800 text-xs">
            Any user attempting to upload listings for prohibited categories will have their account terminated immediately and reported to platform authorities.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900 font-display flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">3</span>
            Peer-to-Peer Escrow Protection Mechanism
          </h2>
          <p>
            To prevent fraud, payment made by the buyer is safely sequestered into an Escrow holding account. The seller is required to dispatch the item via a recognized courier partner (Delhivery, BlueDart, DTDC, India Post) with valid tracking. 
          </p>
          <p>
            Funds are released to the seller&apos;s UPI address solely when:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The buyer confirms physical delivery and parcel inspection in the app, OR</li>
            <li>48 hours elapse following verified courier delivery status without a recorded dispute.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900 font-display flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">4</span>
            Returns &amp; Dispute Resolution
          </h2>
          <p>
            If a delivered item is materially defective or unfaithful to the photographs and description provided by the seller, the buyer can file a dispute within 48 hours of parcel receipt. EasyMart moderators will review photographic evidence and issue a full 100% refund via UPI if the claim is verified.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900 font-display flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">5</span>
            Deployment &amp; Reliability
          </h2>
          <p>
            EasyMart is built to modern progressive web standards and is fully optimized for static CDN edge deployment (such as Netlify). Local state caching preserves user data across sessions without relying on insecure third-party cookies.
          </p>
        </section>

      </div>

    </div>
  );
};
