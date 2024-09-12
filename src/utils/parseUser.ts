import { NonSensitiveInfoUserLogin, User } from "../types";

export const parseLoginUser = (user: User): NonSensitiveInfoUserLogin => {
  return {
    iduser: user.iduser,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
};
