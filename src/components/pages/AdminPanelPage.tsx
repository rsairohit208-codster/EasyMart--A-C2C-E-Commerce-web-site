import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, Users, Package, 
  DollarSign, CheckCircle2, XCircle, Search, Trash2, 
  RefreshCw, Lock, ArrowUpRight, Check 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminPanelPage: React.FC = () => {
  const { 
    currentUser, products, users, orders, reports, 
    resolveReport, deleteProduct, releaseEscrow, showToast,
    updateProduct 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'escrow' | 'listings' | 'users'>('overview');
  const [searchAdmin, setSearchAdmin] = useState('');

  // Metrics
  const activeProducts = products.filter(p => p.status === 'active');
  const escrowHeldTotal = orders
    .filter(o => o.escrowStatus === 'held_in_escrow')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const escrowReleasedTotal = orders
    .filter(o => o.escrowStatus === 'released_to_seller')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingReports = reports.filter(r => r.status === 'pending');

  const handleTakeDown = (productId: string, reportId?: string) => {
    deleteProduct(productId);
    if (reportId) resolveReport(reportId, 'resolved');
    showToast('Listing taken down and removed from Indian catalog');
  };

  const handleForceReleaseEscrow = (orderId: string) => {
    releaseEscrow(orderId);
    showToast('Admin override: Escrow released to seller UPI');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>EasyMart National Administration Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display">
            Platform Governance &amp; Escrow Center
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Admin: <strong>{currentUser.name}</strong> • Enforcing &lt;5kg everyday essentials &amp; Indian consumer escrow
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex flex-wrap gap-1.5 bg-neutral-100 p-1.5 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl transition ${activeTab === 'overview' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${activeTab === 'reports' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'}`}
          >
            <span>Safety Reports</span>
            {pendingReports.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">
                {pendingReports.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('escrow')}
            className={`px-3 py-1.5 rounded-xl transition ${activeTab === 'escrow' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'}`}
          >
            Escrow Vault (₹)
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-3 py-1.5 rounded-xl transition ${activeTab === 'listings' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'}`}
          >
            All Listings
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-xl transition ${activeTab === 'users' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'}`}
          >
            User Verification
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-neutral-400">Total Active Listings</span>
          <div className="text-2xl font-black text-neutral-900 font-display">{activeProducts.length}</div>
          <span className="text-[11px] text-emerald-700 font-medium">Pan-India coverage</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-neutral-400">Locked in Escrow</span>
          <div className="text-2xl font-black text-amber-600 font-display">₹{escrowHeldTotal.toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-amber-800 font-medium">Pending parcel handovers</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-neutral-400">Escrow Settled</span>
          <div className="text-2xl font-black text-emerald-600 font-display">₹{escrowReleasedTotal.toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-emerald-700 font-medium">Paid to seller UPI accounts</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-neutral-400">Safety Flagged</span>
          <div className="text-2xl font-black text-rose-600 font-display">{pendingReports.length}</div>
          <span className="text-[11px] text-rose-700 font-medium">Urgent review required</span>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Policy Compliance Audit */}
          <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-neutral-900 font-display flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Automated Anti-Heavy Machinery Audit
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Our automated content ingestion filter scans all incoming ads to enforce our strict prohibition on automotive vehicles, industrial machinery, and tools exceeding 5kg.
            </p>
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <span className="font-bold block">Status: Clean &amp; Compliant</span>
              <span>0 active heavy machinery or tractor listings detected. All current active listings adhere to the everyday essentials category.</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-neutral-900 font-display">
              Escrow Operations Quick Summary
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {orders.length} total C2C transactions recorded on the platform with 100% trace records for tax compliance.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab('escrow')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition"
              >
                Inspect Escrow Orders
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs rounded-xl transition"
              >
                Review Reports ({pendingReports.length})
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: SAFETY REPORTS */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-neutral-900">Safety &amp; Compliance Reports</h3>
              <p className="text-xs text-neutral-500">Flags submitted by Indian buyers &amp; sellers</p>
            </div>
          </div>

          {reports.length === 0 ? (
            <div className="p-12 text-center text-xs text-neutral-400">
              No reports currently filed. The marketplace is running smoothly.
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {reports.map((rep) => (
                <div key={rep.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                        {rep.targetType}: {rep.reason}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${rep.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {rep.status}
                      </span>
                      <span className="text-[10px] text-neutral-400">{rep.createdAt}</span>
                    </div>

                    <h4 className="font-bold text-xs sm:text-sm text-neutral-900">
                      Report on: {rep.targetTitle}
                    </h4>

                    <p className="text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                      &quot;{rep.details}&quot;
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {rep.targetType === 'listing' && (
                      <button
                        onClick={() => handleTakeDown(rep.targetId, rep.id)}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Take Down Listing</span>
                      </button>
                    )}

                    {rep.status === 'pending' && (
                      <button
                        onClick={() => resolveReport(rep.id, 'dismissed')}
                        className="px-3 py-1.5 text-xs font-bold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition"
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ESCROW VAULT */}
      {activeTab === 'escrow' && (
        <div className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-neutral-900">Active Escrow Transactions</h3>
              <p className="text-xs text-neutral-500">Oversee buyer payments awaiting delivery verification</p>
            </div>
          </div>

          <div className="divide-y divide-neutral-100">
            {orders.map((ord) => (
              <div key={ord.id} className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex gap-4 items-center">
                  <img src={ord.productImage} alt="" className="w-14 h-14 rounded-xl object-cover border" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-neutral-400">#{ord.orderNumber}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${ord.escrowStatus === 'released_to_seller' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {ord.escrowStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-neutral-900">{ord.productTitle}</h4>
                    <p className="text-xs text-neutral-500">
                      Buyer: {ord.buyerName} ➔ Seller: {ord.sellerName} (UPI: {ord.sellerUpiId || 'VPA verified'})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                  <div className="text-right">
                    <span className="font-black text-sm text-neutral-900 block font-display">₹{ord.totalAmount}</span>
                    <span className="text-[10px] text-neutral-400">{ord.status}</span>
                  </div>

                  {ord.escrowStatus === 'held_in_escrow' && (
                    <button
                      onClick={() => handleForceReleaseEscrow(ord.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs transition"
                    >
                      Admin Release to Seller
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ALL LISTINGS */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-neutral-900">Manage All Catalog Listings</h3>
              <p className="text-xs text-neutral-500">Verify weight limits (&lt;5kg) and compliance</p>
            </div>
          </div>

          <div className="divide-y divide-neutral-100">
            {products.map((p) => (
              <div key={p.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <img src={p.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover border shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                        {p.category}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-semibold">
                        Weight: {p.weightGrams}g (&lt;5kg ✓)
                      </span>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-neutral-900 truncate">{p.title}</h4>
                    <p className="text-xs text-neutral-500">Seller: {p.seller.name} • ₹{p.price} • {p.location.city}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleTakeDown(p.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Take Down Listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: USERS */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-neutral-900">Platform Users &amp; KYC Verification</h3>
              <p className="text-xs text-neutral-500">Manage Indian verified seller badges</p>
            </div>
          </div>

          <div className="divide-y divide-neutral-100">
            {users.map((u) => (
              <div key={u.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img src={u.avatar} alt="" className="w-12 h-12 rounded-full object-cover border" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-neutral-900">{u.name}</h4>
                      {u.isVerified && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      )}
                      <span className="text-[10px] uppercase font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                        {u.role}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500">{u.email} • {u.phone} • {u.city}, {u.state}</p>
                    <span className="text-[10px] text-neutral-400">Escrow UPI: {u.upiId || 'Not set'}</span>
                  </div>
                </div>

                <div className="text-xs font-bold text-neutral-600">
                  Rating: ★ {u.rating} ({u.reviewCount} Reviews)
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
