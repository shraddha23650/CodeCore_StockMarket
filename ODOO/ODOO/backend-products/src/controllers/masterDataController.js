/**
 * Master Data Controller
 */

const masterDataService = require('../services/masterDataService');
const { sendSuccess, sendError } = require('../../shared/utils/response');

class MasterDataController {
  // ============ WAREHOUSE ROUTES ============
  
  async createWarehouse(req, res, next) {
    try {
      const warehouse = await masterDataService.createWarehouse(req.body);
      return sendSuccess(res, 'Warehouse created successfully', warehouse, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAllWarehouses(req, res, next) {
    try {
      const filters = {
        search: req.query.search,
        isActive: req.query.isActive !== 'false'
      };
      const warehouses = await masterDataService.getAllWarehouses(filters);
      return sendSuccess(res, 'Warehouses retrieved successfully', warehouses);
    } catch (error) {
      next(error);
    }
  }

  async getWarehouseById(req, res, next) {
    try {
      const warehouse = await masterDataService.getWarehouseById(req.params.id);
      return sendSuccess(res, 'Warehouse retrieved successfully', warehouse);
    } catch (error) {
      next(error);
    }
  }

  async updateWarehouse(req, res, next) {
    try {
      const warehouse = await masterDataService.updateWarehouse(req.params.id, req.body);
      return sendSuccess(res, 'Warehouse updated successfully', warehouse);
    } catch (error) {
      next(error);
    }
  }

  async deleteWarehouse(req, res, next) {
    try {
      const warehouse = await masterDataService.deleteWarehouse(req.params.id);
      return sendSuccess(res, 'Warehouse deactivated successfully', warehouse);
    } catch (error) {
      next(error);
    }
  }

  // ============ CATEGORY ROUTES ============
  
  async createCategory(req, res, next) {
    try {
      const category = await masterDataService.createCategory(req.body);
      return sendSuccess(res, 'Category created successfully', category, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAllCategories(req, res, next) {
    try {
      const filters = {
        search: req.query.search,
        isActive: req.query.isActive !== 'false'
      };
      const categories = await masterDataService.getAllCategories(filters);
      return sendSuccess(res, 'Categories retrieved successfully', categories);
    } catch (error) {
      next(error);
    }
  }

  async getCategoryById(req, res, next) {
    try {
      const category = await masterDataService.getCategoryById(req.params.id);
      return sendSuccess(res, 'Category retrieved successfully', category);
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req, res, next) {
    try {
      const category = await masterDataService.updateCategory(req.params.id, req.body);
      return sendSuccess(res, 'Category updated successfully', category);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const category = await masterDataService.deleteCategory(req.params.id);
      return sendSuccess(res, 'Category deactivated successfully', category);
    } catch (error) {
      next(error);
    }
  }

  // ============ LOCATION ROUTES ============
  
  async createLocation(req, res, next) {
    try {
      const location = await masterDataService.createLocation(req.body);
      return sendSuccess(res, 'Location created successfully', location, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAllLocations(req, res, next) {
    try {
      const filters = {
        warehouse: req.query.warehouse,
        search: req.query.search,
        isActive: req.query.isActive !== 'false'
      };
      const locations = await masterDataService.getAllLocations(filters);
      return sendSuccess(res, 'Locations retrieved successfully', locations);
    } catch (error) {
      next(error);
    }
  }

  async getLocationById(req, res, next) {
    try {
      const location = await masterDataService.getLocationById(req.params.id);
      return sendSuccess(res, 'Location retrieved successfully', location);
    } catch (error) {
      next(error);
    }
  }

  async getLocationsByWarehouse(req, res, next) {
    try {
      const locations = await masterDataService.getLocationsByWarehouse(req.params.warehouse);
      return sendSuccess(res, 'Locations retrieved successfully', locations);
    } catch (error) {
      next(error);
    }
  }

  async updateLocation(req, res, next) {
    try {
      const location = await masterDataService.updateLocation(req.params.id, req.body);
      return sendSuccess(res, 'Location updated successfully', location);
    } catch (error) {
      next(error);
    }
  }

  async deleteLocation(req, res, next) {
    try {
      const location = await masterDataService.deleteLocation(req.params.id);
      return sendSuccess(res, 'Location deactivated successfully', location);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MasterDataController();

