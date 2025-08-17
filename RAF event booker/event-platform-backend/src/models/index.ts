import { sequelize } from '../config/db';
import User from './User';
import Event from './Event';
import Category from './Category';
import Tag from './Tag';
import Comment from './Comment';
import RSVP from './RSVP';
import EventTag from './EventTag';

// User-Event (One-to-Many)
User.hasMany(Event, { foreignKey: 'authorId', as: 'events' });
Event.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

// Category-Event (One-to-Many)
Category.hasMany(Event, { foreignKey: 'categoryId' });
Event.belongsTo(Category, { foreignKey: 'categoryId' });

// Event-Comment (One-to-Many)
Event.hasMany(Comment, { foreignKey: 'eventId' });
Comment.belongsTo(Event, { foreignKey: 'eventId' });

// Event-RSVP (One-to-Many)
Event.hasMany(RSVP, { foreignKey: 'eventId' });
RSVP.belongsTo(Event, { foreignKey: 'eventId' });

// User-RSVP (One-to-Many - Optional)
User.hasMany(RSVP, { foreignKey: 'userId' });
RSVP.belongsTo(User, { foreignKey: 'userId' });

// Event-Tag (Many-to-Many)
Event.belongsToMany(Tag, { through: EventTag, foreignKey: 'eventId' });
Tag.belongsToMany(Event, { through: EventTag, foreignKey: 'tagId' });

export {
  sequelize,
  User,
  Event,
  Category,
  Tag,
  Comment,
  RSVP,
  EventTag,
};