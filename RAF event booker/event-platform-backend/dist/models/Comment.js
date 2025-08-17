"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
class Comment extends sequelize_1.Model {
    id;
    authorName;
    text;
    likes;
    dislikes;
    // Foreign key
    eventId;
    createdAt;
    updatedAt;
}
Comment.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    authorName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    text: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    likes: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    dislikes: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    sequelize: db_1.sequelize,
    modelName: 'comment',
});
exports.default = Comment;
