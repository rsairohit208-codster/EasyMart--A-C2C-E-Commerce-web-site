import React, { useState } from 'react';
import { 
  DollarSign, Package, Truck, CheckCircle2, 
  Clock, ShieldCheck, MessageSquare, ArrowRight 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SalesPage: React.FC = () => {
  const { currentUser, isAuthenticated, navigateTo, orders, updateOrderStatus, startConversation, showToast } = useApp();

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

  const handleDispatch = (orderId: string) => {
    if (!trackingNumber.trim()) {
      showToast('Please enter a tracking/consignment number', 'error');
      return;
    }

    updateOrderStatus(orderId, 'dispatched', trackingNumber.trim(), courierName);
    setActiveTrackingOrder(null);
    setTrackingNumber('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display">
          Seller Sales &amp; UPI Payouts
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Dispatch sold items, input India courier waybills, and monitor your Escrow payouts
        </p>
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
            Transferred directly to your VPA: {currentUser.upiId}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
            Locked in Safe Escrow
          </span>
          <div className="text-3xl font-extrabold text-amber-600 font-display">
            ₹{pendingInEscrow.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-amber-800">
            Funds deposited by buyers; will release once parcel is delivered.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-2">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
            Total Orders Sold
          </span>
          <div className="text-3xl font-extrabold text-neutral-900 font-display">
            {mySales.length} Items
          </div>
          <p className="text-[11px] text-neutral-400">
            100% genuine C2C everyday essentials
          </p>
        </div>
      </div>

      {/* Sales Orders List */}
      {mySales.length === 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-4">
          <div className="w-14 h-14 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-base text-neutral-800">No sales yet</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Make sure your listings have attractive photos and clear condition notes to attract quick buyers!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {mySales.map((order) => (
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
                      order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-neutral-900 line-clamp-1">{order.productTitle}</h4>
                  <div className="text-xs text-neutral-500">
                    Buyer: <strong>{order.buyerName}</strong> • Price: <strong className="text-neutral-900">₹{order.amount}</strong> (+₹{order.shippingFee} Shipping)
                  </div>
                  <div className="text-xs text-neutral-600">
                    Ship to: {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.pincode}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3">
                {order.status === 'confirmed' && (
                  <button
                    onClick={() => setActiveTrackingOrder(order.id)}
                    className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Dispatch &amp; Enter Tracking</span>
                  </button>
                )}

                {order.trackingNumber && (
                  <div className="p-2.5 bg-neutral-50 rounded-xl border text-xs text-neutral-600 text-center sm:text-left">
                    <span className="block text-[10px] text-neutral-400 uppercase font-bold">{order.courierPartner}</span>
                    <span className="font-mono font-bold text-neutral-800">{order.trackingNumber}</span>
                  </div>
                )}

                <button
                  onClick={() => startConversation(order.productId)}
                  className="w-full sm:w-auto px-3.5 py-2 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat Buyer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tracking Modal */}
      {activeTrackingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-xl border border-neutral-200 p-6 max-w-md w-full space-y-4">
            <h4 className="font-bold text-base text-neutral-900">Enter Courier Dispatch Details</h4>
            <p className="text-xs text-neutral-500">
              Handover the securely packed lightweight parcel to your chosen Indian courier service:
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
                <label className="block text-xs font-bold text-neutral-700 mb-1">Waybill / Tracking Consignment No.</label>
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

    </div>
  );
};
