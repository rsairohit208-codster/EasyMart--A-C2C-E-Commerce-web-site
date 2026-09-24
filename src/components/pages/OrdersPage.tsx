import React, { useState } from 'react';
import { 
  Package, ShieldCheck, Truck, CheckCircle2, Clock, 
  Printer, MessageSquare, Star, ArrowRight, ExternalLink, 
  AlertCircle, Copy, Lock, FileText, ChevronDown, ChevronUp, 
  AlertTriangle, RefreshCw, Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';

export const OrdersPage: React.FC = () => {
  const { 
    currentUser, isAuthenticated, orders, releaseEscrow, 
    verifyDeliveryOtp, raiseDispute, navigateTo, startConversation, showToast 
  } = useApp();

  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);
  const [expandedTracking, setExpandedTracking] = useState<Record<string, boolean>>({});
  const [disputeOrderId, setDisputeOrderId] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto shadow-xs">
          <Package className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-neutral-900 font-display">Sign In to Track Purchases</h2>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
            Real-world buyers can track live courier dispatches, manage Secret Handover OTPs, and control Escrow releases.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigateTo('login')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition"
          >
            Sign In Now
          </button>
          <button
            onClick={() => navigateTo('register')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs transition"
          >
            Register Free Account
          </button>
        </div>
      </div>
    );
  }

  // Purchases for this user
  const myOrders = orders.filter(o => o.buyerId === currentUser.id);

  const toggleTracking = (orderId: string) => {
    setExpandedTracking(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard!`);
  };

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeOrderId || !disputeReason.trim()) return;
    raiseDispute(disputeOrderId, disputeReason.trim());
    setDisputeOrderId(null);
    setDisputeReason('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-900 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>National Escrow Buyer Protection Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display">
            Purchases, Dispatches &amp; Escrow Tracking
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Buyer: <strong>{currentUser.name}</strong> • Real-time courier tracking &amp; 6-digit handover inspection codes
          </p>
        </div>

        <button
          onClick={() => navigateTo('products')}
          className="self-start sm:self-auto px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Escrow Guarantee Banner */}
      <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-emerald-950">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-sm block">100% Escrow Protection Vault Active</span>
            <span className="text-[11px] text-emerald-800 leading-relaxed">
              Your money remains held securely in the EasyMart Escrow vault. Only provide your 6-digit Secret Delivery Code after opening the parcel and inspecting the item condition.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-xs font-bold text-emerald-800 bg-white/80 px-3 py-1.5 rounded-xl border border-emerald-200">
            RBI/NPCI Escrow Standard
          </span>
        </div>
      </div>

      {/* Orders List */}
      {myOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-2xl flex items-center justify-center mx-auto border border-neutral-200">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-neutral-800 font-display">No Orders Placed Yet</h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
              When you purchase everyday items (books, kitchenware, mobile accessories, clothing) with 100% Escrow Protection, live courier dispatches and your delivery codes will appear here.
            </p>
          </div>
          <button
            onClick={() => navigateTo('products')}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition inline-flex items-center gap-2"
          >
            <span>Browse Active Listings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {myOrders.map((order) => {
            const isDelivered = order.status === 'delivered';
            const isDisputed = order.escrowStatus === 'disputed';
            const isExpanded = Boolean(expandedTracking[order.id]);

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-xs hover:border-neutral-300 transition"
              >
                {/* Order Top Bar */}
                <div className="bg-neutral-50/90 px-6 py-4 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-5">
                    <div>
                      <span className="text-neutral-400 text-[10px] uppercase font-bold block">Order Number</span>
                      <span className="font-mono font-bold text-neutral-900">#{order.orderNumber}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 text-[10px] uppercase font-bold block">Order Date</span>
                      <span className="font-bold text-neutral-800">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 text-[10px] uppercase font-bold block">Total Amount</span>
                      <span className="font-extrabold text-neutral-900">₹{order.totalAmount}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 text-[10px] uppercase font-bold block">Seller</span>
                      <span className="font-bold text-neutral-800">{order.sellerName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedInvoice(order)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-neutral-200 text-neutral-700 hover:text-emerald-700 hover:border-emerald-300 text-xs font-bold transition shadow-2xs"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tax Invoice</span>
                    </button>
                  </div>
                </div>

                {/* Order Body Grid */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left: Product & Escrow Secret Code (7 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex gap-4">
                      <img
                        src={order.productImage}
                        alt={order.productTitle}
                        className="w-24 h-24 rounded-2xl object-cover border border-neutral-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {order.category}
                        </span>
                        <h4 className="font-bold text-sm sm:text-base text-neutral-900 line-clamp-2">
                          {order.productTitle}
                        </h4>
                        <div className="text-xs text-neutral-500">
                          Item: <strong>₹{order.amount}</strong> + Courier Shipping: <strong>₹{order.shippingFee}</strong>
                        </div>
                        <div className="text-xs text-neutral-600 pt-0.5">
                          <strong>Delivery Address:</strong> {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                        </div>
                      </div>
                    </div>

                    {/* Secret Delivery Handover OTP Box */}
                    <div className="p-3.5 bg-amber-50/90 rounded-2xl border border-amber-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-amber-950 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                          <Lock className="w-3.5 h-3.5 text-amber-700" />
                          <span>Secret Delivery Handover Code</span>
                        </span>
                        <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded">
                          {isDelivered ? 'Handover Completed' : 'Share Only at Handover'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-amber-200">
                        <span className="font-mono text-xl font-black text-neutral-900 tracking-widest">
                          {order.deliveryOtp || '839201'}
                        </span>
                        <button
                          onClick={() => copyToClipboard(order.deliveryOtp || '', 'Delivery Code')}
                          className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-lg transition flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-amber-800">
                        Provide this 6-digit code to the delivery courier or seller <strong>only after</strong> you verify the item matches description.
                      </p>
                    </div>

                    {/* Escrow & Payment Security Signatures */}
                    <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-[11px] space-y-1.5 text-neutral-600">
                      <div className="flex justify-between">
                        <span>Gateway Rail:</span>
                        <span className="font-bold text-neutral-900">{order.gatewayName || 'BHIM UPI Dynamic'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bank RRN (12-Digit):</span>
                        <span className="font-mono font-bold text-neutral-800">{order.rrn || '428190384729'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Escrow Vault Node:</span>
                        <span className="font-mono font-bold text-emerald-700">{order.escrowVaultId || 'ESCROW-VAULT-IND-BLR'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>HMAC Security Token:</span>
                        <span className="font-mono text-[10px] text-neutral-400 truncate max-w-[200px]">{order.securitySignature || 'sec_sha256_live'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Courier Tracking Timeline & Actions (5 cols) */}
                  <div className="lg:col-span-5 space-y-4 lg:border-l lg:border-neutral-100 lg:pl-6">
                    
                    {/* Status & Escrow Vault Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${isDelivered ? 'bg-emerald-600' : isDisputed ? 'bg-rose-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`}></span>
                        <span className="font-extrabold text-sm text-neutral-900 capitalize">
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        order.escrowStatus === 'released_to_seller' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : order.escrowStatus === 'disputed'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.escrowStatus === 'released_to_seller' 
                          ? 'Escrow Released to Seller' 
                          : order.escrowStatus === 'disputed'
                          ? 'Disputed - Escrow Frozen'
                          : 'Held in Escrow'}
                      </span>
                    </div>

                    {/* Courier Dispatch Card */}
                    <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs space-y-1.5">
                      <div className="flex justify-between text-neutral-600">
                        <span>Courier Partner:</span>
                        <span className="font-bold text-neutral-900">{order.courierPartner || 'Delhivery Express'}</span>
                      </div>
                      {order.trackingNumber ? (
                        <div className="flex justify-between items-center text-neutral-600">
                          <span>Consignment AWB:</span>
                          <span className="font-mono font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-neutral-200">
                            {order.trackingNumber}
                          </span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-neutral-500 italic">
                          Seller notified to prepare package and generate courier waybill.
                        </div>
                      )}
                      <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-1 border-t border-neutral-200">
                        <span>Est. Doorstep Arrival:</span>
                        <span className="font-semibold text-neutral-800">{order.estimatedDelivery}</span>
                      </div>
                    </div>

                    {/* Interactive Tracking Timeline Toggle */}
                    <div>
                      <button
                        type="button"
                        onClick={() => toggleTracking(order.id)}
                        className="w-full py-1.5 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs rounded-xl transition flex items-center justify-between"
                      >
                        <span className="flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Live Progress Timeline ({order.trackingEvents?.length || 2} checkpoints)</span>
                        </span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-2 p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs space-y-2.5 max-h-56 overflow-y-auto">
                          {(order.trackingEvents || []).map((ev, idx) => (
                            <div key={idx} className="flex gap-2.5 items-start">
                              <div className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1.5"></div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="font-bold text-neutral-900">{ev.status}</span>
                                  <span className="text-neutral-400 font-mono text-[10px]">{ev.time}</span>
                                </div>
                                <p className="text-[10px] text-neutral-600 mt-0.5">{ev.note}</p>
                                <span className="text-[9px] text-neutral-400 font-medium">{ev.location}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Buyer Control Actions */}
                    <div className="space-y-2 pt-1">
                      {!isDelivered ? (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => releaseEscrow(order.id)}
                            className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Confirm Delivery &amp; Release Funds to Seller</span>
                          </button>

                          <div className="flex gap-2">
                            <button
                              onClick={() => setDisputeOrderId(order.id)}
                              className="flex-1 py-2 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1"
                            >
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Hold / Dispute</span>
                            </button>

                            <button
                              onClick={() => startConversation(order.productId)}
                              className="flex-1 py-2 px-2.5 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Chat Seller</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-2 text-xs text-emerald-900 font-semibold">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          <span>Delivery verified! Escrow payout (₹{order.amount}) released to seller UPI.</span>
                        </div>
                      )}
                    </div>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Dispute Modal */}
      {disputeOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-neutral-200 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-base text-neutral-900">Raise Issue &amp; Freeze Escrow</h3>
            </div>
            <p className="text-xs text-neutral-600">
              If the parcel arrived damaged, incomplete, or not matching the description, report it now to lock the escrow funds in the vault.
            </p>
            <form onSubmit={handleDisputeSubmit} className="space-y-3">
              <textarea
                value={disputeReason}
                onChange={e => setDisputeReason(e.target.value)}
                placeholder="Describe the issue (e.g. Broken packaging, missing components, wrong model)..."
                rows={3}
                required
                className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-xs outline-none focus:border-rose-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDisputeOrderId(null)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl"
                >
                  Freeze Escrow &amp; Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Tax Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-neutral-200 p-6 sm:p-8 max-w-xl w-full space-y-6 max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
              <div>
                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mb-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Verified Indian Escrow Invoice</span>
                </div>
                <h3 className="text-xl font-bold font-display text-neutral-900">EasyMart Tax Invoice</h3>
                <p className="text-[11px] text-neutral-500">Peer-to-Peer Consumer Transaction Receipt</p>
              </div>
              <div className="text-right text-xs">
                <span className="font-mono font-bold text-neutral-900 block">#{selectedInvoice.orderNumber}</span>
                <span className="text-neutral-500 text-[11px]">{new Date(selectedInvoice.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
                <span className="text-neutral-400 uppercase font-bold text-[9px] block mb-1">Buyer (Recipient)</span>
                <p className="font-bold text-neutral-900">{selectedInvoice.buyerName}</p>
                <p className="text-neutral-600 text-[11px] mt-0.5">{selectedInvoice.shippingAddress.addressLine1}</p>
                <p className="text-neutral-600 text-[11px]">{selectedInvoice.shippingAddress.city}, {selectedInvoice.shippingAddress.state} - {selectedInvoice.shippingAddress.pincode}</p>
              </div>
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
                <span className="text-neutral-400 uppercase font-bold text-[9px] block mb-1">Seller (Consignor)</span>
                <p className="font-bold text-neutral-900">{selectedInvoice.sellerName}</p>
                <p className="text-neutral-600 text-[11px] mt-0.5">Escrow Payout VPA: {selectedInvoice.sellerUpiId}</p>
                <p className="text-emerald-700 font-bold text-[10px] mt-1">Verified Neighbor Seller</p>
              </div>
            </div>

            <div className="border border-neutral-200 rounded-2xl p-4 bg-neutral-50 text-xs space-y-2.5">
              <div className="flex justify-between font-bold text-neutral-900">
                <span>{selectedInvoice.productTitle}</span>
                <span>₹{selectedInvoice.amount}</span>
              </div>
              <div className="flex justify-between text-neutral-600 text-[11px]">
                <span>Pan-India Courier Dispatch</span>
                <span>₹{selectedInvoice.shippingFee}</span>
              </div>
              <div className="flex justify-between text-neutral-600 text-[11px]">
                <span>Escrow Guarantee &amp; Safe-Pay Shield</span>
                <span className="text-emerald-700 font-bold">100% FREE</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-neutral-200 font-extrabold text-sm text-neutral-900">
                <span>Total Amount Paid</span>
                <span className="text-emerald-700">₹{selectedInvoice.totalAmount}</span>
              </div>
            </div>

            {/* Escrow Audit Information */}
            <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-[11px] space-y-1 text-emerald-950">
              <div className="flex justify-between">
                <span>Escrow Vault Reference:</span>
                <span className="font-mono font-bold">{selectedInvoice.escrowVaultId || 'ESCROW-NODE-IND'}</span>
              </div>
              <div className="flex justify-between">
                <span>Bank Retrieval Ref (RRN):</span>
                <span className="font-mono font-bold">{selectedInvoice.rrn || '428190384729'}</span>
              </div>
              <div className="flex justify-between">
                <span>Gateway Transaction ID:</span>
                <span className="font-mono text-neutral-600">{selectedInvoice.paymentDetails.transactionId}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl font-bold transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
