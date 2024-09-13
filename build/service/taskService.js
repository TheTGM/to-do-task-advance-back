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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.registerTask = exports.getTaskByUserId = exports.getTaskById = exports.getTasks = void 0;
const db_1 = require("../db");
const taskSchema_1 = require("../schema/taskSchema");
const sequelize_1 = require("sequelize");
const getTasks = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, pageSize = 10) {
    if (!page || !pageSize) {
        page = 1;
        pageSize = 10;
    }
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    let totalItems = yield db_1.sequelize.query("SELECT COUNT(*) FROM Task", {
        type: sequelize_1.QueryTypes.SELECT,
    });
    totalItems = Object.values(totalItems[0])[0];
    const task = yield db_1.sequelize.query("SELECT * FROM Task LIMIT :limit OFFSET :offset", {
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
exports.getTasks = getTasks;
const getTaskById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield db_1.sequelize.query("SELECT * FROM Task WHERE idtask = :id", {
            replacements: { id: id },
            type: sequelize_1.QueryTypes.SELECT,
        });
        if (task.length === 0) {
            return { error: "No se encuentra la tarea" };
        }
        return task;
    }
    catch (error) {
        console.error(error);
        return { error: "Error recuperando la tarea" };
    }
});
exports.getTaskById = getTaskById;
const getTaskByUserId = (id_1, ...args_1) => __awaiter(void 0, [id_1, ...args_1], void 0, function* (id, page = 1, pageSize = 10) {
    try {
        if (!page || !pageSize) {
            page = 1;
            pageSize = 10;
        }
        const offset = (page - 1) * pageSize;
        const limit = pageSize;
        let totalItems = yield db_1.sequelize.query("SELECT COUNT(*) FROM Task WHERE iduser = :id", {
            replacements: { id: id },
            type: sequelize_1.QueryTypes.SELECT,
        });
        totalItems = Object.values(totalItems[0])[0];
        const task = yield db_1.sequelize.query("SELECT * FROM Task WHERE iduser = :id", {
            replacements: { id: id, limit: limit, offset: offset },
            type: sequelize_1.QueryTypes.SELECT,
        });
        const totalPages = Math.ceil(Number(totalItems) / pageSize);
        if (task.length === 0) {
            return { error: "No se encuentra el usuario" };
        }
        return {
            data: task,
            currentPage: page,
            totalPages: totalPages,
            totalItems: totalItems,
        };
    }
    catch (error) {
        console.error(error);
        return { error: "Error recuperando la tarea" };
    }
});
exports.getTaskByUserId = getTaskByUserId;
const registerTask = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield db_1.sequelize.transaction();
    try {
        const { error } = taskSchema_1.taskSchema.validate(data, { abortEarly: false });
        if (error) {
            return { error: error.details.map((detail) => detail.message) };
        }
        const task = yield db_1.sequelize.query(`INSERT INTO Task 
    (iduser, name, description, status) 
   VALUES (:iduser, :name, :description, status)`, {
            replacements: {
                iduser: data.iduser,
                name: data.name,
                description: data.description || null,
                status: data.status,
            },
            type: sequelize_1.QueryTypes.INSERT,
        });
        const [f_task] = yield db_1.sequelize.query(`SELECT * FROM Task WHERE idtask = :idtask`, {
            replacements: { idtask: task[0] },
            type: sequelize_1.QueryTypes.SELECT,
            transaction,
        });
        yield transaction.commit();
        return f_task;
    }
    catch (error) {
        yield transaction.rollback();
        console.error(error);
        throw error;
    }
});
exports.registerTask = registerTask;
const updateTask = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield db_1.sequelize.transaction();
    try {
        const { error } = taskSchema_1.updateTaskSchema.validate(data, { abortEarly: false });
        if (error) {
            return { error: error.details.map((detail) => detail.message) };
        }
        const [affectedRows] = yield db_1.sequelize.query(`UPDATE Task 
        SET name = :name, description = :description, status = :status
        WHERE idtask = :idtask`, {
            replacements: {
                name: data.name,
                description: data.description || null,
                status: data.status,
                idtask: id,
            },
            type: sequelize_1.QueryTypes.UPDATE,
            transaction,
        });
        if (affectedRows === 0) {
            yield transaction.rollback();
            return { error: "No se encuentra la tarea or no changes made" };
        }
        const [f_task] = yield db_1.sequelize.query(`SELECT * FROM Task WHERE idtask = :idtask`, {
            replacements: { idtask: id },
            type: sequelize_1.QueryTypes.SELECT,
            transaction,
        });
        yield transaction.commit();
        return { data: f_task, message: "Tarea actualizada con exito" };
    }
    catch (error) {
        yield transaction.rollback();
        console.error(error);
        throw error;
    }
});
exports.updateTask = updateTask;
const deleteTask = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield db_1.sequelize.transaction();
    try {
        yield db_1.sequelize.query(`DELETE FROM Task WHERE idtask = :idtask`, {
            replacements: { idtask: id },
            type: sequelize_1.QueryTypes.DELETE,
            transaction,
        });
        yield transaction.commit();
        return { success: true, idtask: id };
    }
    catch (error) {
        yield transaction.rollback();
        console.error(error);
        throw error;
    }
});
exports.deleteTask = deleteTask;
