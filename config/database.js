import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
console.log(process.env.DATABASE_URL);

const sequelize = isProduction
  ? new Sequelize("dpg-d5kd2b7fte5s73cj8b6g-a", {
      dialect: "postgres",
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        logging: false,
      }
    );

export default sequelize;
