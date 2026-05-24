import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

export const docClient = DynamoDBDocumentClient.from(client);

export const TABLES = {
  PRODUCTS: process.env.PRODUCTS_TABLE,
  ORDERS: process.env.ORDERS_TABLE,
  USERS: process.env.USERS_TABLE,
  BULB_DATA: process.env.BULB_DATA_TABLE,
  CART: process.env.CART_TABLE,
  WISHLIST: process.env.WISHLIST_TABLE,
  ADDRESSES: process.env.ADDRESSES_TABLE
};
