import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import bcrypt from "bcrypt";

// Create an ADMIN Schema
export const Admin = sequelize.define(
  "admin",
  {
    admin_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensures email is unique
      validate: {
        isEmail: true, // Validates that the email format is correct
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value: string) {
        const hashedPassword = bcrypt.hashSync(value, 10);
        this.setDataValue("password", hashedPassword);
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "admin", // Default role for admins
      validate: {
        notEmpty: true,
      },
      //more roles will be added in the future
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "admin",
    timestamps: true, // Enables createdAt and updatedAt automatically
  }
);
