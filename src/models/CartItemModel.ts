import { sequelize } from "../config/db";
import { DataTypes } from "sequelize";
import { User } from "./UserModel";
import { Product } from "./ProductModel";

// Define the Cart model
export const CartItem = sequelize.define(
  "CartItem",
  {
    cartItem_id: {
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
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "cart_item",
    timestamps: false,
  }
);
