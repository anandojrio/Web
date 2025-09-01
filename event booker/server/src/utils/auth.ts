import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// JWT Secret
const JWT_SECRET = 'your-super-secret-key-change-in-production';
const SALT_ROUNDS = 12;

// Hash password pre cuvanja u bazi podataka
export const hashPassword = async (password: string): Promise<string> => {
  try {
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

// Compare password with hashed password from database
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

// Generate JWT token for user
export const generateToken = (userId: number, role: string): string => {
  try {
    return jwt.sign(
      { 
        userId, 
        role,
        iat: Math.floor(Date.now() / 1000) // time
      },
      JWT_SECRET,
      { expiresIn: '24h' } // Token expires in 24 hours
    );
  } catch (error) {
    throw new Error('Error generating token');
  }
};

// Verify and decode JWT token
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};