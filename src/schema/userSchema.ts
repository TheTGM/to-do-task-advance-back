import Joi from "joi";
export const userSchema = Joi.object({
  firstname: Joi.string().min(2).max(50).required().messages({
    "string.base": "El nombre debe ser un texto",
    "string.empty": "El nombre es obligatorio",
    "string.min": "El nombre debe tener al menos 2 caracteres",
    "any.required": "El nombre es obligatorio",
  }),
  lastname: Joi.string().min(2).max(50).required().messages({
    "string.base": "El apellido debe ser un texto",
    "string.empty": "El apellido es obligatorio",
    "string.min": "El apellido debe tener al menos 2 caracteres",
    "any.required": "El apellido es obligatorio",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .max(15)
    .required()
    .messages({
      "string.pattern.base": "El teléfono debe contener solo números",
      "string.empty": "El teléfono es obligatorio",
      "string.min": "El teléfono debe tener al menos 10 dígitos",
      "any.required": "El teléfono es obligatorio",
    }),
  email: Joi.string().email().required().messages({
    "string.email": "El correo electrónico debe ser válido",
    "any.required": "El correo electrónico es obligatorio",
  }),
  passwordhash: Joi.string().min(8).required().messages({
    "string.min": "La contraseña debe tener al menos 8 caracteres",
    "any.required": "La contraseña es obligatoria",
  }),
  role: Joi.string().valid("admin", "user").required().messages({
    "any.only": "El rol debe ser admin o user",
    "any.required": "El rol es obligatorio",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "El correo electrónico debe ser válido",
    "any.required": "El correo electrónico es obligatorio",
  }),
  passwordhash: Joi.string().min(8).required().messages({
    "string.min": "La contraseña debe tener al menos 8 caracteres",
    "any.required": "La contraseña es obligatoria",
  }),
});

export const putUserSchema = Joi.object({
  iduser: Joi.number().integer().positive().required().messages({
    'number.base': 'El ID de usuario debe ser un número',
    'number.integer': 'El ID de usuario debe ser un número entero',
    'number.positive': 'El ID de usuario debe ser un número positivo',
    'any.required': 'El ID de usuario es obligatorio',
  }),
  firstname: Joi.string().min(2).max(50).required().messages({
    'string.base': 'El nombre debe ser un texto',
    'string.empty': 'El nombre es obligatorio',
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'any.required': 'El nombre es obligatorio',
  }),
  lastname: Joi.string().min(2).max(50).required().messages({
    'string.base': 'El apellido debe ser un texto',
    'string.empty': 'El apellido es obligatorio',
    'string.min': 'El apellido debe tener al menos 2 caracteres',
    'any.required': 'El apellido es obligatorio',
  }),
  phone: Joi.string().pattern(/^[0-9]+$/).min(10).max(15).required().messages({
    'string.pattern.base': 'El teléfono debe contener solo números',
    'string.empty': 'El teléfono es obligatorio',
    'string.min': 'El teléfono debe tener al menos 10 dígitos',
    'any.required': 'El teléfono es obligatorio',
  }),
  role: Joi.string().valid('admin', 'user').required().messages({
    'any.only': 'El rol debe ser admin o user',
    'any.required': 'El rol es obligatorio',
  }),
});
