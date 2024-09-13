"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketIOMiddleware = void 0;
// Middleware para añadir io al objeto Request
const socketIOMiddleware = (io) => {
    return (req, _res, next) => {
        req.io = io;
        next();
    };
};
exports.socketIOMiddleware = socketIOMiddleware;
