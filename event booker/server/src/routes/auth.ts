import { Router } from 'express';
import { User } from '../models/User';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { authenticate } from '../middleware/auth';

const router = Router();

// POST /api/auth/register
// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, firstName, lastName, password, role } = req.body;

    // Validate required fields
    if (!email || !firstName || !lastName || !password) {
      return res.status(400).json({
        success: false,
        error: 'All fields (email, firstName, lastName, password) are required.'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists.'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      role: role || 'event creator', // Default to event creator
      isActive: true,
    });

    // Generate JWT token
    const token = generateToken(user.id, user.role);

    // Return user data (without password) and token
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isActive: user.isActive
        },
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /api/auth/login
// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.'
      });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated. Please contact administrator.'
      });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.role);

    res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax", // or "none" if using HTTPS on localhost
    secure: false    // true if using HTTPS in production
});
    // Return user data (without password) and token
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isActive: user.isActive
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /api/auth/logout
router.post('/logout',authenticate, (req, res) => {
  // Clear the JWT token cookie
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax', // or 'none' for cross-site with HTTPS
    secure: false    // true only for HTTPS
  });
  res.json({ success: true, message: 'Logged out successfully' });
});


// GET /api/auth/me – return currently logged-in user's info, or 401 if not authenticated
router.get('/me',authenticate ,async (req, res) => {
  try {
    // If using JWT verified via middleware, req.user should be set with userId and role
    // If using sessions, req.session.userId and req.session.role etc.
    // Adjust according to your middleware!
    const userId = req.user?.userId; 
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }
    const user = await User.findByPk(userId, {
      attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive']
    });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


export default router;