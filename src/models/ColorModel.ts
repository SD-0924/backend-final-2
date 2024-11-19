import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

// Create a COLORS Schema
export const Color = sequelize.define(
  "color",
  {
    color_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensures color names are unique
      validate: {
        notEmpty: true,
      },
    },
    hexadecimal_value: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensures hex values are unique
      validate: {
        is: /^#[0-9A-Fa-f]{6}$/, // Validates a proper hexadecimal color code
      },
    },
  },
  {
    tableName: "color",
    timestamps: false, // Disables timestamps for simplicity
  }
);
