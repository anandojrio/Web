import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';

// Extend Express Request type to include user data
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        role: string;
        iat: number;
        exp: number;
      };
    }
  }
}

// Middleware to check if user is authenticated (cookie ili header)
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Prefer token from cookie
    const authHeader = req.header('Authorization');
    const token =
      req.cookies?.token ||
      (authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token.'
    });
  }
};

// Middleware to check if user has required role
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required.'
      });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions.'
      });
    }
    next();
  };
};

export const requireAdmin = requireRole(['admin']);
export const requireEventCreatorOrAdmin = requireRole(['event creator', 'admin']);
