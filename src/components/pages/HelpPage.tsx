import React, { useState } from 'react';
import { 
  HelpCircle, ShieldCheck, Phone, Mail, 
  MessageSquare, ChevronDown, ChevronUp, Send, CheckCircle2 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HelpPage: React.FC = () => {
  const { showToast } = useApp();
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMsg, setTicketMsg] = useState('');
  const [ticketSent, setTicketSent] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does EasyMart Escrow protect Indian buyers and sellers?',
      a: 'When you purchase an item via UPI or Card, your money is securely locked in an RBI-compliant Escrow account. The seller is notified to ship via courier. Once the courier delivers the package and you inspect it, you click "Confirm Delivery", which automatically releases the funds to the seller\'s UPI address.'
    },
    {
      q: 'Why does EasyMart prohibit automotive, machinery, and industrial goods?',
      a: 'EasyMart is strictly engineered for everyday lightweight essentials (books, decor, kitchen gadgets, clothing, accessories, electronics under 5kg). Heavy machinery, tractor parts, and vehicles require specialized freight logistics and inspections, and are barred to keep shipping rapid, affordable, and consumer-safe.'
    },
    {
      q: 'What if an item arrives damaged or does not match description?',
      a: 'Do not click "Confirm Delivery". Simply open a dispute from your Orders page or tap "Report". EasyMart will hold the funds in escrow, review the photographs, and issue a 100% refund directly to your original UPI/bank account.'
    },
    {
      q: 'How do sellers get paid?',
      a: 'Sellers configure their UPI ID (VPA) in their Profile. Once a buyer confirms receipt or 48 hours lapse after verified courier delivery without dispute, the escrow system transfers the entire item amount straight to your UPI bank account with zero platform commission.'
    }
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMsg) return;
    setTicketSent(true);
    showToast('Support ticket #EM-HELP-892 created! Support agent will respond in 2 hours.');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 font-display">
          EasyMart India Help &amp; Support
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600">
          Dedicated assistance for peer-to-peer everyday transactions, Escrow resolution, and courier tracking
        </p>
      </div>

      {/* Support Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/90 text-center space-y-2 shadow-2xs">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-neutral-900">Toll-Free Helpline</h3>
          <p className="text-xs font-mono font-bold text-emerald-700">1800-420-EASY (3279)</p>
          <span className="text-[10px] text-neutral-400 block">Mon - Sat, 9:00 AM - 8:00 PM IST</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200/90 text-center space-y-2 shadow-2xs">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-neutral-900">Email Grievance</h3>
          <p className="text-xs font-bold text-emerald-700">support@easymart.in</p>
          <span className="text-[10px] text-neutral-400 block">Avg. response under 2 hours</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200/90 text-center space-y-2 shadow-2xs">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-neutral-900">Escrow Dispute Cell</h3>
          <p className="text-xs font-bold text-emerald-700">disputes@easymart.in</p>
          <span className="text-[10px] text-neutral-400 block">Fast UPI refund decisions</span>
        </div>
      </div>

      {/* FAQs */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-neutral-900 font-display">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-neutral-200/90 overflow-hidden transition"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-neutral-900 flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-neutral-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Ticket Form */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="border-b border-neutral-100 pb-3">
          <h3 className="text-base font-bold text-neutral-900">Submit a Support Ticket</h3>
          <p className="text-xs text-neutral-500">Need help with an ongoing order, delivery, or seller verification?</p>
        </div>

        {ticketSent ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-sm text-neutral-900">Ticket Submitted Successfully!</h4>
            <p className="text-xs text-neutral-500">Our customer team in Bengaluru will contact you shortly.</p>
            <button
              onClick={() => { setTicketSent(false); setTicketSubject(''); setTicketMsg(''); }}
              className="mt-3 px-4 py-2 bg-neutral-100 text-neutral-700 text-xs font-bold rounded-xl"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Issue Subject</label>
              <input
                type="text"
                required
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="e.g. Courier tracking not updating for order #EM-IN-78219"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Detailed Description</label>
              <textarea
                required
                rows={3}
                value={ticketMsg}
                onChange={(e) => setTicketMsg(e.target.value)}
                placeholder="Please describe what happened, transaction ID, or seller name..."
                className="w-full p-3 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Ticket</span>
            </button>
          </form>
        )}
      </div>

    </div>
  );
};
