import { Order } from "../models/Order";

export class orderService {
  static async createOrder(user_id: number, total: number, status: number) {
    const order = await Order.create({
      user_id,
      status,
      total,
    });
    return order;
  }

  static async getAllOrders(user_id: number) {
    const orders = await Order.findAll({
      where: {
        user_id,
      },
    });

    return orders;
  }
}
