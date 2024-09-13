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
jest.mock('../service/taskService', () => ({
    deleteTask: jest.fn(),
}));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(task_1.default);
describe('DELETE /deleteTask/:id', () => {
    it('should delete the task and return 200 with success message', () => __awaiter(void 0, void 0, void 0, function* () {
        taskService_1.deleteTask.mockResolvedValue({
            success: true,
            idtask: 1,
        });
        const response = yield (0, supertest_1.default)(app)
            .delete('/deleteTask/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            idtask: 1,
        });
        expect(taskService_1.deleteTask).toHaveBeenCalledWith(1);
    }));
    it('should return 400 if task deletion fails due to an error', () => __awaiter(void 0, void 0, void 0, function* () {
        taskService_1.deleteTask.mockResolvedValue({
            error: 'No se encuentra la tarea or could not be deleted',
        });
        const response = yield (0, supertest_1.default)(app)
            .delete('/deleteTask/1');
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: 'No se encuentra la tarea or could not be deleted',
        });
    }));
    it('should return 500 if there is an internal server error', () => __awaiter(void 0, void 0, void 0, function* () {
        taskService_1.deleteTask.mockRejectedValue(new Error('Internal server error'));
        const response = yield (0, supertest_1.default)(app)
            .delete('/deleteTask/1');
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Internal server error' });
    }));
});
