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
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../routes/user"));
const userService_1 = require("../service/userService");
jest.mock("../service/userService", () => ({
    loginUser: jest.fn(),
}));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(user_1.default);
describe("POST /loginUser", () => {
    const mockLoginData = {
        email: "john.doe@example.com",
        password: "securepassword",
    };
    it("should log in the user and return 200 with success message", () => __awaiter(void 0, void 0, void 0, function* () {
        userService_1.loginUser.mockResolvedValue({
            id: 1,
            firstname: "John",
            lastname: "Doe",
            email: "john.doe@example.com",
        });
        const response = yield (0, supertest_1.default)(app)
            .post("/loginUser")
            .send({ data: mockLoginData });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Usuario inicio sesión exitosamente",
            data: {
                id: 1,
                firstname: "John",
                lastname: "Doe",
                email: "john.doe@example.com",
            },
        });
        expect(userService_1.loginUser).toHaveBeenCalledWith(mockLoginData);
    }));
    it("should return 400 if login validation fails", () => __awaiter(void 0, void 0, void 0, function* () {
        userService_1.loginUser.mockResolvedValue({
            error: ["Validation error 1", "Validation error 2"],
        });
        const response = yield (0, supertest_1.default)(app)
            .post("/loginUser")
            .send({ data: mockLoginData });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            dataUser: { error: ["Validation error 1", "Validation error 2"] },
        });
    }));
    it("should return 400 if user is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        userService_1.loginUser.mockResolvedValue({
            error: "No se encuentra el usuario",
        });
        const response = yield (0, supertest_1.default)(app)
            .post("/loginUser")
            .send({ data: mockLoginData });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            dataUser: { error: "No se encuentra el usuario" },
        });
    }));
    it("should return 500 if there is an internal server error", () => __awaiter(void 0, void 0, void 0, function* () {
        userService_1.loginUser.mockRejectedValue(new Error("Internal server error"));
        const response = yield (0, supertest_1.default)(app)
            .post("/loginUser")
            .send({ data: mockLoginData });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            message: "Internal server error",
        });
    }));
});
