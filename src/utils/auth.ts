import jwt from "jsonwebtoken";
import { NonSensitiveInfoUserLogin } from "../types";
import dotenv from "dotenv";
dotenv.config();
export const auth = (dataUser: NonSensitiveInfoUserLogin) => {
  return jwt.sign(dataUser, `${process.env.SECRET_KEY}`, {
    expiresIn: "2h",
  });
};
