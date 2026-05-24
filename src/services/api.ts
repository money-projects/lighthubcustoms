import { Order } from '../types';
import { apiClient } from './apiClient';

export const OrderService = {
  // Get all orders for user
  getUserOrders: async (userId: string): Promise<{ orders: Order[]; isMock: boolean }> => {
    try {
      const orders = await apiClient.getOrders();
      const sorted = (orders || []).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return { orders: sorted, isMock: false };
    } catch (err) {
      console.error("Error loading user orders from backend:", err);
      return { orders: [], isMock: false };
    }
  },

  // Post new order
  createOrder: async (orderData: Omit<Order, 'status' | 'createdAt' | 'updatedAt'>): Promise<{ order: Order; isMock: boolean }> => {
    const fullOrder: Order = {
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    try {
      await apiClient.createOrder(fullOrder);
      console.log(`✅ Order ${fullOrder.orderId} successfully saved to backend.`);
    } catch (err) {
      console.error("Failed to save order to backend:", err);
      throw err;
    }

    return { order: fullOrder, isMock: false };
  },

  // Track single order
  trackOrder: async (orderId: string): Promise<{ order: Order | null; isMock: boolean }> => {
    try {
      const order = await apiClient.getOrder(orderId);
      return { order, isMock: false };
    } catch (err) {
      console.error("Failed tracking order via backend:", err);
      return { order: null, isMock: false };
    }
  },

  // Admin: Get all orders
  getAllOrders: async (): Promise<{ orders: Order[]; isMock: boolean }> => {
    try {
      const orders = await apiClient.getAllOrders();
      const sorted = (orders || []).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return { orders: sorted, isMock: false };
    } catch (err) {
      console.error("Failed to fetch all orders from backend:", err);
      return { orders: [], isMock: false };
    }
  },

  // Admin: Update order
  updateOrder: async (orderId: string, status: Order['status']): Promise<{ success: boolean; isMock: boolean }> => {
    try {
      await apiClient.updateOrderStatus(orderId, status);
      console.log(`✅ Order status for ${orderId} successfully set to ${status}.`);
      return { success: true, isMock: false };
    } catch (err) {
      console.error("Failed to update status in backend:", err);
      return { success: false, isMock: false };
    }
  },

  // Admin: Delete order
  deleteOrder: async (orderId: string): Promise<{ success: boolean; isMock: boolean }> => {
    try {
      await apiClient.deleteOrder(orderId);
      console.log(`✅ Order ${orderId} successfully deleted from backend.`);
      return { success: true, isMock: false };
    } catch (err) {
      console.error("Failed to delete order from backend:", err);
      return { success: false, isMock: false };
    }
  }
};
