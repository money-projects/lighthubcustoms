import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [];

export const ALL_PRODUCTS: Product[] = [...INITIAL_PRODUCTS];

export const updateAllProducts = (newProducts: Product[]) => {
  if (!newProducts || newProducts.length === 0) return;
  ALL_PRODUCTS.length = 0;
  ALL_PRODUCTS.push(...newProducts);
};
