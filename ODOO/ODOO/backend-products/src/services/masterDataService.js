/**
 * Master Data Service
 * Handles Warehouse, Category, and Location CRUD operations
 */

const Warehouse = require('../models/Warehouse');
const Category = require('../models/Category');
const Location = require('../models/Location');
const logger = require('../../shared/utils/logger');

class MasterDataService {
  // ============ WAREHOUSE OPERATIONS ============
  
  async createWarehouse(warehouseData) {
    const warehouse = await Warehouse.create(warehouseData);
    logger.info('Warehouse created', { warehouseId: warehouse._id, code: warehouse.code });
    return warehouse;
  }

  async getAllWarehouses(filters = {}) {
    const query = { isActive: filters.isActive !== false };
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { code: { $regex: filters.search, $options: 'i' } }
      ];
    }
    return await Warehouse.find(query).sort({ name: 1 });
  }

  async getWarehouseById(warehouseId) {
    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) {
      throw new Error('Warehouse not found');
    }
    return warehouse;
  }

  async getWarehouseByCode(code) {
    const warehouse = await Warehouse.findOne({ code: code.toUpperCase() });
    if (!warehouse) {
      throw new Error('Warehouse not found');
    }
    return warehouse;
  }

  async updateWarehouse(warehouseId, updateData) {
    const warehouse = await Warehouse.findByIdAndUpdate(
      warehouseId,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!warehouse) {
      throw new Error('Warehouse not found');
    }
    logger.info('Warehouse updated', { warehouseId: warehouse._id, code: warehouse.code });
    return warehouse;
  }

  async deleteWarehouse(warehouseId) {
    const warehouse = await Warehouse.findByIdAndUpdate(
      warehouseId,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );
    if (!warehouse) {
      throw new Error('Warehouse not found');
    }
    logger.info('Warehouse deactivated', { warehouseId: warehouse._id });
    return warehouse;
  }

  // ============ CATEGORY OPERATIONS ============
  
  async createCategory(categoryData) {
    const category = await Category.create(categoryData);
    logger.info('Category created', { categoryId: category._id, code: category.code });
    return category;
  }

  async getAllCategories(filters = {}) {
    const query = { isActive: filters.isActive !== false };
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { code: { $regex: filters.search, $options: 'i' } }
      ];
    }
    return await Category.find(query).sort({ name: 1 });
  }

  async getCategoryById(categoryId) {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async getCategoryByCode(code) {
    const category = await Category.findOne({ code: code.toUpperCase() });
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async updateCategory(categoryId, updateData) {
    const category = await Category.findByIdAndUpdate(
      categoryId,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!category) {
      throw new Error('Category not found');
    }
    logger.info('Category updated', { categoryId: category._id, code: category.code });
    return category;
  }

  async deleteCategory(categoryId) {
    const category = await Category.findByIdAndUpdate(
      categoryId,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );
    if (!category) {
      throw new Error('Category not found');
    }
    logger.info('Category deactivated', { categoryId: category._id });
    return category;
  }

  // ============ LOCATION OPERATIONS ============
  
  async createLocation(locationData) {
    const location = await Location.create(locationData);
    logger.info('Location created', { locationId: location._id, code: location.code });
    return location;
  }

  async getAllLocations(filters = {}) {
    const query = { isActive: filters.isActive !== false };
    if (filters.warehouse) {
      query.warehouse = filters.warehouse;
    }
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { code: { $regex: filters.search, $options: 'i' } }
      ];
    }
    return await Location.find(query).sort({ warehouse: 1, name: 1 });
  }

  async getLocationById(locationId) {
    const location = await Location.findById(locationId);
    if (!location) {
      throw new Error('Location not found');
    }
    return location;
  }

  async getLocationsByWarehouse(warehouse) {
    return await Location.find({ warehouse, isActive: true }).sort({ name: 1 });
  }

  async updateLocation(locationId, updateData) {
    const location = await Location.findByIdAndUpdate(
      locationId,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!location) {
      throw new Error('Location not found');
    }
    logger.info('Location updated', { locationId: location._id, code: location.code });
    return location;
  }

  async deleteLocation(locationId) {
    const location = await Location.findByIdAndUpdate(
      locationId,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );
    if (!location) {
      throw new Error('Location not found');
    }
    logger.info('Location deactivated', { locationId: location._id });
    return location;
  }
}

module.exports = new MasterDataService();

