import { Login, User } from "../types";
import bcrypt from "bcrypt";
import { parseLoginUser } from "../utils/parseUser";
import { auth } from "../utils/auth";

export const login = async (data: Login, user: User) => {
  const match = await bcrypt.compare(data.passwordhash, user.passwordhash);
  if (!match) return { error: "Contraseña Incorrecta" };
  const infoParsed = parseLoginUser(user);
  const token = auth(infoParsed);
  return { ...infoParsed, token };
};
