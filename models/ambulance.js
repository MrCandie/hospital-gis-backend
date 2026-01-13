import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Ambulance = sequelize.define(
  "Ambulance",
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
    tableName: "ambulances",
    freezeTableName: true,
  }
);

export default Ambulance;
