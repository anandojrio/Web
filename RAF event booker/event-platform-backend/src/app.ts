import express, { Application } from 'express';
import cors from 'cors';
import { sequelize } from './config/db';
import createAdmin from './utils/seed'; // Import the seed function

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Event Platform Backend is running!');
});

// Database connection and initialization
async function initializeApp() {
  try {
    // 1. Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connected!');

    // 2. Sync models (alter in development only)
    await sequelize.sync({ 
      alter: process.env.NODE_ENV !== 'production'
    });
    console.log('✅ Models synchronized!');

    // 3. Create admin (only in development)
    if (process.env.NODE_ENV !== 'production') {
      await createAdmin();
    }

    // 4. Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
  }
}

initializeApp();

// Start the application
initializeApp();

export default app;