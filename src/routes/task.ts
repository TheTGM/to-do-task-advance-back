import express from "express";
import {
  deleteTask,
  getTaskById,
  getTaskByUserId,
  getTasks,
  registerTask,
  updateTask,
} from "../service/taskService";
import { authSession } from "../middlewares/authSession";
const router = express.Router();

router.get("/getAllTasks", authSession, async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const tasks = await getTasks(Number(page), Number(pageSize));
    return res.status(200).send(tasks);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.get("/getTask/:id", authSession, async (req, res) => {
  try {
    const { id } = req.params;
    const task = await getTaskById(Number(id));
    return res.status(200).send({ task });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
});

router.get("/getTaskUser/:id", authSession, async (req, res) => {
  try {
    const { id } = req.params;
    const task = await getTaskByUserId(Number(id));
    return res.status(200).send({ task });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
});

router.post("/createTask", authSession, async (req, res) => {
  try {
    const { data } = req.body;
    const taskCreate = await registerTask(data);

    if (taskCreate.hasOwnProperty("error")) {
      return res.status(400).send({ taskCreate });
    }

    if (req.io) {
      req.io.emit("createTask", taskCreate);
    }

    return res
      .status(201)
      .send({ message: "Tarea creada con exito", data: taskCreate });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
});

router.put("/putTask/:id", authSession, async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    const task = await updateTask(Number(id), data);
    if (task.hasOwnProperty("error")) {
      return res.status(400).send({ task });
    }

    if (req.io) {
      req.io.emit("putTask", task);
    }

    return res.status(200).send({ task: task });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server errorx" });
  }
});

router.delete("/deleteTask/:id", authSession, async (req, res) => {
  try {
    const { id } = req.params;
    const task = await deleteTask(Number(id));
    if (task.hasOwnProperty("error")) {
      return res.status(400).send(task);
    }

    if (req.io) {
      req.io.emit("deleteTask", task);
    }

    return res.status(200).send(task);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
});

export default router;
