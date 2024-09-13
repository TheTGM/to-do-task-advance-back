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
const task_1 = __importDefault(require("../routes/task"));
const taskService_1 = require("../service/taskService");
jest.mock("../service/taskService", () => ({
    updateTask: jest.fn(),
}));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(task_1.default);
describe("PUT /putTask/:id", () => {
    const mockRequestData = {
        name: "Updated Task",
        description: "This is an updated task",
        status: "completed",
    };
    it("should update the task and return 200 with success message", () => __awaiter(void 0, void 0, void 0, function* () {
        taskService_1.updateTask.mockResolvedValue({
            success: true,
            message: "Tarea actualizada con exito",
        });
        const response = yield (0, supertest_1.default)(app)
            .put("/putTask/1")
            .send({ data: mockRequestData });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            task: {
                success: true,
                message: "Tarea actualizada con exito",
            },
        });
        expect(taskService_1.updateTask).toHaveBeenCalledWith(1, mockRequestData);
    }));
    it("should return 400 if task update fails due to validation error", () => __awaiter(void 0, void 0, void 0, function* () {
        taskService_1.updateTask.mockResolvedValue({
            error: ["Validation error 1", "Validation error 2"],
        });
        const response = yield (0, supertest_1.default)(app)
            .put("/putTask/1")
            .send({ data: mockRequestData });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            task: { error: ["Validation error 1", "Validation error 2"] },
        });
    }));
    it("should return 500 if there is an internal server error", () => __awaiter(void 0, void 0, void 0, function* () {
        taskService_1.updateTask.mockRejectedValue(new Error("Internal server error"));
        const response = yield (0, supertest_1.default)(app)
            .put("/putTask/1")
            .send({ data: mockRequestData });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: "Internal server errorx" });
    }));
});
