"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const seed_1 = __importDefault(require("./utils/seed")); // Import the seed function
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Test route
app.get('/', (req, res) => {
    res.send('Event Platform Backend is running!');
});
// Database connection and initialization
async function initializeApp() {
    try {
        // 1. Test database connection
        await db_1.sequelize.authenticate();
        console.log('✅ Database connected!');
        // 2. Sync models (alter in development only)
        await db_1.sequelize.sync({
            alter: process.env.NODE_ENV !== 'production'
        });
        console.log('✅ Models synchronized!');
        // 3. Create admin (only in development)
        if (process.env.NODE_ENV !== 'production') {
            await (0, seed_1.default)();
        }
        // 4. Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    }
    catch (error) {
        console.error('❌ Initialization failed:', error);
        process.exit(1);
    }
}
initializeApp();
// Start the application
initializeApp();
exports.default = app;
