"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.loginUser = exports.registerUser = exports.getUserById = exports.getUsers = void 0;
const db_1 = require("../db");
const userSchema_1 = require("../schema/userSchema");
const sequelize_1 = require("sequelize");
const bcrypt_1 = __importDefault(require("bcrypt"));
const functions_1 = require("../utils/functions");
const getUsers = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, pageSize = 10) {
    if (!page || !pageSize) {
        page = 1;
        pageSize = 10;
    }
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    let totalItems = yield db_1.sequelize.query("SELECT COUNT(*) FROM User", {
        type: sequelize_1.QueryTypes.SELECT,
    });
    totalItems = Object.values(totalItems[0])[0];
    const task = yield db_1.sequelize.query("SELECT * FROM User LIMIT :limit OFFSET :offset", {
        replacements: {
            limit: limit,
            offset: offset,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const totalPages = Math.ceil(Number(totalItems) / pageSize);
    return {
        data: task,
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalItems,
    };
});
exports.getUsers = getUsers;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.sequelize.query("SELECT * FROM User WHERE iduser = :id", {
            replacements: { id: id },
            type: sequelize_1.QueryTypes.SELECT,
        });
        if (user.length === 0) {
            return { error: "No se encuentra el usuario" };
        }
        return user;
    }
    catch (error) {
        console.error(error);
        return { error: "Error recuperando el usuario" };
    }
});
exports.getUserById = getUserById;
const registerUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield db_1.sequelize.transaction();
    try {
        const { error } = userSchema_1.userSchema.validate(data, { abortEarly: false });
        if (error) {
            return { error: error.details.map((detail) => detail.message) };
        }
        const existingUser = yield db_1.sequelize.query(`SELECT email FROM User WHERE email = :email`, {
            replacements: { email: data.email },
            type: sequelize_1.QueryTypes.SELECT,
        });
        if (existingUser.length > 0) {
            return { error: [`El correo ${data.email} ya está registrado.`] };
        }
        const hashpass = yield bcrypt_1.default.hash(data.passwordhash, 10);
        const task = yield db_1.sequelize.query(`INSERT INTO User 
    (firstname, lastname, phone, email, passwordhash, role) 
   VALUES (:firstname, :lastname, :phone, :email, :passwordhash, :role)`, {
            replacements: {
                firstname: data.firstname,
                lastname: data.lastname,
                phone: data.phone,
                email: data.email,
                passwordhash: hashpass,
                role: data.role,
            },
            type: sequelize_1.QueryTypes.INSERT,
        });
        yield transaction.commit();
        return { message: `Usuario creado con exito bajo el id: ${task[0]}` };
    }
    catch (error) {
        yield transaction.rollback();
        console.error(error);
        throw error;
    }
});
exports.registerUser = registerUser;
const loginUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = userSchema_1.loginSchema.validate(data, { abortEarly: false });
        if (error) {
            return { error: error.details.map((detail) => detail.message) };
        }
        const row = yield db_1.sequelize.query("SELECT * FROM User WHERE email = :email", {
            replacements: { email: data.email },
            type: sequelize_1.QueryTypes.SELECT,
        });
        if (row.length === 0)
            return { error: ["No se encuentra el usuario"] };
        const user = row[0];
        return (0, functions_1.login)(data, user);
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
exports.loginUser = loginUser;
const updateUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield db_1.sequelize.transaction();
    try {
        const { error } = userSchema_1.putUserSchema.validate(data, { abortEarly: false });
        if (error) {
            return { error: error.details.map((detail) => detail.message) };
        }
        const [affectedRows] = yield db_1.sequelize.query(`UPDATE User 
        SET firstname = :firstname, lastname = :lastname, phone = :phone, role = :role
        WHERE iduser = :iduser`, {
            replacements: {
                iduser: data.iduser,
                firstname: data.firstname,
                lastname: data.lastname,
                phone: data.phone,
                role: data.role,
            },
            type: sequelize_1.QueryTypes.UPDATE,
            transaction,
        });
        if (affectedRows === 0) {
            yield transaction.rollback();
            return { error: "No se encuentra el usuario or no changes made" };
        }
        yield transaction.commit();
        return { success: true, message: "Usuario actualizado con exito" };
    }
    catch (error) {
        yield transaction.rollback();
        console.error(error);
        throw error;
    }
});
exports.updateUser = updateUser;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield db_1.sequelize.transaction();
    try {
        yield db_1.sequelize.query(`DELETE FROM Task WHERE iduser = :iduser`, {
            replacements: { iduser: id },
            type: sequelize_1.QueryTypes.DELETE,
            transaction,
        });
        yield db_1.sequelize.query(`DELETE FROM User WHERE iduser = :iduser`, {
            replacements: { iduser: id },
            type: sequelize_1.QueryTypes.DELETE,
            transaction,
        });
        yield transaction.commit();
        return { success: true, iduser: id };
    }
    catch (error) {
        yield transaction.rollback();
        console.error(error);
        throw error;
    }
});
exports.deleteUser = deleteUser;
