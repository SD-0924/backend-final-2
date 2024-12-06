import { ModelStatic, Model } from "sequelize";
import { sequelize } from "../config/db";
import { Order } from "../models/Order";
import { OrderItem } from "../models/OrderItem";
import { Product } from "../models/ProductModel";

export class orderItemService {
  // create multible  items
  static async bulkCreateItems(items: any) {
    const orderItems = await OrderItem.bulkCreate(items);

    return orderItems;
  }
}
