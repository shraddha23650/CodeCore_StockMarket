/**
 * Transfers Service
 * Handles transfer-related API calls
 */

import baseApi from './base';
import { API_BASE_URLS } from './config';

export interface Transfer {
  _id?: string;
  productId: string;
  fromWarehouse: string;
  toWarehouse: string;
  quantity: number;
  date: string;
  status: 'draft' | 'waiting' | 'ready' | 'done' | 'canceled' | 'failed';
  transferredBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransferFilters {
  warehouse?: string;
  productId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

class TransfersService {
  private baseUrl = API_BASE_URLS.TRANSFERS;

  /**
   * Get all transfers
   */
  async getTransfers(filters?: TransferFilters) {
    const response = await baseApi.get<Transfer[]>(`${this.baseUrl}/transfer`, filters);
    return response;
  }

  /**
   * Get transfer by ID
   */
  async getTransferById(id: string) {
    const response = await baseApi.get<Transfer>(`${this.baseUrl}/transfer/${id}`);
    return response;
  }

  /**
   * Create transfer
   */
  async createTransfer(transfer: Omit<Transfer, '_id' | 'createdAt' | 'updatedAt'>) {
    const response = await baseApi.post<Transfer>(`${this.baseUrl}/transfer`, transfer);
    return response;
  }

  /**
   * Update transfer status
   */
  async updateTransferStatus(id: string, status: Transfer['status']) {
    const response = await baseApi.put<Transfer>(
      `${this.baseUrl}/transfer/${id}/status`,
      { status }
    );
    return response;
  }
}

export default new TransfersService();

