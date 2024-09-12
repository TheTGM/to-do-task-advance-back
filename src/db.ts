import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME || "test",
  process.env.DB_USER || "mysql",
  process.env.DB_PASS || "password",
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: (msg) => console.log(`[Sequelize Log]: ${msg}`),
  }
);
