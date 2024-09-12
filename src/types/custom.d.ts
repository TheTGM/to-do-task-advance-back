import { Server as SocketIOServer } from "socket.io";
import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    io?: SocketIOServer;
  }
}
