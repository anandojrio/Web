import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db';

class Event extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public eventDate!: Date;
  public location!: string;
  public views!: number;
  public maxCapacity!: number | null;

  // Foreign keys
  public authorId!: number;
  public categoryId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    eventDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    maxCapacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
      },
    },
  },
  {
    sequelize,
    modelName: 'event',
  }
);

export default Event;