"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticate = void 0;
const auth_1 = require("../utils/auth");
// Middleware to authenticate JWT tokens
const authenticate = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Access denied. No valid token provided.'
            });
        }
        const token = authHeader.replace('Bearer ', '');
        // Verify token
        const decoded = (0, auth_1.verifyToken)(token);
        req.user = decoded; // Attach user data to request
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            error: 'Invalid or expired token.'
        });
    }
};
exports.authenticate = authenticate;
// Middleware to require specific roles
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'Insufficient permissions. Access denied.'
            });
        }
        next();
    };
};
exports.requireRole = requireRole;
