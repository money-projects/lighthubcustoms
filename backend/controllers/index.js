import { ScanCommand, GetCommand, PutCommand, DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLES } from '../config/aws.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ==================== AUTH ====================
export const registerUser = async (req, res) => {
  try {
    const { email, name, phone, password } = req.body;

    // Check if user exists
    const existing = await docClient.send(new GetCommand({
      TableName: TABLES.USERS,
      Key: { email }
    }));

    if (existing.Item) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      email,
      name,
      phone,
      password: hashedPassword,
      role: email === 'dallaherick0@gmail.com' ? 'admin' : 'user',
      verified: true,
      createdAt: new Date().toISOString()
    };

    await docClient.send(new PutCommand({
      TableName: TABLES.USERS,
      Item: user
    }));

    // Generate token
    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        verified: user.verified
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user
    const result = await docClient.send(new GetCommand({
      TableName: TABLES.USERS,
      Key: { email }
    }));

    if (!result.Item) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.Item;

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        verified: user.verified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: TABLES.USERS,
      Key: { email: req.user.email }
    }));

    if (!result.Item) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...user } = result.Item;
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

// ==================== PRODUCTS ====================
export const getAllProducts = async (req, res) => {
  try {
    const result = await docClient.send(new ScanCommand({
      TableName: TABLES.PRODUCTS
    }));

    res.json(result.Items || []);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: TABLES.PRODUCTS,
      Key: { productId: req.params.id }
    }));

    if (!result.Item) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.Item);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to get product' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = {
      ...req.body,
      productId: `PROD-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    await docClient.send(new PutCommand({
      TableName: TABLES.PRODUCTS,
      Item: product
    }));

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = {
      ...req.body,
      productId: req.params.id,
      updatedAt: new Date().toISOString()
    };

    await docClient.send(new PutCommand({
      TableName: TABLES.PRODUCTS,
      Item: product
    }));

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await docClient.send(new DeleteCommand({
      TableName: TABLES.PRODUCTS,
      Key: { productId: req.params.id }
    }));

    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// ==================== ORDERS ====================
export const getUserOrders = async (req, res) => {
  try {
    const result = await docClient.send(new ScanCommand({
      TableName: TABLES.ORDERS,
      FilterExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': req.user.email
      }
    }));

    res.json(result.Items || []);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const result = await docClient.send(new ScanCommand({
      TableName: TABLES.ORDERS
    }));

    res.json(result.Items || []);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: TABLES.ORDERS,
      Key: { orderId: req.params.id }
    }));

    if (!result.Item) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns this order or is admin
    if (result.Item.userId !== req.user.email && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(result.Item);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to get order' });
  }
};

export const createOrder = async (req, res) => {
  try {
    const order = {
      ...req.body,
      orderId: `ORD-${Date.now()}`,
      userId: req.user.email,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await docClient.send(new PutCommand({
      TableName: TABLES.ORDERS,
      Item: order
    }));

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const result = await docClient.send(new GetCommand({
      TableName: TABLES.ORDERS,
      Key: { orderId: req.params.id }
    }));

    if (!result.Item) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = {
      ...result.Item,
      status,
      updatedAt: new Date().toISOString()
    };

    await docClient.send(new PutCommand({
      TableName: TABLES.ORDERS,
      Item: order
    }));

    res.json(order);
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    await docClient.send(new DeleteCommand({
      TableName: TABLES.ORDERS,
      Key: { orderId: req.params.id }
    }));

    res.json({ message: 'Order deleted' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
};

// ==================== CART ====================
export const getCart = async (req, res) => {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: TABLES.CART,
      Key: { userId: req.user.email }
    }));

    res.json(result.Item?.items || []);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to get cart' });
  }
};

export const saveCart = async (req, res) => {
  try {
    await docClient.send(new PutCommand({
      TableName: TABLES.CART,
      Item: {
        userId: req.user.email,
        items: req.body.items,
        updatedAt: new Date().toISOString()
      }
    }));

    res.json({ message: 'Cart saved' });
  } catch (error) {
    console.error('Save cart error:', error);
    res.status(500).json({ error: 'Failed to save cart' });
  }
};

// ==================== WISHLIST ====================
export const getWishlist = async (req, res) => {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: TABLES.WISHLIST,
      Key: { userId: req.user.email }
    }));

    res.json(result.Item?.items || []);
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ error: 'Failed to get wishlist' });
  }
};

export const saveWishlist = async (req, res) => {
  try {
    await docClient.send(new PutCommand({
      TableName: TABLES.WISHLIST,
      Item: {
        userId: req.user.email,
        items: req.body.items,
        updatedAt: new Date().toISOString()
      }
    }));

    res.json({ message: 'Wishlist saved' });
  } catch (error) {
    console.error('Save wishlist error:', error);
    res.status(500).json({ error: 'Failed to save wishlist' });
  }
};

// ==================== ADDRESSES ====================
export const getAddresses = async (req, res) => {
  try {
    const result = await docClient.send(new ScanCommand({
      TableName: TABLES.ADDRESSES,
      FilterExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': req.user.email
      }
    }));

    res.json(result.Items || []);
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ error: 'Failed to get addresses' });
  }
};

export const saveAddress = async (req, res) => {
  try {
    const address = {
      ...req.body,
      userId: req.user.email,
      addressId: req.body.addressId || `ADDR-${Date.now()}`,
      createdAt: req.body.createdAt || new Date().toISOString()
    };

    await docClient.send(new PutCommand({
      TableName: TABLES.ADDRESSES,
      Item: address
    }));

    res.json(address);
  } catch (error) {
    console.error('Save address error:', error);
    res.status(500).json({ error: 'Failed to save address' });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    await docClient.send(new DeleteCommand({
      TableName: TABLES.ADDRESSES,
      Key: { 
        userId: req.user.email,
        addressId: req.params.id 
      }
    }));

    res.json({ message: 'Address deleted' });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ error: 'Failed to delete address' });
  }
};

// ==================== BULB DATA ====================
export const getBulbData = async (req, res) => {
  try {
    const result = await docClient.send(new ScanCommand({
      TableName: TABLES.BULB_DATA
    }));

    res.json(result.Items || []);
  } catch (error) {
    console.error('Get bulb data error:', error);
    res.status(500).json({ error: 'Failed to get bulb data' });
  }
};

export const getBulbDataByVehicle = async (req, res) => {
  try {
    const { make, model } = req.params;
    const vehicleKey = `${make}#${model}`;

    const result = await docClient.send(new GetCommand({
      TableName: TABLES.BULB_DATA,
      Key: { vehicleKey }
    }));

    if (!result.Item) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json(result.Item);
  } catch (error) {
    console.error('Get bulb data error:', error);
    res.status(500).json({ error: 'Failed to get bulb data' });
  }
};
