// Import Request and Response from express module
import { Request, Response } from "express";

// Import services
import { productService, createProduct, getProductByBrand } from "../services/productService";

import JOI from "joi";

//validate product brand name
const schema = JOI.object({
  brandName: JOI.string().required(),
});

const productSchema = JOI.object({
  name: JOI.string()
      .trim()
      .min(2)
      .max(100)
      .required()
      .messages({
          'string.empty': 'Product name is required',
          'string.min': 'Product name must be at least 2 characters',
          'string.max': 'Product name cannot exceed 100 characters'
      }),

  description: JOI.string()
      .trim()
      .min(10)
      .max(1000)
      .required()
      .messages({
          'string.empty': 'Product description is required',
          'string.min': 'Description must be at least 10 characters',
          'string.max': 'Description cannot exceed 1000 characters'
      }),

  price: JOI.number()
      .positive()
      .precision(2)
      .required()
      .messages({
          'number.base': 'Price must be a number',
          'number.positive': 'Price must be greater than 0',
          'number.precision': 'Price cannot have more than 2 decimal places'
      }),

  stock: JOI.number()
      .integer()
      .min(0)
      .required()
      .messages({
          'number.base': 'Stock must be a number',
          'number.integer': 'Stock must be a whole number',
          'number.min': 'Stock cannot be negative'
      }),

  brand_name: JOI.string()
      .trim()
      .min(2)
      .max(50)
      .required()
      .messages({
          'string.empty': 'Brand name is required',
          'string.min': 'Brand name must be at least 2 characters',
          'string.max': 'Brand name cannot exceed 50 characters'
      }),

  merchant_id: JOI.number()
      .integer()
      .positive()
      .required()
      .messages({
          'number.base': 'Merchant ID must be a number',
          'number.integer': 'Merchant ID must be a whole number',
          'number.positive': 'Merchant ID must be positive'
      })
});

export const getProductsByBrand = async (req: Request, res: Response) => {
  const { error } = schema.validate(req.params);
  if (error) {
      return res.status(400).json({ error: error.details[0].message });
  }
  const brand = req.params.brandName;
  const result = await getProductByBrand(brand);
  const { status, response } = result;
  res.status(status).json(response);
};

export const createProductController = async (req: Request, res: Response) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
      return res.status(400).json({ error: error.details[0].message });
  }
  const product = req.body;
  const result = await createProduct(product);
  const { status, response } = result;
  res.status(status).json(response);
};

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


