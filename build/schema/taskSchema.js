"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskSchema = exports.taskSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.taskSchema = joi_1.default.object({
    iduser: joi_1.default.number().integer().required().messages({
        "number.base": "User ID must be a number",
        "any.required": "User ID is required",
    }),
    name: joi_1.default.string().required().messages({
        "string.empty": "Task name is required",
    }),
    description: joi_1.default.string().allow(null, "").optional(),
    status: joi_1.default.string().valid("enabled", "disabled").required().messages({
        "any.only": 'Status must be either "enable" or "disable"',
        "any.required": "Status is required",
    }),
});
exports.updateTaskSchema = joi_1.default.object({
    name: joi_1.default.string().required().messages({
        "string.empty": "Task name is required",
    }),
    description: joi_1.default.string().allow(null, "").optional(),
    status: joi_1.default.string().valid("enabled", "disabled").required().messages({
        "any.only": 'Status must be either "enable" or "disable"',
        "any.required": "Status is required",
    }),
});
