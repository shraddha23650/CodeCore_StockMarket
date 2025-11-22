/**
 * Products Service
 * Handles product-related API calls
 */

import baseApi from './base';
import { API_BASE_URLS } from './config';

export interface Product {
  _id?: string;
  name: string;
  sku: string;
  description?: string;
  category: string;
  warehouse: string;
  quantity: number;
  reorderLevel: number;
  unitOfMeasure: string;
  price?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilters {
  warehouse?: string;
  category?: string;
  search?: string;
  lowStock?: boolean;
}

class ProductsService {
  private baseUrl = API_BASE_URLS.PRODUCTS;

  /**
   * Get all products
   */
  async getProducts(filters?: ProductFilters) {
    const response = await baseApi.get<Product[]>(
      `${this.baseUrl}/products`,
      filters
    );
    return response;
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string) {
    const response = await baseApi.get<Product>(`${this.baseUrl}/products/${id}`);
    return response;
  }

  /**
   * Create product
   */
  async createProduct(product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>) {
    const response = await baseApi.post<Product>(`${this.baseUrl}/products`, product);
    return response;
  }

  /**
   * Update product
   */
  async updateProduct(id: string, product: Partial<Product>) {
    const response = await baseApi.put<Product>(`${this.baseUrl}/products/${id}`, product);
    return response;
  }

  /**
   * Delete product
   */
  async deleteProduct(id: string) {
    const response = await baseApi.delete(`${this.baseUrl}/products/${id}`);
    return response;
  }
}

export default new ProductsService();

