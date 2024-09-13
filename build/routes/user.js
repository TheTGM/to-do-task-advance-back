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
const userService_1 = require("../service/userService");
const router = express_1.default.Router();
router.get("/getAllUsers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, pageSize } = req.query;
        const user = yield (0, userService_1.getUsers)(Number(page), Number(pageSize));
        return res.status(200).send(user);
    }
    catch (error) {
        return res.status(500).send(error);
    }
}));
router.get("/getUser/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield (0, userService_1.getUserById)(Number(id));
        return res.status(200).send({ user });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal server error" });
    }
}));
router.post("/registerUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        data.role = "user";
        const userCreate = yield (0, userService_1.registerUser)(data);
        if (userCreate.hasOwnProperty("error")) {
            return res.status(400).send({ userCreate });
        }
        return res
            .status(201)
            .send({ message: "Usuario creado con exito", data: userCreate });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal server error" });
    }
}));
router.post("/loginUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        const dataUser = yield (0, userService_1.loginUser)(data);
        if (dataUser.hasOwnProperty("error")) {
            return res.status(400).send({ dataUser });
        }
        return res
            .status(200)
            .json({ message: "Usuario inicio sesión exitosamente", data: dataUser });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal server error" });
    }
}));
router.put("/putUser/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { data } = req.body;
        const user = yield (0, userService_1.updateUser)(Object.assign(Object.assign({}, data), { iduser: Number(id) }));
        if (user.hasOwnProperty("error")) {
            return res.status(400).send({ user });
        }
        return res.status(200).send({ user });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal server error" });
    }
}));
router.delete("/deleteUser/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield (0, userService_1.deleteUser)(Number(id));
        if (user.hasOwnProperty("error")) {
            return res.status(400).send(user);
        }
        return res.status(200).send(user);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal server error" });
    }
}));
exports.default = router;
