"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
class Event extends sequelize_1.Model {
    id;
    title;
    description;
    eventDate;
    location;
    views;
    maxCapacity;
    // Foreign keys
    authorId;
    categoryId;
    createdAt;
    updatedAt;
}
Event.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    eventDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    location: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    views: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    maxCapacity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
        },
    },
}, {
    sequelize: db_1.sequelize,
    modelName: 'event',
});
exports.default = Event;
