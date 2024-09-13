"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_1 = __importDefault(require("./routes/task"));
const user_1 = __importDefault(require("./routes/user"));
const http_1 = require("http");
const socket_1 = require("./socket");
const socket_2 = require("./middlewares/socket");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173', // Reemplaza con la URL de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'access-token'],
}));
const port = 3000;
const server = (0, http_1.createServer)(app);
const io = (0, socket_1.setupSocketIO)(server);
app.use((0, socket_2.socketIOMiddleware)(io));
app.use("/v1/user", user_1.default);
app.use("/v1/task", task_1.default);
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
