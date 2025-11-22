/**
 * Deliveries Service
 * Handles delivery-related API calls
 */

import baseApi from './base';
import { API_BASE_URLS } from './config';

export interface Delivery {
  _id?: string;
  productId: string;
  warehouse: string;
  quantity: number;
  deliveredTo?: string;
  date: string;
  status: 'draft' | 'waiting' | 'ready' | 'picking' | 'packing' | 'done' | 'canceled';
  pickedQuantity?: number;
  deliveredBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DeliveryFilters {
  warehouse?: string;
  productId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

class DeliveriesService {
  private baseUrl = API_BASE_URLS.DELIVERIES;

  /**
   * Get all deliveries
   */
  async getDeliveries(filters?: DeliveryFilters) {
    const response = await baseApi.get<Delivery[]>(`${this.baseUrl}/delivery`, filters);
    return response;
  }

  /**
   * Get delivery by ID
   */
  async getDeliveryById(id: string) {
    const response = await baseApi.get<Delivery>(`${this.baseUrl}/delivery/${id}`);
    return response;
  }

  /**
   * Create delivery
   */
  async createDelivery(delivery: Omit<Delivery, '_id' | 'createdAt' | 'updatedAt'>) {
    const response = await baseApi.post<Delivery>(`${this.baseUrl}/delivery`, delivery);
    return response;
  }

  /**
   * Update delivery status
   */
  async updateDeliveryStatus(id: string, status: Delivery['status']) {
    const response = await baseApi.put<Delivery>(
      `${this.baseUrl}/delivery/${id}/status`,
      { status }
    );
    return response;
  }

  /**
   * Update picking status
   */
  async updatePicking(id: string, pickedQuantity: number) {
    const response = await baseApi.put<Delivery>(
      `${this.baseUrl}/delivery/${id}/picking`,
      { pickedQuantity }
    );
    return response;
  }

  /**
   * Update packing status
   */
  async updatePacking(id: string) {
    const response = await baseApi.put<Delivery>(
      `${this.baseUrl}/delivery/${id}/packing`,
      {}
    );
    return response;
  }
}

export default new DeliveriesService();

