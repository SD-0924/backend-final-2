import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

import { Product } from "./ProductModel";
import { Color } from "./ColorModel";

// Create a PRODUCT_COLORS Schema
export const ProductColor = sequelize.define(
  "product_color",
  {
    productColor_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Automatically generates a UUID
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product, // References the Product table
        key: "product_id",
      },
      onDelete: "CASCADE", // Deletes the association if the product is deleted
    },
    color_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Color, // References the Color table
        key: "color_id",
      },
      onDelete: "CASCADE", // Deletes the association if the color is deleted
    },
  },
  {
    tableName: "product_color",
    timestamps: false, // Disables timestamps as this is a join table
  }
);
