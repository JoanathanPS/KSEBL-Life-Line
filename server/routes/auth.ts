import { Router } from 'express';
import { db } from '../db.js';
import { users } from '../../shared/schema.js';
import { eq } from 'drizzle-orm';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import bcrypt from 'bcrypt';
import { generateTokens } from '../utils/jwt.js';

const router = Router();

// Login endpoint
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw ApiError.badRequest('Email and password are required');
    }

    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    if (!user.isActive) {
      throw ApiError.unauthorized('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    // Generate tokens
    const tokens = generateTokens({ userId: user.id, role: user.role });

    // Return user data without password
    const { passwordHash, ...userData } = user;

    res.json(ApiResponse.success({
      user: userData,
      tokens,
    }, 'Login successful'));
  } catch (error) {
    next(error);
  }
});

// Register endpoint
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, fullName, role, phone } = req.body;

    if (!email || !password || !fullName || !role) {
      throw ApiError.badRequest('Email, password, full name, and role are required');
    }

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      throw ApiError.badRequest('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        fullName,
        role,
        phone,
      })
      .returning();

    // Generate tokens
    const tokens = generateTokens({ userId: newUser.id, role: newUser.role });

    // Return user data without password
    const { passwordHash: _, ...userData } = newUser;

    res.status(201).json(ApiResponse.created({
      user: userData,
      tokens,
    }, 'User registered successfully'));
  } catch (error) {
    next(error);
  }
});

// Refresh token endpoint
router.post('/refresh-token', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw ApiError.badRequest('Refresh token is required');
    }

    // Verify refresh token and get user
    const { userId } = verifyRefreshToken(refreshToken);
    
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user || !user.isActive) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    // Generate new tokens
    const tokens = generateTokens({ userId: user.id, role: user.role });

    res.json(ApiResponse.success({
      tokens,
    }, 'Token refreshed successfully'));
  } catch (error) {
    next(error);
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  res.json(ApiResponse.success({}, 'Logout successful'));
});

export default router;