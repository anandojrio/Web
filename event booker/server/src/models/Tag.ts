import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// 1. Tag field definitions
interface TagAttributes {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TagCreationAttributes extends Optional<TagAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Tag extends Model<TagAttributes, TagCreationAttributes> implements TagAttributes {
  public id!: number;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Tag.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { notEmpty: true } }
  },
  {
    sequelize,
    modelName: 'Tag',
    tableName: 'tags',
    timestamps: true
  }
);

import { Event } from './Event';
import { EventTag } from './EventTag';

Tag.belongsToMany(Event, { through: EventTag, foreignKey: 'tagId', as: 'events' });


export { Tag };
