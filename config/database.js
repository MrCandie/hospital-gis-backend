import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  "postgresql://hospital_gis_user:CL9isjGaHyzHh1G16mb22ZxkvH6dWhnp@dpg-d5kd2b7fte5s73cj8b6g-a.virginia-postgres.render.com/hospital_gis",
  {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

export default sequelize;
