"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// 1. Import the router
const dummy_routes_1 = __importDefault(require("./routes/dummy.routes"));
const app = (0, express_1.default)();
const PORT = 5000;
// 2. Mount the router at the url /api/dummy
app.use('/api/dummy', dummy_routes_1.default);
// Optional: sanity check root
app.get('/', (req, res) => {
    res.json({ message: 'Root is working.' });
});
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
