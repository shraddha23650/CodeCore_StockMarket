/**
 * Authentication Controller
 */

const authService = require('../services/authService');
const { sendSuccess, sendError } = require('../../shared/utils/response');

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      return sendSuccess(res, 'User registered successfully', result, 201);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return sendError(res, 'Email and password are required', 400);
      }

      const result = await authService.login(email, password);
      return sendSuccess(res, 'Login successful', result);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.userId);
      return sendSuccess(res, 'Profile retrieved successfully', user);
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      
      if (!email) {
        return sendError(res, 'Email is required', 400);
      }

      const result = await authService.forgotPassword(email);
      return sendSuccess(res, result.message, result);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { email, otp, newPassword } = req.body;
      
      if (!email || !otp || !newPassword) {
        return sendError(res, 'Email, OTP, and new password are required', 400);
      }

      if (newPassword.length < 6) {
        return sendError(res, 'Password must be at least 6 characters', 400);
      }

      const result = await authService.resetPassword(email, otp, newPassword);
      return sendSuccess(res, result.message);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const { name, email } = req.body;
      const user = await authService.updateProfile(req.user.userId, { name, email });
      return sendSuccess(res, 'Profile updated successfully', user);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return sendError(res, 'Current password and new password are required', 400);
      }

      if (newPassword.length < 6) {
        return sendError(res, 'Password must be at least 6 characters', 400);
      }

      const result = await authService.changePassword(req.user.userId, currentPassword, newPassword);
      return sendSuccess(res, result.message);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();

