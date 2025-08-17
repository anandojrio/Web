"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
class RSVP extends sequelize_1.Model {
    id;
    userIdentifier; // Can be email or ID
    // Foreign keys
    eventId;
    userId; // Optional for logged-in users
    createdAt;
    updatedAt;
}
RSVP.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userIdentifier: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: db_1.sequelize,
    modelName: 'rsvp',
});
exports.default = RSVP;
