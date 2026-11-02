# Mamata Tiffin Center (మమత టిఫిన్ సెంటర్)
### Enterprise Pure Vegetarian Point of Sale & Billing System

A high-performance, luxury Point-of-Sale (POS) and thermal receipt billing application custom built for **Mamata Tiffin Center** (Pure Vegetarian Tiffin Center, Hyderabad, Telangana).

---

## 🌟 Key Features

### 1. 🛡️ Secure Multi-Role Authentication
- Dedicated access levels for **Admin** (`chsmreddy`) and **Billing Cashiers** (`cashier1`, `cashier2`).
- **No displayed passwords or credentials** on public terminal screens for maximum security.
- Caps Lock detector and secure input protection.

### 2. 🥞 Authentic South Indian Veg Menu
- 100% Pure Vegetarian menu with English-first and Telugu-second typography.
- **Dosa Items**: Served exclusively as **Full Plate Only** (no half plates), adhering to authentic South Indian culinary standards.
- **Portion Flexibility**: Multi-portion support for Idli (Full / 1 Idli), Vada (Full / 1 Vada), Poori (Full / Half), and Parotta.

### 3. 🧾 Dual-Theme Thermal Receipt Printer (80mm)
- **Dine-In Orders**: Sleek Sapphire Blue themed receipts.
- **Parcel / Takeaway Orders**: High-visibility Vibrant Orange themed receipts.
- Prominent **Kitchen Token Number** (`#T-01` to `#T-99`) for smooth kitchen line coordination.
- 1-click thermal printing formatted for standard 80mm POS receipt printers.
- Copy receipt text for instant WhatsApp or SMS delivery.

### 4. 💳 Multi-Channel Payment & Tender Calculator
- Supports **Cash 💵**, **UPI / QR 📱** (PhonePe, Google Pay, Paytm), and **Card 💳**.
- Real-time Cash Tender & Change Due calculator for rapid counter transactions.

### 5. 🔊 Interactive POS Sound Engine
- Built using native Web Audio API (zero external assets or latency).
- Tactile feedback on adding items, removing items, and completing orders.
- 1-click sound toggle switch directly in the top navigation bar.

### 6. 📊 Real-Time Analytics & Admin Dashboard
- Total Revenue & Total Plates served tracking.
- Dine-in vs Parcel breakdown.
- Staff & cashier shift performance tracking.
- Item-wise popularity leaderboard.
- 1-click CSV sales report export.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Git](https://git-scm.com/)

### Installation & Local Setup

```bash
# Clone the repository
git clone https://github.com/govardhanreddy9137-sys/mamata-tiffins.git

# Navigate into project directory
cd mamata-tiffins

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 🐙 Connecting to GitHub

To push your local repository to GitHub:

```bash
# Add GitHub Remote
git remote add origin https://github.com/govardhanreddy9137-sys/mamata-tiffins.git

# Rename branch to main (if not already)
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## ☁️ Deployment

This project is fully ready for zero-config 1-click deployment on:
- **Vercel** (`npm run build` -> `dist`)
- **Netlify**
- **GitHub Pages**

---

© Mamata Tiffin Center, Hyderabad. All Rights Reserved.
