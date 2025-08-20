import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface CommentAttributes {
  id: number;
  eventId: number;
  authorName: string;
  text: string;
  likeCount: number;
  dislikeCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CommentCreationAttributes
  extends Optional<CommentAttributes, 'id' | 'likeCount' | 'dislikeCount' | 'createdAt' | 'updatedAt'> {}

class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
  public id!: number;
  public eventId!: number;
  public authorName!: string;
  public text!: string;
  public likeCount!: number;
  public dislikeCount!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Comment.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    eventId: { type: DataTypes.INTEGER, allowNull: false },
    authorName: { type: DataTypes.STRING, allowNull: false },
    text: { type: DataTypes.TEXT, allowNull: false },
    likeCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    dislikeCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
  },
  {
    sequelize,
    modelName: 'Comment',
    tableName: 'comments',
    timestamps: true
  }
);

import { Event } from './Event';
Comment.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

export { Comment };
