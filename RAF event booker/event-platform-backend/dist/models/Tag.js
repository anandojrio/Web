"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
class Tag extends sequelize_1.Model {
    id;
    name;
    createdAt;
    updatedAt;
}
Tag.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
        },
    },
}, {
    sequelize: db_1.sequelize,
    modelName: 'tag',
});
exports.default = Tag;
