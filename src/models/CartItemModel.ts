import { sequelize } from "../config/db";
import { DataTypes } from "sequelize";
import { Cart } from "./CartModel";
import { Product } from "./ProductModel";

// Define the CartItem model
export const CartItem = sequelize.define(
  "Cart_Item",
  {
    cartItem_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cart_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Cart,
        key: "cart_id",
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
