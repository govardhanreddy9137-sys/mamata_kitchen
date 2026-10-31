// 100% Pure Vegetarian Menu for Mamata Tiffin Center
export const initialMenuItems = [
  // Idli
  { id: 1, category: 'Idli', nameEn: 'Idli', name: 'ఇడ్లీ', price: 30, halfPrice: 15, halfLabel: '1 Idli' },
  { id: 3, category: 'Idli', nameEn: 'Karam Idli', name: 'కారం ఇడ్లీ', price: 50, halfPrice: 30, halfLabel: 'Half' },
  { id: 4, category: 'Idli', nameEn: 'Sambar Idli', name: 'సాంబార్ ఇడ్లీ', price: 50, halfPrice: 30, halfLabel: 'Half' },
  { id: 5, category: 'Idli', nameEn: 'Tomato Idli', name: 'టమాటో ఇడ్లీ', price: 50, halfPrice: 30, halfLabel: 'Half' },
  { id: 35, category: 'Idli', nameEn: 'Chitti Idli', name: 'చిట్టి నేతి ఇడ్లీ', price: 50, halfPrice: 30, halfLabel: 'Half' },
  
  // Dosa - Full Plate Only (No half plate / సగం ప్లేట్ లేదు)
  { id: 6, category: 'Dosa', nameEn: 'Plain Dosa', name: 'ప్లెయిన్ దోశ', price: 40, halfPrice: null, halfLabel: null },
  { id: 7, category: 'Dosa', nameEn: 'Masala Dosa', name: 'మసాలా దోశ', price: 60, halfPrice: null, halfLabel: null },
  { id: 9, category: 'Dosa', nameEn: 'Paneer Dosa', name: 'పనీర్ దోశ', price: 70, halfPrice: null, halfLabel: null },
  { id: 10, category: 'Dosa', nameEn: 'Palav Dosa', name: 'పలావ్ దోశ', price: 60, halfPrice: null, halfLabel: null },
  { id: 11, category: 'Dosa', nameEn: 'Rava Dosa', name: 'రవ్వ దోశ', price: 50, halfPrice: null, halfLabel: null },
  { id: 12, category: 'Dosa', nameEn: 'Set Dosa', name: 'సెట్ దోశ', price: 50, halfPrice: null, halfLabel: null },
  { id: 13, category: 'Dosa', nameEn: 'Garlic Dosa', name: 'గార్లిక్ దోశ', price: 60, halfPrice: null, halfLabel: null },
  { id: 14, category: 'Dosa', nameEn: 'Onion Dosa', name: 'ఓనియన్ దోశ', price: 60, halfPrice: null, halfLabel: null },
  { id: 15, category: 'Dosa', nameEn: 'Cheese Dosa', name: 'చీజ్ దోశ', price: 80, halfPrice: null, halfLabel: null },
  { id: 16, category: 'Dosa', nameEn: 'Butter Dosa', name: 'బటర్ దోశ', price: 50, halfPrice: null, halfLabel: null },
  { id: 18, category: 'Dosa', nameEn: 'Paneer Masala Dosa', name: 'పనీర్ మసాలా దోశ', price: 80, halfPrice: null, halfLabel: null },
  { id: 19, category: 'Dosa', nameEn: 'Garlic Masala Dosa', name: 'గార్లిక్ మసాలా దోశ', price: 70, halfPrice: null, halfLabel: null },
  { id: 20, category: 'Dosa', nameEn: 'Onion Masala Dosa', name: 'ఓనియన్ మసాలా దోశ', price: 70, halfPrice: null, halfLabel: null },
  { id: 21, category: 'Dosa', nameEn: 'Cheese Masala Dosa', name: 'చీజ్ మసాలా దోశ', price: 90, halfPrice: null, halfLabel: null },
  { id: 22, category: 'Dosa', nameEn: 'Butter Masala Dosa', name: 'బటర్ మసాలా దోశ', price: 70, halfPrice: null, halfLabel: null },
  
  // Vada
  { id: 23, category: 'Vada', nameEn: 'Medu Vada', name: 'మెడు వడ', price: 40, halfPrice: 20, halfLabel: '1 Vada' },
  { id: 25, category: 'Vada', nameEn: 'Sambar Vada', name: 'సాంబార్ వడ', price: 50, halfPrice: 30, halfLabel: 'Half' },
  { id: 26, category: 'Vada', nameEn: 'Dahi Vada', name: 'దహి వడ', price: 60, halfPrice: 35, halfLabel: 'Half' },
  
  // Poori
  { id: 27, category: 'Poori', nameEn: 'Poori', name: 'పూరి', price: 70, halfPrice: 40, halfLabel: 'Half Plate' },
  { id: 28, category: 'Poori', nameEn: 'Single Poori', name: 'సింగిల్ పూరి', price: 40, halfPrice: null, halfLabel: null },
  
  // Parotta
  { id: 29, category: 'Parotta', nameEn: 'Chapati', name: 'చపాతీ', price: 70, halfPrice: 40, halfLabel: 'Single' },
  { id: 30, category: 'Parotta', nameEn: 'Parotta', name: 'పరోటా', price: 70, halfPrice: 40, halfLabel: 'Single' },
  { id: 31, category: 'Parotta', nameEn: 'Paneer Parotta', name: 'పనీర్ పరోటా', price: 90, halfPrice: 50, halfLabel: 'Half' },
  { id: 32, category: 'Parotta', nameEn: 'Kothu Parotta', name: 'కొత్తు పరోటా', price: 90, halfPrice: 50, halfLabel: 'Half' },
  { id: 33, category: 'Parotta', nameEn: 'Pudina Parotta', name: 'పుదీనా పరోటా', price: 90, halfPrice: 50, halfLabel: 'Half' },
  { id: 34, category: 'Parotta', nameEn: 'Ghee Parotta', name: 'నెయ్యి పరోటా', price: 90, halfPrice: 50, halfLabel: 'Half' },
  
  // Snacks & Bajji
  { id: 36, category: 'Snacks & Bajji', nameEn: 'Punugulu', name: 'పునుగులు', price: 50, halfPrice: 30, halfLabel: 'Half' },
  { id: 37, category: 'Snacks & Bajji', nameEn: 'Mirchi Bajji', name: 'మిర్చి బజ్జీ', price: 50, halfPrice: 30, halfLabel: 'Half' },
  { id: 38, category: 'Snacks & Bajji', nameEn: 'Pakoda', name: 'పకోడా', price: 50, halfPrice: 30, halfLabel: 'Half' },
  
  // Beverages
  { id: 39, category: 'Beverages', nameEn: 'Tea', name: 'చాయ్', price: 15, halfPrice: null, halfLabel: null },
  { id: 40, category: 'Beverages', nameEn: 'Coffee', name: 'కాఫీ', price: 20, halfPrice: null, halfLabel: null },
  { id: 41, category: 'Beverages', nameEn: 'Milk', name: 'మిల్క్', price: 15, halfPrice: null, halfLabel: null },
];

export const categories = [
  'Idli',
  'Dosa',
  'Vada',
  'Poori',
  'Parotta',
  'Snacks & Bajji',
  'Beverages',
];

export const hotelInfo = {
  name: 'మమత టిఫిన్ సెంటర్',
  nameEn: 'Mamata Tiffin Center (Pure Veg)',
  phone: '+91 98765 43210',
  address: 'హైదరాబాద్, తెలంగాణా',
  addressEn: 'Hyderabad, Telangana',
  gstin: '36AABCU9603R1ZM',
  upiId: 'mamata.tiffins@okhdfcbank',
};
