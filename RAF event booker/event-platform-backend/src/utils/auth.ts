import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// JWT secret - in production, use environment variable
const JWT_SECRET = 'your-super-secret-key-here-change-in-production';
const SALT_ROUNDS = 12;

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

// Verify password
export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

// Generate JWT token
export const generateToken = (userId: number, role: string): string => {
  return jwt.sign(
    { userId, role }, 
    JWT_SECRET, 
    { expiresIn: '24h' } // Token expires in 24 hours
  );
};

// Verify JWT token
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};