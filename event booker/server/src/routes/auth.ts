import { Router } from 'express';
import { User } from '../models/User';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { authenticate } from '../middleware/auth';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, firstName, lastName, password, role } = req.body;

    // provera polja
    if (!email || !firstName || !lastName || !password) {
      return res.status(400).json({
        success: false,
        error: 'All fields (email, firstName, lastName, password) are required.'
      });
    }

    // Cprovera da li vec postoji
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
      role: role || 'event creator', // Default event creator
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
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // provera polja
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
    sameSite: "lax",
    secure: false
});
    // Return user data (bez sifre) and token
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
    sameSite: 'lax', 
    secure: false
  });
  res.json({ success: true, message: 'Logged out successfully' });
});


// GET /api/auth/me – vraca info o trenutnom ulogovanom korisniku, ili 401 if not authenticated
router.get('/me',authenticate ,async (req, res) => {
  try {
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