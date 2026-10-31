import { useState, useMemo } from 'react';
import { useBilling } from '../context/BillingContext';
import Receipt from './Receipt';
import { playTapSound, playSuccessChime, playRemoveSound } from '../utils/audio';

// Vibrant category color schemes
const CATEGORY_COLORS = {
  Idli: 'bg-cyan-500/15 text-cyan-400 border-cyan-400/30 shadow-cyan-500/10',
  Dosa: 'bg-amber-500/15 text-amber-400 border-amber-400/30 shadow-amber-500/10',
  Vada: 'bg-purple-500/15 text-purple-400 border-purple-400/30 shadow-purple-500/10',
  Poori: 'bg-rose-500/15 text-rose-400 border-rose-400/30 shadow-rose-500/10',
  Parotta: 'bg-emerald-500/15 text-emerald-400 border-emerald-400/30 shadow-emerald-500/10',
  'Snacks & Bajji': 'bg-red-500/15 text-red-400 border-red-400/30 shadow-red-500/10',
  Beverages: 'bg-teal-500/15 text-teal-400 border-teal-400/30 shadow-teal-500/10',
};

const Billing = ({ currentUser, onNavigateToAdmin }) => {
  const {
    menuItems,
    currentOrder,
    orderType,
    paymentMethod,
    setPaymentMethod,
    addToOrder,
    updateOrderQuantity,
    removeFromOrder,
    clearOrder,
    getOrderSubtotal,
    getTotalPlates,
    completeOrder,
    setOrderType,
    billNumber,
  } = useBilling();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showReceipt, setShowReceipt] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [cashTendered, setCashTendered] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const nextTokenNumber = ((billNumber - 1) % 100) + 1;

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(menuItems.map((item) => item.category)))];
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name?.toLowerCase().includes(q) ||
        item.nameEn?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  const subtotal = getOrderSubtotal();
  const finalTotal = Math.max(0, subtotal - (Number(discount) || 0));
  const changeDue = cashTendered && Number(cashTendered) >= finalTotal
    ? Number(cashTendered) - finalTotal
    : 0;

  const handleAddFull = (item) => {
    playTapSound();
    addToOrder(item, 1, false);
  };

  const handleAddHalf = (item) => {
    // Dosa strictly cannot have half plate
    if (item.category === 'Dosa') return;
    playTapSound();
    addToOrder(item, 1, true);
  };

  const handleUpdateQty = (itemId, qty, isHalf) => {
    if (qty <= 0) {
      playRemoveSound();
    } else {
      playTapSound();
    }
    updateOrderQuantity(itemId, qty, isHalf);
  };

  const handleRemoveItem = (itemId, isHalf) => {
    playRemoveSound();
    removeFromOrder(itemId, isHalf);
  };

  const handleClearOrder = () => {
    playRemoveSound();
    clearOrder();
    setDiscount(0);
    setCashTendered('');
    setOrderNotes('');
  };

  const handleCompleteOrder = () => {
    if (currentOrder.length === 0) return;
    playSuccessChime();

    const completed = completeOrder(currentUser, {
      paymentMethod,
      discount: Number(discount) || 0,
      receivedAmount: cashTendered ? Number(cashTendered) : finalTotal,
      changeDue,
      notes: orderNotes,
    });

    setShowReceipt(completed);
    setDiscount(0);
    setCashTendered('');
    setOrderNotes('');
  };

  const handlePrintReceipt = () => {
    const printContent = document.getElementById('receipt-print');
    if (printContent) {
      const isParcel = showReceipt?.orderType === 'parcel';
      const themeColor = isParcel ? '#EA580C' : '#1D4ED8';
      const themeBg = isParcel ? '#FFF7ED' : '#EFF6FF';

      const printWindow = window.open('', '', 'width=440,height=700');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Bill #${showReceipt.billNumber} (Token #${showReceipt.tokenNumber}) - Mamata Tiffin Center</title>
            <style>
              @page { size: 80mm auto; margin: 0; }
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
                font-size: 13px;
                color: #0f172a;
                background: ${themeBg};
                margin: 0;
                padding: 10px;
                width: 76mm;
                box-sizing: border-box;
              }
              .text-center { text-align: center; }
              .text-right { text-align: right; }
              .font-bold { font-weight: bold; }
              #receipt-print {
                border: 2px dashed ${themeColor} !important;
                padding: 10px;
                border-radius: 12px;
                background: #ffffff;
              }
            </style>
          </head>
          <body>${printContent.innerHTML}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const getItemCartCount = (itemId, isHalf = false) => {
    const found = currentOrder.find(
      (ci) => ci.id === itemId && ci.isHalf === isHalf
    );
    return found ? found.quantity : 0;
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="bg-gradient-to-r from-[#131D31] via-[#17233B] to-[#131D31] rounded-3xl shadow-2xl border border-[#233554] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner border transition-all ${
              orderType === 'parcel'
                ? 'bg-orange-500/10 border-orange-500/40 text-orange-400'
                : 'bg-blue-500/10 border-blue-500/40 text-blue-400'
            }`}
          >
            {orderType === 'dine-in' ? '🍽️' : '📦'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base tracking-wide">
                Billing Terminal / బిల్లింగ్ కౌంటర్
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                🟢 100% PURE VEG
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Staff: <span className="font-bold text-amber-400">{currentUser?.name || 'Counter Staff'}</span> | Bill: <span className="font-black text-emerald-400">#{billNumber}</span> | Next Token: <span className="font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">#T-{nextTokenNumber}</span>
            </p>
          </div>
        </div>

        {/* Dynamic Colorful Order Type Switcher & Admin Revenue Button */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
          {isAdmin && onNavigateToAdmin && (
            <button
              onClick={onNavigateToAdmin}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black shadow-lg shadow-orange-500/20 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <span>📊</span>
              <span>All Revenue & Analytics</span>
            </button>
          )}

          {/* Dine-in (Blue) vs Parcel (Orange) Switcher */}
          <div className="inline-flex p-1 bg-[#090D17] rounded-2xl border border-[#233554] shadow-inner gap-1">
            <button
              type="button"
              onClick={() => {
                playTapSound();
                setOrderType('dine-in');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                orderType === 'dine-in'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-[#162136]'
              }`}
            >
              <span className="text-sm">🍽️</span>
              <span>Dine-in (డైన్-ఇన్)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playTapSound();
                setOrderType('parcel');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                orderType === 'parcel'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-lg shadow-orange-500/30 ring-2 ring-orange-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-[#162136]'
              }`}
            >
              <span className="text-sm">📦</span>
              <span>Parcel (పార్సల్)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Billing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Colorful Menu Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#121A2B] rounded-3xl shadow-2xl border border-[#202E4A] p-5">
            {/* Search & Category Header */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🥞</span>
                <div>
                  <h2 className="text-base font-black text-white">
                    Veg Menu Selection / టిఫిన్స్ ఎంచుకోండి
                  </h2>
                  <p className="text-[11px] text-amber-300 font-semibold">
                    Dosa items served Full Plate only · Authentic Pure Veg
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search item / వెతకండి..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#090D17] text-white border border-[#243555] rounded-xl focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 placeholder-slate-500"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                  🔍
                </span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills (Colorful Glow) */}
            <div className="flex flex-wrap gap-2 pb-3 mb-4 border-b border-[#1B273E]">
              {categories.map((cat) => {
                const colorClass =
                  CATEGORY_COLORS[cat] || 'bg-slate-800 text-slate-300 border-slate-700';
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      playTapSound();
                      setSelectedCategory(cat);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 border-amber-400 shadow-lg shadow-orange-500/25 scale-105'
                        : `${colorClass} hover:brightness-125`
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 max-h-[660px] overflow-y-auto pr-1">
              {filteredItems.map((item) => {
                const isDosa = item.category === 'Dosa';
                const fullCount = getItemCartCount(item.id, false);
                const halfCount = isDosa ? 0 : (item.halfPrice ? getItemCartCount(item.id, true) : 0);
                const totalInCart = fullCount + halfCount;
                const catColor = CATEGORY_COLORS[item.category] || 'text-amber-400';

                return (
                  <div
                    key={item.id}
                    className={`bg-gradient-to-b from-[#162136] to-[#0E1524] border rounded-2xl p-4 transition-all flex flex-col justify-between hover:shadow-2xl hover:border-amber-400/60 ${
                      totalInCart > 0
                        ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-lg shadow-amber-400/10'
                        : 'border-[#22314E]'
                    }`}
                  >
                    <div>
                      {/* Category Tag & Cart Count */}
                      <div className="flex justify-between items-center mb-1.5">
                        <span
                          className={`text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full border ${catColor}`}
                        >
                          {item.category}
                        </span>
                        {totalInCart > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-sm animate-pulse">
                            {totalInCart} in cart
                          </span>
                        )}
                      </div>

                      {/* 1st English Name (Bold, Primary) */}
                      <div className="font-black text-white text-base leading-snug">
                        {item.nameEn || item.name}
                      </div>

                      {/* 2nd Telugu Name (Secondary, Distinct) */}
                      <div className="text-xs text-amber-300 font-semibold mb-3">
                        {item.name}
                      </div>
                    </div>

                    {/* Dual Pricing & Add Buttons */}
                    <div className="space-y-2 pt-2.5 border-t border-[#1E2B44]">
                      {/* Full Plate Action */}
                      <div className="flex items-center justify-between gap-1">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                            Full Plate
                          </span>
                          <span className="font-black text-amber-400 text-base">
                            ₹{item.price}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddFull(item)}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 active:scale-95 text-slate-950 text-xs font-black flex items-center gap-1 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                        >
                          <span>+ Full</span>
                          {fullCount > 0 && (
                            <span className="bg-slate-950 text-amber-300 rounded-full px-1.5 py-0.2 text-[10px] font-black">
                              {fullCount}
                            </span>
                          )}
                        </button>
                      </div>

                      {/* Dosa Special: Strictly No Half Plate */}
                      {isDosa ? (
                        <div className="text-[11px] text-amber-300/80 font-bold text-center py-1 bg-amber-400/5 rounded-xl border border-amber-400/10 flex items-center justify-center gap-1.5">
                          <span className="text-amber-400">🥞</span>
                          <span>Full Plate Only · No Half</span>
                        </div>
                      ) : item.halfPrice ? (
                        /* Half Plate Action for non-Dosa items */
                        <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-dashed border-[#1E2B44]">
                          <div>
                            <span className="text-[10px] text-emerald-400 block font-semibold uppercase">
                              {item.halfLabel || 'Half Plate'}
                            </span>
                            <span className="font-black text-emerald-400 text-sm">
                              ₹{item.halfPrice}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddHalf(item)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                          >
                            <span>+ {item.halfLabel || 'Half'}</span>
                            {halfCount > 0 && (
                              <span className="bg-slate-950 text-emerald-300 rounded-full px-1.5 py-0.2 text-[10px] font-black">
                                {halfCount}
                              </span>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-500 text-center py-0.5 italic">
                          Single / Full only
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-16 text-slate-400">
                <span className="text-5xl block mb-2">🔍</span>
                <p className="text-base font-bold text-white">No items found</p>
                <p className="text-xs text-slate-400 mt-1">Try another category or search query</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Order Summary & Dynamic Receipt Theming (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div
            className={`rounded-3xl shadow-2xl border p-5 sticky top-20 transition-all ${
              orderType === 'parcel'
                ? 'bg-[#151420] border-orange-500/40 shadow-orange-500/5'
                : 'bg-[#11182A] border-blue-500/40 shadow-blue-500/5'
            }`}
          >
            {/* Header with Dine-in (Blue) / Parcel (Orange) Badge */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#202E4A]">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <span>🧾</span>
                  <span>ప్రస్తుత ఆర్డర్ / Current Order</span>
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      orderType === 'parcel'
                        ? 'bg-orange-500 text-slate-950'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {orderType === 'parcel' ? '📦 Parcel (Orange Slip)' : '🍽️ Dine-in (Blue Slip)'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="px-3 py-1 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 font-black text-xs shadow-inner">
                  Token #T-{nextTokenNumber}
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Bill #{billNumber}
                </span>
              </div>
            </div>

            {/* Cart Items List */}
            {currentOrder.length === 0 ? (
              <div className="py-20 text-center text-slate-400">
                <span className="text-5xl block mb-3 text-slate-600">🍽️</span>
                <p className="text-sm font-bold text-white">Cart is empty</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Click "+ Full" or "+ Half" on any veg tiffin on the left to add items.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 my-4 max-h-[320px] overflow-y-auto pr-1">
                {currentOrder.map((item, index) => (
                  <div
                    key={`${item.id}-${item.isHalf}-${index}`}
                    className="p-3 bg-[#080C14] rounded-2xl border border-[#202E4A] flex items-center justify-between gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-white text-sm truncate">
                          {item.nameEn || item.name}
                        </span>
                        <span
                          className={`px-2 py-0.2 rounded-full font-black text-[10px] ${
                            item.isHalf
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/30'
                              : 'bg-amber-400/20 text-amber-400 border border-amber-400/30'
                          }`}
                        >
                          {item.isHalf ? (item.halfLabel || 'Half Plate') : 'Full Plate'}
                        </span>
                      </div>
                      <div className="text-xs text-amber-300">
                        {item.name} · ₹{item.unitPrice} each
                      </div>
                      <div className="text-xs font-black text-amber-400 mt-0.5">
                        ₹{item.unitPrice} × {item.quantity} = ₹{item.unitPrice * item.quantity}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateQty(item.id, item.quantity - 1, item.isHalf)
                        }
                        className="w-7 h-7 rounded-lg bg-[#141E32] border border-[#2B3C5E] hover:bg-[#202E4A] active:scale-95 text-white font-bold text-sm flex items-center justify-center transition-all cursor-pointer"
                        title="Reduce"
                      >
                        -
                      </button>
                      <span className="w-7 text-center font-black text-white text-sm">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateQty(item.id, item.quantity + 1, item.isHalf)
                        }
                        className="w-7 h-7 rounded-lg bg-[#141E32] border border-[#2B3C5E] hover:bg-[#202E4A] active:scale-95 text-white font-bold text-sm flex items-center justify-center transition-all cursor-pointer"
                        title="Increase"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id, item.isHalf)}
                        className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/30 hover:bg-rose-500/30 active:scale-95 text-rose-400 text-xs flex items-center justify-center transition-all ml-1 cursor-pointer"
                        title="Delete item"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bill Summary Totals & Payment Settings */}
            {currentOrder.length > 0 && (
              <div className="pt-3.5 border-t border-[#202E4A] space-y-3">
                {/* Plates & Subtotal */}
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Total Plates / మొత్తం ప్లేట్లు:</span>
                  <span className="font-black text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-lg">
                    {getTotalPlates()} plates
                  </span>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Payment Mode / చెల్లింపు విధానం
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        playTapSound();
                        setPaymentMethod('cash');
                      }}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                        paymentMethod === 'cash'
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black border-emerald-400 shadow-md shadow-emerald-500/20'
                          : 'bg-[#090D17] text-slate-300 border-[#202E4A] hover:bg-[#141E32]'
                      }`}
                    >
                      💵 Cash
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playTapSound();
                        setPaymentMethod('upi');
                      }}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                        paymentMethod === 'upi'
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black border-purple-400 shadow-md shadow-purple-500/20'
                          : 'bg-[#090D17] text-slate-300 border-[#202E4A] hover:bg-[#141E32]'
                      }`}
                    >
                      📱 UPI / QR
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playTapSound();
                        setPaymentMethod('card');
                      }}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-slate-950 font-black border-blue-400 shadow-md shadow-blue-500/20'
                          : 'bg-[#090D17] text-slate-300 border-[#202E4A] hover:bg-[#141E32]'
                      }`}
                    >
                      💳 Card
                    </button>
                  </div>
                </div>

                {/* Cash Tendered Calculator (If Cash selected) */}
                {paymentMethod === 'cash' && (
                  <div className="p-3 bg-[#090D17] rounded-xl border border-[#202E4A] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300">Cash Received:</span>
                      <div className="flex items-center gap-1">
                        <span className="text-amber-400 font-bold">₹</span>
                        <input
                          type="number"
                          value={cashTendered}
                          onChange={(e) => setCashTendered(e.target.value)}
                          placeholder={finalTotal.toString()}
                          className="w-20 px-2 py-1 bg-[#141E32] text-white text-xs font-bold rounded-lg border border-[#2B3C5E] text-right focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                    {changeDue > 0 && (
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-[#1B273E]">
                        <span className="text-emerald-400 font-bold">Change Due (తిరిగి ఇవ్వవలసినది):</span>
                        <span className="text-emerald-400 font-black text-sm">₹{changeDue}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Grand Total Display */}
                <div className="flex justify-between items-center py-3 px-4 bg-[#090D17] border border-[#233554] rounded-2xl">
                  <div>
                    <span className="text-[11px] uppercase font-black text-slate-400 tracking-wider">
                      Grand Total / మొత్తం:
                    </span>
                    <p
                      className={`text-[10px] font-bold ${
                        orderType === 'parcel' ? 'text-orange-400' : 'text-blue-400'
                      }`}
                    >
                      {orderType === 'parcel' ? '📦 Parcel Order' : '🍽️ Dine-in Order'} · {paymentMethod.toUpperCase()}
                    </p>
                  </div>
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">
                    ₹{finalTotal}
                  </span>
                </div>

                {/* Print Bill & Action Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleClearOrder}
                    className="py-3.5 px-3 rounded-2xl bg-[#141E32] hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-[#283854] font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>🗑️</span>
                    <span>Clear</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCompleteOrder}
                    className={`col-span-2 py-3.5 px-4 rounded-2xl active:scale-95 font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      orderType === 'parcel'
                        ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-400 text-slate-950 shadow-orange-500/30'
                        : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/30'
                    }`}
                  >
                    <span>🖨️</span>
                    <span>
                      {orderType === 'parcel'
                        ? 'PRINT ORANGE PARCEL BILL'
                        : 'PRINT BLUE DINE-IN BILL'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Printable Themed Receipt Modal */}
      {showReceipt && (
        <Receipt
          order={showReceipt}
          onClose={() => setShowReceipt(null)}
          onPrint={handlePrintReceipt}
        />
      )}
    </div>
  );
};

export default Billing;
