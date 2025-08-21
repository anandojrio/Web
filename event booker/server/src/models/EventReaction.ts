import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface EventReactionAttributes {
  id: number;
  eventId: number;
  userId: number | null;       // null for guests (if supporting IP-based; else make required)
  reaction: 'like' | 'dislike';
  ip: string | null;           // for guests, store IP
  createdAt?: Date;
  updatedAt?: Date;
}

interface EventReactionCreationAttributes
  extends Optional<EventReactionAttributes, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'ip'> {}

class EventReaction extends Model<EventReactionAttributes, EventReactionCreationAttributes>
  implements EventReactionAttributes {
  public id!: number;
  public eventId!: number;
  public userId!: number | null;
  public reaction!: 'like' | 'dislike';
  public ip!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

EventReaction.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    eventId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    reaction: { type: DataTypes.ENUM('like', 'dislike'), allowNull: false },
    ip: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: 'EventReaction',
    tableName: 'event_reactions',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['eventId', 'userId', 'ip'] // Only one reaction per event per user or per IP
      }
    ]
  }
);

export { EventReaction };
