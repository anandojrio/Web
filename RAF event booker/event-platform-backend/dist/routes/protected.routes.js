"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// This route requires authentication
router.get('/profile', auth_1.authenticate, (req, res) => {
    res.json({
        success: true,
        message: 'Protected route accessed successfully!',
        user: req.user // User data from JWT token
    });
});
// This route requires admin role
router.get('/admin-only', auth_1.authenticate, (0, auth_1.requireRole)(['admin']), (req, res) => {
    res.json({
        success: true,
        message: 'Admin route accessed successfully!',
        user: req.user
    });
});
// This route requires event creator or admin role
router.get('/event-management', auth_1.authenticate, (0, auth_1.requireRole)(['event creator', 'admin']), (req, res) => {
    res.json({
        success: true,
        message: 'Event management route accessed successfully!',
        user: req.user
    });
});
exports.default = router;
