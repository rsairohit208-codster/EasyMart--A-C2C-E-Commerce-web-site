import React, { useState } from 'react';
import { 
  Package, ShieldCheck, Truck, CheckCircle2, Clock, 
  Printer, MessageSquare, Star, ArrowRight, ExternalLink, AlertCircle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';

export const OrdersPage: React.FC = () => {
  const { currentUser, isAuthenticated, orders, releaseEscrow, navigateTo, startConversation } = useApp();
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto shadow-xs">
          <Package className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-neutral-900 font-display">Sign In to View Purchases</h2>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
            Track your deliveries, manage escrow releases, and view invoices for all your purchases.
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

  // My purchases as buyer
  const myOrders = orders.filter(o => o.buyerId === currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display">
          My Purchases &amp; Orders
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Track active courier dispatches, confirm delivery, and inspect parcel condition
        </p>
      </div>

      {/* Escrow Guarantee Banner */}
      <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex items-center justify-between gap-4 text-xs text-emerald-950">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold block">100% Escrow Buyer Protection Active</span>
            <span className="text-[11px] text-emerald-800">
              Funds are held safely in EasyMart vault. Once your parcel arrives, click &quot;Confirm Delivery&quot; to release payment to the seller.
            </span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {myOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-4">
          <div className="w-14 h-14 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-base text-neutral-800">You haven&apos;t placed any orders yet</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Explore everyday books, kitchen gadgets, mobile accessories, and home items on the catalog.
          </p>
          <button
            onClick={() => navigateTo('products')}
            className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl"
          >
            Start Browsing
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {myOrders.map((order) => {
            const isDelivered = order.status === 'delivered';

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-xs"
              >
                {/* Order Top Bar */}
                <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-neutral-400 text-[10px] uppercase font-bold block">Order Placed</span>
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
                    <span className="font-mono text-neutral-500 font-bold">#{order.orderNumber}</span>
                    <button
                      onClick={() => setSelectedInvoice(order)}
                      className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Invoice</span>
                    </button>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  
                  {/* Product Details (7 cols) */}
                  <div className="lg:col-span-7 flex gap-4">
                    <img
                      src={order.productImage}
                      alt={order.productTitle}
                      className="w-24 h-24 rounded-2xl object-cover border border-neutral-200 shrink-0"
                    />
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                        {order.category}
                      </span>
                      <h4 className="font-bold text-sm text-neutral-900 line-clamp-2">
                        {order.productTitle}
                      </h4>
                      <div className="text-xs text-neutral-500">
                        Price: ₹{order.amount} + ₹{order.shippingFee} Shipping
                      </div>
                      <div className="text-xs text-neutral-600 pt-1">
                        <strong>Delivery Address:</strong> {order.shippingAddress.addressLine1}, {order.shippingAddress.city} - {order.shippingAddress.pincode}
                      </div>
                    </div>
                  </div>

                  {/* Status & Escrow Timeline (5 cols) */}
                  <div className="lg:col-span-5 space-y-4 lg:border-l lg:border-neutral-100 lg:pl-6">
                    
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${isDelivered ? 'bg-emerald-600' : 'bg-amber-500 animate-pulse'}`}></span>
                        <span className="font-extrabold text-sm text-neutral-900 capitalize">
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        order.escrowStatus === 'released_to_seller' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.escrowStatus === 'released_to_seller' ? 'Escrow Released' : 'Held in Escrow'}
                      </span>
                    </div>

                    {/* Courier Tracking Info */}
                    {order.trackingNumber ? (
                      <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1">
                        <div className="flex justify-between text-neutral-600">
                          <span>Courier: <strong>{order.courierPartner || 'Delhivery Express'}</strong></span>
                          <span className="font-mono font-bold text-neutral-900">{order.trackingNumber}</span>
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          Est. Delivery: {order.estimatedDelivery}
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-neutral-50 rounded-xl text-[11px] text-neutral-500">
                        Seller has been notified to pack and assign Indian courier pickup.
                      </div>
                    )}

                    {/* Buyer Action */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {!isDelivered ? (
                        <button
                          onClick={() => releaseEscrow(order.id)}
                          className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirm Delivery &amp; Release Funds</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Delivered &amp; Payment Released to Seller UPI</span>
                        </div>
                      )}

                      <button
                        onClick={() => startConversation(order.productId)}
                        className="py-2 px-3 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-300 font-bold text-xs rounded-xl transition flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat Seller</span>
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-neutral-200 p-8 max-w-xl w-full space-y-6">
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <h3 className="text-xl font-bold font-display text-neutral-900">EasyMart Tax Invoice</h3>
                <p className="text-xs text-neutral-500">C2C Verified Transaction (India)</p>
              </div>
              <div className="text-right text-xs">
                <span className="font-mono font-bold text-neutral-900 block">#{selectedInvoice.orderNumber}</span>
                <span className="text-neutral-500">{new Date(selectedInvoice.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-neutral-400 uppercase font-bold text-[10px] block mb-1">Delivered To (Buyer)</span>
                <p className="font-bold text-neutral-800">{selectedInvoice.buyerName}</p>
                <p className="text-neutral-600">{selectedInvoice.shippingAddress.addressLine1}</p>
                <p className="text-neutral-600">{selectedInvoice.shippingAddress.city}, {selectedInvoice.shippingAddress.state} - {selectedInvoice.shippingAddress.pincode}</p>
              </div>
              <div>
                <span className="text-neutral-400 uppercase font-bold text-[10px] block mb-1">Seller Details</span>
                <p className="font-bold text-neutral-800">{selectedInvoice.sellerName}</p>
                <p className="text-neutral-600">Escrow Payout: {selectedInvoice.sellerUpiId || 'UPI Direct'}</p>
                <p className="text-emerald-700 font-semibold mt-1">Verified C2C Partner</p>
              </div>
            </div>

            <div className="border rounded-xl p-3 bg-neutral-50 text-xs space-y-2">
              <div className="flex justify-between font-bold text-neutral-900">
                <span>{selectedInvoice.productTitle}</span>
                <span>₹{selectedInvoice.amount}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Pan-India Courier Fee</span>
                <span>₹{selectedInvoice.shippingFee}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>EasyMart Escrow Protection</span>
                <span className="text-emerald-700 font-bold">FREE</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-extrabold text-sm text-neutral-900">
                <span>Total Paid</span>
                <span>₹{selectedInvoice.totalAmount}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t">
              <span>Transaction ID: {selectedInvoice.paymentDetails.transactionId}</span>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-5 py-2 bg-neutral-900 text-white rounded-xl font-bold text-xs"
              >
                Close Invoice
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
