import { sequelize } from "../db";
import { taskSchema, updateTaskSchema } from "../schema/taskSchema";
import { TaskRequest } from "../types";
import { QueryTypes } from "sequelize";

export const getTasks = async (page: number = 1, pageSize: number = 10) => {
  if (!page || !pageSize) {
    page = 1;
    pageSize = 10;
  }
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  let totalItems = await sequelize.query("SELECT COUNT(*) FROM Task", {
    type: QueryTypes.SELECT,
  });
  totalItems = Object.values(totalItems[0])[0];

  const task = await sequelize.query(
    "SELECT * FROM Task LIMIT :limit OFFSET :offset",
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

export const getTaskById = async (id: number) => {
  try {
    const task = await sequelize.query(
      "SELECT * FROM Task WHERE idtask = :id",
      {
        replacements: { id: id },
        type: QueryTypes.SELECT,
      }
    );
    if (task.length === 0) {
      return { error: "No se encuentra la tarea" };
    }
    return task;
  } catch (error) {
    console.error(error);
    return { error: "Error recuperando la tarea" };
  }
};

export const getTaskByUserId = async (
  id: number,
  page: number = 1,
  pageSize: number = 10
) => {
  try {
    if (!page || !pageSize) {
      page = 1;
      pageSize = 10;
    }
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    let totalItems = await sequelize.query(
      "SELECT COUNT(*) FROM Task WHERE iduser = :id",
      {
        replacements: { id: id },
        type: QueryTypes.SELECT,
      }
    );
    totalItems = Object.values(totalItems[0])[0];

    const task = await sequelize.query(
      "SELECT * FROM Task WHERE iduser = :id",
      {
        replacements: { id: id, limit: limit, offset: offset },
        type: QueryTypes.SELECT,
      }
    );

    const totalPages = Math.ceil(Number(totalItems) / pageSize);
    if (task.length === 0) {
      return { error: "No se encuentra el usuario" };
    }
    return {
      data: task,
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalItems,
    };
  } catch (error) {
    console.error(error);
    return { error: "Error recuperando la tarea" };
  }
};

export const registerTask = async (data: TaskRequest) => {
  const transaction = await sequelize.transaction();
  try {
    const { error } = taskSchema.validate(data, { abortEarly: false });
    if (error) {
      return { error: error.details.map((detail) => detail.message) };
    }

    const task = await sequelize.query(
      `INSERT INTO Task 
    (iduser, name, description, status) 
   VALUES (:iduser, :name, :description, status)`,
      {
        replacements: {
          iduser: data.iduser,
          name: data.name,
          description: data.description || null,
          status: data.status,
        },
        type: QueryTypes.INSERT,
      }
    );
    const [f_task] = await sequelize.query(
      `SELECT * FROM Task WHERE idtask = :idtask`,
      {
        replacements: { idtask: task[0] },
        type: QueryTypes.SELECT,
        transaction,
      }
    );

    await transaction.commit();
    return f_task;
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    throw error;
  }
};

export const updateTask = async (id: number, data: TaskRequest) => {
  const transaction = await sequelize.transaction();
  try {
    const { error } = updateTaskSchema.validate(data, { abortEarly: false });
    if (error) {
      return { error: error.details.map((detail) => detail.message) };
    }

    const [affectedRows] = await sequelize.query(
      `UPDATE Task 
        SET name = :name, description = :description, status = :status
        WHERE idtask = :idtask`,
      {
        replacements: {
          name: data.name,
          description: data.description || null,
          status: data.status,
          idtask: id,
        },
        type: QueryTypes.UPDATE,
        transaction,
      }
    );

    if (affectedRows === 0) {
      await transaction.rollback();
      return { error: "No se encuentra la tarea or no changes made" };
    }

    const [f_task] = await sequelize.query(
      `SELECT * FROM Task WHERE idtask = :idtask`,
      {
        replacements: { idtask: id },
        type: QueryTypes.SELECT,
        transaction,
      }
    );

    await transaction.commit();

    return { data: f_task, message: "Tarea actualizada con exito" };
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    throw error;
  }
};

export const deleteTask = async (id: number) => {
  const transaction = await sequelize.transaction();
  try {
    await sequelize.query(`DELETE FROM Task WHERE idtask = :idtask`, {
      replacements: { idtask: id },
      type: QueryTypes.DELETE,
      transaction,
    });

    await transaction.commit();
    return { success: true, idtask: id };
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    throw error;
  }
};
