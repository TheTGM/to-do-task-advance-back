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
const express_1 = __importDefault(require("express"));
const taskService_1 = require("../service/taskService");
const authSession_1 = require("../middlewares/authSession");
const router = express_1.default.Router();
router.get("/getAllTasks", authSession_1.authSession, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, pageSize } = req.query;
        const tasks = yield (0, taskService_1.getTasks)(Number(page), Number(pageSize));
        return res.status(200).send(tasks);
    }
    catch (error) {
        return res.status(500).send(error);
    }
}));
router.get("/getTask/:id", authSession_1.authSession, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const task = yield (0, taskService_1.getTaskById)(Number(id));
        return res.status(200).send({ task });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal server error" });
    }
}));
router.get("/getTaskUser/:id", authSession_1.authSession, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const task = yield (0, taskService_1.getTaskByUserId)(Number(id));
        return res.status(200).send({ task });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal server error" });
    }
}));
router.post("/createTask", authSession_1.authSession, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        const taskCreate = yield (0, taskService_1.registerTask)(data);
        if (taskCreate.hasOwnProperty("error")) {
            return res.status(400).send({ taskCreate });
        }
        if (req.io) {
            req.io.emit("createTask", taskCreate);
        }
        return res
            .status(201)
            .send({ message: "Tarea creada con exito", data: taskCreate });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal server error" });
    }
}));
router.put("/putTask/:id", authSession_1.authSession, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { data } = req.body;
        const task = yield (0, taskService_1.updateTask)(Number(id), data);
        if (task.hasOwnProperty("error")) {
            return res.status(400).send({ task });
        }
        if (req.io) {
            req.io.emit("putTask", task);
        }
        return res.status(200).send({ task: task });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal server errorx" });
    }
}));
router.delete("/deleteTask/:id", authSession_1.authSession, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const task = yield (0, taskService_1.deleteTask)(Number(id));
        if (task.hasOwnProperty("error")) {
            return res.status(400).send(task);
        }
        if (req.io) {
            req.io.emit("deleteTask", task);
        }
        return res.status(200).send(task);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal server error" });
    }
}));
exports.default = router;
