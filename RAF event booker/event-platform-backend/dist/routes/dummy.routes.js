"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Handles GET /api/dummy
router.get('/', (req, res) => {
    res.json({ message: 'Dummy route working!' });
});
// Export as default (this is crucial)
exports.default = router;
