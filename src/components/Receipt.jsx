import { useState, useEffect } from 'react';
import { playTapSound, playRemoveSound } from '../utils/audio';

const Receipt = ({ order, onClose, onPrint }) => {
  const { hotelInfo } = order;
  const isParcel = order.orderType === 'parcel';
  const [copied, setCopied] = useState(false);

  const tokenNumber = order.tokenNumber || ((order.billNumber - 1) % 100) + 1;

  // Listen for Escape key to close the modal anytime
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        playRemoveSound();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    playRemoveSound();
    onClose();
  };

  // Theme configuration based on Order Type
  // Parcel -> ORANGE THEME
  // Dine-in -> BLUE THEME
  const theme = isParcel
    ? {
        typeLabel: '📦 PARCEL RECEIPT',
        typeLabelTelugu: 'పార్సల్ రసీదు',
        modalHeaderBg: 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500',
        badgeBg: 'bg-orange-500 text-white',
        borderDashed: 'border-orange-500',
        textPrimary: 'text-orange-950',
        textAccent: 'text-orange-600',
        boxBg: 'bg-orange-50/50',
        printBtnBg: 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 shadow-orange-500/30',
        accentHex: '#EA580C',
        softHex: '#FFF7ED',
      }
    : {
        typeLabel: '🍽️ DINE-IN RECEIPT',
        typeLabelTelugu: 'డైన్-ఇన్ రసీదు',
        modalHeaderBg: 'bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-600',
        badgeBg: 'bg-blue-600 text-white',
        borderDashed: 'border-blue-500',
        textPrimary: 'text-blue-950',
        textAccent: 'text-blue-600',
        boxBg: 'bg-blue-50/50',
        printBtnBg: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/30',
        accentHex: '#1D4ED8',
        softHex: '#EFF6FF',
      };

  const handleCopyBill = () => {
    playTapSound();
    const itemsText = order.items
      .map(
        (it) =>
          `• ${it.nameEn || it.name} (${it.isHalf ? (it.halfLabel || 'Half') : 'Full'}): ${it.quantity} x ₹${it.unitPrice} = ₹${it.quantity * it.unitPrice}`
      )
      .join('\n');

    const billText = `
MAMATA TIFFIN CENTER (100% PURE VEG)
----------------------------------------
Token: #T-${tokenNumber} | Bill: #${order.billNumber}
Type: ${isParcel ? 'PARCEL' : 'DINE-IN'}
Date: ${new Date(order.date).toLocaleString('en-IN')}
Cashier: ${order.cashier || 'Cashier'}
Payment: ${(order.paymentMethod || 'cash').toUpperCase()}
----------------------------------------
${itemsText}
----------------------------------------
Total Plates: ${order.totalPlates}
Total Amount: ₹${order.total}
Thank you! Visit again!
    `.trim();

    navigator.clipboard?.writeText(billText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={(e) => {
        // Close if clicked on the darkened backdrop
        if (e.target === e.currentTarget) {
          handleClose(e);
        }
      }}
      className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200 cursor-pointer overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#111827] rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-[#2B3E68] cursor-default my-auto relative"
      >
        {/* Modal Top Bar */}
        <div className={`${theme.modalHeaderBg} px-6 py-4 flex items-center justify-between text-white shadow-md relative z-20`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{isParcel ? '📦' : '🍽️'}</span>
            <div>
              <h3 className="font-black text-sm tracking-wide">
                {theme.typeLabel}
              </h3>
              <p className="text-[10px] text-white/90">
                Token #T-{tokenNumber} · Bill #{order.billNumber}
              </p>
            </div>
          </div>

          {/* Cross Mark Button with robust touch target & Esc shortcut */}
          <button
            type="button"
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 active:scale-90 flex items-center justify-center text-white text-lg font-black transition-all cursor-pointer border border-white/25 shadow-md"
            title="Close Receipt / ముగించు (Esc)"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* Printable Ticket */}
          <div
            id="receipt-print"
            className={`p-5 rounded-2xl font-mono text-xs text-slate-900 shadow-inner border-2 border-dashed ${theme.borderDashed} ${theme.boxBg}`}
            style={{
              borderColor: theme.accentHex,
            }}
          >
            {/* Header */}
            <div className="text-center pb-3 border-b-2 border-dashed" style={{ borderColor: theme.accentHex }}>
              <div
                className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-1.5 ${theme.badgeBg}`}
              >
                {theme.typeLabel}
              </div>

              {/* Bold High-Impact Token Number for Kitchen & Customer */}
              <div
                className="py-1 px-3 my-1.5 rounded-xl font-black text-xl tracking-wider text-center border-2 border-slate-900"
                style={{ backgroundColor: isParcel ? '#FFEDD5' : '#DBEAFE', color: theme.accentHex }}
              >
                TOKEN #T-{tokenNumber}
              </div>

              <h2 className="font-black text-base tracking-wide text-slate-950 mt-1">
                {hotelInfo.nameEn}
              </h2>
              <div className="text-[12px] font-bold text-slate-800">
                {hotelInfo.name}
              </div>
              <div className="text-[10px] text-emerald-700 font-black mt-0.5">
                🟢 100% PURE VEGETARIAN
              </div>
              <div className="text-[10px] text-slate-600 mt-0.5">
                {hotelInfo.addressEn}
              </div>
              <div className="text-[10px] text-slate-600 font-semibold">
                Ph: {hotelInfo.phone}
              </div>
            </div>

            {/* Bill Meta */}
            <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-[11px]">
              <div className="flex justify-between font-bold">
                <span>Bill No: #{order.billNumber}</span>
                <span style={{ color: theme.accentHex }}>
                  {order.orderType === 'parcel' ? '📦 PARCEL' : '🍽️ DINE-IN'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 text-[10px]">
                <span>Date: {new Date(order.date).toLocaleDateString('en-IN')}</span>
                <span>Time: {new Date(order.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[10px]">
                <span>Cashier Staff:</span>
                <span className="font-bold text-slate-900">{order.cashier || 'Cashier'}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[10px]">
                <span>Payment Mode:</span>
                <span className="font-bold text-slate-900 uppercase">
                  {(order.paymentMethod || 'cash')}
                </span>
              </div>
            </div>

            {/* Items Column Header */}
            <div className="pt-2 pb-1 flex justify-between font-bold text-[11px] text-slate-800 border-b border-slate-300">
              <span>Item (English / Telugu)</span>
              <span className="text-right">Qty × Rate = Amt</span>
            </div>

            {/* Items List */}
            <div className="py-2 space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start text-[11px]">
                  <div className="flex-1 pr-2">
                    <div className="font-black text-slate-950 text-xs">
                      {item.nameEn || item.name}
                    </div>
                    <div className="text-[10px] text-slate-600 font-medium">
                      {item.name} {item.isHalf && `(${item.halfLabel || 'Half Plate'})`}
                    </div>
                  </div>
                  <div className="text-right whitespace-nowrap font-medium">
                    <span className="text-[10px] text-slate-600">
                      {item.quantity} × ₹{item.unitPrice} =
                    </span>{' '}
                    <span className="font-black text-slate-950">
                      ₹{item.unitPrice * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Section */}
            <div className="pt-2 border-t-2 border-dashed space-y-1.5" style={{ borderColor: theme.accentHex }}>
              <div className="flex justify-between text-slate-700 font-semibold text-xs">
                <span>Total Plates / మొత్తం ప్లేట్లు:</span>
                <span className="font-bold">{order.totalPlates}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold text-xs">
                  <span>Discount / తగ్గింపు:</span>
                  <span className="font-bold">-₹{order.discount}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-black pt-1 border-t border-slate-300">
                <span className="text-slate-950">Grand Total / మొత్తం:</span>
                <span className="text-base" style={{ color: theme.accentHex }}>
                  ₹{order.total}
                </span>
              </div>

              {order.changeDue > 0 && (
                <div className="flex justify-between text-[11px] text-slate-600 pt-1">
                  <span>Change Given:</span>
                  <span className="font-bold text-slate-900">₹{order.changeDue}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="text-center pt-3 border-t border-dashed border-slate-400 text-[10px] text-slate-600 space-y-0.5">
              <p className="font-bold text-slate-800">
                ధన్యవాదాలు! మళ్లీ రండి
              </p>
              <p>Thank you! Visit again!</p>
              <p className="text-[9px] text-slate-500 mt-1">
                GST Included (Composition Scheme) · Pure Vegetarian
              </p>
            </div>
          </div>

          {/* Action Buttons: Copy, Print, and Done/Close */}
          <div className="mt-4 space-y-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyBill}
                className="py-2.5 px-3 rounded-xl bg-[#1F293D] hover:bg-[#28354E] active:scale-95 text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#2D3F63]"
                title="Copy bill text"
              >
                <span>{copied ? '✅' : '📋'}</span>
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playTapSound();
                  onPrint();
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl active:scale-95 text-xs font-black shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${theme.printBtnBg}`}
              >
                <span>🖨️</span>
                <span>Print Slip / ప్రింట్ రసీదు</span>
              </button>
            </div>

            {/* Dedicated Big Done / Next Order Button */}
            <button
              type="button"
              onClick={handleClose}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1A253A] hover:bg-[#23324E] active:scale-98 text-slate-200 border border-[#2E4268] text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>✓ Done / Close & Next Order (ముగించు)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
