// Import Request and Response from express module
import { Request, Response } from "express";

// Import services
import { productService } from "../services/productService";

// Retrieve all new arrivals products
export const getNewArrivalsProducts = async (
  req: Request,
  res: Response
): Promise<any> => {
  const products = await productService.getNewArrivalsProducts();
  res.status(200).json(products);
};

// Retrieve all products where either the product brand or the product name contains the keyword entered by the user
export const findProductsByText = async (
  req: Request,
  res: Response
): Promise<any> => {
  const text = req.params.text;
  const products = await productService.findProductsByText(text);
  res.status(200).json(products);
};
