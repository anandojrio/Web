import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db';

class EventTag extends Model {
  public eventId!: number;
  public tagId!: number;
}

EventTag.init(
  {
    eventId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    tagId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: 'event_tag',
    timestamps: false,
  }
);

export default EventTag;