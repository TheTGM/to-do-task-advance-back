import { Request, Response, NextFunction } from "express";
import { Server as SocketIOServer } from "socket.io";

// Middleware para añadir io al objeto Request
export const socketIOMiddleware = (io: SocketIOServer) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.io = io;
    next();
  };
};
