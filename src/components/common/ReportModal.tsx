import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportModal: React.FC = () => {
  const { reportModal, closeReportModal, submitReport, currentUser } = useApp();
  const { isOpen, targetType, targetId, targetTitle } = reportModal;

  const [reason, setReason] = useState('Prohibited Item: Heavy Industrial Machinery or Automotive');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const reportReasons = [
    'Prohibited Item: Heavy Industrial Machinery or Automotive',
    'Item exceeds 5kg lightweight policy',
    'Misleading Description or Fake Images',
    'Suspected Counterfeit or Unlicensed Goods',
    'Seller asking for offline money transfer outside EasyMart Escrow',
    'Abusive or Harassing communication',
    'Other Community Guideline Violation'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport({
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      targetType,
      targetId,
      targetTitle,
      reason,
      details: details.trim() || 'No additional details provided.'
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      closeReportModal();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-rose-50/50">
          <div className="flex items-center gap-2 text-rose-700">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-bold text-sm">Report {targetType === 'listing' ? 'Listing' : 'User'}</h3>
          </div>
          <button 
            id="close-report-modal-btn"
            onClick={closeReportModal}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-neutral-900 text-base">Report Submitted</h4>
            <p className="text-xs text-neutral-500 mt-1">
              Thank you for keeping EasyMart India safe. Our trust & safety team has queued this item for administrative review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
              <span className="text-neutral-500">Reporting:</span>
              <p className="font-bold text-neutral-900 truncate mt-0.5">{targetTitle}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Reason for report
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              >
                {reportReasons.map((r, i) => (
                  <option key={i} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Additional Details (Optional)
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Explain why this violates EasyMart rules (e.g. seller is selling industrial motor parts)..."
                className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 resize-none"
              />
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>EasyMart explicitly bars automotive vehicles, heavy tractors, machinery, and hazardous goods.</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeReportModal}
                className="px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="submit-report-btn"
                className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
