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
jest.mock('../service/userService', () => ({
    registerUser: jest.fn(),
}));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(user_1.default);
describe('POST /registerUser', () => {
    const mockRequestData = {
        firstname: 'John',
        lastname: 'Doe',
        phone: '123456789',
        email: 'john.doe@example.com',
        passwordhash: 'securepassword',
    };
    it('should register a user and return 201 with success message', () => __awaiter(void 0, void 0, void 0, function* () {
        userService_1.registerUser.mockResolvedValue({
            message: 'Usuario creado con exito bajo el id: 1',
        });
        const response = yield (0, supertest_1.default)(app)
            .post('/registerUser')
            .send({ data: mockRequestData });
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            message: 'Usuario creado con exito',
            data: { message: 'Usuario creado con exito bajo el id: 1' },
        });
        expect(userService_1.registerUser).toHaveBeenCalledWith(Object.assign(Object.assign({}, mockRequestData), { role: 'user' }));
    }));
    it('should return 400 if user registration fails due to validation error', () => __awaiter(void 0, void 0, void 0, function* () {
        userService_1.registerUser.mockResolvedValue({
            error: ['Validation error 1', 'Validation error 2'],
        });
        const response = yield (0, supertest_1.default)(app)
            .post('/registerUser')
            .send({ data: mockRequestData });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            userCreate: { error: ['Validation error 1', 'Validation error 2'] },
        });
    }));
    it('should return 500 if there is an internal server error', () => __awaiter(void 0, void 0, void 0, function* () {
        userService_1.registerUser.mockRejectedValue(new Error('Internal server error'));
        const response = yield (0, supertest_1.default)(app)
            .post('/registerUser')
            .send({ data: mockRequestData });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Internal server error' });
    }));
});
