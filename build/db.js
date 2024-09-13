"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.sequelize = new sequelize_1.Sequelize(process.env.DB_NAME || "test", process.env.DB_USER || "mysql", process.env.DB_PASS || "password", {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: (msg) => console.log(`[Sequelize Log]: ${msg}`),
});
