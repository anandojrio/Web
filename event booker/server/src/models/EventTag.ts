import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Fields: eventId, tagId
interface EventTagAttributes {
  id: number;
  eventId: number;
  tagId: number;
  createdAt?: Date;
  updatedAt?: Date;
}
interface EventTagCreationAttributes extends Optional<EventTagAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class EventTag extends Model<EventTagAttributes, EventTagCreationAttributes> implements EventTagAttributes {
  public id!: number;
  public eventId!: number;
  public tagId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

EventTag.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    eventId: { type: DataTypes.INTEGER, allowNull: false },
    tagId: { type: DataTypes.INTEGER, allowNull: false }
  },
  {
    sequelize,
    modelName: 'EventTag',
    tableName: 'event_tags',
    timestamps: true
  }
);

export { EventTag };
