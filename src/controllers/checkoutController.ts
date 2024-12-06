import { Request, Response, NextFunction } from "express";
import { sequelize } from "../config/db";
import { Product } from "../models/ProductModel";
import { CartItem } from "../models/CartItemModel";
import { productService } from "../services/productService";
import { orderService } from "../services/orderService";
import { OrderItem } from "../models/OrderItem";
import { orderItemService } from "../services/orderItemService";
import { Sequelize, Transaction } from "sequelize";

export const checkoutHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await sequelize.transaction(async (t: any) => {
      try {
        const { user_id } = req.body;
        //1- fetch cart data
        const productList = await productService.getCartProducts(user_id);
        console.log(productList[0].dataValues.CartItems);

        //2- check stock
        for (const product of productList) {
          const isAvaiable = await productService.checkStock(
            product.dataValues.product_id,
            product.dataValues.CartItems[0].dataValues.quantity
          );

          if (!isAvaiable) {
            throw new Error(
              `Insufficient stock for product ID ${product.dataValues.product_id}`
            );
          }
        }
        //3- calculate total
        const total = productList.reduce((sum, product) => {
          return (
            sum +
            product.dataValues.price *
              product.dataValues.CartItems[0].dataValues.quantity
          );
        }, 0);

        //4-simulate payment
        const simulatePatment = simulatePayment(total);
        if (!simulatePatment) {
          const order = await orderService.createOrder(user_id, total, 0);

          throw new Error("Patment Faild");
        }
        //5- update order , orderItem tables ans stock in product table

        const order = await orderService.createOrder(user_id, total, 1);

        const orderItems = productList.map((product) => ({
          quantity: product.dataValues.CartItems[0].dataValues.quantity,
          user_id,
          product_id: product.dataValues.product_id,
          order_id: order.dataValues.order_id,
        }));

        await orderItemService.bulkCreateItems(orderItems);

        //update the stock
        for (const product of productList) {
          await productService.updateStock(
            product.dataValues.product_id,
            product.dataValues.CartItems[0].dataValues.quantity,
            "sub"
          );
        }
        await t.commit();

        res.status(202).json({
          order: productList,
          total,
        });
      } catch (error) {
        await t.rollback();
        res.status(400).json({
          message: error.message,
        });
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const orderHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id } = req.body;
    const orders = await orderService.getAllOrders(user_id);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
      details: error,
    });
  }
};

export const orderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order_id = parseInt(req.params.order_id);
    const { user_id } = req.body;

    if (!order_id) throw new Error("no order id provided");

    const orderItems = await productService.getOrderProducts(order_id);

    res.status(200).json(orderItems);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
      details: error,
    });
  }
};

// Simulate a payment function
function simulatePayment(amount: number): boolean {
  return Math.random() > 0.2;
}
