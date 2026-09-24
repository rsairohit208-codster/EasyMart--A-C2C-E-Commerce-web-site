import React, { useState } from 'react';
import { 
  DollarSign, Package, Truck, CheckCircle2, 
  Clock, ShieldCheck, MessageSquare, ArrowRight, Lock, KeyRound, AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SalesPage: React.FC = () => {
  const { 
    currentUser, isAuthenticated, navigateTo, orders, 
    updateOrderStatus, verifyDeliveryOtp, startConversation, showToast 
  } = useApp();

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto shadow-xs">
          <DollarSign className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-neutral-900 font-display">Sign In to View Sales &amp; Payouts</h2>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
            Manage dispatch orders, submit courier tracking details, and receive verified escrow payouts to your UPI.
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

  // Seller orders
  const mySales = orders.filter(o => o.sellerId === currentUser.id);

  const totalEarnings = mySales
    .filter(o => o.escrowStatus === 'released_to_seller')
    .reduce((sum, o) => sum + o.amount, 0);

  const pendingInEscrow = mySales
    .filter(o => o.escrowStatus === 'held_in_escrow')
    .reduce((sum, o) => sum + o.amount, 0);

  // Tracking modal state
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<string | null>(null);
  const [courierName, setCourierName] = useState('Delhivery Express');
  const [trackingNumber, setTrackingNumber] = useState('');

  // Delivery OTP verification modal
  const [activeOtpOrder, setActiveOtpOrder] = useState<string | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');

  const handleDispatch = (orderId: string) => {
    if (!trackingNumber.trim()) {
      showToast('Please enter a tracking/consignment number', 'error');
      return;
    }

    updateOrderStatus(orderId, 'dispatched', trackingNumber.trim(), courierName);
    setActiveTrackingOrder(null);
    setTrackingNumber('');
  };

  const handleOtpVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOtpOrder || !enteredOtp.trim()) return;

    const res = verifyDeliveryOtp(activeOtpOrder, enteredOtp.trim());
    if (res.success) {
      setActiveOtpOrder(null);
      setEnteredOtp('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-900 mb-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
            <span>Seller Escrow &amp; UPI Payout Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display">
            Seller Sales, Logistics &amp; Payouts
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Seller: <strong>{currentUser.name}</strong> • Registered Payout UPI: <strong className="font-mono text-emerald-700">{currentUser.upiId || 'Add in Profile'}</strong>
          </p>
        </div>

        <button
          onClick={() => navigateTo('post-item')}
          className="self-start sm:self-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs"
        >
          <Package className="w-3.5 h-3.5" />
          <span>+ Post Another Item</span>
        </button>
      </div>

      {/* Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
            Completed UPI Payouts
          </span>
          <div className="text-3xl font-extrabold text-emerald-600 font-display">
            ₹{totalEarnings.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-neutral-400">
            Transferred directly to your VPA: {currentUser.upiId || 'Pending setup'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
            Locked in Safe Escrow Vault
          </span>
          <div className="text-3xl font-extrabold text-amber-600 font-display">
            ₹{pendingInEscrow.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-amber-800">
            Funds deposited by buyers; released when parcel arrives or OTP is verified.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
            Total Orders Sold
          </span>
          <div className="text-3xl font-extrabold text-neutral-900 font-display">
            {mySales.length} Orders
          </div>
          <p className="text-[11px] text-neutral-400">
            100% verified Indian peer-to-peer trades
          </p>
        </div>
      </div>

      {/* Sales Orders List */}
      {mySales.length === 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-2xl flex items-center justify-center mx-auto border border-neutral-200">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-neutral-800 font-display">No sales orders yet</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
              When buyers purchase your active listings, their delivery addresses and escrow guarantees will appear here for shipping.
            </p>
          </div>
          <button
            onClick={() => navigateTo('post-item')}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition inline-flex items-center gap-2"
          >
            <span>Post a Free Ad</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {mySales.map((order) => {
            const isDelivered = order.status === 'delivered';

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-neutral-200/90 p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xs"
              >
                <div className="flex gap-4">
                  <img
                    src={order.productImage}
                    alt={order.productTitle}
                    className="w-20 h-20 rounded-2xl object-cover border border-neutral-200 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-neutral-400 font-bold">#{order.orderNumber}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                        isDelivered ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-neutral-900 line-clamp-1">{order.productTitle}</h4>
                    <div className="text-xs text-neutral-500">
                      Buyer: <strong>{order.buyerName}</strong> ({order.buyerPhone}) • Payout: <strong className="text-emerald-700">₹{order.amount}</strong>
                    </div>
                    <div className="text-xs text-neutral-600">
                      <strong>Deliver To:</strong> {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </div>
                  </div>
                </div>

                {/* Seller Actions */}
                <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-2.5">
                  {order.status === 'confirmed' && (
                    <button
                      onClick={() => setActiveTrackingOrder(order.id)}
                      className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Pack &amp; Enter Waybill</span>
                    </button>
                  )}

                  {!isDelivered && (
                    <button
                      onClick={() => setActiveOtpOrder(order.id)}
                      className="w-full sm:w-auto px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                      title="Enter the 6-digit code received from buyer to release payout"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                      <span>Verify Handover Code</span>
                    </button>
                  )}

                  {order.trackingNumber && (
                    <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-600 text-center sm:text-left">
                      <span className="block text-[10px] text-neutral-400 uppercase font-bold">{order.courierPartner}</span>
                      <span className="font-mono font-bold text-neutral-800">{order.trackingNumber}</span>
                    </div>
                  )}

                  {isDelivered && (
                    <div className="p-2 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Payout Released to UPI</span>
                    </div>
                  )}

                  <button
                    onClick={() => startConversation(order.productId)}
                    className="w-full sm:w-auto px-3.5 py-2 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Chat Buyer</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Courier Dispatch Waybill Modal */}
      {activeTrackingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-xl border border-neutral-200 p-6 max-w-md w-full space-y-4">
            <h4 className="font-bold text-base text-neutral-900 font-display">Enter Courier Dispatch Details</h4>
            <p className="text-xs text-neutral-500">
              Handover the securely packed everyday lightweight item to your courier service:
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Courier Partner</label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full p-2.5 text-xs bg-neutral-50 border rounded-xl outline-none focus:border-emerald-500"
                >
                  <option value="Delhivery Express">Delhivery Express</option>
                  <option value="Blue Dart Express">Blue Dart Express</option>
                  <option value="DTDC Courier">DTDC Courier</option>
                  <option value="India Post Speed Post">India Post Speed Post</option>
                  <option value="Shadowfax Local">Shadowfax Local</option>
                  <option value="Local Handover / Dunzo">Local Handover / Dunzo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Waybill / Consignment Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DLHV98213892IN"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full p-2.5 text-xs font-mono font-bold bg-neutral-50 border rounded-xl outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTrackingOrder(null)}
                className="flex-1 py-2 text-xs font-bold text-neutral-600 bg-neutral-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDispatch(activeTrackingOrder)}
                className="flex-1 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
              >
                Save &amp; Notify Buyer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verify Buyer Handover OTP Modal */}
      {activeOtpOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-xl border border-neutral-200 p-6 max-w-md w-full space-y-4">
            <div className="flex items-center gap-2 text-amber-700">
              <KeyRound className="w-5 h-5" />
              <h4 className="font-bold text-base text-neutral-900 font-display">Verify Buyer Handover Code</h4>
            </div>
            <p className="text-xs text-neutral-500">
              Ask the buyer for their 6-digit Secret Delivery Code (visible in their Purchases tab). Entering this code verifies handover and releases escrow payout to your UPI!
            </p>

            <form onSubmit={handleOtpVerification} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">6-Digit Secret Security Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. 849201"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full p-3 text-center text-xl font-mono font-bold tracking-widest bg-neutral-50 border rounded-2xl outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setActiveOtpOrder(null); setEnteredOtp(''); }}
                  className="flex-1 py-2.5 text-xs font-bold text-neutral-600 bg-neutral-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
                >
                  Verify &amp; Claim Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
