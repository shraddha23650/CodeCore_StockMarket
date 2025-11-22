/**
 * Dashboard Service
 * Handles dashboard and KPI-related API calls
 */

import baseApi from './base';
import { API_BASE_URLS } from './config';

export interface DashboardFilters {
  warehouse?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}

export interface DashboardSummary {
  totalProducts: number;
  totalStock: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalReceived: number;
  totalDelivered: number;
  totalTransfers: number;
  totalTransferredQuantity: number;
  totalAdjustments: number;
  pendingReceipts: number;
  pendingDeliveries: number;
  pendingTransfers: number;
  pendingAdjustments: number;
  filters: {
    warehouse: string;
    category: string;
    dateRange: {
      startDate: string | null;
      endDate: string | null;
    };
  };
}

export interface MovementFilters extends DashboardFilters {
  productId?: string;
  operationType?: 'receipt' | 'delivery' | 'transfer' | 'adjustment' | 'all';
}

export interface StockMovement {
  type: 'receipt' | 'delivery' | 'transfer' | 'adjustment';
  id: string;
  product: {
    _id: string;
    name: string;
    sku: string;
    category: string;
  };
  quantity: number;
  warehouse: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  date: string;
  details: Record<string, any>;
}

class DashboardService {
  private baseUrl = API_BASE_URLS.DASHBOARD;

  /**
   * Get dashboard summary (KPIs)
   */
  async getSummary(filters?: DashboardFilters) {
    const response = await baseApi.get<DashboardSummary>(
      `${this.baseUrl}/dashboard/summary`,
      filters
    );
    return response;
  }

  /**
   * Get stock movements
   */
  async getMovements(filters?: MovementFilters) {
    const response = await baseApi.get<StockMovement[]>(
      `${this.baseUrl}/dashboard/movements`,
      filters
    );
    return response;
  }
}

export default new DashboardService();

