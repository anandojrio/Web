"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const auth_1 = require("../utils/auth");
const router = (0, express_1.Router)();
// Test route - to verify routes are working
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Auth routes are working!',
        timestamp: new Date().toISOString()
    });
});
// Register new user
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
        const existingUser = await User_1.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'Email already exists. Please use a different email.'
            });
        }
        // Hash password and create user
        const hashedPassword = await (0, auth_1.hashPassword)(password);
        const user = await User_1.User.create({
            email,
            firstName,
            lastName,
            password: hashedPassword,
            role: role || 'event creator',
            isActive: true,
        });
        // Generate JWT token
        const token = (0, auth_1.generateToken)(user.id, user.role);
        // Return success response (excluding password)
        res.status(201).json({
            success: true,
            message: 'User registered successfully!',
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
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error during registration.'
        });
    }
});
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
        const user = await User_1.User.findOne({ where: { email } });
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
        const isValidPassword = await (0, auth_1.verifyPassword)(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password.'
            });
        }
        // Generate JWT token
        const token = (0, auth_1.generateToken)(user.id, user.role);
        // Return success response
        res.json({
            success: true,
            message: 'Login successful!',
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
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error during login.'
        });
    }
});
exports.default = router;
