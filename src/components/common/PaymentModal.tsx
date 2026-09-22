import React, { useState } from 'react';
import { 
  X, ShieldCheck, QrCode, Smartphone, CreditCard, 
  Building2, CheckCircle2, Lock, ArrowRight, Loader2, MapPin, AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { Address } from '../../types';

export const PaymentModal: React.FC = () => {
  const { paymentModal, closePaymentModal, currentUser, createOrder, navigateTo } = useApp();
  const { isOpen, product, offerPrice } = paymentModal;

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'netbanking' | 'card' | 'cod'>('upi');
  const [upiOption, setUpiOption] = useState<'qr' | 'id'>('qr');
  const [upiIdInput, setUpiIdInput] = useState(currentUser.upiId || 'aarav.sharma@okaxis');
  const [selectedBank, setSelectedBank] = useState('State Bank of India (SBI)');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  // Selected delivery address
  const defaultAddr = currentUser.savedAddresses.find(a => a.isDefault) || currentUser.savedAddresses[0] || {
    id: 'temp-1',
    fullName: currentUser.name,
    phone: currentUser.phone,
    addressLine1: 'Flat 402, Green Glen Layout, Bellandur',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
    isDefault: true,
    label: 'Home' as const
  };

  const [selectedAddress, setSelectedAddress] = useState<Address>(defaultAddr);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<any | null>(null);

  if (!isOpen || !product) return null;

  const finalAmount = offerPrice !== undefined ? offerPrice : product.price;
  const shippingFee = product.shippingFee || 49;
  const totalPayable = finalAmount + shippingFee;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const handlePay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      const newOrder = createOrder({
        productId: product.id,
        product,
        amount: finalAmount,
        shippingFee,
        paymentMethod,
        paymentDetails: {
          upiId: paymentMethod === 'upi' ? upiIdInput : undefined,
          bankName: paymentMethod === 'netbanking' ? selectedBank : undefined,
          transactionId: `TXN-IN-${Math.floor(100000000 + Math.random() * 900000000)}`
        },
        shippingAddress: selectedAddress
      });

      setPaymentSuccess(newOrder);
      triggerConfetti();
    }, 1400);
  };

  const handleDone = () => {
    closePaymentModal();
    if (paymentSuccess) {
      navigateTo('orders');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-base">EasyMart Escrow Payment Gateway</h3>
              <p className="text-xs text-neutral-500">Safe Indian Peer-to-Peer Escrow Protection</p>
            </div>
          </div>
          <button 
            id="close-payment-modal-btn"
            onClick={closePaymentModal}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentSuccess ? (
          /* Payment Success State */
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full mb-2">
              Payment Held Safely in Escrow
            </span>

            <h3 className="text-2xl font-bold text-neutral-900 font-display">
              Order Placed Successfully!
            </h3>
            <p className="text-sm text-neutral-600 mt-1 max-w-md mx-auto">
              Order <strong className="text-neutral-900 font-mono">#{paymentSuccess.orderNumber}</strong> has been generated. The seller ({product.seller.name}) has been notified to pack and dispatch via courier.
            </p>

            <div className="mt-6 p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-neutral-500">Total Paid:</span>
                <span className="font-bold text-neutral-900">₹{paymentSuccess.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Transaction ID:</span>
                <span className="font-mono text-neutral-700">{paymentSuccess.paymentDetails.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Delivery To:</span>
                <span className="text-neutral-700 font-medium">{selectedAddress.city}, {selectedAddress.pincode}</span>
              </div>
              <div className="pt-2 border-t border-neutral-200 flex items-center gap-1.5 text-emerald-700 font-semibold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Your funds will be released to the seller only after you verify the parcel.</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                id="view-order-success-btn"
                onClick={handleDone}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <span>Track Order & Purchases</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Checkout & Payment Form */
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {/* Item Summary Card */}
            <div className="flex items-center gap-4 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <img 
                src={product.images[0]} 
                alt={product.title} 
                className="w-16 h-16 object-cover rounded-lg border border-neutral-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {product.category}
                </span>
                <h4 className="font-bold text-neutral-900 text-sm truncate mt-0.5">{product.title}</h4>
                <div className="flex items-center gap-2 text-xs text-neutral-600 mt-0.5">
                  <span>Seller: <strong>{product.seller.name}</strong></span>
                  <span>•</span>
                  <span>{product.location.city}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-base font-extrabold text-neutral-900">₹{finalAmount}</div>
                {offerPrice !== undefined && (
                  <span className="text-[10px] text-amber-600 font-semibold">Negotiated Offer</span>
                )}
              </div>
            </div>

            {/* Delivery Address Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Delivery Address (India)
                </label>
                <button 
                  onClick={() => { closePaymentModal(); navigateTo('my-profile'); }}
                  className="text-xs text-emerald-600 font-semibold hover:underline"
                >
                  Manage Addresses
                </button>
              </div>

              <div className="p-3 bg-white rounded-xl border border-neutral-200 hover:border-emerald-300 transition text-xs">
                <div className="flex items-center justify-between font-bold text-neutral-900">
                  <span>{selectedAddress.fullName} ({selectedAddress.label})</span>
                  <span className="text-neutral-500 font-normal">{selectedAddress.phone}</span>
                </div>
                <p className="text-neutral-600 mt-1">
                  {selectedAddress.addressLine1}, {selectedAddress.addressLine2 ? `${selectedAddress.addressLine2}, ` : ''}{selectedAddress.city}, {selectedAddress.state} - <strong>{selectedAddress.pincode}</strong>
                </p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                Select Indian Payment Option
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${paymentMethod === 'upi' ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 ring-2 ring-emerald-500/20' : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'}`}
                >
                  <Smartphone className="w-5 h-5 text-emerald-600 mb-1" />
                  <div>
                    <div className="text-xs font-bold">UPI Fast Pay</div>
                    <div className="text-[10px] text-neutral-500">GPay, PhonePe, Paytm</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${paymentMethod === 'netbanking' ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 ring-2 ring-emerald-500/20' : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'}`}
                >
                  <Building2 className="w-5 h-5 text-emerald-600 mb-1" />
                  <div>
                    <div className="text-xs font-bold">Net Banking</div>
                    <div className="text-[10px] text-neutral-500">SBI, HDFC, ICICI, etc.</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${paymentMethod === 'card' ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 ring-2 ring-emerald-500/20' : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'}`}
                >
                  <CreditCard className="w-5 h-5 text-emerald-600 mb-1" />
                  <div>
                    <div className="text-xs font-bold">Cards (RuPay)</div>
                    <div className="text-[10px] text-neutral-500">Debit / Credit</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${paymentMethod === 'cod' ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 ring-2 ring-emerald-500/20' : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'}`}
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
                  <div>
                    <div className="text-xs font-bold">Handover / COD</div>
                    <div className="text-[10px] text-neutral-500">Pay on Handover</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Payment Details Container */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setUpiOption('qr')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition ${upiOption === 'qr' ? 'bg-white border-neutral-300 text-neutral-900 shadow-xs' : 'text-neutral-500 border-transparent hover:bg-white/60'}`}
                    >
                      Scan QR Code (Any App)
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpiOption('id')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition ${upiOption === 'id' ? 'bg-white border-neutral-300 text-neutral-900 shadow-xs' : 'text-neutral-500 border-transparent hover:bg-white/60'}`}
                    >
                      Enter VPA / UPI ID
                    </button>
                  </div>

                  {upiOption === 'qr' ? (
                    <div className="text-center py-2">
                      <div className="w-36 h-36 bg-white p-2.5 rounded-xl border border-neutral-300 mx-auto shadow-xs flex items-center justify-center">
                        <QrCode className="w-32 h-32 text-neutral-800" />
                      </div>
                      <p className="text-xs font-bold text-neutral-800 mt-2">Scan & Pay ₹{totalPayable} with BHIM UPI</p>
                      <p className="text-[11px] text-neutral-500">Supports Google Pay • PhonePe • Paytm • BHIM • CRED</p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Enter your UPI ID / VPA</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={upiIdInput}
                          onChange={(e) => setUpiIdInput(e.target.value)}
                          placeholder="e.g. yourname@okhdfcbank"
                          className="flex-1 px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg outline-none focus:border-emerald-500 font-mono"
                        />
                        <span className="px-3 py-2 text-xs bg-neutral-200 text-neutral-700 rounded-lg font-semibold flex items-center">
                          Verified
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Select Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg outline-none focus:border-emerald-500"
                  >
                    <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Punjab National Bank (PNB)">Punjab National Bank (PNB)</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    <option value="Bank of Baroda">Bank of Baroda</option>
                  </select>
                  <p className="text-[11px] text-neutral-500 mt-1">You will be securely routed to your bank&apos;s authorization portal with 2FA OTP.</p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Card Number (RuPay / Visa / Master)</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 •••• •••• 8821"
                      className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="08/28"
                        className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        maxLength={4}
                        className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-lg outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="text-xs text-neutral-700 space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-neutral-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Cash / UPI on Local Handover or Delivery
                  </p>
                  <p className="text-neutral-500 text-[11px]">
                    Inspect the everyday essential in person. Once satisfied, confirm with the delivery agent or seller and pay via Cash or instant UPI QR.
                  </p>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
              <div className="flex justify-between">
                <span>Item Price</span>
                <span className="font-semibold text-neutral-900">₹{finalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Pan-India Courier Shipping</span>
                <span className="font-semibold text-neutral-900">₹{shippingFee}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>EasyMart Escrow & Buyer Guarantee</span>
                <span className="font-bold uppercase text-[11px]">Free</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-neutral-900 pt-2 border-t border-neutral-200">
                <span>Total Amount to Pay</span>
                <span className="text-emerald-700 text-base">₹{totalPayable}</span>
              </div>
            </div>

            {/* Escrow Trust Notice */}
            <div className="flex items-start gap-2 p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200 text-[11px] text-emerald-900">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>100% Escrow Security:</strong> Your money remains locked in the EasyMart escrow vault until you confirm item arrival in satisfactory condition.
              </span>
            </div>

            {/* CTA Button */}
            <button
              id="confirm-pay-btn"
              type="button"
              disabled={isProcessing}
              onClick={handlePay}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 disabled:opacity-75"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Contacting Indian Bank / UPI NPCI...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay ₹{totalPayable} with Escrow Protection</span>
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
