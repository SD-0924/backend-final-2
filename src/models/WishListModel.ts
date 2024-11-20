import { sequelize } from "../config/db";
import { DataTypes } from "sequelize";
import { User } from "./UserModel";
import { Product } from "./ProductModel";

// Define the Wishlist model
export const Wishlist = sequelize.define(
  "Wishlist",
  {
    wishlist_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "user_id",
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Product,
        key: "product_id",
      },
    },
  },
  {
    tableName: "wishlist",
    timestamps: false,
  }
);
