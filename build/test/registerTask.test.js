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
const taskService_1 = require("../service/taskService");
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const task_1 = __importDefault(require("../routes/task"));
jest.mock('../service/taskService', () => ({
    registerTask: jest.fn(),
}));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(task_1.default);
describe('POST /createTask', () => {
    const mockRequestData = {
        data: {
            iduser: 1,
            name: 'Test Task',
            description: 'This is a test task',
            status: 'pending',
        },
    };
    it('should create a task and return 201 with success message', () => __awaiter(void 0, void 0, void 0, function* () {
        taskService_1.registerTask.mockResolvedValue({
            message: 'Tarea creada correctamente bajo en ID: 1',
        });
        const response = yield (0, supertest_1.default)(app)
            .post('/createTask')
            .send(mockRequestData);
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            message: 'Tarea creada con exito',
            data: { message: 'Tarea creada correctamente bajo en ID: 1' },
        });
        expect(taskService_1.registerTask).toHaveBeenCalledWith(mockRequestData.data);
    }));
    it('should return 400 if task creation fails with validation error', () => __awaiter(void 0, void 0, void 0, function* () {
        taskService_1.registerTask.mockResolvedValue({
            error: ['Validation error 1', 'Validation error 2'],
        });
        const response = yield (0, supertest_1.default)(app)
            .post('/createTask')
            .send(mockRequestData);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            taskCreate: { error: ['Validation error 1', 'Validation error 2'] },
        });
    }));
    it('should return 500 if there is an internal server error', () => __awaiter(void 0, void 0, void 0, function* () {
        taskService_1.registerTask.mockRejectedValue(new Error('Internal server error'));
        const response = yield (0, supertest_1.default)(app)
            .post('/createTask')
            .send(mockRequestData);
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Internal server error' });
    }));
});
