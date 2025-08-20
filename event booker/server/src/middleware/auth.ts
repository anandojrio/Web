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

// Middleware to check if user is authenticated
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header (format: "Bearer token")
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        error: 'Access denied. No token provided.' 
      });
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);
    
    // Verify token and get user data
    const decoded = verifyToken(token);
    req.user = decoded; // Attach user data to request object
    
    next(); // Continue to next middleware/route handler
  } catch (error) {
    res.status(401).json({ 
      success: false,
      error: 'Invalid or expired token.' 
    });
  }
};

// Middleware to check if user has required role(s)
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
    
    next(); // User has required role, continue
  };
};

// Helper middleware combinations
export const requireAdmin = requireRole(['admin']);
export const requireEventCreatorOrAdmin = requireRole(['event creator', 'admin']);