"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketIO = setupSocketIO;
const socket_io_1 = require("socket.io");
function setupSocketIO(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST", "PUT", "DELETE"],
        },
    });
    io.on("connection", (socket) => {
        console.log("A user connected");
        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
        socket.on("message", (msg) => {
            console.log("Message received:", msg);
            io.emit("message", msg);
        });
    });
    return io;
}
