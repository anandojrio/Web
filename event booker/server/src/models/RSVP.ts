import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface RSVPAttributes {
  id: number;
  userId: number;
  eventId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface RSVPCreationAttributes extends Optional<RSVPAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class RSVP extends Model<RSVPAttributes, RSVPCreationAttributes> implements RSVPAttributes {
  public id!: number;
  public userId!: number;
  public eventId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RSVP.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    eventId: { type: DataTypes.INTEGER, allowNull: false }
  },
  {
    sequelize,
    modelName: 'RSVP',
    tableName: 'rsvps',
    timestamps: true,
    indexes: [
      { unique: true, fields: ['userId', 'eventId'] }, // Prevent duplicate RSVPs
    ]
  }
);

export { RSVP };
