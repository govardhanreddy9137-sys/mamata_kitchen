import { useState, useMemo } from 'react';
import { useBilling } from '../context/BillingContext';
import { categories as defaultCategories } from '../data/initialMenu';
import { playTapSound, playSuccessChime, playRemoveSound } from '../utils/audio';

const CATEGORY_COLORS = {
  Idli: 'bg-cyan-500/15 text-cyan-400 border-cyan-400/30',
  Dosa: 'bg-amber-500/15 text-amber-400 border-amber-400/30',
  Vada: 'bg-purple-500/15 text-purple-400 border-purple-400/30',
  Poori: 'bg-rose-500/15 text-rose-400 border-rose-400/30',
  Parotta: 'bg-emerald-500/15 text-emerald-400 border-emerald-400/30',
  'Snacks & Bajji': 'bg-red-500/15 text-red-400 border-red-400/30',
  Beverages: 'bg-teal-500/15 text-teal-400 border-teal-400/30',
};

const MenuManagement = () => {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, resetMenuToDefault } =
    useBilling();

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState('');
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

  const [formData, setFormData] = useState({
    category: 'Idli',
    name: '',
    nameEn: '',
    price: '',
    halfPrice: '',
    halfLabel: 'Half',
  });

  const categories = useMemo(() => {
    const fromItems = Array.from(new Set(menuItems.map((item) => item.category)));
    return ['All', ...Array.from(new Set([...defaultCategories, ...fromItems]))];
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCat =
        selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name?.toLowerCase().includes(q) ||
        item.nameEn?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleOpenAdd = () => {
    playTapSound();
    setEditingItem(null);
    setFormData({
      category: 'Dosa',
      name: '',
      nameEn: '',
      price: '',
      halfPrice: '',
      halfLabel: 'Half',
    });
    setShowFormModal(true);
  };

  const handleOpenEdit = (item) => {
    playTapSound();
    setEditingItem(item);
    setFormData({
      category: item.category,
      name: item.name,
      nameEn: item.nameEn,
      price: item.price.toString(),
      halfPrice: item.category === 'Dosa' ? '' : (item.halfPrice ? item.halfPrice.toString() : ''),
      halfLabel: item.halfLabel || 'Half',
    });
    setShowFormModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.nameEn.trim() || !formData.price) {
      alert('Please fill in required fields: English Name, Telugu Name, and Full Price');
      return;
    }

    const isDosa = formData.category === 'Dosa';

    const itemData = {
      category: formData.category,
      name: formData.name.trim(),
      nameEn: formData.nameEn.trim(),
      price: parseFloat(formData.price),
      halfPrice: isDosa ? null : (formData.halfPrice ? parseFloat(formData.halfPrice) : null),
      halfLabel: isDosa ? null : (formData.halfLabel?.trim() || 'Half'),
    };

    if (editingItem) {
      updateMenuItem(editingItem.id, itemData);
      playSuccessChime();
      showToast(`Updated "${itemData.nameEn}" successfully!`);
    } else {
      addMenuItem(itemData);
      playSuccessChime();
      showToast(`Added "${itemData.nameEn}" to menu!`);
    }

    setShowFormModal(false);
  };

  const executeDelete = (id, itemName) => {
    playRemoveSound();
    deleteMenuItem(id);
    setDeleteConfirmationId(null);
    showToast(`🗑️ "${itemName}" removed from menu!`);
  };

  const handleResetToDefault = () => {
    if (
      window.confirm(
        'Reset all menu items to official Mamata Tiffin Center defaults? / అసలు మెనూను రీసెట్ చేయాలా?'
      )
    ) {
      playSuccessChime();
      resetMenuToDefault();
      showToast('Menu reset to official defaults (Dosa has no half plate)');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#162034] text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-400/40 flex items-center gap-2 animate-in fade-in slide-in-from-bottom duration-200">
          <span className="text-emerald-400 text-lg">✅</span>
          <span className="text-sm font-bold text-amber-300">{notification}</span>
        </div>
      )}

      {/* Header and Controls */}
      <div className="bg-[#121A2B] rounded-3xl shadow-xl border border-[#202E4A] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white">
              📋 Menu Management / మెనూ నిర్వహణ
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-400/10 text-amber-400 border border-amber-400/30">
              {menuItems.length} Pure Veg Items
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure items and pricing. Dosa items are configured as Full Plate only.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>➕</span>
            <span>Add Item / వస్తువు చేర్చు</span>
          </button>

          <button
            onClick={handleResetToDefault}
            className="px-3.5 py-2.5 bg-[#172237] hover:bg-[#202E4A] text-slate-300 hover:text-white rounded-xl text-xs font-bold border border-[#2B3C5E] transition-all cursor-pointer"
            title="Reset menu to default"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="bg-[#121A2B] rounded-3xl shadow-xl border border-[#202E4A] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2">
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
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 border-amber-400 shadow-md shadow-orange-500/20'
                      : `${colorClass} hover:brightness-125`
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#090D17] text-white border border-[#233554] rounded-xl focus:outline-none focus:border-amber-400 placeholder-slate-500"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              🔍
            </span>
          </div>
        </div>

        {/* Menu Items Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#202E4A]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090D17] text-slate-400 font-bold uppercase tracking-wider border-b border-[#202E4A]">
              <tr>
                <th className="py-3 px-4">Item Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Full Plate Price</th>
                <th className="py-3 px-4">Half Plate Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A263D] text-slate-300">
              {filteredItems.map((item) => {
                const isDosa = item.category === 'Dosa';
                return (
                  <tr key={item.id} className="hover:bg-[#162136] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-black text-white text-sm">
                        {item.nameEn || item.name}
                      </div>
                      <div className="text-xs text-amber-300 font-medium">
                        {item.name}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          CATEGORY_COLORS[item.category] || 'text-slate-400 border-slate-700'
                        }`}
                      >
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-black text-amber-400 text-sm">
                      ₹{item.price}
                    </td>

                    <td className="py-3.5 px-4">
                      {isDosa ? (
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-amber-400/10 text-amber-400 border border-amber-400/20">
                          🚫 No Half Plate (Full Only)
                        </span>
                      ) : item.halfPrice ? (
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-400/30">
                          ₹{item.halfPrice} ({item.halfLabel || 'Half'})
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">
                          Full plate only
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="px-3 py-1.5 bg-[#17233B] hover:bg-amber-500 hover:text-slate-950 text-amber-400 font-bold rounded-lg border border-amber-400/30 transition-all cursor-pointer"
                      >
                        ✏️ Edit
                      </button>

                      {deleteConfirmationId === item.id ? (
                        <span className="inline-flex items-center gap-1">
                          <button
                            onClick={() => executeDelete(item.id, item.nameEn || item.name)}
                            className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg transition-all text-[11px]"
                          >
                            Confirm Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirmationId(null)}
                            className="px-2 py-1.5 bg-slate-700 text-slate-300 rounded-lg text-[11px]"
                          >
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmationId(item.id)}
                          className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold rounded-lg border border-rose-500/30 transition-all cursor-pointer"
                        >
                          🗑️
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#121A2B] rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#2B3E68] animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-[#202E4A] flex justify-between items-center">
              <h3 className="font-black text-white text-base">
                {editingItem ? '✏️ Edit Menu Item' : '➕ Add New Menu Item'}
              </h3>
              <button
                onClick={() => setShowFormModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Category / వర్గం *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    const nextCat = e.target.value;
                    setFormData({
                      ...formData,
                      category: nextCat,
                      halfPrice: nextCat === 'Dosa' ? '' : formData.halfPrice,
                    });
                  }}
                  className="w-full px-4 py-2.5 bg-[#090D17] border border-[#233554] rounded-xl text-white text-sm font-medium focus:outline-none focus:border-amber-400 cursor-pointer"
                  required
                >
                  {defaultCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    1. English Name *
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="e.g. Masala Dosa"
                    className="w-full px-4 py-2.5 bg-[#090D17] border border-[#233554] rounded-xl text-white text-sm font-medium focus:outline-none focus:border-amber-400 placeholder-slate-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    2. Telugu Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. మసాలా దోశ"
                    className="w-full px-4 py-2.5 bg-[#090D17] border border-[#233554] rounded-xl text-white text-sm font-medium focus:outline-none focus:border-amber-400 placeholder-slate-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Full Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="60"
                    className="w-full px-4 py-2.5 bg-[#090D17] border border-[#233554] rounded-xl text-amber-400 font-black text-sm focus:outline-none focus:border-amber-400 placeholder-slate-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Half Price (₹)
                  </label>
                  {formData.category === 'Dosa' ? (
                    <div className="w-full px-3 py-2.5 bg-[#090D17]/50 border border-amber-400/20 rounded-xl text-amber-400/80 text-xs font-semibold flex items-center">
                      🚫 Dosa has no half plate
                    </div>
                  ) : (
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={formData.halfPrice}
                      onChange={(e) => setFormData({ ...formData, halfPrice: e.target.value })}
                      placeholder="Optional"
                      className="w-full px-4 py-2.5 bg-[#090D17] border border-[#233554] rounded-xl text-emerald-400 font-bold text-sm focus:outline-none focus:border-amber-400 placeholder-slate-600"
                    />
                  )}
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="w-1/3 py-3 bg-[#172237] hover:bg-[#202E4A] text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
