import { sequelize } from "../config/db";
import { Order } from "../models/Order";
import { OrderItem } from "../models/OrderItem";
import { Product } from "../models/ProductModel";

export class orderItemService {
  //get user orders
  // static async getOrderItems(user_id: number, orderItem_id: number) {
  //   const orderItems = await OrderItem.findAll({
  //     where: { user_id },
  //     include: [
  //       {
  //         model: Order,
  //         where: { user_id },
  //         attributes: ["status", "timestamps"],
  //       },
  //       {
  //         model: Product,
  //         where: { orderItem_id },
  //         include: ["price"],
  //       },
  //     ],
  //   });
  //   return orderItems;
  // }
}
