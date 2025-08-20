import { Sequelize } from 'sequelize';
import path from 'path';

// Create path to database file
const dbPath = path.resolve(__dirname, '../../database.sqlite');

// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: 'sqlite',           // Database type
  storage: dbPath,             // Where to store database file
  logging: false,
});

// Test database connection
export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
  } catch (error) {
    console.error('❌ Unable to connect to database:', error);
    throw error;
  }
};

// Sync all models with database (create tables)
export const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ Database synchronized successfully');
  } catch (error) {
    console.error('❌ Database sync failed:', error);
    throw error;
  }
};

export { sequelize };