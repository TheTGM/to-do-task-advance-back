export type Role = "admin" | "user";
export type User = {
  iduser: number;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  passwordhash: string;
  role: Role;
};

export interface Login {
  email: string;
  passwordhash: string;
}

export interface putUser {
  iduser: number;
  firstname: string;
  lastname: string;
  phone: string;
  role: Role;
}

export type NonSensitiveInfoUserLogin = Omit<User, "passwordhash">;

export type UserRequest = Omit<User, "iduser">;
