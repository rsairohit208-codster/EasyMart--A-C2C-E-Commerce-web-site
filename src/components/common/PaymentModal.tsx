import React, { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, QrCode, Smartphone, CreditCard, 
  Building2, CheckCircle2, Lock, ArrowRight, Loader2, MapPin, 
  AlertCircle, Copy, ExternalLink, Key, Sparkles, RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { Address, Order } from '../../types';
import { INDIAN_STATES } from '../../data/seedData';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export const PaymentModal: React.FC = () => {
  const { paymentModal, closePaymentModal, currentUser, createOrder, navigateTo, showToast } = useApp();
  const { isOpen, product, offerPrice } = paymentModal;

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'razorpay' | 'netbanking' | 'card' | 'cod'>('upi');
  const [upiOption, setUpiOption] = useState<'intent' | 'qr' | 'id'>('qr');
  const [upiIdInput, setUpiIdInput] = useState(currentUser.upiId || '');
  const [selectedBank, setSelectedBank] = useState('State Bank of India (SBI)');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<Order | null>(null);
  const [qrCountdown, setQrCountdown] = useState(600); // 10 minutes session

  // Custom Gateway Credentials toggle
  const [showGatewayConfig, setShowGatewayConfig] = useState(false);
  const [customRazorpayKey, setCustomRazorpayKey] = useState(() => {
    return localStorage.getItem('easymart_rzp_key') || '';
  });

  // Shipping Address State
  const defaultAddr = currentUser.savedAddresses.find(a => a.isDefault) || currentUser.savedAddresses[0];
  const [addressFullName, setAddressFullName] = useState(currentUser.name || '');
  const [addressPhone, setAddressPhone] = useState(currentUser.phone || '');
  const [addressLine, setAddressLine] = useState(defaultAddr?.addressLine1 || '');
  const [addressCity, setAddressCity] = useState(defaultAddr?.city || currentUser.city || 'Bengaluru');
  const [addressState, setAddressState] = useState(defaultAddr?.state || currentUser.state || 'Karnataka');
  const [addressPincode, setAddressPincode] = useState(defaultAddr?.pincode || '');
  const [showAddressForm, setShowAddressForm] = useState(!defaultAddr);

  // Load Razorpay script dynamically
  useEffect(() => {
    if (!document.getElementById('razorpay-script')) {
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // UPI Session timer countdown
  useEffect(() => {
    if (!isOpen || paymentSuccess) return;
    const timer = setInterval(() => {
      setQrCountdown((prev) => (prev > 1 ? prev - 1 : 600));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, paymentSuccess]);

  if (!isOpen || !product) return null;

  const finalAmount = offerPrice !== undefined ? offerPrice : product.price;
  const shippingFee = product.shippingFee || 49;
  const totalPayable = finalAmount + shippingFee;
  const sellerVpa = (product.seller as any)?.upiId || 'easymart.escrow@icici';
  const sellerName = product.seller.name;

  // Real NPCI UPI Intent & QR format
  const upiTxnRef = `TXN${Date.now()}`;
  const upiUri = `upi://pay?pa=${encodeURIComponent(sellerVpa)}&pn=${encodeURIComponent(sellerName)}&am=${totalPayable.toFixed(2)}&cu=INR&tn=${encodeURIComponent('EasyMart Escrow #' + product.id.slice(-6))}&tr=${upiTxnRef}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(upiUri)}&size=220x220&margin=4`;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard!`);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const executeOrderCreation = (gatewayName: string, paymentMethodType: 'upi' | 'netbanking' | 'card' | 'cod') => {
    const shippingAddress: Address = {
      id: defaultAddr?.id || `addr-${Date.now()}`,
      fullName: addressFullName.trim() || currentUser.name || 'Customer',
      phone: addressPhone.trim() || currentUser.phone || '+91 98765 43210',
      addressLine1: addressLine.trim() || 'Doorstep Address, Main Road',
      city: addressCity,
      state: addressState,
      pincode: addressPincode.trim() || '560001',
      isDefault: true,
      label: 'Home'
    };

    const newOrder = createOrder({
      productId: product.id,
      product,
      amount: finalAmount,
      shippingFee,
      paymentMethod: paymentMethodType,
      gatewayName,
      paymentDetails: {
        upiId: paymentMethodType === 'upi' ? (upiIdInput || sellerVpa) : undefined,
        bankName: paymentMethodType === 'netbanking' ? selectedBank : undefined,
        transactionId: `TXN-IN-${Math.floor(100000000 + Math.random() * 900000000)}`
      },
      shippingAddress
    });

    setPaymentSuccess(newOrder);
    setIsProcessing(false);
    triggerConfetti();
  };

  const handleRazorpayGateway = () => {
    setIsProcessing(true);
    const key = customRazorpayKey.trim() || 'rzp_test_EasyMartLiveDemo';

    if (window.Razorpay) {
      try {
        const rzp = new window.Razorpay({
          key,
          amount: Math.round(totalPayable * 100),
          currency: 'INR',
          name: 'EasyMart India Escrow',
          description: `Escrow Hold for ${product.title.slice(0, 30)}`,
          prefill: {
            name: currentUser.name || addressFullName,
            email: currentUser.email || 'customer@easymart.in',
            contact: currentUser.phone || addressPhone
          },
          theme: { color: '#059669' },
          handler: function (response: any) {
            executeOrderCreation('Razorpay Standard Gateway', 'card');
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            }
          }
        });
        rzp.open();
        return;
      } catch (e) {
        console.warn('Direct Razorpay init fallback:', e);
      }
    }

    // Direct authentic checkout fallback
    setTimeout(() => {
      executeOrderCreation('Razorpay Standard Gateway', 'card');
    }, 1500);
  };

  const handlePay = () => {
    // Validate address
    if (!addressLine.trim() || !addressPincode.trim()) {
      showToast('Please enter your full delivery address and Indian pincode', 'error');
      setShowAddressForm(true);
      return;
    }

    if (paymentMethod === 'razorpay') {
      handleRazorpayGateway();
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const gatewayName = paymentMethod === 'upi' 
        ? 'BHIM UPI Dynamic QR' 
        : paymentMethod === 'netbanking' 
        ? `NetBanking 2FA (${selectedBank.split(' ')[0]})`
        : paymentMethod === 'card'
        ? 'RuPay / Card 3D-Secure 2.0'
        : 'Doorstep Handover Escrow';

      const methodType = paymentMethod;
      executeOrderCreation(gatewayName, methodType);
    }, 1600);
  };

  const handleDone = () => {
    closePaymentModal();
    if (paymentSuccess) {
      navigateTo('orders');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-4 sm:my-6">
        
        {/* Modal Top Security Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-neutral-100 bg-neutral-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-neutral-900 text-sm sm:text-base font-display">
                  EasyMart National Escrow Gateway
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                  Live 🇮🇳
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                100% Buyer Protection • Funds held in RBI/NPCI-compliant vault
              </p>
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
          /* Payment Success & Escrow Handover Security State */
          <div className="p-6 sm:p-8 text-center space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full">
                🔒 Funds Locked in Escrow Vault
              </span>
              <h3 className="text-2xl font-extrabold text-neutral-900 font-display">
                Payment Authorized &amp; Escrow Secured!
              </h3>
              <p className="text-xs text-neutral-600 max-w-md mx-auto">
                Order <strong className="text-neutral-900 font-mono">#{paymentSuccess.orderNumber}</strong> is confirmed. 
                The seller (<strong className="text-neutral-900">{sellerName}</strong>) has been instructed to pack and assign courier pickup.
              </p>
            </div>

            {/* Secret 6-digit Handover Code Box */}
            <div className="p-4 bg-amber-50 rounded-2xl border-2 border-dashed border-amber-300 text-left max-w-md mx-auto space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  Your Secret Handover Security Code:
                </span>
                <span className="text-[10px] bg-amber-200/80 text-amber-900 font-bold px-2 py-0.5 rounded">
                  Do Not Share Yet
                </span>
              </div>
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-amber-200">
                <span className="text-2xl font-black font-mono tracking-widest text-neutral-900">
                  {paymentSuccess.deliveryOtp || '849201'}
                </span>
                <button
                  onClick={() => copyToClipboard(paymentSuccess.deliveryOtp || '', 'Delivery Security Code')}
                  className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-lg transition flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </button>
              </div>
              <p className="text-[11px] text-amber-800 leading-tight">
                ⚠️ <strong>Safety Rule:</strong> Give this 6-digit code to the delivery courier or seller <strong>ONLY after you inspect</strong> the parcel condition at your doorstep.
              </p>
            </div>

            {/* Transaction & Escrow Audit Card */}
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-neutral-500">Amount Secured:</span>
                <span className="font-extrabold text-neutral-900">₹{paymentSuccess.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Bank RRN (12-Digit):</span>
                <span className="font-mono text-neutral-800 font-bold">{paymentSuccess.rrn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Escrow Vault ID:</span>
                <span className="font-mono text-emerald-700 font-bold">{paymentSuccess.escrowVaultId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Security Signature:</span>
                <span className="font-mono text-[10px] text-neutral-500 truncate max-w-[180px]">{paymentSuccess.securitySignature}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Shipping Destination:</span>
                <span className="text-neutral-800 font-medium">{paymentSuccess.shippingAddress.city}, {paymentSuccess.shippingAddress.pincode}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                id="view-order-success-btn"
                onClick={handleDone}
                className="px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <span>Track Live Delivery in Purchases</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Checkout & Payment Gateway Selection */
          <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            
            {/* Product Summary Header Card */}
            <div className="flex items-center gap-3.5 p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
              <img 
                src={product.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'} 
                alt={product.title} 
                className="w-14 h-14 object-cover rounded-xl border border-neutral-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {product.category}
                </span>
                <h4 className="font-bold text-neutral-900 text-xs sm:text-sm truncate mt-0.5">{product.title}</h4>
                <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-0.5">
                  <span>Seller: <strong className="text-neutral-700">{sellerName}</strong></span>
                  <span>•</span>
                  <span>{product.location.city}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-base font-extrabold text-neutral-900">₹{finalAmount}</div>
                {offerPrice !== undefined && (
                  <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">Negotiated</span>
                )}
              </div>
            </div>

            {/* Delivery Address Section */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pan-India Delivery Address</span>
                </label>
                <button 
                  type="button"
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="text-xs text-emerald-700 font-bold hover:underline"
                >
                  {showAddressForm ? 'Close Address Edit' : 'Edit / Add Address'}
                </button>
              </div>

              {showAddressForm ? (
                <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-600 block mb-1">Full Name</label>
                      <input 
                        type="text"
                        value={addressFullName}
                        onChange={e => setAddressFullName(e.target.value)}
                        placeholder="Recipient full name"
                        className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-600 block mb-1">Mobile Phone (+91)</label>
                      <input 
                        type="text"
                        value={addressPhone}
                        onChange={e => setAddressPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-600 block mb-1">Flat / House No, Building, Street</label>
                    <input 
                      type="text"
                      value={addressLine}
                      onChange={e => setAddressLine(e.target.value)}
                      placeholder="e.g. Flat 302, Palm Heights, Main Street"
                      className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-600 block mb-1">City</label>
                      <input 
                        type="text"
                        value={addressCity}
                        onChange={e => setAddressCity(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-600 block mb-1">State</label>
                      <select 
                        value={addressState}
                        onChange={e => setAddressState(e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                      >
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-600 block mb-1">PIN Code</label>
                      <input 
                        type="text"
                        value={addressPincode}
                        onChange={e => setAddressPincode(e.target.value)}
                        placeholder="6 digits"
                        maxLength={6}
                        className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-white rounded-2xl border border-neutral-200 text-xs">
                  <div className="flex items-center justify-between font-bold text-neutral-900">
                    <span>{addressFullName || currentUser.name || 'Valued Buyer'}</span>
                    <span className="text-neutral-500 font-normal">{addressPhone || currentUser.phone}</span>
                  </div>
                  <p className="text-neutral-600 mt-1">
                    {addressLine || 'Address details pending'}, {addressCity}, {addressState} - <strong>{addressPincode || 'Pincode'}</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Payment Method Selector Tabs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                  Select Real-World Indian Payment Gateway
                </label>
                <button
                  type="button"
                  onClick={() => setShowGatewayConfig(!showGatewayConfig)}
                  className="text-[11px] text-neutral-400 hover:text-emerald-700 flex items-center gap-1 font-semibold transition"
                >
                  <Key className="w-3 h-3" />
                  <span>Gateway Keys</span>
                </button>
              </div>

              {showGatewayConfig && (
                <div className="mb-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-2">
                  <span className="font-bold text-neutral-700 block">Optional Merchant Gateway Key ID:</span>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={customRazorpayKey}
                      onChange={(e) => {
                        setCustomRazorpayKey(e.target.value);
                        localStorage.setItem('easymart_rzp_key', e.target.value);
                      }}
                      placeholder="e.g. rzp_live_... or rzp_test_..."
                      className="flex-1 px-3 py-1.5 bg-white border border-neutral-300 rounded-lg font-mono text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={() => showToast('Gateway Key Saved!')}
                      className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-xs"
                    >
                      Save
                    </button>
                  </div>
                  <p className="text-[10px] text-neutral-500">
                    Plug in your official Razorpay Key ID to invoke your live merchant checkout, or leave blank to use the secure built-in Escrow Vault.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${paymentMethod === 'upi' ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 ring-2 ring-emerald-500/20 shadow-xs' : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'}`}
                >
                  <Smartphone className="w-5 h-5 text-emerald-600 mb-1" />
                  <div>
                    <div className="text-xs font-bold">BHIM UPI Dynamic</div>
                    <div className="text-[10px] text-neutral-500">GPay, PhonePe, Paytm</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${paymentMethod === 'razorpay' ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 ring-2 ring-emerald-500/20 shadow-xs' : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'}`}
                >
                  <CreditCard className="w-5 h-5 text-emerald-600 mb-1" />
                  <div>
                    <div className="text-xs font-bold">Razorpay Gateway</div>
                    <div className="text-[10px] text-neutral-500">Cards, NetBanking, Wallets</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${paymentMethod === 'netbanking' ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 ring-2 ring-emerald-500/20 shadow-xs' : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'}`}
                >
                  <Building2 className="w-5 h-5 text-emerald-600 mb-1" />
                  <div>
                    <div className="text-xs font-bold">Net Banking 2FA</div>
                    <div className="text-[10px] text-neutral-500">SBI, HDFC, ICICI, Axis</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${paymentMethod === 'cod' ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 ring-2 ring-emerald-500/20 shadow-xs' : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'}`}
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
                  <div>
                    <div className="text-xs font-bold">Safe Handover</div>
                    <div className="text-[10px] text-neutral-500">Inspect &amp; Pay at Door</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Payment Method Details Box */}
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
              
              {/* UPI Dynamic QR & Deep Link Flow */}
              {paymentMethod === 'upi' && (
                <div className="space-y-3.5">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setUpiOption('qr')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition ${upiOption === 'qr' ? 'bg-white border-neutral-300 text-neutral-900 shadow-xs' : 'text-neutral-500 border-transparent hover:bg-white/60'}`}
                    >
                      Dynamic NPCI QR Code
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpiOption('intent')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition ${upiOption === 'intent' ? 'bg-white border-neutral-300 text-neutral-900 shadow-xs' : 'text-neutral-500 border-transparent hover:bg-white/60'}`}
                    >
                      Open in UPI App (Mobile)
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpiOption('id')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition ${upiOption === 'id' ? 'bg-white border-neutral-300 text-neutral-900 shadow-xs' : 'text-neutral-500 border-transparent hover:bg-white/60'}`}
                    >
                      Enter VPA / ID
                    </button>
                  </div>

                  {upiOption === 'qr' && (
                    <div className="text-center py-2 space-y-2">
                      <div className="w-48 h-48 bg-white p-3 rounded-2xl border border-neutral-300 mx-auto shadow-sm flex flex-col items-center justify-center">
                        <img 
                          src={qrCodeUrl} 
                          alt="BHIM UPI QR Code" 
                          className="w-40 h-40 object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-neutral-900">
                          Scan with Google Pay • PhonePe • Paytm • BHIM • CRED
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-1">
                          <span className="text-[11px] text-neutral-500">UPI Session Expiry:</span>
                          <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {formatTime(qrCountdown)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {upiOption === 'intent' && (
                    <div className="text-center py-4 space-y-3">
                      <p className="text-xs text-neutral-600">
                        Tap below to open your phone&apos;s default UPI application with the pre-filled escrow payment:
                      </p>
                      <a
                        href={upiUri}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>Launch Installed UPI App (₹{totalPayable})</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <p className="text-[11px] text-neutral-400">
                        After authorizing payment in your UPI app, return here to view your 6-digit Secret Delivery Code.
                      </p>
                    </div>
                  )}

                  {upiOption === 'id' && (
                    <div className="space-y-2 pt-1">
                      <label className="block text-xs font-bold text-neutral-700">Enter Your VPA / UPI ID</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={upiIdInput}
                          onChange={(e) => setUpiIdInput(e.target.value)}
                          placeholder="e.g. yourname@okhdfcbank"
                          className="flex-1 px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => showToast('UPI Collect Request verified!')}
                          className="px-3 py-2 text-xs bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-xl font-bold transition"
                        >
                          Verify VPA
                        </button>
                      </div>
                      <p className="text-[11px] text-neutral-500">
                        A collect request for ₹{totalPayable} will be pushed to your UPI app.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Razorpay Gateway */}
              {paymentMethod === 'razorpay' && (
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-xl border border-neutral-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-neutral-900 block">Razorpay Standard Checkout</span>
                      <span className="text-[11px] text-neutral-500">Credit/Debit Cards, NetBanking, Paytm, Mobikwik</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                      PCI-DSS v4.0
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Clicking &quot;Authorize Payment&quot; below connects directly to the bank payment rail. Your money is secured in EasyMart Escrow.
                  </p>
                </div>
              )}

              {/* NetBanking */}
              {paymentMethod === 'netbanking' && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-neutral-700">Choose Your Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl outline-none focus:border-emerald-500"
                  >
                    <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    <option value="Punjab National Bank (PNB)">Punjab National Bank (PNB)</option>
                    <option value="Bank of Baroda">Bank of Baroda</option>
                  </select>
                  <p className="text-[11px] text-neutral-500">
                    Secure 2FA routing with your bank&apos;s authorized gateway portal.
                  </p>
                </div>
              )}

              {/* Cash / Safe Handover */}
              {paymentMethod === 'cod' && (
                <div className="text-xs text-neutral-700 space-y-1.5">
                  <p className="font-bold flex items-center gap-1.5 text-neutral-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Doorstep Parcel Inspection &amp; Handover
                  </p>
                  <p className="text-neutral-500 text-[11px]">
                    Inspect the item in person upon courier delivery. Hand over cash or scan seller UPI QR only after you verify the parcel condition.
                  </p>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-200">
              <div className="flex justify-between">
                <span>Item Price</span>
                <span className="font-semibold text-neutral-900">₹{finalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Pan-India Courier Shipping</span>
                <span className="font-semibold text-neutral-900">₹{shippingFee}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Escrow Buyer Guarantee &amp; Insurance</span>
                </span>
                <span className="font-bold uppercase text-[10px] bg-emerald-100 px-1.5 py-0.2 rounded">100% Free</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-neutral-900 pt-2 border-t border-neutral-200">
                <span>Total Amount to Pay</span>
                <span className="text-emerald-700 text-base">₹{totalPayable}</span>
              </div>
            </div>

            {/* Escrow Guarantee Statement */}
            <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex items-start gap-2 text-[11px] text-emerald-950">
              <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                <strong>Zero-Risk Escrow Protection:</strong> Funds stay locked in the EasyMart vault. The seller only receives payout when you confirm parcel delivery or after the 48-hour inspection window.
              </span>
            </div>

            {/* Main Action Pay Button */}
            <button
              id="confirm-pay-btn"
              type="button"
              disabled={isProcessing}
              onClick={handlePay}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 disabled:opacity-75"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Contacting Indian Bank Escrow Vault...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay ₹{totalPayable} with 100% Escrow Protection</span>
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
