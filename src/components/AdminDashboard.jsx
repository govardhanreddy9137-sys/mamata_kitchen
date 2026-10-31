import { useState } from 'react';
import { useBilling } from '../context/BillingContext';
import Receipt from './Receipt';
import { playTapSound } from '../utils/audio';
import { printReceiptTicket } from '../utils/print';

const AdminDashboard = () => {
  const {
    salesHistory,
    getSalesStats,
    exportSalesToCSV,
    clearSalesHistory,
  } = useBilling();

  const [timeframe, setTimeframe] = useState('today'); // 'today' or 'all'
  const [activeTab, setActiveTab] = useState('revenue'); // 'revenue', 'items', 'cashiers', 'history', 'github'
  const [reprintOrder, setReprintOrder] = useState(null);
  const [copiedCmd, setCopiedCmd] = useState('');

  const stats = getSalesStats(timeframe);

  const filteredBills =
    timeframe === 'today'
      ? salesHistory.filter(
          (s) => new Date(s.date).toDateString() === new Date().toDateString()
        )
      : salesHistory;

  const handlePrintReceipt = () => {
    printReceiptTicket(
      'receipt-print',
      `Bill #${reprintOrder?.billNumber} (Token #${reprintOrder?.tokenNumber}) - Mamata Tiffin Center`
    );
  };

  const copyToClipboard = (text, key) => {
    playTapSound();
    navigator.clipboard?.writeText(text);
    setCopiedCmd(key);
    setTimeout(() => setCopiedCmd(''), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-[#121A2B] rounded-3xl shadow-xl border border-[#202E4A] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white">
              💰 ఆల్ రెవెన్యూ & సేల్స్ / All Revenue & Plates Analytics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-400/10 text-amber-400 border border-amber-400/30">
              Admin Exclusive
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time revenue, total plates served, cashier breakdowns, payment analytics, and GitHub status.
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe Toggle */}
          <div className="inline-flex p-1 bg-[#090D17] rounded-xl border border-[#233554]">
            <button
              onClick={() => {
                playTapSound();
                setTimeframe('today');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeframe === 'today'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Today / ఈ రోజు
            </button>
            <button
              onClick={() => {
                playTapSound();
                setTimeframe('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeframe === 'all'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Time / మొత్తం
            </button>
          </div>

          <button
            onClick={() => {
              playTapSound();
              exportSalesToCSV();
            }}
            className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white rounded-xl text-xs font-black shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>📥</span>
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              if (
                window.confirm(
                  'Are you sure you want to clear sales history? / అన్ని అమ్మకాల చరిత్రను తొలగించాలా?'
                )
              ) {
                clearSalesHistory();
              }
            }}
            className="px-3 py-2 bg-[#172237] hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-[#283854] rounded-xl text-xs font-bold transition-all cursor-pointer"
            title="Clear sales data"
          >
            🗑️ Clear Data
          </button>
        </div>
      </div>

      {/* Main KPI Cards: Revenue, Plates, Dine-in, Parcel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-[#162136] to-[#0E1524] rounded-3xl p-5 border border-amber-400/30 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 block mb-1">
                Total Revenue / మొత్తం ఆదాయం
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white">
                ₹{stats.totalIncome.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-amber-300/80 font-semibold mt-1">
                From {stats.totalBills} completed orders
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center text-xl">
              💰
            </div>
          </div>
        </div>

        {/* Total Plates Sold */}
        <div className="bg-gradient-to-br from-[#162136] to-[#0E1524] rounded-3xl p-5 border border-emerald-400/30 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 block mb-1">
                Total Plates / మొత్తం ప్లేట్లు
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {stats.totalPlates}{' '}
                <span className="text-sm font-semibold text-emerald-400">plates</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-1">
                Avg {(stats.totalPlates / (stats.totalBills || 1)).toFixed(1)} plates per bill
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 flex items-center justify-center text-xl">
              🍽️
            </div>
          </div>
        </div>

        {/* Dine-in Revenue & Plates */}
        <div className="bg-gradient-to-br from-[#162136] to-[#0E1524] rounded-3xl p-5 border border-[#233554] shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-400 block mb-1">
                Dine-in / డైన్-ఇన్
              </span>
              <div className="text-xl sm:text-2xl font-black text-white">
                ₹{stats.dineInRevenue.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-400 font-semibold mt-1">
                {stats.dineInPlates} plates ({stats.dineInCount} bills)
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center text-xl">
              🍽️
            </div>
          </div>
        </div>

        {/* Parcel (Takeaway) */}
        <div className="bg-gradient-to-br from-[#162136] to-[#0E1524] rounded-3xl p-5 border border-[#233554] shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-orange-400 block mb-1">
                Parcel / పార్సల్
              </span>
              <div className="text-xl sm:text-2xl font-black text-white">
                ₹{stats.parcelRevenue.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-400 font-semibold mt-1">
                {stats.parcelPlates} plates ({stats.parcelCount} bills)
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center text-xl">
              📦
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-[#121A2B] rounded-3xl shadow-xl border border-[#202E4A] overflow-hidden">
        <div className="border-b border-[#202E4A] px-6 pt-3 flex gap-4 overflow-x-auto bg-[#0C1220]">
          <button
            onClick={() => {
              playTapSound();
              setActiveTab('revenue');
            }}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'revenue'
                ? 'border-amber-400 text-amber-400 font-black'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>📊</span>
            <span>Summary & Payments</span>
          </button>

          <button
            onClick={() => {
              playTapSound();
              setActiveTab('items');
            }}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'items'
                ? 'border-amber-400 text-amber-400 font-black'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>🍽️</span>
            <span>Item-wise Plates / అమ్మిన ప్లేట్లు</span>
          </button>

          <button
            onClick={() => {
              playTapSound();
              setActiveTab('cashiers');
            }}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'cashiers'
                ? 'border-amber-400 text-amber-400 font-black'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>🧑‍💼</span>
            <span>Cashier Performance</span>
          </button>

          <button
            onClick={() => {
              playTapSound();
              setActiveTab('history');
            }}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'history'
                ? 'border-amber-400 text-amber-400 font-black'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>📜</span>
            <span>Billing Records ({filteredBills.length})</span>
          </button>

          <button
            onClick={() => {
              playTapSound();
              setActiveTab('github');
            }}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'github'
                ? 'border-cyan-400 text-cyan-400 font-black'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span>🐙</span>
            <span>GitHub & Cloud / గిట్‌హబ్</span>
          </button>
        </div>

        <div className="p-6">
          {/* TAB 1: SUMMARY & REVENUE CHARTS */}
          {activeTab === 'revenue' && (
            <div className="space-y-6">
              {/* Payment Methods Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#090D17] rounded-2xl p-4 border border-[#202E4A]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400">💵 Cash Collections</span>
                    <span className="text-xs font-black text-emerald-400">Cashier Counter</span>
                  </div>
                  <div className="text-xl font-black text-emerald-400">
                    ₹{(stats.paymentBreakdown?.cash || 0).toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="bg-[#090D17] rounded-2xl p-4 border border-[#202E4A]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400">📱 UPI / QR Payments</span>
                    <span className="text-xs font-black text-purple-400">GPay/PhonePe/Paytm</span>
                  </div>
                  <div className="text-xl font-black text-purple-400">
                    ₹{(stats.paymentBreakdown?.upi || 0).toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="bg-[#090D17] rounded-2xl p-4 border border-[#202E4A]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400">💳 Card Swipes</span>
                    <span className="text-xs font-black text-blue-400">POS Machine</span>
                  </div>
                  <div className="text-xl font-black text-blue-400">
                    ₹{(stats.paymentBreakdown?.card || 0).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dine-in vs Parcel bar breakdown */}
                <div className="bg-[#090D17] rounded-2xl p-5 border border-[#202E4A]">
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-amber-400">📈</span>
                    <span>Order Type Split / ఆర్డర్ రకాల విభజన</span>
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                          Dine-in (డైన్-ఇన్):
                        </span>
                        <span className="text-blue-400">
                          ₹{stats.dineInRevenue} ({stats.dineInPlates} plates)
                        </span>
                      </div>
                      <div className="w-full bg-[#162136] rounded-full h-3 overflow-hidden border border-[#233554]">
                        <div
                          className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              stats.totalIncome > 0
                                ? (stats.dineInRevenue / stats.totalIncome) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                          Parcel Takeaway (పార్సల్):
                        </span>
                        <span className="text-orange-400">
                          ₹{stats.parcelRevenue} ({stats.parcelPlates} plates)
                        </span>
                      </div>
                      <div className="w-full bg-[#162136] rounded-full h-3 overflow-hidden border border-[#233554]">
                        <div
                          className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              stats.totalIncome > 0
                                ? (stats.parcelRevenue / stats.totalIncome) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category Revenue Breakdown */}
                <div className="bg-[#090D17] rounded-2xl p-5 border border-[#202E4A]">
                  <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <span className="text-emerald-400">🏷️</span>
                    <span>Category Breakdown / వర్గాల వారీగా</span>
                  </h3>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {Object.entries(stats.categorySales).map(([cat, data]) => (
                      <div
                        key={cat}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#121A2B] border border-[#202E4A] text-xs"
                      >
                        <span className="font-bold text-white">{cat}</span>
                        <div className="text-right">
                          <span className="font-black text-amber-400 block">
                            ₹{data.revenue}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-semibold">
                            {data.plates} plates
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ITEM-WISE PLATES & SALES */}
          {activeTab === 'items' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">
                  All Items Sold Ranked by Plates & Revenue
                </h3>
                <span className="text-xs text-amber-400 font-semibold">
                  Sorted by highest plate quantity
                </span>
              </div>

              {Object.keys(stats.itemSales).length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <span className="text-4xl block mb-2">🍽️</span>
                  <p className="text-sm font-bold text-white">No items sold yet in this period</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-[#202E4A] rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#090D17] text-slate-400 font-bold border-b border-[#202E4A]">
                      <tr>
                        <th className="p-3 w-12 text-center">#</th>
                        <th className="p-3">Item</th>
                        <th className="p-3">Category</th>
                        <th className="p-3 text-right">Plates Sold</th>
                        <th className="p-3 text-right">Revenue</th>
                        <th className="p-3 text-right">% of Sales</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1A263D] font-medium">
                      {Object.entries(stats.itemSales)
                        .sort(([, a], [, b]) => b.quantity - a.quantity)
                        .map(([key, item], idx) => {
                          const percent =
                            stats.totalIncome > 0
                              ? ((item.revenue / stats.totalIncome) * 100).toFixed(1)
                              : 0;
                          return (
                            <tr key={key} className="hover:bg-[#162136] transition-colors">
                              <td className="p-3 text-center text-slate-500 font-bold">
                                {idx + 1}
                              </td>
                              <td className="p-3">
                                <div className="font-bold text-white text-sm">
                                  {item.nameEn || item.name}
                                </div>
                                <div className="text-[11px] text-amber-300">
                                  {item.name} {item.isHalf && `(${item.halfLabel || 'Half Plate'})`}
                                </div>
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded bg-[#162136] text-[10px] font-semibold text-slate-300 border border-[#233554]">
                                  {item.category}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <span className="font-black text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-400/20 px-2.5 py-1 rounded-lg">
                                  {item.quantity} plates
                                </span>
                              </td>
                              <td className="p-3 text-right font-black text-amber-400 text-sm">
                                ₹{item.revenue}
                              </td>
                              <td className="p-3 text-right text-slate-400 font-semibold">
                                {percent}%
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CASHIERS PERFORMANCE BREAKDOWN */}
          {activeTab === 'cashiers' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">
                Staff & Cashier Breakdown / క్యాషియర్ల వివరాలు
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(stats.cashierSales).map(([cashierName, data]) => (
                  <div
                    key={cashierName}
                    className="p-5 bg-[#090D17] border border-[#233554] rounded-2xl space-y-3 shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center text-xl font-bold">
                        🧑‍💼
                      </div>
                      <div>
                        <h4 className="font-black text-white text-sm">
                          {cashierName}
                        </h4>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">
                          Billing Terminal Staff
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-[#202E4A] text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Total Bills Handled:</span>
                        <span className="font-bold text-white">{data.bills} bills</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Total Plates Served:</span>
                        <span className="font-black text-emerald-400">{data.plates} plates</span>
                      </div>
                      <div className="flex justify-between text-white font-black pt-1.5 border-t border-dashed border-[#202E4A]">
                        <span>Total Cash Collected:</span>
                        <span className="text-amber-400 text-base font-black">
                          ₹{data.revenue.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BILLING HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">
                  Order & Receipt Records
                </h3>
                <span className="text-xs text-slate-400">
                  Showing {filteredBills.length} bills
                </span>
              </div>

              {filteredBills.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <span className="text-4xl block mb-2">📜</span>
                  <p className="text-sm font-bold text-white">No orders found in this period</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-[#202E4A] rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#090D17] text-slate-400 font-bold border-b border-[#202E4A]">
                      <tr>
                        <th className="p-3">Bill #</th>
                        <th className="p-3">Token</th>
                        <th className="p-3">Time</th>
                        <th className="p-3">Cashier</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3">Items Summary</th>
                        <th className="p-3 text-right">Plates</th>
                        <th className="p-3 text-right">Amount</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1A263D] font-medium">
                      {filteredBills.map((bill) => (
                        <tr key={bill.billNumber} className="hover:bg-[#162136] transition-colors">
                          <td className="p-3 font-black text-amber-400">
                            #{bill.billNumber}
                          </td>
                          <td className="p-3">
                            <span className="font-bold px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20 text-[11px]">
                              #T-{bill.tokenNumber || ((bill.billNumber - 1) % 100) + 1}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400 whitespace-nowrap">
                            {new Date(bill.date).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="p-3 font-semibold text-slate-300">
                            {bill.cashier || 'Cashier'}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                bill.orderType === 'dine-in'
                                  ? 'bg-blue-400/20 text-blue-400 border border-blue-400/30'
                                  : 'bg-orange-400/20 text-orange-400 border border-orange-400/30'
                              }`}
                            >
                              {bill.orderType === 'dine-in' ? '🍽️ Dine-in' : '📦 Parcel'}
                            </span>
                          </td>
                          <td className="p-3 uppercase font-bold text-slate-300">
                            {bill.paymentMethod || 'cash'}
                          </td>
                          <td className="p-3 text-slate-300 max-w-xs truncate">
                            {bill.items
                              .map(
                                (i) => `${i.nameEn || i.name} x${i.quantity}`
                              )
                              .join(', ')}
                          </td>
                          <td className="p-3 text-right font-black text-emerald-400">
                            {bill.totalPlates}
                          </td>
                          <td className="p-3 text-right font-black text-white text-sm">
                            ₹{bill.total}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => setReprintOrder(bill)}
                              className="px-2.5 py-1 bg-[#141E32] hover:bg-amber-400/20 hover:text-amber-400 text-slate-300 font-bold rounded-lg text-[11px] border border-[#2B3C5E] transition-all cursor-pointer"
                            >
                              🖨️ Re-Print
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: GITHUB & CLOUD DEPLOYMENT */}
          {activeTab === 'github' && (
            <div className="space-y-6">
              <div className="p-6 bg-[#090D17] rounded-2xl border border-cyan-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-2xl">
                      🐙
                    </div>
                    <div>
                      <h3 className="font-black text-white text-base">
                        GitHub Repository & Cloud Sync
                      </h3>
                      <p className="text-xs text-slate-400">
                        Git Repository initialized on <span className="text-cyan-400 font-mono">main</span> branch
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    🟢 Git Initialized
                  </span>
                </div>

                <div className="p-4 bg-[#121A2B] rounded-xl border border-[#202E4A] space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-300">Configured Git Remote URL:</span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          'https://github.com/govardhanreddy9137-sys/tiffin-billing-system.git',
                          'remote'
                        )
                      }
                      className="text-cyan-400 hover:underline font-mono"
                    >
                      {copiedCmd === 'remote' ? '✅ Copied!' : '📋 Copy URL'}
                    </button>
                  </div>
                  <div className="p-2.5 bg-[#060A12] rounded-lg font-mono text-xs text-amber-300 border border-[#1A263D] break-all">
                    https://github.com/govardhanreddy9137-sys/tiffin-billing-system.git
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
                    Quick Commands to Push to GitHub:
                  </h4>

                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-[#121A2B] rounded-xl border border-[#202E4A]">
                      <span className="text-slate-200">
                        git remote add origin https://github.com/govardhanreddy9137-sys/tiffin-billing-system.git
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            'git remote add origin https://github.com/govardhanreddy9137-sys/tiffin-billing-system.git',
                            'cmd1'
                          )
                        }
                        className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg text-[11px] font-bold"
                      >
                        {copiedCmd === 'cmd1' ? 'Copied' : 'Copy'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-[#121A2B] rounded-xl border border-[#202E4A]">
                      <span className="text-slate-200">
                        git push -u origin main
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard('git push -u origin main', 'cmd2')
                        }
                        className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg text-[11px] font-bold"
                      >
                        {copiedCmd === 'cmd2' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-cyan-500/5 rounded-xl border border-cyan-500/20 text-xs text-slate-300 space-y-1.5">
                  <div className="font-bold text-cyan-300">💡 Free 1-Click Hosting:</div>
                  <p>
                    Once pushed to GitHub, you can connect this repo to{' '}
                    <strong className="text-white">Vercel</strong> or{' '}
                    <strong className="text-white">Netlify</strong> for instant global HTTPS deployment so staff can access the billing system from any tablet, mobile, or counter PC!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Re-Print Bill Modal if clicked */}
      {reprintOrder && (
        <Receipt
          order={reprintOrder}
          onClose={() => setReprintOrder(null)}
          onPrint={handlePrintReceipt}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
