import { checkoutHandler } from "../src/controllers/checkoutController";
import { sequelize } from "../src/config/db";
import { Product } from "../src/models/ProductModel";
import { CartItem } from "../src/models/CartItemModel";
import { productService } from "../src/services/productService";
import { orderService } from "../src/services/orderService";
import { OrderItem } from "../src/models/OrderItem";
import { Request, Response } from "express";

jest.mock("../src/config/db");
jest.mock("../src/models/ProductModel");
jest.mock("../src/models/CartItemModel");
jest.mock("../src/models/OrderItem");
jest.mock("../src/services/productService");
jest.mock("../src/services/orderService");

describe("checkoutHandler", () => {
  const mockRequest = (body: any): Request => ({ body }) as Request;
  const mockResponse = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockTransaction = jest.fn();
  (sequelize.transaction as jest.Mock).mockImplementation(mockTransaction);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should complete the checkout process successfully", async () => {
    const req = mockRequest({ user_id: 1 });
    const res = mockResponse();

    const mockProductList = [
      { dataValues: { product_id: 1, price: 100, quantity: 2 } },
      { dataValues: { product_id: 2, price: 50, quantity: 1 } },
    ];
    (Product.findAll as jest.Mock).mockResolvedValue(mockProductList);
    (productService.checkStock as jest.Mock).mockResolvedValue(true);
    const simulatePayment = jest.fn().mockReturnValue(true);
    (orderService.createOrder as jest.Mock).mockResolvedValue({ id: 1 });
    (OrderItem.bulkCreate as jest.Mock).mockResolvedValue(undefined);
    (productService.updateStock as jest.Mock).mockResolvedValue(undefined);

    await checkoutHandler(req, res, jest.fn());

    expect(Product.findAll).toHaveBeenCalledWith({
      include: [
        {
          model: CartItem,
          where: { user_id: 1 },
          attributes: ["quantity"],
        },
      ],
    });

    expect(productService.checkStock).toHaveBeenCalledTimes(2);
    expect(orderService.createOrder).toHaveBeenCalledWith(1, 250, 1);
    expect(OrderItem.bulkCreate).toHaveBeenCalledWith([
      { quantity: 2, user_id: 1, product_id: 1 },
      { quantity: 1, user_id: 1, product_id: 2 },
    ]);
    expect(productService.updateStock).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(202);
    expect(res.json).toHaveBeenCalledWith({
      order: mockProductList,
      total: 250,
    });
  });

  it("should handle insufficient stock error", async () => {
    const req = mockRequest({ user_id: 1 });
    const res = mockResponse();

    const mockProductList = [
      { dataValues: { product_id: 1, price: 100, quantity: 2 } },
    ];
    (Product.findAll as jest.Mock).mockResolvedValue(mockProductList);
    (productService.checkStock as jest.Mock).mockResolvedValue(false);

    await checkoutHandler(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Insufficient stock for product ID 1",
    });
  });

  it("should handle payment failure", async () => {
    const req = mockRequest({ user_id: 1 });
    const res = mockResponse();

    const mockProductList = [
      { dataValues: { product_id: 1, price: 100, quantity: 2 } },
    ];
    (Product.findAll as jest.Mock).mockResolvedValue(mockProductList);
    (productService.checkStock as jest.Mock).mockResolvedValue(true);
    const simulatePayment = jest.fn().mockReturnValue(false);
    (orderService.createOrder as jest.Mock).mockResolvedValue({ id: 1 });

    await checkoutHandler(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Patment Faild",
    });
  });
});
