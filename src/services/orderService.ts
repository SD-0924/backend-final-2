import { Order } from "../models/Order";

export class orderService {
  static async createOrder(user_id: number, status: number) {
    const order = await Order.create({
      user_id,
      status,
    });
    return order;
  }
}
