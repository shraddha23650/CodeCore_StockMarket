/**
 * Dashboard Page
 * Displays KPIs and stock movements
 */

import React, { useState, useEffect } from 'react';
import dashboardService, { DashboardSummary, StockMovement } from '../api/dashboardService';

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    warehouse: '',
    category: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    loadDashboardData();
  }, [filters]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const summaryResponse = await dashboardService.getSummary({
        warehouse: filters.warehouse || undefined,
        category: filters.category || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      });

      const movementsResponse = await dashboardService.getMovements({
        warehouse: filters.warehouse || undefined,
        category: filters.category || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        operationType: 'all',
      });

      if (summaryResponse.success && summaryResponse.data) {
        setSummary(summaryResponse.data);
      }

      if (movementsResponse.success && movementsResponse.data) {
        setMovements(movementsResponse.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Warehouse</label>
            <input
              type="text"
              value={filters.warehouse}
              onChange={(e) => handleFilterChange('warehouse', e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Filter by warehouse"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Filter by category"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* KPIs */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Products</h3>
            <p className="text-3xl font-bold">{summary.totalProducts}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Stock</h3>
            <p className="text-3xl font-bold">{summary.totalStock}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Low Stock Items</h3>
            <p className="text-3xl font-bold text-yellow-600">{summary.lowStockItems}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Out of Stock</h3>
            <p className="text-3xl font-bold text-red-600">{summary.outOfStockItems}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Received</h3>
            <p className="text-3xl font-bold text-green-600">{summary.totalReceived}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Delivered</h3>
            <p className="text-3xl font-bold text-blue-600">{summary.totalDelivered}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Transfers</h3>
            <p className="text-3xl font-bold">{summary.totalTransfers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Adjustments</h3>
            <p className="text-3xl font-bold">{summary.totalAdjustments}</p>
          </div>
        </div>
      )}

      {/* Pending Operations */}
      {summary && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Pending Operations</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Pending Receipts</p>
              <p className="text-2xl font-bold">{summary.pendingReceipts}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Deliveries</p>
              <p className="text-2xl font-bold">{summary.pendingDeliveries}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Transfers</p>
              <p className="text-2xl font-bold">{summary.pendingTransfers}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Adjustments</p>
              <p className="text-2xl font-bold">{summary.pendingAdjustments}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stock Movements */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Stock Movements</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warehouse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {movements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No movements found
                  </td>
                </tr>
              ) : (
                movements.map((movement) => (
                  <tr key={movement.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded ${
                        movement.type === 'receipt' ? 'bg-green-100 text-green-800' :
                        movement.type === 'delivery' ? 'bg-red-100 text-red-800' :
                        movement.type === 'transfer' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {movement.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {movement.product?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{movement.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{movement.warehouse}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {movement.user?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(movement.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

