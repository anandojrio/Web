"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
class EventTag extends sequelize_1.Model {
    eventId;
    tagId;
}
EventTag.init({
    eventId: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
    },
    tagId: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
    },
}, {
    sequelize: db_1.sequelize,
    modelName: 'event_tag',
    timestamps: false,
});
exports.default = EventTag;
