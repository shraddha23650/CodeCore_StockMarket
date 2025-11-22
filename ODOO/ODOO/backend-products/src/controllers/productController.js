/**
 * Product Controller
 */

const productService = require('../services/productService');
const { sendSuccess, sendError } = require('../../shared/utils/response');

class ProductController {
  async createProduct(req, res, next) {
    try {
      const product = await productService.createProduct(req.body);
      return sendSuccess(res, 'Product created successfully', product, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAllProducts(req, res, next) {
    try {
      const filters = {
        warehouse: req.query.warehouse,
        category: req.query.category,
        search: req.query.search,
        lowStock: req.query.lowStock
      };

      const products = await productService.getAllProducts(filters);
      return sendSuccess(res, 'Products retrieved successfully', products);
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const product = await productService.getProductById(req.params.id);
      return sendSuccess(res, 'Product retrieved successfully', product);
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      return sendSuccess(res, 'Product updated successfully', product);
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      await productService.deleteProduct(req.params.id);
      return sendSuccess(res, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();

