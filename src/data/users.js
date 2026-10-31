export const USERS = [
  {
    username: 'chsmreddy',
    password: 'mamata@123',
    role: 'admin',
    name: 'C.H.S.M. Reddy (Admin)',
    teluguName: 'సి.హెచ్.ఎస్.ఎం. రెడ్డి (నిర్వాహకుడు)'
  },
  {
    username: 'cashier1',
    password: 'cash123',
    role: 'cashier',
    name: 'Cashier 1',
    teluguName: 'క్యాషియర్ 1'
  },
  {
    username: 'cashier2',
    password: 'cash2@123',
    role: 'cashier',
    name: 'Cashier 2',
    teluguName: 'క్యాషియర్ 2'
  }
];

export const authenticateUser = (username, password) => {
  return USERS.find(
    (u) => u.username.trim() === username.trim() && u.password === password
  ) || null;
};
