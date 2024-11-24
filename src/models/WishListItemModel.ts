import { sequelize } from "../config/db";
import { DataTypes } from "sequelize";
import { User } from "./UserModel";
import { Product } from "./ProductModel";

// Define the WishlistItem model
export const WishlistItem = sequelize.define(
  "WishlistItem",
  {
    wishlistItem_Id: {
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
    tableName: "wishlist_item",
    timestamps: false,
  }
);
