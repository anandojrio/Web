"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createAdmin;
const User_1 = __importDefault(require("../models/User"));
async function createAdmin() {
    try {
        const adminData = {
            email: 'admin@example.com',
            firstName: 'Admin',
            lastName: 'User',
            password: 'admin123',
            role: 'admin',
            isActive: true
        };
        // Check if admin exists
        const existingAdmin = await User_1.default.findOne({
            where: { email: adminData.email }
        });
        if (existingAdmin) {
            console.log('ℹ️ Admin user already exists:', existingAdmin.email);
            return existingAdmin;
        }
        // Create new admin
        const admin = await User_1.default.create(adminData);
        console.log('✅ Admin user created:', admin.email);
        return admin;
    }
    catch (error) {
        console.error('❌ Admin creation error:', error);
        throw error;
    }
}
