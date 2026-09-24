import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, MessageSquare, ShieldCheck, Tag, 
  Check, X, ArrowRight, UserCheck, Package, ExternalLink, Lock 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ChatPage: React.FC = () => {
  const { 
    conversations, chatMessages, navParams,
    sendChatMessage, respondToOffer, currentUser, isAuthenticated, products, 
    openPaymentModal, navigateTo 
  } = useApp();

  const [activeConvId, setActiveConvId] = useState<string>(
    navParams.conversationId || conversations[0]?.id || ''
  );
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto shadow-xs">
          <MessageSquare className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-neutral-900 font-display">Sign In to View Messages</h2>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
            Chat with Indian buyers and sellers, negotiate offers, and confirm parcel delivery.
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

  useEffect(() => {
    if (navParams.conversationId) {
      setActiveConvId(navParams.conversationId);
    } else if (!activeConvId && conversations[0]?.id) {
      setActiveConvId(conversations[0].id);
    }
  }, [navParams.conversationId, conversations]);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];
  const messages = activeConv ? (chatMessages[activeConv.id] || []) : [];
  const activeProduct = products.find(p => p.id === activeConv?.productId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    sendChatMessage(activeConv.id, inputText.trim());
    setInputText('');
  };

  const sendQuickReply = (text: string) => {
    if (!activeConv) return;
    sendChatMessage(activeConv.id, text);
  };

  if (!activeConv) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto border border-emerald-100 shadow-xs">
          <MessageSquare className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>End-to-End Escrow Protected Messaging</span>
          </div>
          <h2 className="text-2xl font-extrabold text-neutral-900 font-display">
            No Active Conversations Yet
          </h2>
          <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
            This chat space is strictly reserved for real buyers and sellers to communicate, negotiate prices, and schedule safe deliveries across India.
          </p>
        </div>

        <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-left text-xs space-y-2 max-w-md mx-auto">
          <span className="font-bold text-neutral-800 block text-[11px] uppercase tracking-wider">How Peer Chat Works:</span>
          <p className="text-neutral-600 leading-relaxed text-[11px]">
            1. Browse any everyday essential listing on the marketplace.<br />
            2. Tap <strong>&quot;Chat with Seller&quot;</strong> or <strong>&quot;Make an Offer&quot;</strong>.<br />
            3. Negotiate directly with the neighbor seller, agree on price, and checkout via 100% Escrow Protection.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigateTo('products')}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
          >
            <span>Explore Active Listings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigateTo('post-item')}
            className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-xs rounded-xl border border-neutral-300 transition"
          >
            Post an Item to Sell
          </button>
        </div>
      </div>
    );
  }

  const isMeBuyer = activeConv.buyerId === currentUser.id;
  const otherUserName = isMeBuyer ? activeConv.sellerName : activeConv.buyerName;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-12 h-[720px]">
        
        {/* Left Sidebar: Conversations List (4 cols) */}
        <div className="md:col-span-4 border-r border-neutral-200 flex flex-col h-full bg-neutral-50/50">
          <div className="p-4 border-b border-neutral-200 bg-white">
            <h2 className="font-bold text-base text-neutral-900 font-display">Messages &amp; Offers</h2>
            <p className="text-[11px] text-neutral-500">Live Indian peer negotiations</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
            {conversations.map((conv) => {
              const isSelected = conv.id === activeConv.id;
              const isCurrBuyer = conv.buyerId === currentUser.id;
              const partnerName = isCurrBuyer ? conv.sellerName : conv.buyerName;

              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition ${isSelected ? 'bg-white border-l-4 border-emerald-600 shadow-2xs' : 'hover:bg-neutral-100/70'}`}
                >
                  <img
                    src={conv.productImage}
                    alt=""
                    className="w-11 h-11 rounded-xl object-cover border border-neutral-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-neutral-900 truncate">{partnerName}</h4>
                      <span className="text-[10px] text-neutral-400">
                        {conv.lastTimestamp}
                      </span>
                    </div>

                    <p className="text-[11px] font-semibold text-emerald-800 truncate">
                      {conv.productTitle}
                    </p>

                    <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && !isSelected && (
                    <span className="w-5 h-5 bg-emerald-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Main Chat Thread (8 cols) */}
        <div className="md:col-span-8 flex flex-col h-full bg-white">
          
          {/* Header Product Card */}
          {activeProduct && (
            <div className="p-3.5 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between gap-3">
              <div 
                onClick={() => navigateTo('product-details', { productId: activeProduct.id })}
                className="flex items-center gap-3 cursor-pointer group min-w-0"
              >
                <img
                  src={activeProduct.images[0]}
                  alt=""
                  className="w-12 h-12 rounded-xl object-cover border shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-neutral-900 group-hover:text-emerald-700 transition truncate">
                    {activeProduct.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-extrabold text-neutral-900">₹{activeProduct.price}</span>
                    <span className="text-neutral-400">•</span>
                    <span className="text-neutral-500">Seller: {activeConv.sellerName}</span>
                    <span className="text-neutral-400">•</span>
                    <span className="text-neutral-500">{activeProduct.location.city}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  id="chat-buy-now-btn"
                  onClick={() => openPaymentModal(activeProduct)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Buy with Escrow (₹{activeProduct.price})
                </button>
              </div>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50/30">
            
            {/* Safety Notice in Chat */}
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-[11px] text-amber-900 text-center max-w-lg mx-auto">
              <span className="font-bold block">⚠️ Safety Advice for Indian Buyers &amp; Sellers:</span>
              Never pay off-platform or share OTPs. Use our Escrow checkout so funds are held safely until delivery.
            </div>

            {messages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-neutral-400 mb-1 px-1">
                    {msg.senderName}
                  </span>

                  {/* Normal Text Bubble */}
                  {!msg.isOffer && (
                    <div
                      className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                        isMe
                          ? 'bg-emerald-600 text-white rounded-br-xs'
                          : 'bg-white text-neutral-800 border border-neutral-200 rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}

                  {/* Offer Bubble */}
                  {msg.isOffer && (
                    <div className="max-w-sm w-full bg-white border-2 border-amber-400 p-4 rounded-2xl shadow-sm space-y-2.5 my-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-900 flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5 text-amber-600" />
                          Price Offer
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                          msg.offerStatus === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                          msg.offerStatus === 'declined' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {msg.offerStatus || 'Pending'}
                        </span>
                      </div>

                      <div className="text-xl font-black text-neutral-900 font-display">
                        ₹{msg.offerPrice}
                      </div>

                      <p className="text-[11px] text-neutral-600 leading-relaxed">
                        {msg.text}
                      </p>

                      {/* Offer Response buttons if I am the recipient and offer is pending */}
                      {!isMe && msg.offerStatus === 'pending' && (
                        <div className="flex gap-2 pt-1 border-t border-neutral-100">
                          <button
                            onClick={() => respondToOffer(activeConv.id, msg.id, true)}
                            className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept Offer</span>
                          </button>
                          <button
                            onClick={() => respondToOffer(activeConv.id, msg.id, false)}
                            className="flex-1 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs rounded-lg flex items-center justify-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Decline</span>
                          </button>
                        </div>
                      )}

                      {msg.offerStatus === 'accepted' && (
                        <div className="pt-2 border-t text-center">
                          <button
                            onClick={() => {
                              if (activeProduct) {
                                openPaymentModal(activeProduct, msg.offerPrice);
                              }
                            }}
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
                          >
                            Checkout with Escrow at ₹{msg.offerPrice}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <span className="text-[10px] text-neutral-400 mt-0.5 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Chips */}
          <div className="p-2 border-t border-neutral-100 bg-white flex gap-2 overflow-x-auto text-[11px] whitespace-nowrap">
            {[
              'Is this still available in Bengaluru?',
              'What is the packing & courier condition?',
              'Will you take ₹450?',
              'Can we do doorstep OTP handover?'
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => sendQuickReply(chip)}
                className="px-2.5 py-1 bg-neutral-100 hover:bg-emerald-50 hover:text-emerald-700 text-neutral-600 rounded-full transition"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 border-t border-neutral-200 flex items-center gap-2 bg-white">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${otherUserName}...`}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
