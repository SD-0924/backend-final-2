import { Request, Response, NextFunction } from "express";
import { sequelize } from "../config/db";
import { Product } from "../models/ProductModel";
import { CartItem } from "../models/CartItemModel";
import { productService } from "../services/productService";
import { orderService } from "../services/orderService";
import { OrderItem } from "../models/OrderItem";

export const checkoutHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await sequelize.transaction(async (t: any) => {
      const { user_id } = req.body;
      //1- fetch cart data
      const productList = await Product.findAll({
        include: [
          {
            model: CartItem,
            where: { user_id },
            attributes: ["quantity"],
          },
        ],
      });
      //2- check stock
      for (const product of productList) {
        const isAvaiable = await productService.checkStock(
          product.dataValues.product_id,
          product.dataValues.quantity
        );
        if (!isAvaiable) {
          throw new Error(
            `Insufficient stock for product ID ${product.dataValues.product_id}`
          );
        }
      }
      //3- calculate total
      const total = productList.reduce((sum, product) => {
        return sum + product.dataValues.price * product.dataValues.quantity;
      }, 0);

      //4-simulate payment
      const simulatePatment = simulatePayment(total);
      if (!simulatePatment) {
        throw new Error("Patment Faild");
      }
      //5- update order , orderItem tables ans stock in product table

      const order = await orderService.createOrder(user_id, 1);

      const orderItems = productList.map((product) => ({
        quantity: product.dataValues.quantity,
        user_id,
        product_id: product.dataValues.product_id,
      }));

      await OrderItem.bulkCreate(orderItems);

      //update the stock
      for (const product of productList) {
        await productService.updateStock(
          product.dataValues.product_id,
          product.dataValues.quantity,
          "sub"
        );
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Simulate a payment function
function simulatePayment(amount: number): boolean {
  return Math.random() > 0.2;
}
