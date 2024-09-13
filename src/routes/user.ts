import express from "express";
import {
  deleteUser,
  getUserById,
  getUsers,
  loginUser,
  registerUser,
  updateUser,
} from "../service/userService";
const router = express.Router();

router.get("/getAllUsers", async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const user = await getUsers(Number(page), Number(pageSize));
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.get("/getUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(Number(id));
    return res.status(200).send({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
});

router.post("/registerUser", async (req, res) => {
  try {
    const { data } = req.body;
    data.role = "user";
    const userCreate = await registerUser(data);
    if (userCreate.hasOwnProperty("error")) {
      return res.status(400).send({ userCreate });
    }

    return res
      .status(201)
      .send({ message: "Usuario creado con exito", data: userCreate });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
});

router.post("/loginUser", async (req, res) => {
  try {
    const { data } = req.body;
    const dataUser = await loginUser(data);
    if (dataUser.hasOwnProperty("error")) {
      return res.status(400).send({ dataUser });
    }
    return res
      .status(200)
      .json({ message: "Usuario inicio sesión exitosamente", data: dataUser });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
});

router.put("/putUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    const user = await updateUser({ ...data, iduser: Number(id) });
    if (user.hasOwnProperty("error")) {
      return res.status(400).send({ user });
    }
    return res.status(200).send({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
});

router.delete("/deleteUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await deleteUser(Number(id));
    if (user.hasOwnProperty("error")) {
      return res.status(400).send(user);
    }
    return res.status(200).send(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
});

export default router;
