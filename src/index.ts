import express from "express";
import taskRoutes from "./routes/task";
import userRoutes from "./routes/user";
import { createServer } from "http";
import { setupSocketIO } from "./socket";
import { socketIOMiddleware } from "./middlewares/socket";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({
  origin: `${process.env.FRONTEND}`, // Reemplaza con la URL de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'access-token'],
}));

const port = 3000;

const server = createServer(app);

const io: SocketIOServer = setupSocketIO(server);

app.use(socketIOMiddleware(io));

app.use("/v1/user", userRoutes);
app.use("/v1/task", taskRoutes);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
