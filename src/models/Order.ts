import { sequelize } from '../config/db'
import { DataTypes } from 'sequelize'
import { User } from './UserModel'
import { OrderItem } from './OrderItem'
export const Order = sequelize.define(
  'Order',
  {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'user_id',
      },
    },
    orderItem_id: {
      type: DataTypes.INTEGER,
      references: {
        model: OrderItem,
        key: 'orderItem_id',
      },
    },
  },
  {
    tableName: 'order',
    timestamps: true,
  }
)
