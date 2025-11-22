/**
 * Authentication Service
 */

const User = require('../models/User');
const { generateToken, generateOTP } = require('../utils/jwt');
const logger = require('../../shared/utils/logger');

class AuthService {
  async register(userData) {
    const { name, email, password, role } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'staff'
    });

    // Generate token
    const token = generateToken(user._id, user.email, user.role);

    logger.info('User registered', { userId: user._id, email: user.email });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  async login(email, password) {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = generateToken(user._id, user.email, user.role);

    logger.info('User logged in', { userId: user._id, email: user.email });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  async getProfile(userId) {
    const user = await User.findById(userId).select('-password -otp');
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return { message: 'If email exists, OTP has been sent' };
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = {
      code: otp,
      expiresAt
    };
    await user.save();

    // In production, send OTP via email/SMS
    logger.info('OTP generated for password reset', { 
      email: user.email, 
      otp // Remove in production
    });

    return { message: 'If email exists, OTP has been sent', otp }; // Remove otp in production
  }

  async resetPassword(email, otp, newPassword) {
    const user = await User.findOne({ email });
    if (!user || !user.otp) {
      throw new Error('Invalid OTP');
    }

    // Check OTP
    if (user.otp.code !== otp) {
      throw new Error('Invalid OTP');
    }

    // Check expiration
    if (new Date() > user.otp.expiresAt) {
      user.otp = undefined;
      await user.save();
      throw new Error('OTP expired');
    }

    // Update password
    user.password = newPassword;
    user.otp = undefined;
    await user.save();

    logger.info('Password reset successful', { email: user.email });

    return { message: 'Password reset successful' };
  }

  async updateProfile(userId, updateData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Allow updating name and email only
    if (updateData.name) {
      user.name = updateData.name;
    }
    if (updateData.email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ email: updateData.email, _id: { $ne: userId } });
      if (existingUser) {
        throw new Error('Email already in use');
      }
      user.email = updateData.email;
    }

    await user.save();

    logger.info('Profile updated', { userId: user._id });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    logger.info('Password changed', { userId: user._id });

    return { message: 'Password changed successfully' };
  }
}

module.exports = new AuthService();

