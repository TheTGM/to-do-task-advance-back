import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";

export function setupSocketIO(server: HttpServer): SocketIOServer {
  const io = new SocketIOServer(server, {
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
