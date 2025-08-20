import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// This route requires authentication
router.get('/profile', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Protected route accessed successfully!',
    user: req.user // User data from JWT token
  });
});

// This route requires admin role
router.get('/admin-only', authenticate, requireRole(['admin']), (req, res) => {
  res.json({
    success: true,
    message: 'Admin route accessed successfully!',
    user: req.user
  });
});

// This route requires event creator or admin role
router.get('/event-management', authenticate, requireRole(['event creator', 'admin']), (req, res) => {
  res.json({
    success: true,
    message: 'Event management route accessed successfully!',
    user: req.user
  });
});

export default router;