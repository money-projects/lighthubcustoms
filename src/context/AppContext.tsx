import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, Address, User, ShippingInfo, VehicleBulbData } from '../types';
import { ALL_PRODUCTS, updateAllProducts } from '../data/products';
import { OrderService } from '../services/api';
import { apiClient } from '../services/apiClient';

type ThemeMode = 'dark' | 'light' | 'hybrid';

interface AppContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  cart: CartItem[];
  cartCount: number;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  addresses: Address[];
  addAddress: (address: Omit<Address, 'addressId' | 'userId' | 'createdAt'>) => void;
  removeAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  orders: Order[];
  refreshOrders: () => Promise<void>;
  submitOrder: (orderArgs: {
    items: Order['items'];
    subtotal: number;
    shipping: number;
    total: number;
    paymentMethod: Order['paymentMethod'];
    deliveryMethod: Order['deliveryMethod'];
    shippingInfo: ShippingInfo;
    orderNotes?: string;
  }) => Promise<Order>;
  
  // Registration and Authentication
  signUp: (email: string, name: string, phone: string, pass: string) => Promise<string>;
  verifyCode: (code: string) => Promise<boolean>;
  signIn: (email: string, password?: string) => Promise<User>;
  signOut: () => void;
  
  // Fitment Vehicle search state
  selectedMake: string;
  setSelectedMake: (make: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Theme state (default is premium-dark)
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('lighthub_theme');
    return (saved as ThemeMode) || 'dark';
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('lighthub_theme', newTheme);
  };

  // 2. User Authentication
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('lighthub_user');
    const token = localStorage.getItem('lighthub_token');
    if (saved && token) {
      return JSON.parse(saved);
    }
    return null;
  });

  // 3. Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('lighthub_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Calculate distinct counts
  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  // 4. Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('lighthub_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // 5. Addresses State
  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('lighthub_addresses');
    if (saved) return JSON.parse(saved);
    
    // Seed default address for Erick
    const defaultAddresses: Address[] = [
      {
        userId: 'dallaherick0@gmail.com',
        addressId: 'ADDR-9901',
        fullName: 'Erick Dallah',
        phone: '+254 712 345 678',
        address: 'Ngong Road, Greenhouse Mall, Suite 10',
        apartment: 'Block B, 2nd Floor',
        city: 'Nairobi',
        county: 'Nairobi',
        postalCode: '00100',
        isDefault: true,
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('lighthub_addresses', JSON.stringify(defaultAddresses));
    return defaultAddresses;
  });

  // 6. Orders State
  const [orders, setOrders] = useState<Order[]>([]);

  // 7. Vehicle fitment states
  const [selectedMake, setSelectedMake] = useState<string>('Toyota');
  const [selectedModel, setSelectedModel] = useState<string>('Corolla');

  // Load products from backend API once on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await apiClient.getProducts();
        if (products && products.length > 0) {
          updateAllProducts(products);
          console.log(`Loaded ${products.length} products from backend API`);
        }
      } catch (err) {
        console.error("Failed to load products from backend:", err);
      }
    };
    fetchProducts();
  }, []);

  // Fetch backend data on login
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('lighthub_user', JSON.stringify(currentUser));
      refreshOrders();
      
      const fetchUserData = async () => {
        try {
          const [cartData, wishlistData, addressData] = await Promise.all([
            apiClient.getCart(),
            apiClient.getWishlist(),
            apiClient.getAddresses()
          ]);
          
          if (cartData && cartData.length > 0) setCart(cartData);
          if (wishlistData && wishlistData.length > 0) setWishlist(wishlistData);
          if (addressData && addressData.length > 0) setAddresses(addressData);
        } catch (err) {
          console.warn("Could not sync user data from backend:", err);
        }
      };
      fetchUserData();
    } else {
      localStorage.removeItem('lighthub_user');
      setOrders([]);
    }
  }, [currentUser]);

  // Sync Cart to backend
  useEffect(() => {
    localStorage.setItem('lighthub_cart', JSON.stringify(cart));
    if (currentUser?.email) {
      apiClient.saveCart(cart).catch(err => {
        console.error("Failed to sync cart to backend:", err);
      });
    }
  }, [cart, currentUser?.email]);

  // Sync Wishlist to backend
  useEffect(() => {
    localStorage.setItem('lighthub_wishlist', JSON.stringify(wishlist));
    if (currentUser?.email) {
      apiClient.saveWishlist(wishlist).catch(err => {
        console.error("Failed to sync wishlist to backend:", err);
      });
    }
  }, [wishlist, currentUser?.email]);

  // Sync Addresses locally
  useEffect(() => {
    localStorage.setItem('lighthub_addresses', JSON.stringify(addresses));
  }, [addresses]);

  // Load orders
  const refreshOrders = async () => {
    if (!currentUser) return;
    const res = await OrderService.getUserOrders(currentUser.email);
    setOrders(res.orders);
  };

  // Add item to Cart
  const addToCart = (productId: string, quantity: number = 1) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.productId === productId);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = { 
          ...copy[idx], 
          quantity: copy[idx].quantity + quantity 
        };
        return copy;
      }
      return [...prev, { productId, quantity, addedAt: new Date().toISOString() }];
    });
  };

  // Remove from Cart
  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  // Update Cart Quantity
  const updateCartQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.productId === productId ? { ...item, quantity: qty } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Toggle Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  // Address Actions
  const addAddress = (addrArgs: Omit<Address, 'addressId' | 'userId' | 'createdAt'>) => {
    if (!currentUser) return;
    const newAddr: Address = {
      ...addrArgs,
      userId: currentUser.email,
      addressId: `ADDR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    };

    setAddresses(prev => {
      const list = newAddr.isDefault 
        ? prev.map(item => ({ ...item, isDefault: false })) 
        : prev;
      return [...list, newAddr];
    });

    apiClient.saveAddress(newAddr).catch(err => {
      console.error("Failed to save address to backend:", err);
    });
  };

  const removeAddress = (addressId: string) => {
    if (!currentUser) return;
    setAddresses(prev => prev.filter(a => a.addressId !== addressId));
    apiClient.deleteAddress(addressId).catch(err => {
      console.error("Failed to delete address from backend:", err);
    });
  };

  const setDefaultAddress = (addressId: string) => {
    setAddresses(prev => {
      const updated = prev.map(a => ({
        ...a,
        isDefault: a.addressId === addressId
      }));
      updated.forEach(addr => {
        apiClient.saveAddress(addr).catch(err => {
          console.error("Failed to sync default address to backend:", err);
        });
      });
      return updated;
    });
  };


  // Submit dynamic checkout Order
  const submitOrder = async (orderArgs: {
    items: Order['items'];
    subtotal: number;
    shipping: number;
    total: number;
    paymentMethod: Order['paymentMethod'];
    deliveryMethod: Order['deliveryMethod'];
    shippingInfo: ShippingInfo;
    orderNotes?: string;
  }): Promise<Order> => {
    const userEmail = currentUser ? currentUser.email : orderArgs.shippingInfo.email;
    
    // Prepare standardized order configuration
    const orderData = {
      orderId: `ORD-${Date.now()}`,
      userId: userEmail,
      items: orderArgs.items,
      subtotal: orderArgs.subtotal,
      shipping: orderArgs.shipping,
      total: orderArgs.total,
      paymentMethod: orderArgs.paymentMethod,
      deliveryMethod: orderArgs.deliveryMethod,
      shippingInfo: orderArgs.shippingInfo,
      orderNotes: orderArgs.orderNotes
    };

    const res = await OrderService.createOrder(orderData);
    await refreshOrders();
    clearCart();
    return res.order;
  };

  // Backend authentication
  const signUp = async (email: string, name: string, phone: string, pass: string): Promise<string> => {
    try {
      await apiClient.register(email, name, phone, pass);
      const data = await apiClient.login(email, pass);
      const user: User = data.user;
      setCurrentUser(user);
      localStorage.setItem('lighthub_user', JSON.stringify(user));
      return "SUCCESS";
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const verifyCode = async (code: string): Promise<boolean> => {
    return true;
  };

  const signIn = async (email: string, password?: string): Promise<User> => {
    try {
      if (!password) {
        throw new Error('Password is required');
      }
      
      const data = await apiClient.login(email, password);
      const user: User = data.user;
      setCurrentUser(user);
      localStorage.setItem('lighthub_user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('lighthub_user');
    localStorage.removeItem('lighthub_token');
    apiClient.logout();
  };

  return (
    <AppContext.Provider value={{
      theme,
      setTheme,
      currentUser,
      setCurrentUser,
      cart,
      cartCount,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      wishlist,
      toggleWishlist,
      addresses,
      addAddress,
      removeAddress,
      setDefaultAddress,
      orders,
      refreshOrders,
      submitOrder,
      
      // Authentication
      signUp,
      verifyCode,
      signIn,
      signOut,
      
      // Fitment search state
      selectedMake,
      setSelectedMake,
      selectedModel,
      setSelectedModel
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside an AppProvider');
  }
  return context;
};
