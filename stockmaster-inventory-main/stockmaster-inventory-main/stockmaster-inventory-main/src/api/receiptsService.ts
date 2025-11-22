/**
 * Receipts Service
 * Handles receipt-related API calls
 */

import baseApi from './base';
import { API_BASE_URLS } from './config';

export interface Receipt {
  _id?: string;
  productId: string;
  warehouse: string;
  quantity: number;
  supplier?: string;
  date: string;
  status: 'draft' | 'waiting' | 'ready' | 'done' | 'canceled';
  receivedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReceiptFilters {
  warehouse?: string;
  productId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

class ReceiptsService {
  private baseUrl = API_BASE_URLS.RECEIPTS;

  /**
   * Get all receipts
   */
  async getReceipts(filters?: ReceiptFilters) {
    const response = await baseApi.get<Receipt[]>(`${this.baseUrl}/receipt`, filters);
    return response;
  }

  /**
   * Get receipt by ID
   */
  async getReceiptById(id: string) {
    const response = await baseApi.get<Receipt>(`${this.baseUrl}/receipt/${id}`);
    return response;
  }

  /**
   * Create receipt
   */
  async createReceipt(receipt: Omit<Receipt, '_id' | 'createdAt' | 'updatedAt'>) {
    const response = await baseApi.post<Receipt>(`${this.baseUrl}/receipt`, receipt);
    return response;
  }

  /**
   * Update receipt status
   */
  async updateReceiptStatus(id: string, status: Receipt['status']) {
    const response = await baseApi.put<Receipt>(
      `${this.baseUrl}/receipt/${id}/status`,
      { status }
    );
    return response;
  }
}

export default new ReceiptsService();

