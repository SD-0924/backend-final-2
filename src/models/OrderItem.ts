import { sequelize } from '../config/db'
import { DataTypes } from 'sequelize'
import { Product } from './ProductModel'

export const OrderItem = sequelize.define(
  'OrderItem',
  {
    orderItem_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Product,
        key: 'product_id',
      },
    },
  },
  {
    tableName: 'orderItem',
    timestamps: true,
  }
)
