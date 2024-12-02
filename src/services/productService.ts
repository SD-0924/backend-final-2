// Import the constants
import { CONSTANTS, FIELD_NAMES, RATING } from "../constants";

// Import product model
import { Product } from "../models/ProductModel";

// Import rating service
import { ratingService } from "../services/ratingService";

// Import category service
import { categoryService } from "../services/categoryService";

// Import productCategory service
import { productCategoryService } from "../services/productCategoryService";

// Import Sequelize and Op from sequelize module
import { Op, Sequelize } from "sequelize";
import { response } from "express";
import { OrderItem } from "../models/OrderItem";

export class productService {
  // This method to add discount information to product information
  static addDiscountInfo(productInfo: any) {
    if (productInfo.discount_percentage === CONSTANTS.DISCOUNT_ZERO) {
      productInfo.price_after_discount = null;
      return;
    }
    const discountValue =
      productInfo.price * (productInfo.discount_percentage / 100);
    productInfo.price_after_discount = productInfo.price - discountValue;

    productInfo.price_after_discount = parseFloat(
      productInfo.price_after_discount.toFixed(CONSTANTS.DISCOUNT_PRECISION)
    );
  }
  // Method to retrieve new arrival products
  static async getNewArrivalsProducts() {
    const currentDate = new Date();

    // Calculate the start date of the previous three months
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

    try {
      // Fetch products created within the last three months
      const newProducts: any[] = await Product.findAll({
        where: {
          createdAt: {
            [Op.between]: [threeMonthsAgo, currentDate],
          },
        },
        raw: true,
        attributes: [
          "product_id",
          "name",
          "price",
          "brand_name",
          "discount_percentage",
          "product_image_url",
        ],
      });

      // Process products and clean up fields
      newProducts.forEach((product) => {
        this.addDiscountInfo(product); // Add discount info
      });

      return newProducts;
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
      throw new Error("Failed to fetch new arrival products.");
    }
  }
  // This method to get all products that matched user search
  static async findProductsByText(text: string) {
    const products: any = await Product.findAll({
      where: {
        [Op.or]: [
          {
            brand_name: {
              [Op.like]: `%${text}%`,
            },
          },
          {
            name: {
              [Op.like]: `%${text}%`,
            },
          },
        ],
      },
      attributes: [
        "product_id",
        "name",
        "price",
        "brand_name",
        "discount_percentage",
        "product_image_url",
        "averageRating",
        "NumberOfRatings",
        "product_id",
        "name",
        "price",
        "brand_name",
        "discount_percentage",
        "product_image_url",
        "averageRating",
        "NumberOfRatings",
      ],
      raw: true,
    });
    for (const product of products) {
      this.addDiscountInfo(product);
    }
    return products;
  }
  // This method to get a specific product based on id
  static async findProductById(product_id: number) {
    const product: any = await Product.findByPk(product_id, {
      raw: true,
      attributes: [
        "product_id",
        "name",
        "description",
        "price",
        "stock",
        "brand_name",
        "discount_percentage",
        "product_image_url",
        "averageRating",
        "NumberOfRatings",
        "product_id",
        "name",
        "description",
        "price",
        "stock",
        "brand_name",
        "discount_percentage",
        "product_image_url",
        "averageRating",
        "NumberOfRatings",
      ],
    });
    if (product === null) {
      return null;
    }
    this.addDiscountInfo(product);
    return product;
  }
  // This method to get all products that belongs to category
  static async findProductsByCategory(
    categoryName: string,
    pageNumber: number
  ) {
    const categoryInfo: any =
      await categoryService.getCategoryByName(categoryName);
    await categoryService.getCategoryByName(categoryName);
    if (!categoryInfo) {
      return {};
      return {};
    }
    const products: any =
      await productCategoryService.getProductsBelongsToCategory(
        categoryInfo.category_id,
        pageNumber
      );
    return products;
  }

  // This method to get all brands
  static async getBrandsService() {
    const brands = await Product.findAll({
      attributes: ["brand_image_url", "brand_name"],
      group: ["brand_name", "brand_image_url"],
    });
    console.log(brands);
    return brands.map((e) => e.dataValues);
  }

  //check stock availabilty
  static async checkStock(product_id: number, quantity: number) {
    const product = await Product.findOne({
      where: { product_id },
    });

    //check if product exist
    if (!product) {
      throw new Error("Product not found");
    }

    if (product.dataValues.stock >= quantity) return true;

    return false;
  }
  //update the stock
  static async updateStock(
    product_id: number,
    quantity: number,
    operation: string
  ) {
    try {
      const product = await Product.findOne({
        where: { product_id },
      });

      //check if product exist
      if (!product) {
        throw new Error("Product not found");
      }
      if (operation === "sub") {
        product.dataValues.stock -= quantity;
      } else {
        product.dataValues.stock += quantity;
      }
    } catch (error) {
      return { status: 500, response: error };
    }
  }

  static async getOrderProducts(order_id: number) {
    try {
      const products = await Product.findAll({
        include: [
          {
            model: OrderItem,
            where: { order_id },
            attributes: [
              "quantity",
              [Sequelize.literal("quantity*price"), "subtotal"],
            ],
          },
        ],
        attributes: ["price", "name", "brand_name"],
      });
      return products;
    } catch (error) {
      return { status: 500, response: error };
    }
  }
}

export const getProductByBrand = async (brand: string) => {
  try {
    const products = await Product.findAll({
      where: {
        brand_name: brand,
      },
    });
    if (products.length === 0) {
      return { status: 404, response: "No products found" };
    }
    return { status: 200, response: products };
  } catch (error) {
    return { status: 500, response: error };
  }
};

export const createProduct = async (product: any) => {
  try {
    const newProduct = await Product.create(product);
    return { status: 201, response: newProduct };
  } catch (error) {
    return { status: 500, response: error };
  }
};
