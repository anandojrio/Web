"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Correct implementation that satisfies TypeScript and Sequelize
class User extends sequelize_1.Model {
    // Optional: Add password comparison method
    comparePassword(candidatePassword) {
        return bcryptjs_1.default.compareSync(candidatePassword, this.password);
    }
}
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
        },
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    role: {
        type: sequelize_1.DataTypes.ENUM('admin', 'event_creator'),
        defaultValue: 'event_creator',
        allowNull: false,
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('password', bcryptjs_1.default.hashSync(value, 10));
        },
        validate: {
            notEmpty: true,
            len: [6, 100],
        },
    },
}, {
    sequelize: db_1.sequelize,
    modelName: 'user',
    timestamps: true,
});
exports.default = User;
