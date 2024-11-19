import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

import { Product } from "./ProductModel";
import { Category } from "./CategoryModel";

// Create a PRODUCT_CATEGORIES Schema
export const ProductCategory = sequelize.define(
  "product_category",
  {
    productCategory_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product, // References the Product table
        key: "product_id",
      },
      onDelete: "CASCADE", // Deletes association if the product is deleted
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category, // References the category table
        key: "category_id",
      },
      onDelete: "CASCADE", // Deletes association if the category is deleted
    },
  },
  {
    tableName: "product_category",
    timestamps: false, // Disables timestamps as this is a join table
  }
);
