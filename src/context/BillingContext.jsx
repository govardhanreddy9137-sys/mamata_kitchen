import { createContext, useContext, useState, useEffect } from 'react';
import { initialMenuItems, hotelInfo } from '../data/initialMenu';

const BillingContext = createContext();

export const useBilling = () => {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error('useBilling must be used within BillingProvider');
  }
  return context;
};

const MENU_VERSION = 'v5_dosa_no_half_premium';

// Seed sample sales if fresh
const getInitialSalesHistory = () => {
  const saved = localStorage.getItem('salesHistory');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback
    }
  }

  const now = new Date();
  const makeTime = (hoursAgo, minsAgo = 0) => {
    const d = new Date(now.getTime() - (hoursAgo * 60 + minsAgo) * 60 * 1000);
    return d.toISOString();
  };

  return [
    {
      billNumber: 101,
      tokenNumber: 1,
      orderType: 'dine-in',
      paymentMethod: 'cash',
      cashier: 'Cashier 1',
      cashierUsername: 'cashier1',
      items: [
        { id: 1, name: 'ఇడ్లీ', nameEn: 'Idli', price: 30, unitPrice: 30, quantity: 2, isHalf: false },
        { id: 7, name: 'మసాలా దోశ', nameEn: 'Masala Dosa', price: 60, unitPrice: 60, quantity: 2, isHalf: false },
        { id: 39, name: 'చాయ్', nameEn: 'Tea', price: 15, unitPrice: 15, quantity: 2, isHalf: false },
      ],
      subtotal: 210,
      discount: 0,
      total: 210,
      totalPlates: 6,
      date: makeTime(3, 20),
      hotelInfo,
    },
    {
      billNumber: 102,
      tokenNumber: 2,
      orderType: 'parcel',
      paymentMethod: 'upi',
      cashier: 'Cashier 2',
      cashierUsername: 'cashier2',
      items: [
        { id: 27, name: 'పూరి', nameEn: 'Poori', price: 70, unitPrice: 70, quantity: 2, isHalf: false },
        { id: 30, name: 'పరోటా', nameEn: 'Parotta', price: 70, unitPrice: 70, quantity: 3, isHalf: false },
      ],
      subtotal: 350,
      discount: 0,
      total: 350,
      totalPlates: 5,
      date: makeTime(2, 45),
      hotelInfo,
    },
    {
      billNumber: 103,
      tokenNumber: 3,
      orderType: 'dine-in',
      paymentMethod: 'cash',
      cashier: 'Cashier 1',
      cashierUsername: 'cashier1',
      items: [
        { id: 27, name: 'పూరి', nameEn: 'Poori', price: 70, unitPrice: 40, quantity: 2, isHalf: true, halfLabel: 'Half Plate' },
        { id: 1, name: 'ఇడ్లీ', nameEn: 'Idli', price: 30, unitPrice: 15, quantity: 2, isHalf: true, halfLabel: '1 Idli' },
        { id: 40, name: 'కాఫీ', nameEn: 'Coffee', price: 20, unitPrice: 20, quantity: 2, isHalf: false },
      ],
      subtotal: 150,
      discount: 0,
      total: 150,
      totalPlates: 6,
      date: makeTime(1, 10),
      hotelInfo,
    },
  ];
};

export const BillingProvider = ({ children }) => {
  // Menu Items - automatic sync with initialMenu on version update
  // Guarantees Dosa items NEVER have halfPrice
  const [menuItems, setMenuItems] = useState(() => {
    const savedVersion = localStorage.getItem('menuVersion');
    if (savedVersion !== MENU_VERSION) {
      localStorage.setItem('menuVersion', MENU_VERSION);
      localStorage.setItem('menuItems', JSON.stringify(initialMenuItems));
      return initialMenuItems;
    }
    const saved = localStorage.getItem('menuItems');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((item) =>
          item.category === 'Dosa'
            ? { ...item, halfPrice: null, halfLabel: null }
            : item
        );
      } catch {
        return initialMenuItems;
      }
    }
    return initialMenuItems;
  });

  // Current Order in Cart
  const [currentOrder, setCurrentOrder] = useState([]);
  const [orderType, setOrderType] = useState('dine-in'); // 'dine-in' or 'parcel'
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' | 'upi' | 'card'

  // Sales History
  const [salesHistory, setSalesHistory] = useState(() => {
    return getInitialSalesHistory();
  });

  // Bill Number
  const [billNumber, setBillNumber] = useState(() => {
    const saved = localStorage.getItem('billNumber');
    return saved ? parseInt(saved) : 104;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('salesHistory', JSON.stringify(salesHistory));
  }, [salesHistory]);

  useEffect(() => {
    localStorage.setItem('billNumber', billNumber.toString());
  }, [billNumber]);

  // Menu Management Functions
  const addMenuItem = (item) => {
    const isDosa = item.category === 'Dosa';
    const newItem = {
      ...item,
      halfPrice: isDosa ? null : item.halfPrice,
      halfLabel: isDosa ? null : item.halfLabel,
      id: Date.now(),
    };
    setMenuItems((prev) => [newItem, ...prev]);
    return newItem;
  };

  const updateMenuItem = (id, updatedItem) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const merged = { ...item, ...updatedItem };
        if (merged.category === 'Dosa') {
          merged.halfPrice = null;
          merged.halfLabel = null;
        }
        return merged;
      })
    );
  };

  const deleteMenuItem = (id) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const resetMenuToDefault = () => {
    setMenuItems(initialMenuItems);
    localStorage.setItem('menuVersion', MENU_VERSION);
    localStorage.setItem('menuItems', JSON.stringify(initialMenuItems));
  };

  // Order Management Functions
  const addToOrder = (item, quantity = 1, isHalf = false) => {
    // Strictly prevent half plate for Dosa
    const actualHalf = item.category === 'Dosa' ? false : isHalf;
    const price = actualHalf && item.halfPrice ? item.halfPrice : item.price;
    const halfLabel = actualHalf ? (item.halfLabel || 'Half') : 'Full';

    setCurrentOrder((prev) => {
      const existingItem = prev.find(
        (orderItem) => orderItem.id === item.id && orderItem.isHalf === actualHalf
      );

      if (existingItem) {
        return prev.map((orderItem) =>
          orderItem.id === item.id && orderItem.isHalf === actualHalf
            ? { ...orderItem, quantity: orderItem.quantity + quantity }
            : orderItem
        );
      } else {
        return [
          ...prev,
          {
            ...item,
            quantity,
            isHalf: actualHalf,
            halfLabel,
            unitPrice: price,
          },
        ];
      }
    });
  };

  const updateOrderQuantity = (itemId, quantity, isHalf = false) => {
    if (quantity <= 0) {
      removeFromOrder(itemId, isHalf);
      return;
    }
    setCurrentOrder((prev) =>
      prev.map((orderItem) =>
        orderItem.id === itemId && orderItem.isHalf === isHalf
          ? { ...orderItem, quantity }
          : orderItem
      )
    );
  };

  const removeFromOrder = (itemId, isHalf = false) => {
    setCurrentOrder((prev) =>
      prev.filter(
        (orderItem) => !(orderItem.id === itemId && orderItem.isHalf === isHalf)
      )
    );
  };

  const clearOrder = () => {
    setCurrentOrder([]);
  };

  // Calculate Order Totals
  const getOrderTotal = (discountAmount = 0) => {
    const subtotal = currentOrder.reduce((total, item) => {
      return total + item.unitPrice * item.quantity;
    }, 0);
    return Math.max(0, subtotal - discountAmount);
  };

  const getOrderSubtotal = () => {
    return currentOrder.reduce((total, item) => {
      return total + item.unitPrice * item.quantity;
    }, 0);
  };

  const getTotalPlates = () => {
    return currentOrder.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  };

  // Complete Order with Token Number & Payment Details
  const completeOrder = (cashierUser, extraDetails = {}) => {
    if (currentOrder.length === 0) return null;

    const subtotal = getOrderSubtotal();
    const discount = extraDetails.discount || 0;
    const finalTotal = Math.max(0, subtotal - discount);
    const tokenNumber = ((billNumber - 1) % 100) + 1; // Sequential 1-100 token

    const order = {
      billNumber,
      tokenNumber,
      orderType,
      paymentMethod: extraDetails.paymentMethod || paymentMethod || 'cash',
      receivedAmount: extraDetails.receivedAmount || finalTotal,
      changeDue: extraDetails.changeDue || 0,
      notes: extraDetails.notes || '',
      cashier: cashierUser?.name || 'Counter Staff',
      cashierUsername: cashierUser?.username || 'cashier',
      items: [...currentOrder],
      subtotal,
      discount,
      total: finalTotal,
      totalPlates: getTotalPlates(),
      date: new Date().toISOString(),
      hotelInfo,
    };

    setSalesHistory((prev) => [order, ...prev]);
    setBillNumber((prev) => prev + 1);
    clearOrder();

    return order;
  };

  // Get Today's Sales
  const getTodaySales = () => {
    const today = new Date().toDateString();
    return salesHistory.filter(
      (sale) => new Date(sale.date).toDateString() === today
    );
  };

  // Get Comprehensive Sales & Revenue Statistics
  const getSalesStats = (timeframe = 'today') => {
    const records =
      timeframe === 'today'
        ? getTodaySales()
        : salesHistory;

    const totalIncome = records.reduce((sum, sale) => sum + (sale.total || 0), 0);
    const totalPlates = records.reduce((sum, sale) => sum + (sale.totalPlates || 0), 0);
    const totalBills = records.length;
    const averageBill = totalBills > 0 ? totalIncome / totalBills : 0;

    const dineInOrders = records.filter((sale) => sale.orderType === 'dine-in');
    const parcelOrders = records.filter((sale) => sale.orderType === 'parcel');

    const dineInRevenue = dineInOrders.reduce((sum, sale) => sum + (sale.total || 0), 0);
    const parcelRevenue = parcelOrders.reduce((sum, sale) => sum + (sale.total || 0), 0);

    const dineInPlates = dineInOrders.reduce((sum, sale) => sum + (sale.totalPlates || 0), 0);
    const parcelPlates = parcelOrders.reduce((sum, sale) => sum + (sale.totalPlates || 0), 0);

    // Payment breakdown
    const paymentBreakdown = { cash: 0, upi: 0, card: 0 };
    records.forEach((s) => {
      const pm = s.paymentMethod || 'cash';
      paymentBreakdown[pm] = (paymentBreakdown[pm] || 0) + (s.total || 0);
    });

    // Item-wise sales breakdown with plate count & revenue
    const itemSales = {};
    const categorySales = {};
    const cashierSales = {};

    records.forEach((sale) => {
      // Cashier breakdown
      const cName = sale.cashier || 'Counter Cashier';
      if (!cashierSales[cName]) {
        cashierSales[cName] = { bills: 0, plates: 0, revenue: 0 };
      }
      cashierSales[cName].bills += 1;
      cashierSales[cName].plates += sale.totalPlates || 0;
      cashierSales[cName].revenue += sale.total || 0;

      // Item breakdown
      sale.items.forEach((item) => {
        const itemKey = `${item.nameEn || item.name} (${item.isHalf ? (item.halfLabel || 'Half') : 'Full'})`;
        if (!itemSales[itemKey]) {
          itemSales[itemKey] = {
            name: item.name,
            nameEn: item.nameEn,
            category: item.category || 'Other',
            isHalf: item.isHalf,
            halfLabel: item.halfLabel,
            quantity: 0,
            revenue: 0,
            unitPrice: item.unitPrice,
          };
        }
        itemSales[itemKey].quantity += item.quantity;
        itemSales[itemKey].revenue += item.unitPrice * item.quantity;

        // Category breakdown
        const cat = item.category || 'Other';
        if (!categorySales[cat]) {
          categorySales[cat] = { plates: 0, revenue: 0 };
        }
        categorySales[cat].plates += item.quantity;
        categorySales[cat].revenue += item.unitPrice * item.quantity;
      });
    });

    return {
      totalIncome,
      totalPlates,
      totalBills,
      averageBill,
      dineInRevenue,
      parcelRevenue,
      dineInPlates,
      parcelPlates,
      dineInCount: dineInOrders.length,
      parcelCount: parcelOrders.length,
      paymentBreakdown,
      itemSales,
      categorySales,
      cashierSales,
    };
  };

  // Clear sales history
  const clearSalesHistory = () => {
    setSalesHistory([]);
    localStorage.removeItem('salesHistory');
  };

  // Export Sales to CSV
  const exportSalesToCSV = () => {
    const todaySales = getTodaySales();
    const headers = [
      'Bill Number',
      'Token Number',
      'Date & Time',
      'Cashier',
      'Order Type',
      'Payment Method',
      'Items',
      'Total Plates',
      'Subtotal',
      'Discount',
      'Total Amount (INR)',
    ];

    const rows = todaySales.map((sale) => {
      const itemsStr = sale.items
        .map(
          (item) =>
            `${item.nameEn || item.name} x${item.quantity} (${
              item.isHalf ? (item.halfLabel || 'Half') : 'Full'
            })`
        )
        .join('; ');
      return [
        sale.billNumber,
        sale.tokenNumber || `#T-${sale.billNumber % 100 || 100}`,
        `"${new Date(sale.date).toLocaleString('en-IN')}"`,
        `"${sale.cashier || 'Cashier'}"`,
        sale.orderType,
        sale.paymentMethod || 'cash',
        `"${itemsStr}"`,
        sale.totalPlates,
        sale.subtotal || sale.total,
        sale.discount || 0,
        sale.total,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `mamata_sales_report_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <BillingContext.Provider
      value={{
        menuItems,
        currentOrder,
        orderType,
        paymentMethod,
        billNumber,
        salesHistory,
        setOrderType,
        setPaymentMethod,
        addToOrder,
        updateOrderQuantity,
        removeFromOrder,
        clearOrder,
        getOrderTotal,
        getOrderSubtotal,
        getTotalPlates,
        completeOrder,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        resetMenuToDefault,
        getTodaySales,
        getSalesStats,
        clearSalesHistory,
        exportSalesToCSV,
      }}
    >
      {children}
    </BillingContext.Provider>
  );
};
