import express from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getUserOrders,
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getCart,
  saveCart,
  getWishlist,
  saveWishlist,
  getAddresses,
  saveAddress,
  deleteAddress,
  getBulbData,
  getBulbDataByVehicle
} from '../controllers/index.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Auth routes
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.get('/auth/profile', authMiddleware, getProfile);

// Product routes
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.post('/products', authMiddleware, adminMiddleware, createProduct);
router.put('/products/:id', authMiddleware, adminMiddleware, updateProduct);
router.delete('/products/:id', authMiddleware, adminMiddleware, deleteProduct);

// Order routes
router.get('/orders', authMiddleware, getUserOrders);
router.get('/orders/all', authMiddleware, adminMiddleware, getAllOrders);
router.get('/orders/:id', authMiddleware, getOrderById);
router.post('/orders', authMiddleware, createOrder);
router.put('/orders/:id', authMiddleware, adminMiddleware, updateOrderStatus);
router.delete('/orders/:id', authMiddleware, adminMiddleware, deleteOrder);

// Cart routes
router.get('/cart', authMiddleware, getCart);
router.post('/cart', authMiddleware, saveCart);

// Wishlist routes
router.get('/wishlist', authMiddleware, getWishlist);
router.post('/wishlist', authMiddleware, saveWishlist);

// Address routes
router.get('/addresses', authMiddleware, getAddresses);
router.post('/addresses', authMiddleware, saveAddress);
router.delete('/addresses/:id', authMiddleware, deleteAddress);

// Bulb data routes
router.get('/bulb-data', getBulbData);
router.get('/bulb-data/:make/:model', getBulbDataByVehicle);

export default router;
