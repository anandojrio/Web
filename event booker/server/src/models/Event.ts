import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';
import { Category } from './Category';

// 1. Interface for Event attributes
interface EventAttributes {
  id: number;
  title: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  eventDate: Date;
  location: string;
  views: number;
  authorId: number;
  categoryId: number;
  maxCapacity?: number | null;
}

interface EventCreationAttributes extends Optional<EventAttributes, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'maxCapacity'> {}

// Model class for Event
class Event extends Model<EventAttributes, EventCreationAttributes> implements EventAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public eventDate!: Date;
  public location!: string;
  public views!: number;
  public authorId!: number;
  public categoryId!: number;
  public maxCapacity?: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize table definition for Sequelize
Event.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    eventDate: { type: DataTypes.DATE, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    views: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    authorId: { type: DataTypes.INTEGER, allowNull: false },
    categoryId: { type: DataTypes.INTEGER, allowNull: false },
    maxCapacity: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    sequelize,
    modelName: 'Event',
    tableName: 'events',
    timestamps: true,
  }
);

import { Tag } from './Tag';
import { EventTag } from './EventTag';
import { Comment } from './Comment';

Event.hasMany(Comment, { foreignKey: 'eventId', as: 'comments' });

// Many-to-many: Event <-> Tag via EventTag
Event.belongsToMany(Tag, { through: EventTag, foreignKey: 'eventId', as: 'tags' });



Event.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Event.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

export { Event };
