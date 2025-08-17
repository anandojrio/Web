import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db';
import bcrypt from 'bcryptjs';

interface UserAttributes {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'event_creator';
  isActive: boolean;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Correct implementation that satisfies TypeScript and Sequelize
class User extends Model<UserAttributes> implements UserAttributes {
  declare id: number;
  declare email: string;
  declare firstName: string;
  declare lastName: string;
  declare role: 'admin' | 'event_creator';
  declare isActive: boolean;
  declare password: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  // Optional: Add password comparison method
  comparePassword(candidatePassword: string): boolean {
    return bcrypt.compareSync(candidatePassword, this.password);
  }
}

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
    },
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  role: {
    type: DataTypes.ENUM('admin', 'event_creator'),
    defaultValue: 'event_creator',
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value: string) {
      this.setDataValue('password', bcrypt.hashSync(value, 10));
    },
    validate: {
      notEmpty: true,
      len: [6, 100],
    },
  },
}, {
  sequelize,
  modelName: 'user',
  timestamps: true,
});

export default User;