import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Define what a User looks like in the database
interface UserAttributes {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: 'event creator' | 'admin';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// When creating a user, ID and timestamps are auto-generated
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Define the User model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public firstName!: string;
  public lastName!: string;
  public password!: string;
  public role!: 'event creator' | 'admin';
  public isActive!: boolean;
  
  // Timestamps are automatically managed by Sequelize
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the User model with database structure
User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100],
    },
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100],
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 255],
    },
  },
  role: {
    type: DataTypes.ENUM('event creator', 'admin'),
    allowNull: false,
    defaultValue: 'event creator',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['email'],
    },
  ],
});

export { User };