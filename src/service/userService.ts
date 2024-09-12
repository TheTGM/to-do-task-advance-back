import { sequelize } from "../db";
import { loginSchema, putUserSchema, userSchema } from "../schema/userSchema";
import { Login, putUser, User, UserRequest } from "../types";
import { QueryTypes } from "sequelize";
import bcrypt from "bcrypt";
import { login } from "../utils/functions";

export const getUsers = async (page: number = 1, pageSize: number = 10) => {
  if (!page || !pageSize) {
    page = 1;
    pageSize = 10;
  }
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  let totalItems = await sequelize.query("SELECT COUNT(*) FROM User", {
    type: QueryTypes.SELECT,
  });
  totalItems = Object.values(totalItems[0])[0];

  const task = await sequelize.query(
    "SELECT * FROM User LIMIT :limit OFFSET :offset",
    {
      replacements: {
        limit: limit,
        offset: offset,
      },
      type: QueryTypes.SELECT,
    }
  );

  const totalPages = Math.ceil(Number(totalItems) / pageSize);
  return {
    data: task,
    currentPage: page,
    totalPages: totalPages,
    totalItems: totalItems,
  };
};

export const getUserById = async (id: number) => {
  try {
    const user = await sequelize.query(
      "SELECT * FROM User WHERE iduser = :id",
      {
        replacements: { id: id },
        type: QueryTypes.SELECT,
      }
    );
    if (user.length === 0) {
      return { error: "User not found" };
    }
    return user;
  } catch (error) {
    console.error(error);
    return { error: "Error retrieving user" };
  }
};

export const registerUser = async (data: UserRequest) => {
  const transaction = await sequelize.transaction();
  try {
    const { error } = userSchema.validate(data, { abortEarly: false });
    if (error) {
      return { error: error.details.map((detail) => detail.message) };
    }
    const hashpass = await bcrypt.hash(data.passwordhash, 10);
    const task = await sequelize.query(
      `INSERT INTO User 
    (firstname, lastname, phone, email, passwordhash, role) 
   VALUES (:firstname, :lastname, :phone, :email, :passwordhash, :role)`,
      {
        replacements: {
          firstname: data.firstname,
          lastname: data.lastname,
          phone: data.phone,
          email: data.email,
          passwordhash: hashpass,
          role: data.role,
        },
        type: QueryTypes.INSERT,
      }
    );

    await transaction.commit();
    return { message: `User created successfully with ID: ${task[0]}` };
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    throw error;
  }
};

export const loginUser = async (data: Login) => {
  try {
    const { error } = loginSchema.validate(data, { abortEarly: false });
    if (error) {
      return { error: error.details.map((detail) => detail.message) };
    }

    const row = await sequelize.query(
      "SELECT * FROM User WHERE email = :email",
      {
        replacements: { email: data.email },
        type: QueryTypes.SELECT,
      }
    );
    console.log(row[0]);
    if (row.length === 0) return { error: "User not found" };
    const user = row[0] as User;
    return login(data, user);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateUser = async (data: putUser) => {
  const transaction = await sequelize.transaction();
  try {
    const { error } = putUserSchema.validate(data, { abortEarly: false });
    if (error) {
      return { error: error.details.map((detail) => detail.message) };
    }
    const [affectedRows] = await sequelize.query(
      `UPDATE User 
        SET firstname = :firstname, lastname = :lastname, phone = :phone, role = :role
        WHERE iduser = :iduser`,
      {
        replacements: {
          iduser: data.iduser,
          firstname: data.firstname,
          lastname: data.lastname,
          phone: data.phone,
          role: data.role,
        },
        type: QueryTypes.UPDATE,
        transaction,
      }
    );

    if (affectedRows === 0) {
      await transaction.rollback();
      return { error: "User not found or no changes made" };
    }

    await transaction.commit();

    return { success: true, message: "User updated successfully" };
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    throw error;
  }
};

export const deleteUser = async (id: number) => {
  const transaction = await sequelize.transaction();
  try {
    await sequelize.query(`DELETE FROM Task WHERE iduser = :iduser`, {
      replacements: { iduser: id },
      type: QueryTypes.DELETE,
      transaction,
    });
    await sequelize.query(`DELETE FROM User WHERE iduser = :iduser`, {
      replacements: { iduser: id },
      type: QueryTypes.DELETE,
      transaction,
    });

    await transaction.commit();
    return { success: true, iduser: id };
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    throw error;
  }
};
