import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { connectDatabase, syncDatabase } from './config/database';
import { hashPassword } from './utils/auth';
import { User } from './models/User';
import { Category } from './models/Category';
import { Event } from './models/Event';
import { RSVP } from './models/RSVP';
import { Comment } from './models/Comment';
import { EventReaction } from './models/EventReaction';


import categoryRoutes from './routes/categories';
import eventRoutes from './routes/events';
import rsvpRoutes from './routes/rsvp';
import commentRoutes from './routes/comments';
import tagRoutes from './routes/tags';

// Import route files
import authRoutes from './routes/auth';
import cookieParser from 'cookie-parser';

const app: Application = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 Starting RAF Event Booker Backend...');

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true,                // Allow cookies, authorization headers, etc.
}));
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

User.hasMany(RSVP, { foreignKey: 'userId', as: 'rsvps' });
Event.hasMany(RSVP, { foreignKey: 'eventId', as: 'rsvps' });
RSVP.belongsTo(User, { foreignKey: 'userId', as: 'user' });
RSVP.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });
User.hasMany(EventReaction, { foreignKey: 'userId', as: 'eventReactions' });
Event.hasMany(EventReaction, { foreignKey: 'eventId', as: 'reactions' });
EventReaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });
EventReaction.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });
console.log('✅ Middleware configured');

// Health check route
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'RAF Event Booker API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API test route
app.get('/api/test', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API endpoint working!',
    timestamp: new Date().toISOString()
  });
});

app.use(cookieParser());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/events', rsvpRoutes);
app.use('/api', commentRoutes);
app.use('/api',tagRoutes);



// 404 handler for unknown routes
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /',
      'GET /api/test',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/test'
    ]
  });
});

// Global error handler
app.use((error: any, req: Request, res: Response, next: any) => {
  console.error('❌ Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message
  });
});

// Create default admin user
const createAdminUser = async () => {
  try {
    const adminEmail = 'admin@raf.rs';
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    
    if (!existingAdmin) {
      const hashedPassword = await hashPassword('admin123');
      await User.create({
        email: adminEmail,
        firstName: 'Admin',
        lastName: 'User',
        password: hashedPassword,
        role: 'admin',
        isActive: true
      });
      console.log('✅ Admin user created');
      console.log('   Email: admin@raf.rs');
      console.log('   Password: admin123');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
};

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await connectDatabase();

    console.log('🔄 Synchronizing database...');
    await syncDatabase(false); // Set to true to reset database

    
    console.log('🔄 Creating admin user...');
    await createAdminUser();

    // Start the server
    app.listen(PORT, () => {
  console.log(`\n============================================================`);
  console.log(`🎉 RAF EVENT BOOKER BACKEND STARTED ON: http://localhost:${PORT}`);
  console.log(`============================================================`);
  console.log(`Available endpoints:`);
  console.log(`- GET    /                (health check)`);
  console.log(`- GET    /api/test        (API test)`);
  console.log(`- POST   /api/auth/register`);
  console.log(`- POST   /api/auth/login`);
  console.log(`- GET    /api/auth/test`);
  console.log(`- GET    /api/categories`);
  console.log(`- etc...`);
  console.log(`============================================================`);
});


  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;