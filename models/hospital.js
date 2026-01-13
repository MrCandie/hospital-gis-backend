import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Hospital = sequelize.define(
  "Hospital",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.GEOGRAPHY("POINT", 4326),
      allowNull: false,
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
  },
  {
    tableName: "hospitals",
    freezeTableName: true,
  }
);

export default Hospital;
