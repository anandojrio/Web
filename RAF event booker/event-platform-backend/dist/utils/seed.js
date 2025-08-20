"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createAdmin;
const User_1 = require("../models/User");
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
        const existingAdmin = await User_1.User.findOne({
            where: { email: adminData.email }
        });
        if (existingAdmin) {
            console.log('ℹ️ Admin user already exists:', existingAdmin.email);
            return existingAdmin;
        }
        const admin = await User_1.User.create(adminData);
        console.log('✅ Admin user created:', admin.email);
        return admin;
    }
    catch (error) {
        console.error('❌ Admin creation error:', error);
        throw error;
    }
}
