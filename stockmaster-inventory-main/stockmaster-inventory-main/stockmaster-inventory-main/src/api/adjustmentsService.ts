/**
 * Adjustments Service
 * Handles adjustment-related API calls
 */

import baseApi from './base';
import { API_BASE_URLS } from './config';

export interface Adjustment {
  _id?: string;
  productId: string;
  warehouse: string;
  oldStock: number;
  newStock: number;
  adjustmentReason: string;
  date: string;
  status: 'draft' | 'done';
  adjustedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdjustmentFilters {
  warehouse?: string;
  productId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

class AdjustmentsService {
  private baseUrl = API_BASE_URLS.ADJUSTMENTS;

  /**
   * Get all adjustments
   */
  async getAdjustments(filters?: AdjustmentFilters) {
    const response = await baseApi.get<Adjustment[]>(`${this.baseUrl}/adjustment`, filters);
    return response;
  }

  /**
   * Get adjustment by ID
   */
  async getAdjustmentById(id: string) {
    const response = await baseApi.get<Adjustment>(`${this.baseUrl}/adjustment/${id}`);
    return response;
  }

  /**
   * Create adjustment
   */
  async createAdjustment(adjustment: Omit<Adjustment, '_id' | 'createdAt' | 'updatedAt'>) {
    const response = await baseApi.post<Adjustment>(`${this.baseUrl}/adjustment`, adjustment);
    return response;
  }

  /**
   * Update adjustment status
   */
  async updateAdjustmentStatus(id: string, status: Adjustment['status']) {
    const response = await baseApi.put<Adjustment>(
      `${this.baseUrl}/adjustment/${id}/status`,
      { status }
    );
    return response;
  }
}

export default new AdjustmentsService();

