import Joi from "joi";

export const taskSchema = Joi.object({
  iduser: Joi.number().integer().required().messages({
    "number.base": "User ID must be a number",
    "any.required": "User ID is required",
  }),
  name: Joi.string().required().messages({
    "string.empty": "Task name is required",
  }),
  description: Joi.string().allow(null, "").optional(),
  status: Joi.string().valid("enabled", "disabled").required().messages({
    "any.only": 'Status must be either "enable" or "disable"',
    "any.required": "Status is required",
  }),
});

export const updateTaskSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Task name is required",
  }),
  description: Joi.string().allow(null, "").optional(),
  status: Joi.string().valid("enabled", "disabled").required().messages({
    "any.only": 'Status must be either "enable" or "disable"',
    "any.required": "Status is required",
  }),
});
