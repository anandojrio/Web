"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
// Define the User model class
class User extends sequelize_1.Model {
    id;
    email;
    firstName;
    lastName;
    password;
    role;
    isActive;
    // Timestamps
    createdAt;
    updatedAt;
}
exports.User = User;
// Initialize the model
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true,
        },
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 100],
        },
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 100],
        },
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [6, 255], // Minimum password length
        },
    },
    role: {
        type: sequelize_1.DataTypes.ENUM('event creator', 'admin'),
        allowNull: false,
        defaultValue: 'event creator',
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    sequelize: db_1.sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['email'],
        },
    ],
});
