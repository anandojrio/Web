"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventTag = exports.RSVP = exports.Comment = exports.Tag = exports.Category = exports.Event = exports.User = exports.sequelize = void 0;
const db_1 = require("../config/db");
Object.defineProperty(exports, "sequelize", { enumerable: true, get: function () { return db_1.sequelize; } });
const User_1 = require("./User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
const Event_1 = __importDefault(require("./Event"));
exports.Event = Event_1.default;
const Category_1 = __importDefault(require("./Category"));
exports.Category = Category_1.default;
const Tag_1 = __importDefault(require("./Tag"));
exports.Tag = Tag_1.default;
const Comment_1 = __importDefault(require("./Comment"));
exports.Comment = Comment_1.default;
const RSVP_1 = __importDefault(require("./RSVP"));
exports.RSVP = RSVP_1.default;
const EventTag_1 = __importDefault(require("./EventTag"));
exports.EventTag = EventTag_1.default;
// User-Event (One-to-Many)
User_1.User.hasMany(Event_1.default, { foreignKey: 'authorId', as: 'events' });
Event_1.default.belongsTo(User_1.User, { foreignKey: 'authorId', as: 'author' });
// Category-Event (One-to-Many)
Category_1.default.hasMany(Event_1.default, { foreignKey: 'categoryId' });
Event_1.default.belongsTo(Category_1.default, { foreignKey: 'categoryId' });
// Event-Comment (One-to-Many)
Event_1.default.hasMany(Comment_1.default, { foreignKey: 'eventId' });
Comment_1.default.belongsTo(Event_1.default, { foreignKey: 'eventId' });
// Event-RSVP (One-to-Many)
Event_1.default.hasMany(RSVP_1.default, { foreignKey: 'eventId' });
RSVP_1.default.belongsTo(Event_1.default, { foreignKey: 'eventId' });
// User-RSVP (One-to-Many - Optional)
User_1.User.hasMany(RSVP_1.default, { foreignKey: 'userId' });
RSVP_1.default.belongsTo(User_1.User, { foreignKey: 'userId' });
// Event-Tag (Many-to-Many)
Event_1.default.belongsToMany(Tag_1.default, { through: EventTag_1.default, foreignKey: 'eventId' });
Tag_1.default.belongsToMany(Event_1.default, { through: EventTag_1.default, foreignKey: 'tagId' });
