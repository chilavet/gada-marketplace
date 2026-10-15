// Authentication and User State Service for Gada Customer Website
// Uses localStorage for persistent session & realistic multi-user management.

const USERS_STORAGE_KEY = 'gada_market_users';
const CURRENT_USER_KEY = 'gada_market_current_user';

// Seed initial demo data if empty
const DEFAULT_DEMO_USERS = [
  {
    id: 'user-demo-1',
    name: 'George Emmanuel',
    email: 'george@gada.ng',
    password: 'password123',
    phone: '+234 803 456 7890',
    avatar: 'GE',
    walletBalance: 25000,
    addresses: [
      {
        id: 'addr-1',
        label: 'Home',
        address: 'No 14, Ring Road, Ibadan, Oyo State',
        isDefault: true,
        landmark: 'Opposite Mobil Station'
      },
      {
        id: 'addr-2',
        label: 'Office',
        address: 'Dugbe Tech Hub, Suite 3B, Commercial Ave, Ibadan',
        isDefault: false,
        landmark: 'Beside First Bank'
      }
    ],
    orders: [
      {
        id: 'GADA-8291',
        date: 'Yesterday, 2:40 PM',
        items: [
          { name: 'Special Chicken Shawarma', quantity: 2, price: 3500 },
          { name: 'Cold Zobo Drink (500ml)', quantity: 2, price: 700 }
        ],
        storeName: 'Chowdeck Kitchen - Bodija',
        storeLocation: 'Bodija Central Hub',
        agentName: 'Agent Tunde',
        riderName: 'Babatunde Ogunlesi',
        total: 8400,
        status: 'Delivered',
        deliveryAddress: 'No 14, Ring Road, Ibadan, Oyo State'
      }
    ],
    transactions: [
      { id: 'tx-101', title: 'Wallet Topup via Flutterwave', date: 'Oct 14, 2026', amount: 30000, type: 'credit' },
      { id: 'tx-102', title: 'Order #GADA-8291 Payment', date: 'Yesterday', amount: 8400, type: 'debit' }
    ]
  }
];

export const authService = {
  // Initialize storage
  init() {
    if (!localStorage.getItem(USERS_STORAGE_KEY)) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_DEMO_USERS));
    }
  },

  getAllUsers() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || DEFAULT_DEMO_USERS;
    } catch {
      return DEFAULT_DEMO_USERS;
    }
  },

  getCurrentUser() {
    this.init();
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  },

  saveCurrentUser(user) {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      // Also update in all users list
      const users = this.getAllUsers();
      const index = users.findIndex(u => u.id === user.id);
      if (index > -1) {
        users[index] = user;
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      }
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  login(email, password) {
    const users = this.getAllUsers();
    const found = users.find(
      u => u.email.trim().toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (!found) {
      throw new Error('Invalid email or password. Please try again or use the demo login.');
    }

    this.saveCurrentUser(found);
    return found;
  },

  demoLogin() {
    const users = this.getAllUsers();
    const demo = users[0] || DEFAULT_DEMO_USERS[0];
    this.saveCurrentUser(demo);
    return demo;
  },

  register({ name, email, phone, password, address }) {
    const users = this.getAllUsers();
    const normalizedEmail = email.trim().toLowerCase();

    if (users.some(u => u.email.trim().toLowerCase() === normalizedEmail)) {
      throw new Error('An account with this email already exists. Please log in.');
    }

    const initials = name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0].toUpperCase())
      .join('') || 'CU';

    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password,
      phone: phone.trim() || '+234 800 000 0000',
      avatar: initials,
      walletBalance: 15000, // Welcome bonus promo
      addresses: address ? [
        {
          id: `addr-${Date.now()}`,
          label: 'Default Address',
          address: address.trim(),
          isDefault: true,
          landmark: ''
        }
      ] : [],
      orders: [],
      transactions: [
        {
          id: `tx-welcome-${Date.now()}`,
          title: 'Welcome Promotional Credit',
          date: 'Just Now',
          amount: 15000,
          type: 'credit'
        }
      ]
    };

    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    this.saveCurrentUser(newUser);
    return newUser;
  },

  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  updateProfile(updates) {
    const current = this.getCurrentUser();
    if (!current) return null;

    const updated = { ...current, ...updates };
    this.saveCurrentUser(updated);
    return updated;
  },

  addAddress(addressObj) {
    const current = this.getCurrentUser();
    if (!current) return null;

    const newAddr = {
      id: `addr-${Date.now()}`,
      label: addressObj.label || 'Home',
      address: addressObj.address,
      landmark: addressObj.landmark || '',
      isDefault: current.addresses.length === 0 || addressObj.isDefault
    };

    let updatedAddresses = [...(current.addresses || [])];
    if (newAddr.isDefault) {
      updatedAddresses = updatedAddresses.map(a => ({ ...a, isDefault: false }));
    }
    updatedAddresses.push(newAddr);

    return this.updateProfile({ addresses: updatedAddresses });
  },

  deleteAddress(addressId) {
    const current = this.getCurrentUser();
    if (!current) return null;

    const filtered = (current.addresses || []).filter(a => a.id !== addressId);
    return this.updateProfile({ addresses: filtered });
  },

  setDefaultAddress(addressId) {
    const current = this.getCurrentUser();
    if (!current) return null;

    const updated = (current.addresses || []).map(a => ({
      ...a,
      isDefault: a.id === addressId
    }));
    return this.updateProfile({ addresses: updated });
  },

  addOrder(orderData) {
    const current = this.getCurrentUser();
    if (!current) return null;

    const newOrder = {
      ...orderData,
      id: orderData.id || `GADA-${Math.floor(1000 + Math.random() * 9000)}`,
      date: 'Just Now'
    };

    const updatedOrders = [newOrder, ...(current.orders || [])];
    const updatedTransactions = orderData.paymentMethod === 'wallet' ? [
      {
        id: `tx-${Date.now()}`,
        title: `Order #${newOrder.id} Payment`,
        date: 'Just Now',
        amount: orderData.total,
        type: 'debit'
      },
      ...(current.transactions || [])
    ] : (current.transactions || []);

    const updatedBalance = orderData.paymentMethod === 'wallet'
      ? Math.max(0, current.walletBalance - orderData.total)
      : current.walletBalance;

    return this.updateProfile({
      orders: updatedOrders,
      transactions: updatedTransactions,
      walletBalance: updatedBalance
    });
  },

  topupWallet(amount) {
    const current = this.getCurrentUser();
    if (!current) return null;

    const newBalance = current.walletBalance + amount;
    const newTx = {
      id: `tx-${Date.now()}`,
      title: 'Wallet Topup via Online Card',
      date: 'Just Now',
      amount: amount,
      type: 'credit'
    };

    return this.updateProfile({
      walletBalance: newBalance,
      transactions: [newTx, ...(current.transactions || [])]
    });
  }
};
