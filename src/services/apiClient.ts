const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('lighthub_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('lighthub_token', token);
    } else {
      localStorage.removeItem('lighthub_token');
    }
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async register(email, name, phone, password) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, name, phone, password })
    });
    this.setToken(data.token);
    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.setToken(data.token);
    return data;
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  logout() {
    this.setToken(null);
  }

  // Products
  async getProducts() {
    return this.request('/products');
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async createProduct(product) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(product)
    });
  }

  async updateProduct(id, product) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product)
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE'
    });
  }

  // Orders
  async getOrders() {
    return this.request('/orders');
  }

  async getAllOrders() {
    return this.request('/orders/all');
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  async createOrder(order) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(order)
    });
  }

  async updateOrderStatus(id, status) {
    return this.request(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  async deleteOrder(id) {
    return this.request(`/orders/${id}`, {
      method: 'DELETE'
    });
  }

  // Cart
  async getCart() {
    return this.request('/cart');
  }

  async saveCart(items) {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ items })
    });
  }

  // Wishlist
  async getWishlist() {
    return this.request('/wishlist');
  }

  async saveWishlist(items) {
    return this.request('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ items })
    });
  }

  // Addresses
  async getAddresses() {
    return this.request('/addresses');
  }

  async saveAddress(address) {
    return this.request('/addresses', {
      method: 'POST',
      body: JSON.stringify(address)
    });
  }

  async deleteAddress(id) {
    return this.request(`/addresses/${id}`, {
      method: 'DELETE'
    });
  }

  // Bulb Data
  async getBulbData() {
    return this.request('/bulb-data');
  }

  async getBulbDataByVehicle(make, model) {
    return this.request(`/bulb-data/${make}/${model}`);
  }
}

export const apiClient = new ApiClient();
