import { User } from '../models/User';
import { CreationAttributes } from 'sequelize'; // Add this import

// Use CreationAttributes<User> to ensure type safety
interface AdminAttributes extends CreationAttributes<User> {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: 'admin';
  isActive: boolean;
}

export default async function createAdmin(): Promise<User> {
  try {
    const adminData: AdminAttributes = {
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      password: 'admin123',
      role: 'admin',
      isActive: true
    };

    const existingAdmin = await User.findOne({
      where: { email: adminData.email }
    });

    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists:', existingAdmin.email);
      return existingAdmin;
    }

    const admin = await User.create(adminData);
    console.log('✅ Admin user created:', admin.email);
    return admin;
  } catch (error) {
    console.error('❌ Admin creation error:', error);
    throw error;
  }
}