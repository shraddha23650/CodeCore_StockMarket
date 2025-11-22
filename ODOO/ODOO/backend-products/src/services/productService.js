/**
 * Product Service
 */

const Product = require('../models/Product');
const logger = require('../../shared/utils/logger');

class ProductService {
  async createProduct(productData) {
    const product = await Product.create(productData);
    
    // Initialize stock history
    product.stockHistory.push({
      warehouse: product.warehouse,
      quantity: product.quantity
    });
    await product.save();

    logger.info('Product created', { productId: product._id, sku: product.sku });
    return product;
  }

  async getAllProducts(filters = {}) {
    const { warehouse, category, search, lowStock } = filters;
    const query = {};

    if (warehouse) {
      query.warehouse = warehouse;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }

    if (lowStock === 'true') {
      query.$expr = { $lte: ['$quantity', '$reorderLevel'] };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    return products;
  }

  async getProductById(productId) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async getProductBySku(sku) {
    const product = await Product.findOne({ sku: sku.toUpperCase() });
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async updateProduct(productId, updateData) {
    const product = await Product.findByIdAndUpdate(
      productId,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!product) {
      throw new Error('Product not found');
    }

    logger.info('Product updated', { productId: product._id, sku: product.sku });
    return product;
  }

  async deleteProduct(productId) {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    logger.info('Product deleted', { productId: product._id, sku: product.sku });
    return product;
  }

  async updateStock(productId, warehouse, quantity, operation = 'set', location = null) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // If warehouse matches, update quantity
    if (product.warehouse === warehouse) {
      if (operation === 'increment') {
        product.quantity += quantity;
      } else if (operation === 'decrement') {
        product.quantity = Math.max(0, product.quantity - quantity);
      } else {
        product.quantity = quantity;
      }

      // Update location if provided
      if (location) {
        product.location = location;
      }

      // Update stock history
      product.stockHistory.push({
        warehouse,
        location: location || product.location,
        quantity: product.quantity
      });

      await product.save();
      return product;
    }

    // If different warehouse, we might need to handle multi-warehouse products
    // For now, we'll update if warehouse matches
    throw new Error('Warehouse mismatch');
  }

  async getLowStockItems(warehouse = null) {
    const query = {
      $expr: { $lte: ['$quantity', '$reorderLevel'] }
    };

    if (warehouse) {
      query.warehouse = warehouse;
    }

    return await Product.find(query).sort({ quantity: 1 });
  }

  async getOutOfStockItems(warehouse = null) {
    const query = { quantity: 0 };
    
    if (warehouse) {
      query.warehouse = warehouse;
    }

    return await Product.find(query);
  }
}

module.exports = new ProductService();

