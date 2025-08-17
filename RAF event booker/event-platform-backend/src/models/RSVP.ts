import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db';

class RSVP extends Model {
  public id!: number;
  public userIdentifier!: string; // Can be email or ID

  // Foreign keys
  public eventId!: number;
  public userId?: number; // Optional for logged-in users

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RSVP.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userIdentifier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'rsvp',
  }
);

export default RSVP;